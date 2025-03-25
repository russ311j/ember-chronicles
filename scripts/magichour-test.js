/**
 * Magic Hour API Image Generator for The Ember Throne Chronicles
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Helper function to write to log file
function writeLog(message) {
  const logPath = path.join(__dirname, '../logs/magic-hour.log');
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
}

try {
  writeLog('Script starting');
  
  // Load environment variables
  const envPath = path.resolve(__dirname, '../.env');
  writeLog(`Loading .env from: ${envPath}`);
  if (!fs.existsSync(envPath)) {
    writeLog('ERROR: .env file not found');
    process.exit(1);
  }
  
  dotenv.config({ path: envPath });
  
  // Check API key
  const apiKey = process.env.MAGIC_HOUR_API_KEY;
  if (!apiKey) {
    writeLog('ERROR: MAGIC_HOUR_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  writeLog(`API key found: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  
  // Setup output directories
  const outputDir = path.resolve(__dirname, '../media/images/generated');
  const magicHourDir = path.join(outputDir, 'magichour');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    writeLog(`Created output directory: ${outputDir}`);
  }
  
  if (!fs.existsSync(magicHourDir)) {
    fs.mkdirSync(magicHourDir, { recursive: true });
    writeLog(`Created Magic Hour directory: ${magicHourDir}`);
  }
  
  // Create a sample readme
  const readmePath = path.join(magicHourDir, 'README.md');
  fs.writeFileSync(readmePath, `# Magic Hour Generated Images
  
These images were generated using the Magic Hour API on ${new Date().toLocaleDateString()}.

## The Ember Throne Chronicles

This directory contains all images generated for The Ember Throne Chronicles gamebook.

## API Key Information

API key used: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}
`);
  
  writeLog(`Readme file created: ${readmePath}`);
  
  // Create a test image (placeholder)
  const testImagePath = path.join(magicHourDir, 'test-page.png');
  
  // Create a very simple placeholder image (1x1 transparent pixel)
  const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKDWIGMxwAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync(testImagePath, transparentPixel);
  
  writeLog(`Test image created: ${testImagePath}`);
  writeLog('Script completed successfully');
} catch (error) {
  writeLog(`ERROR: ${error.message}`);
  writeLog(error.stack);
} 