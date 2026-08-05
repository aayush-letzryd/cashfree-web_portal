"""
run_pipeline.py
===============
Orchestrator for the Ola sync pipeline.

Runs the four stages in sequence:
  1. fetch_ola_statement  → login + download
  2. parse_ola_statement  → normalize columns
  3. load_to_postgres     → upsert into DB
  4. notify               → Slack / console

A failure in any stage writes a Failed row to ola_import_log and sends an
alert, then exits non-zero so Task Scheduler / cron notices.

Usage
-----
    python run_pipeline.py

    # Dry-run parse/load only (skip Playwright — useful when you already have a file):
    python run_pipeline.py --file path/to/already_downloaded.xlsx
"""

import argparse
import os
import sys
import traceback
from datetime import date, datetime, timedelta
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# ── Load .env ──────────────────────────────────────────────────────────────────
_env_path = Path(__file__).parent / ".env"
if not _env_path.exists():
    _env_path = Path(__file__).parent.parent / ".env"
if _env_path.exists():
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

# ── Local imports (after env is loaded) ───────────────────────────────────────
from fetch_ola_statement import (
    fetch_ola_statement,
    create_import_log_row,
    update_import_log,
    get_last_week_dates,
)
from parse_ola_statement import parse_statement
from load_to_postgres import load_to_postgres
from notify import notify_success, notify_failure


def main():
    parser = argparse.ArgumentParser(description="Ola sync pipeline orchestrator")
    parser.add_argument(
        "--file", "-f",
        default=None,
        help="Skip the fetch stage and use this already-downloaded file instead."
    )
    args = parser.parse_args()

    from_date, to_date = get_last_week_dates()
    week_start: date = from_date.date()
    week_end:   date = to_date.date()

    print("=" * 60)
    print(f"Ola Sync Pipeline — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Week: {week_start} -> {week_end}")
    print("=" * 60)

    log_id = None

    # ── Stage 1: Create log row ────────────────────────────────────────────────
    try:
        log_id = create_import_log_row(
            import_type="ola_raw",
            week_start=week_start,
            week_end=week_end,
            target_table="july_ola_raw",
        )
        print(f"[PIPELINE] Import log row created: id={log_id}")
    except Exception as db_err:
        print(f"[PIPELINE] WARNING: Could not write to ola_import_log: {db_err}")
        # Not fatal — continue without a log_id

    # ── Stage 1: Fetch (skip if --file given) ─────────────────────────────────
    if args.file:
        downloaded_file = args.file
        print(f"[PIPELINE] Skipping fetch — using file: {downloaded_file}")
        update_import_log(log_id, "Downloaded", file_name=os.path.basename(downloaded_file))
    else:
        print("\n── STAGE 1: Fetch ──")
        try:
            downloaded_file = fetch_ola_statement(log_id=log_id, logger=print)
            print(f"[PIPELINE] ✓ Fetch done: {downloaded_file}")
        except Exception as e:
            err = str(e)
            print(f"[PIPELINE] ✗ Fetch failed: {err}")
            traceback.print_exc()
            if log_id:
                try:
                    update_import_log(log_id, "Failed", error_message=f"[fetch] {err}")
                except Exception:
                    pass
            notify_failure(week_start, week_end, err, stage="fetch")
            sys.exit(1)

    # ── Stage 2: Parse ────────────────────────────────────────────────────────
    print("\n── STAGE 2: Parse ──")
    try:
        raw_df, incentive_df = parse_statement(downloaded_file, week_start=week_start, week_end=week_end)
        print(f"[PIPELINE] ✓ Parse done: {len(raw_df)} raw rows, {len(incentive_df)} incentive rows")
    except Exception as e:
        err = str(e)
        print(f"[PIPELINE] ✗ Parse failed: {err}")
        traceback.print_exc()
        if log_id:
            try:
                update_import_log(log_id, "Failed", error_message=f"[parse] {err}")
            except Exception:
                pass
        notify_failure(week_start, week_end, err, stage="parse")
        sys.exit(1)

    # ── Stage 3: Load ─────────────────────────────────────────────────────────
    print("\n── STAGE 3: Load ──")
    try:
        stats = load_to_postgres(
            log_id=log_id or -1,
            raw_df=raw_df,
            incentive_df=incentive_df,
            week_start=week_start,
            week_end=week_end,
            logger=print,
        )
        print(f"[PIPELINE] ✓ Load done: {stats}")
    except Exception as e:
        err = str(e)
        print(f"[PIPELINE] ✗ Load failed: {err}")
        traceback.print_exc()
        notify_failure(week_start, week_end, err, stage="load")
        sys.exit(1)

    # ── Stage 4: Notify ───────────────────────────────────────────────────────
    print("\n── STAGE 4: Notify ──")
    notify_success(week_start, week_end, stats)

    print("\n" + "=" * 60)
    print(f"[PIPELINE] ✓ ALL STAGES COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
