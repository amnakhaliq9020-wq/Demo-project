@echo off
echo ========================================
echo   VidShare Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Starting server...
echo.
echo Server will be available at:
echo   - API: http://localhost:5000
echo   - Test: http://localhost:5000/test
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev

pause 