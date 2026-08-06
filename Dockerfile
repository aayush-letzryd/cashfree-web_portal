FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Copy requirements and install python dependencies
COPY ola-sync/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN playwright install chromium

# Copy source code
COPY . .

# Default command runs the pipeline orchestrator inside ola-sync
CMD ["python", "ola-sync/run_pipeline.py"]
