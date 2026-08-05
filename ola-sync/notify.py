"""
notify.py
=========
Stage 4 of the Ola sync pipeline — send alerts on success or failure.

Currently supports:
- Slack webhook  (set OLA_SLACK_WEBHOOK in .env)
- Console print  (always on, good default)

If OLA_SLACK_WEBHOOK is not set, Slack notifications are silently skipped and
the pipeline still completes successfully.
"""

import json
import os
from pathlib import Path

import requests

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

SLACK_WEBHOOK = os.environ.get("OLA_SLACK_WEBHOOK", "")


def _post_slack(text: str):
    """Post a plain-text message to the configured Slack webhook."""
    if not SLACK_WEBHOOK:
        return
    try:
        resp = requests.post(
            SLACK_WEBHOOK,
            data=json.dumps({"text": text}),
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        if resp.status_code != 200:
            print(f"[NOTIFY] Slack returned {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"[NOTIFY] Slack post failed: {e}")


def notify_success(week_start, week_end, stats: dict):
    """
    Send a success notification.

    Parameters
    ----------
    week_start, week_end : date  — the statement week
    stats                : dict — {inserted_raw, updated_raw, inserted_incentive, ...}
    """
    ws = str(week_start) if week_start else "?"
    we = str(week_end)   if week_end   else "?"
    msg = (
        f"✅ *Ola Sync Complete* — Week {ws} → {we}\n"
        f"Raw: {stats.get('inserted_raw', 0)} inserted, {stats.get('updated_raw', 0)} updated\n"
        f"Incentive: {stats.get('inserted_incentive', 0)} inserted, {stats.get('updated_incentive', 0)} updated"
    )
    print(f"[NOTIFY] {msg}")
    _post_slack(msg)


def notify_failure(week_start, week_end, error: str, stage: str = ""):
    """
    Send a failure alert.

    Parameters
    ----------
    week_start, week_end : date — the statement week (may be None if failure was in fetch)
    error                : str  — error message
    stage                : str  — which pipeline stage failed (e.g. 'fetch', 'parse', 'load')
    """
    ws = str(week_start) if week_start else "?"
    we = str(week_end)   if week_end   else "?"
    msg = (
        f"🚨 *Ola Sync FAILED* (stage: {stage or 'unknown'}) — Week {ws} → {we}\n"
        f"Error: {error[:500]}\n"
        f"Action needed: Check logs or run the pipeline manually."
    )
    print(f"[NOTIFY] {msg}")
    _post_slack(msg)
