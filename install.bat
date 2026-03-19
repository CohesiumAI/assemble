@echo off
REM ═══════════════════════════════════════════════════════════════════════
REM Cohesium AI — Windows Installer (Batch launcher)
REM Detects Node.js or Python and launches the appropriate installer
REM ═══════════════════════════════════════════════════════════════════════

echo.
echo ═══════════════════════════════════════════════════════
echo    Cohesium AI — Agent Workflow System
echo    Windows Installer
echo ═══════════════════════════════════════════════════════
echo.

REM Check for --update flag
set "UPDATE_FLAG="
for %%a in (%*) do (
    if "%%a"=="--update" set "UPDATE_FLAG=--update"
    if "%%a"=="-u" set "UPDATE_FLAG=--update"
)

REM Try Node.js first (preferred)
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using Node.js...
    if defined UPDATE_FLAG (
        node "%~dp0bin\cli.js" --update %*
    ) else (
        node "%~dp0bin\cli.js" %*
    )
    goto :end
)

REM Try Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using Python...
    if defined UPDATE_FLAG (
        python "%~dp0install.py" --update %*
    ) else (
        python "%~dp0install.py" %*
    )
    goto :end
)

REM Try python3 (some Windows installs)
where python3 >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using Python 3...
    if defined UPDATE_FLAG (
        python3 "%~dp0install.py" --update %*
    ) else (
        python3 "%~dp0install.py" %*
    )
    goto :end
)

echo.
echo ERROR: Neither Node.js nor Python was found.
echo Please install one of them:
echo   - Node.js: https://nodejs.org/
echo   - Python:  https://python.org/
echo.
pause
exit /b 1

:end
