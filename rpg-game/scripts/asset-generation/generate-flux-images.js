/**
 * Game Asset Generator using Flux API
 * 
 * This script generates high-quality game assets using the Flux API
 * and stores them as static assets in the media/images/generated directory.
 * 
 * These images should only be regenerated when design changes are required.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables from the rpg-game directory
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });
console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.includes('API')));
console.log('FLUX_API_KEY exists:', !!process.env.FLUX_API_KEY);
console.log('FLUX_API_KEY value:', process.env.FLUX_API_KEY ? 'Has value' : 'No value');

// Define the assets to generate with shorter prompts
const assets = [
  {
    id: 'loading_page',
    name: 'Loading Page',
    prompt: 'Fantasy loading screen, minimal design, mystical',
    width: 1024,
    height: 768
  },
  {
    id: 'landing_page',
    name: 'Landing Page',
    prompt: 'Fantasy RPG landing page, magical scene',
    width: 1024,
    height: 768
  },
  {
    id: 'main_menu_background',
    name: 'Main Menu Background',
    prompt: 'Fantasy castle on mountain, starry night',
    width: 1024,
    height: 768
  },
  {
    id: 'character_creation_background',
    name: 'Character Creation Background',
    prompt: 'Mystical chamber with artifacts, glowing runes',
    width: 1024,
    height: 768
  },
  {
    id: 'mysterious_letter',
    name: 'Mysterious Letter',
    prompt: 'Ancient parchment, fantasy symbols, old paper',
    width: 1024,
    height: 768
  },
  {
    id: 'forest_path_ghost',
    name: 'Forest Path (Ghost)',
    prompt: 'Spooky forest path, ghostly apparition, misty',
    width: 1024,
    height: 768
  },
  {
    id: 'mountain_pass',
    name: 'Mountain Pass',
    prompt: 'Mountain pass, rope bridge, fantasy scene',
    width: 1024,
    height: 768
  },
  {
    id: 'village_tavern',
    name: 'Village Tavern',
    prompt: 'Medieval tavern interior, cozy inn, fireplace',
    width: 1024,
    height: 768
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
const logFile = path.join(logDir, 'flux-image-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
}

// Get the Flux API token
function getFluxToken() {
  const token = process.env.FLUX_API_KEY;
  
  if (!token) {
    throw new Error('FLUX_API_KEY is missing from .env file');
  }
  
  log(`Using Flux API key: ${token.substring(0, 4)}...${token.substring(token.length - 4)}`);
  return token;
}

// Function to generate an image using Flux API
async function generateWithFlux(asset) {
  return new Promise((resolve, reject) => {
    log(`Generating "${asset.name}" using Flux API...`);
    
    // Prompt
    const prompt = asset.prompt;
    
    // Log the prompt
    log(`Prompt: ${prompt}`);
    
    // Create request payload using Flux API format
    const payload = JSON.stringify({
      prompt: prompt,
      negative_prompt: "blurry, text, watermark, signature",
      width: asset.width,
      height: asset.height,
      num_images: 1,
      model: "stable-diffusion-xl"
    });
    
    // Set up request options for Flux API
    const options = {
      hostname: 'api.flux.ai',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getFluxToken()}`,
        'Content-Length': payload.length
      }
    };
    
    log('Making API request to: ' + `https://${options.hostname}${options.path}`);
    log('Using authentication method: Bearer token');
    log('Request payload: ' + payload);
    
    // Make request
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          log(`Error generating ${asset.name}: HTTP ${res.statusCode}`);
          log(`Headers: ${JSON.stringify(res.headers)}`);
          try {
            const errorData = JSON.parse(data);
            log('API Error: ' + JSON.stringify(errorData, null, 2));
          } catch (e) {
            log('Raw response: ' + data);
          }
          
          reject(new Error(`API returned status ${res.statusCode} for ${asset.name}`));
          return;
        }
        
        try {
          const response = JSON.parse(data);
          log('API Response received successfully');
          
          if (response.data && response.data.length > 0) {
            // Extract image URL from response
            const imageUrl = response.data[0].url;
            
            // Download the image
            downloadImage(imageUrl, asset.id).then(outputPath => {
              log(`✅ Successfully generated and saved ${asset.name}: ${outputPath}`);
              resolve(outputPath);
            }).catch(error => {
              log(`Error downloading image for ${asset.name}: ${error.message}`);
              reject(error);
            });
          } else {
            log(`Unexpected response format for ${asset.name}`);
            log('API response: ' + JSON.stringify(response, null, 2));
            reject(new Error(`Unexpected response format for ${asset.name}`));
          }
        } catch (error) {
          log(`Error processing response for ${asset.name}: ${error.message}`);
          log('Raw response data: ' + data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      log(`Error with API request for ${asset.name}: ${error.message}`);
      reject(error);
    });
    
    req.write(payload);
    req.end();
  });
}

// Function to download an image from a URL
function downloadImage(url, id) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, `${id}.png`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(outputPath);
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
      
      file.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Generate all assets
async function generateAllAssets() {
  log('Starting image generation process with Flux API...');
  
  try {
    // Validate that we have a valid API key
    getFluxToken();
  } catch (e) {
    log(e.message);
    process.exit(1);
  }
  
  log(`Generating ${assets.length} images...`);
  
  const results = {
    success: [],
    failed: []
  };
  
  // Generate images sequentially to avoid rate limits
  for (const asset of assets) {
    try {
      const filePath = await generateWithFlux(asset);
      results.success.push({ id: asset.id, path: filePath });
    } catch (error) {
      log(`Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({ id: asset.id, error: error.message });
    }
    
    // Small delay between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Write summary report
  log('\n=== GENERATION SUMMARY ===');
  log(`Total: ${assets.length}`);
  log(`Successful: ${results.success.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(item => {
      log(`- ${item.id}: ${item.error}`);
    });
  }
  
  if (results.success.length > 0) {
    // Create documentation in the images folder
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Static Game Assets Generated With Flux API
  
## Generated Images

These images were generated using Flux API with stable-diffusion-xl on ${new Date().toLocaleDateString()}.

**IMPORTANT: These images are static and should not be regenerated during normal gameplay.**

To regenerate these images (only if needed for design updates):
1. Run \`node scripts/generate-flux-images.js\` from the rpg-game directory
2. Ensure your \`.env\` file contains a valid FLUX_API_KEY

## Available Images

${assets.map(asset => `- **${asset.name}** (\`${asset.id}.png\`): ${asset.prompt}`).join('\n')}

## Usage

These images are automatically loaded by the game. Do not modify the filenames.
`;

    fs.writeFileSync(docsPath, docsContent);
    log(`\nDocumentation written to: ${docsPath}`);
  }
  
  log('\nImage generation process complete!');
  
  // Close the log stream
  logStream.end();
}

// Run the generator
generateAllAssets().catch(err => {
  log('Fatal error during image generation:');
  log(err.message);
  process.exit(1);
}); 