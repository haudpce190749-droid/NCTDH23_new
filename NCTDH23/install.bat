@echo off
title Cai dat Du an Cong Viec Lam Sinh Vien (EduJob)
echo ========================================================
echo   Dang cai dat thu vien phu thuoc cho Backend va Frontend...
echo ========================================================

echo.
echo [1/2] Cai dat thu vien Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [LOI] Khong the cai dat package cho backend.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Cai dat thu vien Frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo [LOI] Khong the cai dat package cho frontend.
    pause
    exit /b %errorlevel%
)

cd ..
echo.
echo ========================================================
echo   CAI DAT HOAN TAT THANH CONG!
echo   Chay 'start.bat' de khoi dong ung dung.
echo ========================================================
pause
