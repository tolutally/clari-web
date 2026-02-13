# Install Sanity CMS packages
Write-Host "Installing Sanity CMS dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Packages installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a Sanity project at https://www.sanity.io/manage" -ForegroundColor White
    Write-Host "2. Copy your Project ID" -ForegroundColor White
    Write-Host "3. Create .env.local file with:" -ForegroundColor White
    Write-Host "   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id" -ForegroundColor Gray
    Write-Host "   NEXT_PUBLIC_SANITY_DATASET=production" -ForegroundColor Gray
    Write-Host "4. Run: npm run dev" -ForegroundColor White
    Write-Host "5. Visit: http://localhost:3000/admin" -ForegroundColor White
    Write-Host ""
    Write-Host "See SANITY_QUICKSTART.md for detailed instructions." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Installation failed. Check the error above." -ForegroundColor Red
}
