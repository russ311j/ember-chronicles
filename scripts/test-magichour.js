/**
 * Test script for Magic Hour API
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('Starting Magic Hour API test...');

// Load environment variables from the rpg-game directory
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Check if the API key exists
const apiKey = process.env.MAGIC_HOUR_API_KEY;
console.log('MAGIC_HOUR_API_KEY exists:', !!apiKey);

if (apiKey) {
  console.log('MAGIC_HOUR_API_KEY value:', `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log('Full key length:', apiKey.length);
  
  // Read the first directory to test file system access
  const outputDir = path.resolve(__dirname, '../media/images/generated');
  console.log('Output directory:', outputDir);
  console.log('Directory exists:', fs.existsSync(outputDir));
  
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    console.log('Files in directory:', files.length);
    console.log('First 5 files:', files.slice(0, 5));
  }
} else {
  console.log('API key not found. Please ensure MAGIC_HOUR_API_KEY is set in the .env file.');
}

console.log('Test complete!'); 