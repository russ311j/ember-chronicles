// Generate game assets using Stability AI API
const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '../../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

// Constants
const OUTPUT_DIR = path.join(__dirname, '../media/images/generated');
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'image-generation-log.txt');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Initialize log file
fs.writeFileSync(LOG_FILE, `Image Generation Log - ${new Date().toISOString()}\n\n`);

// Log both to file and console
function log(message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(message);
}

// Get Stability API Key
function getStabilityToken() {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    throw new Error('STABILITY_API_KEY not found in environment variables');
  }
  
  // Extract only the key value, in case there's any formatting issues
  const cleanKey = apiKey.trim().replace(/^(Bearer\s+)?/i, '');
  
  log(`Using Stability API key: ${cleanKey.substring(0, 3)}...${cleanKey.substring(cleanKey.length - 4)}`);
  return cleanKey;
}

// Generate an image using Stability AI API
async function generateWithStability(assetName, prompt) {
  // Define all available model IDs to try
  const modelIds = [
    'stable-diffusion-v1-6',
    'stable-diffusion-v3-medium',
    'stable-diffusion-v35-large',
    'stable-diffusion-xl-base-1.0'
  ];
  
  let lastError = null;
  
  // Try each model ID in sequence until one works
  for (const modelId of modelIds) {
    try {
      return await tryGenerateWithModel(assetName, prompt, modelId);
    } catch (error) {
      log(`Model ${modelId} failed: ${error.message}`);
      lastError = error;
      // Continue to the next model
    }
  }
  
  // If we reach here, all models failed
  throw lastError || new Error(`All models failed for ${assetName}`);
}

// Try to generate with a specific model
async function tryGenerateWithModel(assetName, prompt, modelId) {
  return new Promise((resolve, reject) => {
    const outputFileName = path.join(OUTPUT_DIR, `${assetName.toLowerCase().replace(/\s+/g, '_')}.png`);
    
    log(`Generating "${assetName}" using Stability AI with model ${modelId}...`);
    log(`Prompt: ${prompt}`);
    
    const apiKey = getStabilityToken();
    
    // Construct the API URL with the model ID
    const apiUrl = `https://api.stability.ai/v1/generation/${modelId}/text-to-image`;
    
    log(`Making API request to: ${apiUrl}`);
    log(`Using authentication method: Bearer token`);
    
    // Prepare request payload
    const payload = JSON.stringify({
      text_prompts: [
        {
          text: prompt,
          weight: 1
        },
        {
          text: "blurry, bad quality, text, watermark, signature, deformed, ugly",
          weight: -1
        }
      ],
      cfg_scale: 7,
      height: 768,
      width: 1024,
      samples: 1,
      steps: 30
    });
    
    log(`Request payload: ${payload}`);
    
    // Prepare request options
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    // Make request to Stability API
    const req = https.request(apiUrl, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          log(`Error generating ${assetName} with model ${modelId}: HTTP ${res.statusCode}`);
          log(`Headers: ${JSON.stringify(res.headers)}`);
          
          try {
            const errorData = JSON.parse(data);
            log(`API Error: ${JSON.stringify(errorData, null, 2)}`);
          } catch (e) {
            log(`API Response: ${data}`);
          }
          
          reject(new Error(`API returned status ${res.statusCode} for ${assetName} with model ${modelId}`));
          return;
        }
        
        try {
          const responseData = JSON.parse(data);
          
          // Extract image data from response and save it
          if (responseData.artifacts && responseData.artifacts.length > 0) {
            const imageBase64 = responseData.artifacts[0].base64;
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            fs.writeFileSync(outputFileName, imageBuffer);
            log(`Successfully generated and saved ${assetName} to ${outputFileName} using model ${modelId}`);
            resolve(outputFileName);
          } else {
            log(`No image data returned for ${assetName} with model ${modelId}`);
            reject(new Error(`No image data returned for ${assetName} with model ${modelId}`));
          }
        } catch (error) {
          log(`Error processing response for ${assetName} with model ${modelId}: ${error.message}`);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      log(`Network error for ${assetName} with model ${modelId}: ${error.message}`);
      reject(error);
    });
    
    // Send the request
    req.write(payload);
    req.end();
  });
}

// Main function to generate all images
async function generateImages() {
  log('Starting image generation process with Stability AI...');
  
  // List of assets to generate
  const assets = [
    {
      name: 'Landing Page',
      prompt: 'Fantasy RPG landing page, magical scene with fantasy elements, epic adventure, high quality fantasy art, no text'
    },
    {
      name: 'Main Menu Background',
      prompt: 'Fantasy landscape, epic medieval castle on a mountain, starry night sky, fantasy world, cinematic lighting, high quality concept art, no text'
    },
    {
      name: 'Character Creation Background',
      prompt: 'Mystical chamber with magical artifacts, fantasy character creation room, glowing runes, atmospheric lighting, fantasy concept art, no text'
    },
    {
      name: 'Mysterious Letter',
      prompt: 'Ancient parchment with fantasy symbols, old weathered paper, mysterious fantasy letter, magical seal, detailed fantasy illustration, no text'
    },
    {
      name: 'Forest Path (Ghost)',
      prompt: 'Spooky forest path with ghostly apparition, misty fantasy forest, eerie atmosphere, fantasy game scene, foggy trail, high quality digital illustration, no text'
    },
    {
      name: 'Mountain Pass',
      prompt: 'Dangerous mountain pass with rope bridge, fantasy mountain scene, treacherous crossing, epic landscape, dramatic lighting, adventure game background, no text'
    },
    {
      name: 'Village Tavern',
      prompt: 'Fantasy medieval tavern interior, cozy inn with fireplace, wooden tables, fantasy RPG location, warm lighting, detailed environment, no text'
    }
  ];
  
  log(`Generating ${assets.length} images...`);
  
  // Track results
  const results = {
    successful: [],
    failed: []
  };
  
  // Generate each image sequentially to avoid rate limits
  for (const asset of assets) {
    try {
      await generateWithStability(asset.name, asset.prompt);
      results.successful.push(asset.name);
      // Add a small delay between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      log(`Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({
        name: asset.name,
        error: error.message
      });
      // Continue with next asset even if this one failed
    }
  }
  
  // Generate summary
  log('\n=== GENERATION SUMMARY ===');
  log(`Total: ${assets.length}`);
  log(`Successful: ${results.successful.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(failure => {
      log(`- ${failure.name.toLowerCase().replace(/\s+/g, '_')}: ${failure.error}`);
    });
  }
  
  log('\nImage generation process complete!');
}

// Run the generation process
generateImages().catch(error => {
  log(`Fatal error: ${error.message}`);
  process.exit(1);
}); 