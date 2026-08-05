import os
import psycopg2
import pandas as pd
from pathlib import Path

# Load env
env_path = Path(__file__).parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).parent.parent / ".env"

env = {}
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip()

print("--- DB INSPECTION ---")
try:
    conn = psycopg2.connect(dsn=env.get('DATABASE_URL'))
    cur = conn.cursor()
    for tbl in ['july_ola_raw', 'july_ola_incentive', 'ola_import_log']:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {tbl};")
            cnt = cur.fetchone()[0]
            print(f"Table '{tbl}': {cnt} rows")
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{tbl}' ORDER BY ordinal_position;")
            cols = cur.fetchall()
            print(f"  Columns: {[c[0] for c in cols]}")
        except Exception as e:
            print(f"  Error on {tbl}: {e}")
            conn.rollback()
    conn.close()
except Exception as e:
    print(f"DB Connection failed: {e}")

print("\n--- SAMPLE DATA FILES INSPECTION ---")
sample_dir = Path(__file__).parent.parent / "sample_data"
for fname in os.listdir(sample_dir):
    if fname.endswith(".xlsx"):
        fpath = sample_dir / fname
        print(f"\nFile: {fname}")
        xl = pd.ExcelFile(fpath)
        for s in xl.sheet_names:
            if "ola" in s.lower() or "incentive" in s.lower() or "hisaab" in s.lower() or "raw" in s.lower():
                df = pd.read_excel(fpath, sheet_name=s)
                print(f"  Sheet '{s}': shape={df.shape}, cols={df.columns.tolist()[:10]}")
