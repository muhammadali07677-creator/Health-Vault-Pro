@echo off
echo Starting PatientPortal V2...
cd backend
start cmd /k "npm start"
cd ../frontend
start cmd /k "npm run dev"
echo Backend and Frontend are starting in separate windows...
pause
