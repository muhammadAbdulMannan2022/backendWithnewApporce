@echo off
echo Starting Docker containers...

:: Start Docker containers in detached mode
docker-compose up -d

:: Optional: wait a few seconds for containers to initialize
timeout /t 5 >nul

echo Starting the project...
npm run dev

pause
