@echo off
setlocal
title Agent BOB Launcher

:: Change to the directory of the script
cd /d "%~dp0"

echo ========================================
echo        AGENT BOB - SMART LAUNCHER
echo ========================================
echo.

:: Check for node_modules
if not exist node_modules (
  echo [INFO] No se detecto node_modules. Instalando dependencias...
  call npm install
  if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias. Revisa tu conexion.
    pause
    exit /b %errorlevel%
  )
)

echo [INFO] Levantando el servidor de Agent BOB...
echo [INFO] La app se abrira en tu navegador predeterminado.
echo.
echo Presiona Ctrl+C para detener el servidor.

:: Run vite with auto-open
call npm run dev -- --open --host
