#!/usr/bin/env bash
# ==============================================================================
# gcp_deploy.sh — Deploy Ola Sync Pipeline to GCP (Cloud Run Job + Cloud Scheduler)
# Project: letzryd-dev-test
# Region:  asia-south1 (Mumbai)
# Database: Cloud SQL instance (letzryd-pgsql-dev1 / 10.10.20.10)
# ==============================================================================
set -euo pipefail

PROJECT_ID="letzryd-dev-test"
REGION="asia-south1"
REPO_NAME="ola-sync-repo"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/ola-sync-worker:latest"
JOB_NAME="ola-sync-job"
SCHEDULER_NAME="ola-sync-hourly-trigger"
CRON_SCHEDULE="0 * * * *"  # Every hour at minute 0

echo "=== STAGE 1: Config GCP Project ==="
gcloud config set project "${PROJECT_ID}"

echo "=== STAGE 2: Create Artifact Registry Repo if needed ==="
gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" >/dev/null 2>&1 || \
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker repository for Ola Sync Worker"

echo "=== STAGE 3: Build & Push Container Image ==="
gcloud builds submit --tag "${IMAGE_NAME}" .

echo "=== STAGE 4: Create or Update Cloud Run Job ==="
gcloud run jobs deploy "${JOB_NAME}" \
  --image="${IMAGE_NAME}" \
  --region="${REGION}" \
  --max-retries=2 \
  --task-timeout=15m \
  --set-env-vars="OLA_PHONE=7483731338,DATABASE_URL=postgresql://postgres:8S5%5DU3%40L%5EXz%29%5CFH%7D@35.200.196.113:5432/postgres"

echo "=== STAGE 5: Create or Update Cloud Scheduler Trigger ==="
gcloud scheduler jobs create http "${SCHEDULER_NAME}" \
  --location="${REGION}" \
  --schedule="${CRON_SCHEDULE}" \
  --uri="https://${REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${PROJECT_ID}/jobs/${JOB_NAME}:run" \
  --http-method=POST \
  --oauth-service-account-email="$(gcloud config get-value account)" || \
gcloud scheduler jobs update http "${SCHEDULER_NAME}" \
  --location="${REGION}" \
  --schedule="${CRON_SCHEDULE}"

echo "✅ GCP Deployment Complete!"
echo "Cloud Run Job: ${JOB_NAME}"
echo "Cloud Scheduler: ${SCHEDULER_NAME} (${CRON_SCHEDULE})"
