import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const zipFile = path.join(rootDir, 'app_optimized.zip');

console.log('Starting optimization build...');

// 1. Clean previous build
console.log('Cleaning clean...');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
if (fs.existsSync(zipFile)) {
    fs.rmSync(zipFile, { force: true });
}

// 2. Create dist
fs.mkdirSync(distDir);

// 3. Copy files
console.log('Copying files...');
const filesToCopy = ['src', 'package.json', 'public', '.env']; // excluded node_modules
filesToCopy.forEach(file => {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    }
});

// 4. Remove uploads from dist
const uploadsDir = path.join(distDir, 'public/uploads');
if (fs.existsSync(uploadsDir)) {
    console.log('Removing public/uploads...');
    fs.rmSync(uploadsDir, { recursive: true, force: true });
}

// 5. Install production dependencies
console.log('Installing production dependencies...');
try {
    execSync('npm install --production --no-audit --no-fund', { cwd: distDir, stdio: 'inherit' });
} catch (e) {
    console.error('npm install failed');
    process.exit(1);
}

// 6. Remove .cache
const cacheDir = path.join(distDir, 'node_modules/.cache');
if (fs.existsSync(cacheDir)) {
    console.log('Removing node_modules/.cache...');
    fs.rmSync(cacheDir, { recursive: true, force: true });
}

// 7. Calculate Size
const getAllFiles = (dirPath, arrayOfFiles) => {
  files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []
  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })
  return arrayOfFiles
}

let totalSize = 0;
getAllFiles(distDir).forEach(filePath => {
    totalSize += fs.statSync(filePath).size;
});
console.log(`Total unzipped size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

if (totalSize > 262144000) {
    console.warn('WARNING: Total size exceeds AWS Lambda 250MB limit!');
} else {
    console.log('SUCCESS: Size is within AWS Lambda limits.');
}

// 8. Zip
console.log('Zipping...');
try {
    // using tar because windows zip might not be available or consistent
    // tar -a -c -f app_optimized.zip -C dist .
    execSync(`tar -a -c -f "${zipFile}" * .env`, { cwd: distDir, stdio: 'inherit' });
} catch (e) {
    console.error('Zip failed', e);
    process.exit(1);
}

console.log('Build complete -> app_optimized.zip');
