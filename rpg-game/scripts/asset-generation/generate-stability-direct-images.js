/**
 * Production-Quality Game Asset Generator
 * Using Stability AI API directly for consistent high-quality images
 * 
 * This script bypasses the problematic SDK and makes direct API calls
 * to generate game assets with a consistent art style.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
// Force reload without caching
delete require.cache[require.resolve('dotenv')];
dotenv.config({ path: envPath, override: true });

// Validate API key
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
if (!STABILITY_API_KEY) {
  console.error('ERROR: STABILITY_API_KEY is not set in .env file');
  process.exit(1);
}
console.log(`STABILITY_API_KEY exists: ${!!STABILITY_API_KEY}`);
console.log(`STABILITY_API_KEY value: ${STABILITY_API_KEY.substring(0, 4)}...${STABILITY_API_KEY.substring(STABILITY_API_KEY.length - 4)}`);

// Define style guidance for consistent look across all images
const STYLE_GUIDANCE = {
  // This will be appended to all prompts to maintain style consistency
  stylePrompt: "fantasy RPG game art, professional quality, cohesive game art style",
  
  // Common parameters for all generations
  cfgScale: 7.5, // How strictly to follow the prompt (7-8 is a good balance)
  steps: 40,     // Higher values = more detail but slower
  sampler: "K_EULER_ANCESTRAL" // Good general purpose sampler
};

// Define the assets to generate - FIXED DIMENSIONS for SDXL
const assets = [
  {
    id: 'loading_page',
    name: 'Loading Page',
    prompt: 'Fantasy loading screen, mystical portal, magical runes around the edges, minimal design',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0" 
  },
  {
    id: 'landing_page',
    name: 'Landing Page',
    prompt: 'Fantasy RPG landing page, magical scene with castle in distance, hero silhouette',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'main_menu_background',
    name: 'Main Menu Background',
    prompt: 'Fantasy castle on mountain, starry night, dramatic lighting, torch flames',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'character_creation_background',
    name: 'Character Creation Background',
    prompt: 'Mystical chamber with artifacts, glowing runes on stone walls, character silhouettes',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'mysterious_letter',
    name: 'Mysterious Letter',
    prompt: 'Ancient parchment, fantasy symbols, old paper with magical seal, fantasy RPG inventory item',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'forest_path_ghost',
    name: 'Forest Path (Ghost)',
    prompt: 'Spooky forest path, ghostly apparition between trees, misty, moonlight filtering through',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'mountain_pass',
    name: 'Mountain Pass',
    prompt: 'Mountain pass with rope bridge, fantasy scene, dramatic cliff, distant adventure',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'village_tavern',
    name: 'Village Tavern',
    prompt: 'Medieval tavern interior, cozy inn, fireplace, patrons, fantasy RPG scene',
    width: 1344,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  }
];

// Map of available engines with their capabilities
const ENGINES = {
  // Higher quality XL engines
  "stable-diffusion-xl-1024-v1-0": {
    displayName: "Stability SDXL 1.0",
    maxWidth: 1344,  // Updated to match our requirements
    maxHeight: 768,  // Updated to match our requirements
    idealAspectRatio: "7:4",
    fallbackEngine: "stable-diffusion-v1-6"
  },
  // Standard engines as fallbacks
  "stable-diffusion-v1-6": {
    displayName: "Stable Diffusion 1.6",
    maxWidth: 1024, 
    maxHeight: 768,
    minWidth: 320,
    minHeight: 320,
    idealAspectRatio: "4:3",
    fallbackEngine: "stable-diffusion-512-v2-1"
  },
  "stable-diffusion-512-v2-1": {
    displayName: "Stable Diffusion 512 v2.1",
    maxWidth: 512,
    maxHeight: 512,
    minPixelCount: 262144, // Min 512x512
    idealAspectRatio: "1:1",
    fallbackEngine: null
  }
};

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
const logFile = path.join(logDir, 'stability-direct-image-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  console.log(formattedMessage);
  logStream.write(formattedMessage + '\n');
}

/**
 * Adjust dimensions to be compatible with the selected engine
 */
