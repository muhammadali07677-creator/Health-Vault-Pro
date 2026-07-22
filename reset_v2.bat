@echo off
setlocal
echo ==========================================
echo    PATIENTPORTAL V2 - DATA RESET TOOL
echo ==========================================
echo WARNING: This will delete ALL patients, doctors,
echo and medical reports from the system.
echo.
set /p confirm="Are you sure you want to proceed? (Y/N): "

if /i "%confirm%" neq "Y" goto cancel

echo.
echo Cleaning up...

:: Clear the uploads folder
if exist "backend\uploads" (
    del /q "backend\uploads\*.*"
    echo [+] Cleared all medical reports.
)

:: Reset the store.json file (with correct structure including reviews)
if exist "backend\data\store.json" (
    (echo {) > "backend\data\store.json"
    (echo   "patients": {},) >> "backend\data\store.json"
    (echo   "reviews": []) >> "backend\data\store.json"
    (echo }) >> "backend\data\store.json"
    echo [+] JSON database has been wiped clean.
)

:: Clear the Access DB patient registry (keeps the .accdb file, only clears records)
if exist "backend\data\patients_registry.accdb" (
    echo [.] Clearing Access DB patient registry...
    cmd /c "cd /d "%~dp0backend" && node clear-access-db.js"
    if %errorlevel% equ 0 (
        echo [+] Access patient registry has been cleared.
    ) else (
        echo [!] Access DB clear failed or driver not installed - skipping.
    )
) else (
    echo [~] Access DB file not found - skipping. It will be created on next startup.
)

echo.
echo RESET SUCCESSFUL!
echo Everything is back to a fresh state.
pause
exit

:cancel
echo.
echo Reset cancelled. No data was deleted.
pause
exit
