/**
 * Game Asset Generator with API and Fallback
 * 
 * This script tries to generate images using AIML API first,
 * but falls back to local placeholder generation if the API fails.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
const { createCanvas } = require('canvas');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Define the assets to generate
const assets = [
  {
    id: 'loading_page',
    name: 'Loading Page',
    prompt: 'Fantasy loading screen, minimal design, mystical',
    color: '#1a1a2e',
    text: 'Loading Page'
  },
  {
    id: 'landing_page',
    name: 'Landing Page',
    prompt: 'Fantasy RPG landing page, magical scene',
    color: '#16213e',
    text: 'Landing Page'
  },
  {
    id: 'main_menu_background',
    name: 'Main Menu Background',
    prompt: 'Fantasy castle on mountain, starry night',
    color: '#0f3460',
    text: 'Main Menu Background'
  },
  {
    id: 'character_creation_background',
    name: 'Character Creation Background',
    prompt: 'Mystical chamber with artifacts, glowing runes',
    color: '#533483',
    text: 'Character Creation'
  },
  {
    id: 'mysterious_letter',
    name: 'Mysterious Letter',
    prompt: 'Ancient parchment, fantasy symbols, old paper',
    color: '#5c3c10',
    text: 'Mysterious Letter'
  },
  {
    id: 'forest_path_ghost',
    name: 'Forest Path (Ghost)',
    prompt: 'Spooky forest path, ghostly apparition, misty',
    color: '#2c3639',
    text: 'Forest Path'
  },
  {
    id: 'mountain_pass',
    name: 'Mountain Pass',
    prompt: 'Mountain pass, rope bridge, fantasy scene',
    color: '#3f4e4f',
    text: 'Mountain Pass'
  },
  {
    id: 'village_tavern',
    name: 'Village Tavern',
    prompt: 'Medieval tavern interior, cozy inn, fireplace',
    color: '#854d0e',
    text: 'Village Tavern'
  }
];

// Ensure output directory exists
const outputDir = path.resolve(__dirname, '../media/images/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Add log file creation
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created log directory: ${logDir}`);
}
const logFile = path.join(logDir, 'fallback-image-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  console.log(formattedMessage);
  logStream.write(formattedMessage + '\n');
}

/**
 * Generate an image using AIML API
 */
async function generateWithAIML(asset) {
  return new Promise((resolve, reject) => {
    const AIML_API_KEY = process.env.AIML_API_KEY;
    if (!AIML_API_KEY) {
      reject(new Error('AIML_API_KEY is not set in .env file'));
      return;
    }

    log(`Attempting API generation for "${asset.name}" using AIML...`);
    
    // Prepare request payload according to AIML API docs
    const payload = JSON.stringify({
      model: "stable-diffusion-v3-medium",
      prompt: asset.prompt,
      response_format: "b64_json",
      size: "1024x768",
      n: 1
    });
    
    // Set up request options based on AIML API requirements
    const options = {
      hostname: "api.aimlapi.com",
      path: "/v1/images/generations",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AIML_API_KEY}`,
        "Content-Length": Buffer.byteLength(payload)
      }
    };
    
    log(`Making API request to: https://${options.hostname}${options.path}`);
    
    // Make the HTTP request
    const req = https.request(options, (res) => {
      let data = "";
      
      // Collect response data
      res.on("data", (chunk) => {
        data += chunk;
      });
      
      // Process response when it's complete
      res.on("end", () => {
        // Check if the request was successful
        if (res.statusCode !== 200) {
          log(`API Error: Received status code ${res.statusCode}`);
          if (data) {
            try {
              const parsedError = JSON.parse(data);
              log(`API Error: ${JSON.stringify(parsedError, null, 2)}`);
            } catch (e) {
              log(`Raw error response: ${data}`);
            }
          }
          reject(new Error(`API request failed with status ${res.statusCode}`));
          return;
        }
        
        try {
          // Parse the response
          const response = JSON.parse(data);
          
          // Check if we have the expected data format
          if (response.data && response.data.length > 0 && response.data[0].b64_json) {
            // Extract the base64-encoded image
            const imageBase64 = response.data[0].b64_json;
            
            // Save the image
            const outputPath = path.join(outputDir, `${asset.id}.png`);
            fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'));
            
            log(`✅ Successfully generated and saved ${asset.name} using AIML API`);
            resolve({ path: outputPath, method: 'api' });
          } else {
            log(`Error: Unexpected response format`);
            log(`Response: ${JSON.stringify(response, null, 2)}`);
            reject(new Error("Invalid response format from API"));
          }
        } catch (error) {
          log(`Error parsing response: ${error.message}`);
          reject(error);
        }
      });
    });
    
    // Handle request errors
    req.on("error", (error) => {
      log(`Request error: ${error.message}`);
      reject(error);
    });
    
    // Send the request
    req.write(payload);
    req.end();
  });
}

