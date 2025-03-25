const fs = require('fs');
const path = require('path');

// Write message to a file
const logPath = path.join(__dirname, 'hello.log');
fs.writeFileSync(logPath, 'Hello, world!\n');

// Also try console.log
console.log('Hello, world!'); 