#!/usr/bin/env bash
# ==============================================================================
# gcp_setup_vm.sh — Setup Ola Sync Pipeline on GCE Worker VM (asia-south1)
# Project: letzryd-dev-test
# Connects directly to Cloud SQL Private IP: 10.10.20.10:5432
# ==============================================================================
set -euo pipefail

echo "=== STAGE 1: Install System Dependencies & Python 3.11 ==="
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv git curl build-essential

echo "=== STAGE 2: Create Virtual Environment & Install Playwright ==="
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
playwright install-deps chromium
playwright install chromium

echo "=== STAGE 3: Setup Hourly Crontab ==="
# Add hourly cron job running run_pipeline.py every hour at minute 0
CRON_JOB="0 * * * * cd $(pwd) && ./venv/bin/python run_pipeline.py >> pipeline.log 2>&1"
(crontab -l 2>/dev/null | grep -v "run_pipeline.py" ; echo "$CRON_JOB") | crontab -

echo "✅ GCE Worker Setup Complete!"
echo "Hourly crontab installed: 0 * * * *"
