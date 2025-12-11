$modelFiles = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\models\*.js" -Exclude "index.js"

foreach ($file in $modelFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace additional require statements
    $content = $content -replace "const slugify = require\('slugify'\);", "import slugify from 'slugify';"
    $content = $content -replace "const \{ now \} = require\('sequelize/lib/utils'\);", "import { now } from 'sequelize/lib/utils';"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Fixed $($file.Name)"
}

Write-Host "All remaining requires in models fixed!"