/**
 * Generate a placeholder image with a solid background and centered text
 */
function generatePlaceholder(asset) {
  log(`Generating placeholder image for ${asset.name}...`);
  
  // Create a canvas (1024x768 resolution)
  const width = 1024;
  const height = 768;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background with color
  ctx.fillStyle = asset.color;
  ctx.fillRect(0, 0, width, height);
  
  // Add diagonal stripes for visual interest
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 20;
  for (let i = -2 * width; i < 2 * height; i += 80) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(i, 0);
    ctx.stroke();
  }
  
  // Draw a frame around the edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  // Add centered text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(asset.text, width / 2, height / 2);
  
  // Add 'PLACEHOLDER' text
  ctx.font = '24px Arial';
  ctx.fillText('PLACEHOLDER IMAGE', width / 2, height / 2 + 60);
  
  // Save the image
  const outputPath = path.join(outputDir, `${asset.id}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  log(`✅ Created placeholder image: ${outputPath}`);
  return { path: outputPath, method: 'placeholder' };
}

/**
 * Generate image with API or fallback to placeholder
 */
async function generateImageWithFallback(asset) {
  try {
    // Try API first
    return await generateWithAIML(asset);
  } catch (error) {
    // If API fails, log and fall back to placeholder
    log(`API generation failed for ${asset.name}: ${error.message}`);
    log(`Falling back to placeholder generation...`);
    return generatePlaceholder(asset);
  }
}

/**
 * Main function to generate all assets
 */
async function generateAllAssets() {
  log('Starting image generation with API + fallback...');
  
  const results = {
    api: [],
    placeholder: [],
    failed: []
  };
  
  // Process each asset one by one
  for (const asset of assets) {
    try {
      log(`\n===== Processing: ${asset.name} =====`);
      const result = await generateImageWithFallback(asset);
      
      if (result.method === 'api') {
        results.api.push({
          id: asset.id,
          name: asset.name,
          path: result.path
        });
      } else {
        results.placeholder.push({
          id: asset.id,
          name: asset.name,
          path: result.path
        });
      }
    } catch (error) {
      // This should rarely happen since placeholder is a reliable fallback
      log(`❌ Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({
        id: asset.id,
        name: asset.name,
        error: error.message
      });
    }
    
    // Add delay between requests to avoid rate limiting
    log('Waiting 1 second before next asset...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate summary report
  log('\n\n===== GENERATION SUMMARY =====');
  log(`Total assets: ${assets.length}`);
  log(`Generated with API: ${results.api.length}`);
  log(`Generated as placeholders: ${results.placeholder.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.api.length > 0) {
    log('\nAssets generated with API:');
    results.api.forEach(item => {
      log(`- ${item.name}`);
    });
  }
  
  if (results.placeholder.length > 0) {
    log('\nAssets generated as placeholders:');
    results.placeholder.forEach(item => {
      log(`- ${item.name}`);
    });
  }
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(item => {
      log(`- ${item.name}: ${item.error}`);
    });
  }
  
  // Create documentation
  const docsPath = path.join(outputDir, 'README.md');
  const docsContent = `# Game Assets 

## Generated Images

These images were generated on ${new Date().toLocaleDateString()}.

**IMPORTANT:** These images are static assets and should not be regenerated during normal gameplay.

## Images Generated with API

${results.api.length > 0 ? 
  results.api.map(item => `- **${item.name}** (\`${item.id}.png\`)`).join('\n') : 
  '(None - API generation was unavailable or rate-limited)'}

## Placeholder Images 

${results.placeholder.length > 0 ? 
  results.placeholder.map(item => `- **${item.name}** (\`${item.id}.png\`)`).join('\n') : 
  '(None)'}

## Regeneration Instructions

To regenerate these images:
1. Run \`node scripts/generate-fallback-images.js\` from the project directory
2. Ensure your \`.env\` file contains valid API keys
`;

  fs.writeFileSync(docsPath, docsContent);
  log(`Created documentation at: ${docsPath}`);
  
  log('\nImage generation process complete!');
  logStream.end();
  
  return results;
}

// Execute the generation process
generateAllAssets()
  .then(results => {
    // Check if we have any failures. If so, exit with error code
    if (results.failed.length > 0) {
      console.error('\nSome images failed to generate. Check the logs for details.');
      process.exit(1);
    } else if (results.api.length === 0 && results.placeholder.length === assets.length) {
      console.warn('\nAll images were generated as placeholders. API may be unavailable or rate-limited.');
    } else {
      console.log(`\nGenerated ${results.api.length} images via API and ${results.placeholder.length} placeholders.`);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 