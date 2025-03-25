/**
 * Debug script for Magic Hour API
 */

// Simple debug script with no async/await
console.log('Starting Magic Hour API debug...');

try {
  // Check Node.js version
  console.log('Node.js version:', process.version);
  
  // Load modules
  console.log('Loading modules...');
  const fs = require('fs');
  const path = require('path');
  const dotenv = require('dotenv');
  
  console.log('Modules loaded successfully');
  
  // Load environment variables
  const envPath = path.resolve(__dirname, '../.env');
  console.log('Loading .env from:', envPath);
  
  // Check if .env file exists
  console.log('.env file exists:', fs.existsSync(envPath));
  
  if (fs.existsSync(envPath)) {
    console.log('.env file content:');
    const envContent = fs.readFileSync(envPath, 'utf8');
    // Print lines that don't contain sensitive information
    const safeLines = envContent.split('\n').map(line => {
      if (line.includes('KEY') || line.includes('SECRET') || line.includes('TOKEN')) {
        return line.split('=')[0] + '=[REDACTED]';
      }
      return line;
    });
    console.log(safeLines.join('\n'));
  }
  
  // Load env vars
  dotenv.config({ path: envPath });
  
  // Check environment variables
  console.log('Environment variables loaded:');
  const envVars = Object.keys(process.env).filter(key => 
    key.includes('API') || key.includes('KEY') || key.includes('TOKEN')
  );
  
  console.log('API-related environment variables:', envVars);
  
  // Check Magic Hour key specifically
  const magicHourKey = process.env.MAGIC_HOUR_API_KEY;
  console.log('MAGIC_HOUR_API_KEY exists:', !!magicHourKey);
  
  if (magicHourKey) {
    // Only show the first and last few characters
    const maskedKey = magicHourKey.substring(0, 4) + '...' + 
                      magicHourKey.substring(magicHourKey.length - 4);
    console.log('MAGIC_HOUR_API_KEY value (masked):', maskedKey);
    console.log('Key length:', magicHourKey.length);
  } else {
    console.log('MAGIC_HOUR_API_KEY not found');
  }
  
  // Write to a log file
  const logDir = path.resolve(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log('Created log directory');
  }
  
  const logFile = path.join(logDir, 'magichour-debug.log');
  fs.writeFileSync(logFile, `Debug log created at ${new Date().toISOString()}\n`, 'utf8');
  console.log('Log file created:', logFile);
  
  console.log('Debug completed successfully');
} catch (error) {
  console.error('ERROR:', error.message);
  console.error(error.stack);
} 