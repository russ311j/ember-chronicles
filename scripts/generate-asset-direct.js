/**
 * Game Asset Generator Script using direct API calls
 * This script uses the Stability AI REST API to generate game assets from text prompts
 */

require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Check for API key
if (!process.env.STABILITY_API_KEY) {
  console.error('Error: STABILITY_API_KEY is required in your .env file');
  console.error('Get your API key from https://platform.stability.ai/');
  process.exit(1);
}

// Ensure output directories exist
const outputDir = path.join(__dirname, '../rpg-game/media/images/generated');
fs.ensureDirSync(outputDir);

// Asset type definitions
const ASSET_TYPES = {
  CHARACTER: 'character',
  ITEM: 'item',
  BACKGROUND: 'background',
  PROP: 'prop'
};

// Game style definitions
const GAME_STYLES = {
  PIXEL_ART: 'pixel art',
  LOW_POLY: 'low poly',
  CARTOON: 'cartoon',
  REALISTIC: 'realistic',
  ISOMETRIC: 'isometric',
  FANTASY: 'fantasy'
};

/**
 * Generate a game asset image using direct API calls
 * @param {string} prompt - Text description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @param {string} filename - Filename to save as (without extension)
 * @returns {Promise<string>} Path to the generated image
 */
async function generateGameAsset(prompt, type, style, filename) {
  // Validate inputs
  if (!Object.values(ASSET_TYPES).includes(type)) {
    throw new Error(`Invalid asset type: ${type}. Must be one of: ${Object.values(ASSET_TYPES).join(', ')}`);
  }
  
  if (!Object.values(GAME_STYLES).includes(style)) {
    throw new Error(`Invalid style: ${style}. Must be one of: ${Object.values(GAME_STYLES).join(', ')}`);
  }
  
  if (!filename) {
    filename = `${type}_${Date.now()}`;
  }
  
  // Enhanced prompt with style information
  const enhancedPrompt = `${style} game ${type}, ${prompt}, professional quality, game asset, transparent background`;
  
  console.log(`Generating ${style} ${type}: "${prompt}"`);
  
  // Create a promise to handle the async API call
  return new Promise((resolve, reject) => {
    const finalPath = path.join(outputDir, `${filename}.png`);
    
    // API request body
    const data = JSON.stringify({
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1.0
        }
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30
    });
    
    // API request options
    const options = {
      hostname: 'api.stability.ai',
      port: 443,
      path: '/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
      }
    };
    
    // Make the API request
    const req = https.request(options, (res) => {
      let responseData = '';
      
      if (res.statusCode === 200) {
        // The response is binary image data
        console.log('Image generated successfully!');
        
        // Handle the binary stream for PNG data
        if (res.headers['content-type'] === 'image/png') {
          // Create a write stream to save the image
          const fileStream = createWriteStream(finalPath);
          res.pipe(fileStream);
          
          fileStream.on('finish', () => {
            console.log(`Asset generated successfully: ${finalPath}`);
            resolve(finalPath);
          });
          
          fileStream.on('error', (error) => {
            console.error('Error saving image file:', error);
            reject(error);
          });
        } else {
          // Handle JSON response (which might contain URLs to images)
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            try {
              const jsonResponse = JSON.parse(responseData);
              
              if (jsonResponse.artifacts && jsonResponse.artifacts.length > 0) {
                // Save the base64 image data as a file
                const base64Data = jsonResponse.artifacts[0].base64;
                const buffer = Buffer.from(base64Data, 'base64');
                
                fs.writeFile(finalPath, buffer, (err) => {
                  if (err) {
                    console.error('Error saving image file:', err);
                    reject(err);
                  } else {
                    console.log(`Asset generated successfully: ${finalPath}`);
                    resolve(finalPath);
                  }
                });
              } else {
                console.error('No image data found in response');
                reject(new Error('No image data found in response'));
              }
            } catch (error) {
              console.error('Error parsing JSON response:', error);
              reject(error);
            }
          });
        }
      } else {
        // Handle error responses
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          console.error(`Error: ${res.statusCode} ${res.statusMessage}`);
          console.error(`Response: ${responseData}`);
          reject(new Error(`API Error: ${res.statusCode} ${res.statusMessage}`));
        });
      }
    });
    
    // Handle request errors
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    // Send the request data
    req.write(data);
    req.end();
  });
}

/**
 * Command line interface for the script
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Display help if requested or no arguments provided
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Game Asset Generator

Usage:
  node generate-asset-direct.js [options]

Options:
  --prompt, -p      Text description of the asset (required)
  --type, -t        Asset type: ${Object.values(ASSET_TYPES).join(', ')} (default: item)
  --style, -s       Visual style: ${Object.values(GAME_STYLES).join(', ')} (default: pixel art)
  --filename, -f    Output filename without extension (default: type_timestamp)
  --help, -h        Show this help message

Example:
  node generate-asset-direct.js --prompt "magic sword with blue glow" --type item --style "pixel art" --filename magic_sword
    `);
    return;
  }
  
  // Parse arguments
  let prompt, type = ASSET_TYPES.ITEM, style = GAME_STYLES.PIXEL_ART, filename;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    if ((arg === '--prompt' || arg === '-p') && nextArg) {
      prompt = nextArg;
      i++;
    } else if ((arg === '--type' || arg === '-t') && nextArg) {
      type = nextArg;
      i++;
    } else if ((arg === '--style' || arg === '-s') && nextArg) {
      style = nextArg;
      i++;
    } else if ((arg === '--filename' || arg === '-f') && nextArg) {
      filename = nextArg;
      i++;
    }
  }
  
  if (!prompt) {
    console.error('Error: --prompt is required');
    process.exit(1);
  }
  
  try {
    await generateGameAsset(prompt, type, style, filename);
  } catch (error) {
    console.error('Failed to generate asset:', error.message);
    process.exit(1);
  }
}

// If this file is run directly (not imported)
if (require.main === module) {
  main();
} else {
  // Export for use as a module
  module.exports = {
    generateGameAsset,
    ASSET_TYPES,
    GAME_STYLES
  };
} 