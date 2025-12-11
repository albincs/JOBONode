# Convert Routes
$routeFiles = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\routes\*.js"

foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace require statements
    $content = $content -replace "const express = require\('express'\);", "import express from 'express';"
    $content = $content -replace "const router = express\.Router\(\);", "const router = express.Router();"
    $content = $content -replace "const (.*?) = require\('\.\/(.*?)'\);", "import `$1 from './$2.js';"
    $content = $content -replace "const (.*?) = require\('\.\.\/(.*?)'\);", "import `$1 from '../$2.js';"
    
    # Replace module.exports
    $content = $content -replace "module\.exports = router;", "export default router;"
    $content = $content -replace "module\.exports = (.*?);", "export default `$1;"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Converted $($file.Name)"
}

# Convert Middleware
$middlewareFiles = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\middleware\*.js"

foreach ($file in $middlewareFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace require statements
    $content = $content -replace "const (.*?) = require\('\.\/(.*?)'\);", "import `$1 from './$2.js';"
    $content = $content -replace "const (.*?) = require\('\.\.\/(.*?)'\);", "import `$1 from '../$2.js';"
    $content = $content -replace "const jwt = require\('jsonwebtoken'\);", "import jwt from 'jsonwebtoken';"
    $content = $content -replace "const multer = require\('multer'\);", "import multer from 'multer';"
    $content = $content -replace "const path = require\('path'\);", "import path from 'path';"
    
    # Replace module.exports
    $content = $content -replace "module\.exports = (.*?);", "export default `$1;"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Converted $($file.Name)"
}

Write-Host "All routes and middleware converted!"
