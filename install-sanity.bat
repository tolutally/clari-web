@echo off
echo Installing Sanity CMS dependencies...
echo.

npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo Installation completed!
    echo ================================
    echo.
    echo Next steps:
    echo 1. Create a Sanity project at https://www.sanity.io/manage
    echo 2. Copy your Project ID
    echo 3. Create .env.local file with:
    echo    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
    echo    NEXT_PUBLIC_SANITY_DATASET=production
    echo 4. Run: npm run dev
    echo 5. Visit: http://localhost:3000/admin
    echo.
    echo See SANITY_SETUP_COMPLETE.md for detailed instructions.
    echo.
) else (
    echo.
    echo Installation failed. Please check the error above.
    echo.
)

pause
