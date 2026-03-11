@echo off
title Rabbitt Sales Insight Automator
color 0A

echo.
echo  ========================================
echo    Rabbitt Sales Insight Automator
echo  ========================================
echo.

echo  Starting backend dev server...
cd /d "%~dp0backend"
start "Rabbitt Backend" cmd /k "npx tsx watch src/server.ts"

echo  Starting frontend dev server...
cd /d "%~dp0frontend"
start "Rabbitt Frontend" cmd /k "npx vite --host"

echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo  Swagger:  http://localhost:5000/api-docs
echo.
echo  Servers running in separate windows.
echo  Close this window or press any key to exit.
pause >nul
