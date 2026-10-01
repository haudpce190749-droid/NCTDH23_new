@echo off
title Khoi Dong Ung Dung Cong Viec Lam Sinh Vien (EduJob)
echo ========================================================
echo   Dang khoi dong Backend API (Port 5000) & Frontend (Port 3000)...
echo ========================================================

:: Lay dia chi IP Wi-Fi / Mạng noi bo
for /f "tokens=*" %%i in ('powershell -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '169.254*' -and $_.IPAddress -notlike '127.0.0.1' } | Select-Object -First 1).IPAddress"') do set LOCAL_IP=%%i

echo.
echo Launching Backend Server...
start "Backend API (Port 5000)" cmd /k "cd backend && npm start"

echo.
echo Launching Frontend Vite App...
start "Frontend Vite (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   UNG DUNG DANG CHAY TAI:
echo.
echo   [1] Local Computer:    http://localhost:3000
echo   [2] Cung Wi-Fi / LAN:  http://%LOCAL_IP%:3000
echo.
echo   - Backend API:         http://localhost:5000/api/health
echo   - Backend Wi-Fi API:   http://%LOCAL_IP%:5000/api/health
echo ========================================================
pause
