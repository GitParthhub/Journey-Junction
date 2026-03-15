@echo off
echo Installing axios dependency for photo service...
cd backend
npm install axios
echo.
echo Axios installed successfully!
echo.
echo Testing photo service...
node testPhotoService.js
echo.
echo Setup complete! The automatic photo feature is now ready.
echo.
echo To get better photos, add your API keys to backend/.env:
echo UNSPLASH_ACCESS_KEY=your_key_here
echo PIXABAY_API_KEY=your_key_here
echo.
pause