# PowerShell script to start the Student Portal application

Write-Host "🎓 Starting Student Portal..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""
Write-Host "Building and starting containers..." -ForegroundColor Yellow
Write-Host ""

# Build and start containers
docker-compose up --build

Write-Host ""
Write-Host "🎉 Application started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "  Database: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "Test accounts:" -ForegroundColor Cyan
Write-Host "  Teacher: teacher@example.com / teacher123" -ForegroundColor White
Write-Host "  Student: student@example.com / student123" -ForegroundColor White






