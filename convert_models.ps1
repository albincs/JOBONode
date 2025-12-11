$files = @(
  "AboutUs.js",
  "Award.js",
  "Client.js",
  "CmsTable.js",
  "CmsTableImage.js",
  "Contact.js",
  "Cost.js",
  "Project.js",
  "ProjectCategory.js",
  "ProjectImage.js",
  "ProjectURL.js",
  "Service.js",
  "Task.js",
  "Team.js",
  "Testimonial.js",
  "User.js"
)

foreach ($file in $files) {
    $filePath = "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\models\$file"
    $content = Get-Content $filePath -Raw
    
    # Replace require statements
    $content = $content -replace "const \{ (.*?) \} = require\('sequelize'\);", "import { `$1 } from 'sequelize';"
    $content = $content -replace "const sequelize = require\('\.\./config/database'\);", "import sequelize from '../config/database.js';"
    
    # Replace module.exports
    $content = $content -replace "module\.exports = (.*?);", "export default `$1;"
    
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "Converted $file"
}

Write-Host "All model files converted!"