function adjustDimensions(asset, engineId) {
  const engineInfo = ENGINES[engineId];
  
  if (!engineInfo) {
    log(`Warning: Engine ${engineId} not found in engine configuration`);
    return { width: asset.width, height: asset.height };
  }
  
  let newWidth = asset.width;
  let newHeight = asset.height;
  
  // Handle the v1-6 model which requires minimum dimensions of 320
  if (engineId === "stable-diffusion-v1-6") {
    newWidth = Math.max(newWidth, engineInfo.minWidth);
    newHeight = Math.max(newHeight, engineInfo.minHeight);
    
    if (newWidth > engineInfo.maxWidth) {
      const ratio = engineInfo.maxWidth / newWidth;
      newWidth = engineInfo.maxWidth;
      newHeight = Math.floor(newHeight * ratio);
    }
    
    if (newHeight > engineInfo.maxHeight) {
      const ratio = engineInfo.maxHeight / newHeight;
      newHeight = engineInfo.maxHeight;
      newWidth = Math.floor(newWidth * ratio);
    }
    
    // Ensure dimensions are in increments of 64
    newWidth = Math.floor(newWidth / 64) * 64;
    newHeight = Math.floor(newHeight / 64) * 64;
    
    // Double-check minimums again after rounding
    newWidth = Math.max(newWidth, engineInfo.minWidth);
    newHeight = Math.max(newHeight, engineInfo.minHeight);
  }
  // Handle the 512-v2-1 model which requires minimum total pixels
  else if (engineId === "stable-diffusion-512-v2-1") {
    // Start with 512x512 as base
    newWidth = 512;
    newHeight = 512;
    
    // For this model, we'll just use a square aspect ratio for simplicity
    log(`Using standard dimensions for ${engineInfo.displayName}: ${newWidth}x${newHeight}`);
  }
  // For XL models, use their specific requirements
  else {
    if (newWidth > engineInfo.maxWidth) {
      const ratio = engineInfo.maxWidth / newWidth;
      newWidth = engineInfo.maxWidth;
      newHeight = Math.floor(newHeight * ratio);
    }
    
    if (newHeight > engineInfo.maxHeight) {
      const ratio = engineInfo.maxHeight / newHeight;
      newHeight = engineInfo.maxHeight;
      newWidth = Math.floor(newWidth * ratio);
    }
    
    // Ensure dimensions are allowed for the XL model
    if (engineId === "stable-diffusion-xl-1024-v1-0") {
      // XL model requires specific aspect ratios - using 1344x768 which is allowed
      newWidth = 1344;
      newHeight = 768;
    }
  }
  
  log(`Adjusted dimensions: ${asset.width}x${asset.height} -> ${newWidth}x${newHeight}`);
  
  return { width: newWidth, height: newHeight };
}

/**
 * Generate an image using Stability API with direct HTTPS calls
 */
