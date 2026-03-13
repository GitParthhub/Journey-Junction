@echo off
echo.
echo ========================================
echo  JOURNEY JUNCTION - GITHUB PUSH SCRIPT
echo ========================================
echo.
echo Replace 'yourusername' with your actual GitHub username
echo Replace 'repository-name' with your actual repository name
echo.
echo Commands to run:
echo.
echo 1. Add remote repository:
echo    git remote add origin https://github.com/yourusername/repository-name.git
echo.
echo 2. Push to GitHub:
echo    git push -u origin master
echo.
echo Example:
echo    git remote add origin https://github.com/johndoe/journey-junction.git
echo    git push -u origin master
echo.
echo ========================================
echo  CURRENT REPOSITORY STATUS
echo ========================================
echo.
git log --oneline -5
echo.
echo Files committed: 92 files, 27,145 insertions
echo.
pause