/**
 * Script to copy PDFs from src/assets/PDF to public/assets/PDF
 * This allows PDFs to be served statically without requiring the backend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../src/assets/PDF');
const targetDir = path.join(__dirname, '../public/assets/PDF');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Created directory:', targetDir);
}

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

// Copy PDFs
if (fs.existsSync(sourceDir)) {
  console.log('Copying PDFs from', sourceDir, 'to', targetDir);
  copyDirectory(sourceDir, targetDir);
  console.log('PDFs copied successfully!');
} else {
  console.error('Source directory not found:', sourceDir);
  process.exit(1);
}

