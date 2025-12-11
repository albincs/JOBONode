$routeFiles = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\routes\*.js" -Exclude "index.js"

foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Convert default imports to named imports (import * as)
    $content = $content -replace "import (\w+)Controller from '\.\./controllers/\1Controller\.js';", "import * as `$1Controller from '../controllers/`$1Controller.js';"
    $content = $content -replace "import authMiddleware from '\.\./middleware/auth\.js';", "import authMiddleware from '../middleware/auth.js';"
    $content = $content -replace "import roleMiddleware from '\.\./middleware/role\.js';", "import roleMiddleware from '../middleware/role.js';"
    $content = $content -replace "import upload from '\.\./middleware/upload\.js';", "import upload from '../middleware/upload.js';"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Fixed $($file.Name)"
}

Write-Host "All route imports fixed!"
