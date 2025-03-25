const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Setup logging
const logPath = path.join(__dirname, 'env-test.log');
function log(message) {
  console.log(message);
  fs.appendFileSync(logPath, message + '\n');
}

// Start with a fresh log
if (fs.existsSync(logPath)) {
  fs.unlinkSync(logPath);
}

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
log('Loading .env from: ' + envPath);

try {
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    log('Error loading .env file: ' + result.error);
  } else {
    log('.env file loaded successfully');
    const apiKeys = Object.keys(process.env).filter(key => key.includes('API'));
    log('Environment variables: ' + JSON.stringify(apiKeys));
    log('AIML_API_KEY exists: ' + !!process.env.AIML_API_KEY);
    if (process.env.AIML_API_KEY) {
      log('AIML_API_KEY value: ' + process.env.AIML_API_KEY.substring(0, 5) + '...');
    } else {
      log('AIML_API_KEY value: No value');
    }
  }
} catch (err) {
  log('Exception occurred: ' + err.toString());
  log('Stack trace: ' + err.stack);
} 