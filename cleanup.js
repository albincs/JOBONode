import fs from 'fs';
import path from 'path';

const dir = path.resolve('.adminjs');

try {
  if (fs.existsSync(dir)) {
    console.log(`Deleting ${dir}...`);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Deleted successfully.');
  } else {
    console.log('Directory not found, nothing to delete.');
  }
} catch (err) {
  console.error('Error deleting directory:', err);
  process.exit(1);
}
