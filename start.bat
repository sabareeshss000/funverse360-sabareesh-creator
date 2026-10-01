@echo off
TITLE FUNVERSE 360 - Launcher
echo ===================================================
echo     FUNVERSE 360 - Play * Eat * Explore * Win
echo ===================================================
echo.
echo Starting Backend and Frontend servers...
echo Backend will be on: http://localhost:5000
echo Frontend will be on: http://localhost:5173
echo.

start "FUNVERSE 360 - Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "FUNVERSE 360 - Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started in separate windows!
echo You can now open http://localhost:5173 in your browser.
pause
