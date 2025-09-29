# Database Connection Test Script for Windows
Write-Host "🔍 Testing database connection..." -ForegroundColor Cyan

# Test 1: Ping database server
Write-Host "📡 Testing ping to 192.168.0.94..." -ForegroundColor Yellow
$pingResult = Test-Connection -ComputerName 192.168.0.94 -Count 3 -Quiet
if ($pingResult) {
    Write-Host "✅ Ping successful" -ForegroundColor Green
} else {
    Write-Host "❌ Ping failed" -ForegroundColor Red
}

# Test 2: Test MySQL port
Write-Host "🔍 Testing MySQL port 3306..." -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName 192.168.0.94 -Port 3306
if ($portTest.TcpTestSucceeded) {
    Write-Host "✅ MySQL port 3306 is accessible" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL port 3306 is not accessible" -ForegroundColor Red
}

# Test 3: Test from Docker container
Write-Host "🐳 Testing from Docker container..." -ForegroundColor Yellow
try {
    $dockerTest = docker exec -u root portal_backend ping -c 3 192.168.0.94
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker container can reach database server" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker container cannot reach database server" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Docker test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check Docker container logs
Write-Host "📋 Checking Docker container logs..." -ForegroundColor Yellow
try {
    $logs = docker logs portal_backend --tail 10
    Write-Host "Recent backend logs:" -ForegroundColor Cyan
    $logs | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} catch {
    Write-Host "❌ Failed to get Docker logs: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🏁 Database connection test completed" -ForegroundColor Cyan