async function generateWithStabilityAPI(asset, engineId) {
  return new Promise((resolve, reject) => {
    log(`Generating "${asset.name}" using ${ENGINES[engineId]?.displayName || engineId}...`);
    
    // Combine the asset prompt with style guidance
    const fullPrompt = `${asset.prompt}. ${STYLE_GUIDANCE.stylePrompt}`;
    
    // Adjust dimensions for the selected engine
    const { width, height } = adjustDimensions(asset, engineId);
    
    // Create random seed for consistent results that can be reproduced
    const seed = Math.floor(Math.random() * 2147483647);
    
    // Set up request body according to Stability API docs
    // https://api.stability.ai/docs#tag/v1generation/operation/textToImage
    const requestBody = JSON.stringify({
      text_prompts: [
        {
          text: fullPrompt,
          weight: 1
        },
        {
          text: "blurry, distorted, low quality, bad anatomy, worst quality, low resolution",
          weight: -1 // Negative weight = negative prompt
        }
      ],
      cfg_scale: STYLE_GUIDANCE.cfgScale,
      height: height,
      width: width,
      samples: 1,
      steps: STYLE_GUIDANCE.steps,
      seed: seed
    });
    
    // Set up request options for Stability API
    const options = {
      hostname: "api.stability.ai",
      path: `/v1/generation/${engineId}/text-to-image`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${STABILITY_API_KEY}`,
        "Content-Length": Buffer.byteLength(requestBody)
      }
    };
    
    log(`Making API request to: https://${options.hostname}${options.path}`);
    log(`Engine: ${engineId}, Dimensions: ${width}x${height}, Seed: ${seed}`);
    log(`Full prompt: "${fullPrompt}"`);
    
    // Make the HTTP request
    const req = https.request(options, (res) => {
      let responseData = '';
      
      // Collect response data
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // Process response when it's complete
      res.on('end', () => {
        // Check if the request was successful
        if (res.statusCode !== 200) {
          log(`Error: Received status code ${res.statusCode}`);
          try {
            const errorData = JSON.parse(responseData);
            log(`API Error: ${JSON.stringify(errorData, null, 2)}`);
          } catch (e) {
            log(`Raw error response: ${responseData}`);
          }
          reject(new Error(`API request failed with status ${res.statusCode}`));
          return;
        }
        
        try {
          // Parse the response
          const response = JSON.parse(responseData);
          
          // Check if we have the expected data format
          if (response.artifacts && response.artifacts.length > 0) {
            // Extract the base64-encoded image
            const imageBase64 = response.artifacts[0].base64;
            
            // Save the image
            const outputPath = path.join(outputDir, `${asset.id}.png`);
            fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'));
            
            log(`✅ Successfully generated and saved ${asset.name}`);
            resolve({
              path: outputPath,
              engine: engineId,
              seed: seed
            });
          } else {
            log(`Error: Unexpected response format`);
            log(`Response: ${JSON.stringify(response, null, 2)}`);
            reject(new Error("Invalid response format from API"));
          }
        } catch (error) {
          log(`Error processing response: ${error.message}`);
          reject(error);
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      log(`Request error: ${error.message}`);
      reject(error);
    });
    
    // Send the request
    req.write(requestBody);
    req.end();
  });
}

/**
 * Try multiple engines if needed
 */
async function generateWithFallbacks(asset) {
  let currentEngine = asset.engine;
  let lastError = null;
  
  // Try the specified engine and its fallbacks
  while (currentEngine) {
    try {
      return await generateWithStabilityAPI(asset, currentEngine);
    } catch (error) {
      lastError = error;
      log(`Failed with ${currentEngine}: ${error.message}`);
      
      // Get fallback engine
      currentEngine = ENGINES[currentEngine]?.fallbackEngine;
      if (currentEngine) {
        log(`Attempting fallback to ${ENGINES[currentEngine]?.displayName || currentEngine}...`);
      }
    }
  }
  
  // If we get here, all engines failed
  throw new Error(`All engines failed: ${lastError?.message}`);
}

/**
 * Main function to generate all assets
 */
async function generateAllAssets() {
  log('Starting high-quality image generation with Stability API...');
  
  const results = {
    success: [],
    failed: []
  };
  
  // Process each asset one by one
  for (const asset of assets) {
    try {
      log(`\n===== Processing: ${asset.name} =====`);
      const result = await generateWithFallbacks(asset);
      
      results.success.push({
        id: asset.id,
        name: asset.name,
        engine: result.engine,
        seed: result.seed,
        path: result.path
      });
    } catch (error) {
      log(`❌ Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({
        id: asset.id,
        name: asset.name,
        error: error.message
      });
    }
    
    // Add delay between requests to avoid rate limiting
    log('Waiting 3 seconds before next request...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Generate summary report
  log('\n\n===== GENERATION SUMMARY =====');
  log(`Total assets: ${assets.length}`);
  log(`Successfully generated: ${results.success.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(item => {
      log(`- ${item.name}: ${item.error}`);
    });
  }
  
  if (results.success.length > 0) {
    log('\nSuccessful assets:');
    results.success.forEach(item => {
      log(`- ${item.name}: Generated with ${ENGINES[item.engine]?.displayName || item.engine} (seed: ${item.seed})`);
    });
    
    // Create documentation
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Production-Quality Game Assets

## Generated Images

These images were generated on ${new Date().toLocaleDateString()} using Stability AI's advanced models.

**IMPORTANT:** These images are static assets and should not be regenerated during normal gameplay.

## Available Images

${results.success.map(item => 
  `- **${item.name}** (\`${item.id}.png\`): Generated using ${ENGINES[item.engine]?.displayName || item.engine} (seed: ${item.seed})`
).join('\n')}

${results.failed.length > 0 ? 
  `\n## Failed Images\n\n${
    results.failed.map(item => `- **${item.name}** (\`${item.id}.png\`): ${item.error}`).join('\n')
  }` : ''}

## Style Details

All images were generated with the following style guidance to ensure consistency:
- \`${STYLE_GUIDANCE.stylePrompt}\`
- Configuration Scale: ${STYLE_GUIDANCE.cfgScale}
- Steps: ${STYLE_GUIDANCE.steps}
- Sampler: ${STYLE_GUIDANCE.sampler}

## Regeneration Instructions

To regenerate these images (only if needed for design updates):
1. Ensure your \`.env\` file contains a valid STABILITY_API_KEY
2. Run \`node scripts/generate-stability-direct-images.js\` from the project directory
`;

    fs.writeFileSync(docsPath, docsContent);
    log(`Created documentation at: ${docsPath}`);
  }
  
  log('\nImage generation process complete!');
  logStream.end();
  
  return results;
}

// Execute the generation process
generateAllAssets()
  .then(results => {
    if (results.failed.length > 0 && results.success.length === 0) {
      console.error('\nAll image generation failed. Please check the logs.');
      
      // Generate summary of failed assets
      console.log('\nFailed Assets Summary:');
      const assetsSummary = results.failed.map(item => {
        return `- ${item.name}: ${item.error}`;
      }).join('\n');
      console.log(assetsSummary);
      
      process.exit(1);
    } else if (results.failed.length > 0) {
      console.warn(`\nSome images failed to generate (${results.failed.length}/${assets.length}). Check the logs for details.`);
    } else {
      console.log('\nAll images generated successfully!');
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 