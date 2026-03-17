@echo off
echo Creating Himalaya Adventure Trek sample data...
echo.

cd /d "%~dp0backend"

echo Running createHimalayaTrek.js...
node createHimalayaTrek.js

echo.
echo Done! Check your admin dashboard to see the new Himalaya Adventure Trek.
echo.
pause