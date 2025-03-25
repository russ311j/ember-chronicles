/**
 * Debug version of Magic Hour API script
 */

// Only use console.log for debugging
console.log('DEBUG START');

// Basic dependencies
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Check current directory
console.log('CWD:', process.cwd());

// Load environment variables
console.log('Loading .env file');
const envPath = path.resolve(__dirname, '../.env');
console.log('.env path:', envPath);
console.log('.env exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  // Read file directly
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env content length:', envContent.length);
  
  // Load with dotenv
  const result = dotenv.config({ path: envPath });
  console.log('dotenv result:', result);
  
  // Check Magic Hour API key
  console.log('MAGIC_HOUR_API_KEY exists:', !!process.env.MAGIC_HOUR_API_KEY);
  if (process.env.MAGIC_HOUR_API_KEY) {
    const key = process.env.MAGIC_HOUR_API_KEY;
    console.log('Key first 4 chars:', key.substring(0, 4));
  }
} else {
  console.log('ERROR: .env file not found');
}

// Test file system operations
const logsDir = path.resolve(__dirname, '../logs');
console.log('logs directory:', logsDir);
console.log('logs exists:', fs.existsSync(logsDir));

if (fs.existsSync(logsDir)) {
  const testFile = path.join(logsDir, 'debug-test.txt');
  fs.writeFileSync(testFile, `Debug test created at ${new Date().toISOString()}\n`);
  console.log('Test file written:', testFile);
}

console.log('DEBUG END'); 