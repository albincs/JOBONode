# Fix broken imports in route files
$routeFiles = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\routes\*.js"

foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix broken controller imports
    $content = $content -replace "import (\w+)Controller from '\.\./\.js';", "import `$1Controller from '../controllers/`$1Controller.js';"
    $content = $content -replace "import authMiddleware from '\.\./\.js';", "import authMiddleware from '../middleware/auth.js';"
    $content = $content -replace "import roleMiddleware from '\.\./\.js';", "import roleMiddleware from '../middleware/role.js';"
    $content = $content -replace "import upload from '\.\./\.js';", "import upload from '../middleware/upload.js';"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Fixed $($file.Name)"
}

# Fix middleware imports if needed
$middlewareFiles = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\middleware\*.js"

foreach ($file in $middlewareFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix broken imports
    $content = $content -replace "from '\.\./\.js'", "from '../config/env.js'"
    $content = $content -replace "import (\w+) from '\.\./models/\.js';", "import `$1 from '../models/`$1.js';"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Fixed $($file.Name)"
}

Write-Host "All import paths fixed!"
