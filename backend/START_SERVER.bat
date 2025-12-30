@echo off
echo ====================================
echo   VidShare Backend Server Setup
echo ====================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating .env from template...
    echo.
    echo Please configure .env file with:
    echo - MONGODB_URI
    echo - JWT_SECRET
    echo - EMAIL_USER and EMAIL_PASS (optional)
    echo.
    pause
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
echo.
echo Server will run on: http://localhost:5000
echo Press Ctrl+C to stop
echo.
echo ====================================
echo.

call npm run dev

pause

