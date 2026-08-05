@echo off
REM ============================================================
REM  setup_windows_scheduler.bat
REM  Creates a Windows Task Scheduler task that runs the Ola
REM  sync pipeline every Monday at 09:00 IST (i.e. 03:30 UTC).
REM
REM  USAGE:
REM    1. Open Command Prompt as Administrator.
REM    2. cd to this ola-sync directory.
REM    3. Run:  setup_windows_scheduler.bat
REM
REM  To view the task:   taskschd.msc
REM  To delete the task: schtasks /Delete /TN "OlaSyncPipeline" /F
REM ============================================================

SET TASK_NAME=OlaSyncPipeline
SET SCRIPT_DIR=%~dp0
SET PYTHON=%SCRIPT_DIR%venv\Scripts\python.exe
SET SCRIPT=%SCRIPT_DIR%run_pipeline.py
SET LOG_FILE=%SCRIPT_DIR%logs\ola_sync.log

REM Create logs directory if it doesn't exist
if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"

REM Check Python venv exists
if not exist "%PYTHON%" (
    echo [ERROR] Python venv not found at %PYTHON%
    echo.
    echo Please run the following first to set up the environment:
    echo   python -m venv venv
    echo   venv\Scripts\pip install -r requirements.txt
    echo   venv\Scripts\playwright install chromium
    pause
    exit /b 1
)

echo [INFO] Creating Task Scheduler task "%TASK_NAME%"...
echo [INFO] Script: %SCRIPT%
echo [INFO] Python: %PYTHON%
echo [INFO] Log:    %LOG_FILE%
echo.

REM Weekly Monday 09:00 AM (local time — adjust if your system is UTC)
schtasks /Create /TN "%TASK_NAME%" /TR "\"%PYTHON%\" \"%SCRIPT%\" >> \"%LOG_FILE%\" 2>&1" /SC WEEKLY /D MON /ST 09:00 /RL HIGHEST /F

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Task "%TASK_NAME%" created successfully.
    echo      Runs: Every Monday at 09:00 local time
    echo      Log:  %LOG_FILE%
    echo.
    echo To add a second run (Thursday safety re-sync):
    echo   schtasks /Create /TN "OlaSyncPipelineThursday" /TR "\"%PYTHON%\" \"%SCRIPT%\" >> \"%LOG_FILE%\" 2>&1" /SC WEEKLY /D THU /ST 09:00 /RL HIGHEST /F
) else (
    echo [ERROR] Task creation failed. Run this script as Administrator.
)

echo.
pause
