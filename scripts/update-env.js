const fs = require('fs');
const path = require('path');

// Define path to .env file
const envPath = path.resolve(__dirname, '../.env');

// Read the current .env file
let content = fs.readFileSync(envPath, 'utf8');

// Replace the old Stability API key with the new one
content = content.replace(
  /STABILITY_API_KEY=sk-5yMvakoAxjmxZ3oVDeetY8PoeyTPi0WYRvRh9J1RbMvKNrq/,
  'STABILITY_API_KEY=sk-YjHVh8JTvfRvCoPo6WDr9OoP62dZ7HfZdOryuZWH8O0A8KUF'
);

// Write the updated content back to the .env file
fs.writeFileSync(envPath, content);

console.log('Updated .env file with new Stability API key');
console.log('New API key:', 'sk-YjHVh8JTvfRvCoPo6WDr9OoP62dZ7HfZdOryuZWH8O0A8KUF'); 