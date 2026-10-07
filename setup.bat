@echo off
TITLE FUNVERSE 360 - Quick Setup
echo ===================================================
echo     FUNVERSE 360 - Dependency Installer & Seeder
echo ===================================================
echo.
echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
echo.
echo [2/3] Installing Frontend Dependencies...
cd ..\frontend
call npm install
echo.
echo [3/3] Seeding Initial Demo Data...
cd ..\backend
call npm run seed
echo.
echo ===================================================
echo     SETUP COMPLETE! Ready to Launch FUNVERSE 360!
echo     Run start.bat or 'npm run dev' to begin!
echo ===================================================
pause
