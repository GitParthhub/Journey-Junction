@echo off
echo Stopping any existing servers on port 5000...

REM Kill any processes using port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        echo Killing process %%a
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo Waiting for port to be released...
timeout /t 2 /nobreak >nul

echo Starting Journey Junction backend server...
cd /d "%~dp0backend"
npm run dev