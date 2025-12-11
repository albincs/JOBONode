$controllers = Get-ChildItem "c:\jobo8_2024\joboBE\joboBE\NodeJobo\src\controllers\*.js"

foreach ($file in $controllers) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace require statements at the top
    $content = $content -replace "const \{ (.*?) \} = require\('\.\./models'\);", "import { `$1 } from '../models/index.js';"
    $content = $content -replace "const bcrypt = require\('bcryptjs'\);", "import bcrypt from 'bcryptjs';"
    $content = $content -replace "const jwt = require\('jsonwebtoken'\);", "import jwt from 'jsonwebtoken';" 
    $content = $content -replace "const crypto = require\('crypto'\);", "import crypto from 'crypto';"
    $content = $content -replace "const nodemailer = require\('nodemailer'\);", "import nodemailer from 'nodemailer';"
    $content = $content -replace "const accessEnv = require\('\.\./\.\./access_env'\);", "import accessEnv from '../../access_env.js';"
    
    # Convert exports.functionName to named exports
    # First, collect all function names
    $functionPattern = "exports\.(\w+)\s*="
    $functions = [regex]::Matches($content, $functionPattern) | ForEach-Object { $_.Groups[1].Value }
    
    # Replace exports.functionName = with const functionName =
    $content = $content -replace "exports\.(\w+)\s*=", "export const `$1 ="
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Converted $($file.Name)"
}

Write-Host "All controllers converted!"
