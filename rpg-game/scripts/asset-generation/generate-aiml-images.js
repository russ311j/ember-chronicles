/**
 * Game Asset Generator using AIML API with Stability AI models
 * 
 * This script generates high-quality game assets using the AIML API
 * with Stability AI models (stable-diffusion-v3-medium and stable-diffusion-v35-large)
 * according to official API documentation.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Validate API key
const AIML_API_KEY = process.env.AIML_API_KEY;
if (!AIML_API_KEY) {
  console.error('ERROR: AIML_API_KEY is not set in .env file');
  process.exit(1);
}
console.log(`AIML_API_KEY exists: ${!!AIML_API_KEY}`);
console.log(`AIML_API_KEY value: ${AIML_API_KEY.substring(0, 4)}...${AIML_API_KEY.substring(AIML_API_KEY.length - 4)}`);

// Define the assets to generate
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
const logFile = path.join(logDir, 'aiml-api-image-generation-log.txt');
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
 * 
 * Implements the API as documented at:
 * https://docs.aimlapi.com/api-references/image-models/stability-ai
 */
async function generateImage(asset, model = "stable-diffusion-v3-medium") {
  return new Promise((resolve, reject) => {
    log(`Generating "${asset.name}" using ${model}...`);
    
    // Prepare request payload according to AIML API docs
    const payload = JSON.stringify({
      model: model,
      prompt: asset.prompt,
      response_format: "b64_json", // Request base64-encoded image data
      size: `${asset.width}x${asset.height}`,
      n: 1 // Generate 1 image
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
    log(`Model: ${model}, Prompt: "${asset.prompt}"`);
    
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
          log(`Error: Received status code ${res.statusCode}`);
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
            
            log(`✅ Successfully generated and saved ${asset.name}`);
            resolve(outputPath);
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
 * Try different models for generating an image
 */
async function tryModels(asset) {
  // Models to try in order of preference
  const models = [
    "stable-diffusion-v3-medium",
    "stable-diffusion-v35-large",
    "stable-diffusion-xl-base-1.0"
  ];
  
  let lastError = null;
  
  // Try each model until one succeeds
  for (const model of models) {
    try {
      log(`Attempting generation with ${model}...`);
      const result = await generateImage(asset, model);
      log(`Success with ${model} for ${asset.name}`);
      return { path: result, model };
    } catch (error) {
      log(`Failed with ${model}: ${error.message}`);
      lastError = error;
      // Continue to next model
    }
  }
  
  // If we get here, all models failed
  throw new Error(`All models failed for ${asset.name}. Last error: ${lastError?.message}`);
}

/**
 * Main function to generate all assets
 */
async function generateAllAssets() {
  log('Starting image generation with AIML API...');
  
  const results = {
    success: [],
    failed: []
  };
  
  // Process each asset one by one
  for (const asset of assets) {
    try {
      log(`\n===== Processing: ${asset.name} =====`);
      const result = await tryModels(asset);
      results.success.push({
        id: asset.id,
        name: asset.name,
        model: result.model,
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
      log(`- ${item.name}: Generated with ${item.model}`);
    });
    
    // Create documentation
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Game Assets Generated With AIML API

## Generated Images

These images were generated on ${new Date().toLocaleDateString()} using AIML API with Stability AI models.

**IMPORTANT:** These images are static assets and should not be regenerated during normal gameplay.

## Available Images

${results.success.map(item => 
  `- **${item.name}** (\`${item.id}.png\`): Generated using ${item.model}`
).join('\n')}

${results.failed.length > 0 ? 
  `\n## Failed Images (Using Placeholders)\n\n${
    results.failed.map(item => `- **${item.name}** (\`${item.id}.png\`): ${item.error}`).join('\n')
  }` : ''}

## Regeneration Instructions

To regenerate these images (only if needed for design updates):
1. Run \`node scripts/generate-aiml-images.js\` from the project directory
2. Ensure your \`.env\` file contains a valid AIML_API_KEY
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
    // Check if we have any failures. If so, exit with error code
    if (results.failed.length > 0) {
      if (results.success.length === 0) {
        console.error('\nAll image generation failed. Please check the logs.');
        process.exit(1);
      } else {
        console.warn('\nSome images failed to generate. Check the logs for details.');
      }
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 