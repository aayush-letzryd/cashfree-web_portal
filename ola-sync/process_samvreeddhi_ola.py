"""
process_samvreeddhi_ola.py
==========================
Manual/direct runner to parse and load Samvreeddhi Mobility statements.

Usage:
    python process_samvreeddhi_ola.py
"""

import sys
import os
from pathlib import Path
from datetime import date

sys.path.append(str(Path(__file__).parent))

from parse_ola_statement import parse_statement
from load_to_postgres import load_to_postgres, _get_db_conn


def run():
    file_path = os.path.join(Path(__file__).parent, "ola_downloads", "Samvreeddhi Mobility Private Limited_2026-Jul-27_2026-Aug-02.xlsx")
    
    if not os.path.exists(file_path):
        print(f"[WARN] Statement file not found at {file_path}")
        return

    print("Step 1: Connecting to PostgreSQL DB...")
    conn = _get_db_conn()
    cur = conn.cursor()

    print("Step 2: Clearing july_ola_raw and july_ola_incentive...")
    cur.execute("TRUNCATE TABLE july_ola_raw, july_ola_incentive CASCADE;")
    conn.commit()
    conn.close()
    print("✓ Data tables cleared.")

    week_start = date(2026, 7, 27)
    week_end = date(2026, 8, 2)
    
    print("Step 3: Parsing Excel statement file...")
    raw_df, incentive_df = parse_statement(file_path, week_start=week_start, week_end=week_end)
    print(f"✓ Parsed raw rows: {len(raw_df)}, incentive rows: {len(incentive_df)}")

    print("Step 4: Loading data to PostgreSQL...")
    stats = load_to_postgres(
        raw_df=raw_df,
        incentive_df=incentive_df,
        week_start=week_start,
        week_end=week_end,
        logger=print
    )

    print("\nStep 5: Verifying PostgreSQL contents...")
    conn = _get_db_conn()
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) FROM july_ola_raw;")
    raw_count = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM july_ola_incentive;")
    inc_count = cur.fetchone()[0]

    print("\n" + "="*50)
    print("DATABASE SUMMARY:")
    print(f"  july_ola_raw total rows      : {raw_count}")
    print(f"  july_ola_incentive total rows: {inc_count}")
    print("="*50)

    conn.close()

if __name__ == "__main__":
    run()
