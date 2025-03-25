/**
 * Multi-API Game Asset Generator
 * 
 * This script attempts to generate images using multiple APIs:
 * - AIML API (with shorter prompts)
 * - Flux API
 * - Stability AI API
 * 
 * It will try each API in sequence for each asset until one succeeds.
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

// Define simplified assets with shorter prompts
const assets = [
  {
    id: 'loading_page',
    name: 'Loading Page',
    prompt: 'Fantasy loading screen, minimal design'
  },
  {
    id: 'landing_page',
    name: 'Landing Page',
    prompt: 'Fantasy RPG landing page, magical'
  },
  {
    id: 'main_menu_background',
    name: 'Main Menu Background',
    prompt: 'Fantasy castle on mountain, starry night'
  },
  {
    id: 'character_creation_background',
    name: 'Character Creation Background',
    prompt: 'Mystical chamber with artifacts'
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
const logFile = path.join(logDir, 'multi-api-image-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
}

// Function to check if an API key exists
function checkApiKey(name) {
  const key = process.env[name];
  log(`${name} exists: ${!!key}`);
  log(`${name} value: ${key ? key.substring(0, 4) + '...' + key.substring(key.length - 4) : 'No value'}`);
  return !!key;
}

// ==================== AIML API IMPLEMENTATION ====================

async function generateWithAIML(asset) {
  return new Promise((resolve, reject) => {
    if (!checkApiKey('AIML_API_KEY')) {
      reject(new Error('AIML_API_KEY is not set'));
      return;
    }

    log(`Generating "${asset.name}" using AIML API with stable-diffusion-v3-medium...`);
    
    // Simplified prompt for token limits
    const prompt = asset.prompt;
    
    // Log the prompt
    log(`Prompt: ${prompt}`);
    
    // Create request payload
    const payload = JSON.stringify({
      model: "stable-diffusion-v3-medium",
      prompt: prompt,
      response_format: "b64_json",
      size: "1024x768",
      n: 1
    });
    
    // Set up request options for AIML API
    const options = {
      hostname: 'api.aiml.services',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
        'Accept': 'application/json',
        'Content-Length': payload.length
      }
    };
    
    log('Making API request to: ' + `https://${options.hostname}${options.path}`);
    log('Using authentication method: Bearer token');
    
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
            // Save the base64 image data
            const imageBase64 = response.data[0].b64_json;
            const outputPath = path.join(outputDir, `${asset.id}.png`);
            
            fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'));
            log(`✅ Successfully generated and saved ${asset.name}: ${outputPath}`);
            resolve(outputPath);
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

// ==================== FLUX API IMPLEMENTATION ====================

async function generateWithFlux(asset) {
  return new Promise((resolve, reject) => {
    if (!checkApiKey('FLUX_API_KEY')) {
      reject(new Error('FLUX_API_KEY is not set'));
      return;
    }

    log(`Generating "${asset.name}" using Flux API...`);
    
    // Use simplified prompt
    const prompt = asset.prompt;
    
    // Log the prompt
    log(`Prompt: ${prompt}`);
    
    // Create request payload for Flux API
    const payload = JSON.stringify({
      prompt: prompt,
      aspect_ratio: "4:3",
      negative_prompt: "blurry, text, watermark, signature, bad quality"
    });
    
    // Set up request options for Flux API
    const options = {
      hostname: 'api.flux.ai',
      path: '/v1/image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FLUX_API_KEY}`,
        'Accept': 'application/json',
        'Content-Length': payload.length
      }
    };
    
    log('Making API request to: ' + `https://${options.hostname}${options.path}`);
    log('Using authentication method: Bearer token');
    
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
          
          if (response.images && response.images.length > 0 && response.images[0].url) {
            // For Flux API, we get a URL to download the image
            const imageUrl = response.images[0].url;
            log(`Image URL: ${imageUrl}`);
            
            // Download the image
            https.get(imageUrl, (imgRes) => {
              if (imgRes.statusCode !== 200) {
                log(`Error downloading image: HTTP ${imgRes.statusCode}`);
                reject(new Error(`Failed to download image for ${asset.name}`));
                return;
              }
              
              const outputPath = path.join(outputDir, `${asset.id}.png`);
              const fileStream = fs.createWriteStream(outputPath);
              
              imgRes.pipe(fileStream);
              
              fileStream.on('finish', () => {
                fileStream.close();
                log(`✅ Successfully downloaded and saved ${asset.name}: ${outputPath}`);
                resolve(outputPath);
              });
              
              fileStream.on('error', (err) => {
                log(`Error saving image: ${err.message}`);
                reject(err);
              });
            }).on('error', (err) => {
              log(`Error downloading image: ${err.message}`);
              reject(err);
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

// ==================== STABILITY API IMPLEMENTATION ====================

async function generateWithStability(asset) {
  return new Promise((resolve, reject) => {
    if (!checkApiKey('STABILITY_API_KEY')) {
      reject(new Error('STABILITY_API_KEY is not set'));
      return;
    }

    log(`Generating "${asset.name}" using Stability API with stable-diffusion-xl-1024-v1-0...`);
    
    // Simplified prompt
    const prompt = asset.prompt;
    
    // Log the prompt
    log(`Prompt: ${prompt}`);
    
    // Create request payload for Stability API
    const payload = JSON.stringify({
      text_prompts: [
        {
          text: prompt,
          weight: 1
        },
        {
          text: "blurry, text, watermark, signature, bad quality",
          weight: -1
        }
      ],
      cfg_scale: 7,
      height: 768,
      width: 1344,  // Valid Stability XL dimensions
      samples: 1,
      steps: 30
    });
    
    // Set up request options for Stability API
    const options = {
      hostname: 'api.stability.ai',
      path: '/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'application/json',
        'Content-Length': payload.length
      }
    };
    
    log('Making API request to: ' + `https://${options.hostname}${options.path}`);
    log('Using authentication method: Bearer token');
    
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
          
          if (response.artifacts && response.artifacts.length > 0) {
            // Save the base64 image data
            const imageBase64 = response.artifacts[0].base64;
            const outputPath = path.join(outputDir, `${asset.id}.png`);
            
            fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'));
            log(`✅ Successfully generated and saved ${asset.name}: ${outputPath}`);
            resolve(outputPath);
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

// Function to try all APIs for an asset
async function tryAllAPIsForAsset(asset) {
  log(`\n================ Processing ${asset.name} ================\n`);
  
  // Try AIML API first
  try {
    log(`Attempting AIML API for ${asset.name}...`);
    const result = await generateWithAIML(asset);
    log(`✅ AIML API succeeded for ${asset.name}`);
    return { api: 'AIML', path: result };
  } catch (error) {
    log(`AIML API failed for ${asset.name}: ${error.message}`);
  }
  
  // Try Flux API next
  try {
    log(`Attempting Flux API for ${asset.name}...`);
    const result = await generateWithFlux(asset);
    log(`✅ Flux API succeeded for ${asset.name}`);
    return { api: 'Flux', path: result };
  } catch (error) {
    log(`Flux API failed for ${asset.name}: ${error.message}`);
  }
  
  // Finally try Stability API
  try {
    log(`Attempting Stability API for ${asset.name}...`);
    const result = await generateWithStability(asset);
    log(`✅ Stability API succeeded for ${asset.name}`);
    return { api: 'Stability', path: result };
  } catch (error) {
    log(`Stability API failed for ${asset.name}: ${error.message}`);
  }
  
  // If all APIs failed
  throw new Error(`All APIs failed for ${asset.name}`);
}

// Generate all assets
async function generateAllAssets() {
  log('\n=== STARTING MULTI-API IMAGE GENERATION ===\n');
  
  // Check all API keys first
  log('Checking API keys...');
  checkApiKey('AIML_API_KEY');
  checkApiKey('FLUX_API_KEY');
  checkApiKey('STABILITY_API_KEY');
  
  log(`\nGenerating ${assets.length} images...\n`);
  
  const results = {
    success: [],
    failed: []
  };
  
  // Generate images sequentially (to avoid rate limits)
  for (const asset of assets) {
    try {
      const result = await tryAllAPIsForAsset(asset);
      results.success.push({ 
        id: asset.id, 
        api: result.api, 
        path: result.path 
      });
    } catch (error) {
      log(`❌ All APIs failed for ${asset.name}: ${error.message}`);
      results.failed.push({ id: asset.id, error: error.message });
    }
    
    // Small delay between assets
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Write summary report
  log('\n\n================ GENERATION SUMMARY ================\n');
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
    log('\nSuccessful assets:');
    results.success.forEach(item => {
      log(`- ${item.id}: Generated with ${item.api} API`);
    });
    
    // Create documentation in the images folder
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Generated Game Assets

## Generated Images

These images were generated on ${new Date().toLocaleDateString()} using multiple APIs.

**IMPORTANT: These images are static and should not be regenerated during normal gameplay.**

To regenerate these images (only if needed for design updates):
1. Run \`node scripts/generate-multi-api-images.js\` from the rpg-game directory
2. Ensure your \`.env\` file contains valid API keys

## Available Images

${assets.map(asset => {
  const successRecord = results.success.find(r => r.id === asset.id);
  if (successRecord) {
    return `- **${asset.name}** (\`${asset.id}.png\`): Generated with ${successRecord.api} API`;
  } else {
    return `- **${asset.name}** (\`${asset.id}.png\`): Failed to generate`;
  }
}).join('\n')}

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