/**
 * Manual Game Asset Generator with FLUX.1
 * This script uses manually crafted detailed prompts with FLUX.1 for image generation
 * without requiring the Gemini API
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

// Template prompt templates for different asset types and styles
const PROMPT_TEMPLATES = {
  // Character templates
  [ASSET_TYPES.CHARACTER]: {
    [GAME_STYLES.PIXEL_ART]: "Pixel art game character, [DESCRIPTION], highly detailed pixelated sprite, vibrant colors, sharp pixel edges, transparent background, game-ready asset",
    [GAME_STYLES.LOW_POLY]: "Low poly game character, [DESCRIPTION], minimalist geometric design, stylized proportions, soft colors, clean edges, 3D game asset",
    [GAME_STYLES.CARTOON]: "Cartoon game character, [DESCRIPTION], vibrant colors, expressive features, clean lines, professional hand-drawn style, game-ready design",
    [GAME_STYLES.REALISTIC]: "Realistic game character, [DESCRIPTION], high detail, textured skin, dynamic lighting, professional quality, game-ready 3D asset",
    [GAME_STYLES.ISOMETRIC]: "Isometric game character, [DESCRIPTION], isometric perspective, clean design, detailed from all visible angles, game-ready asset",
    [GAME_STYLES.FANTASY]: "Fantasy game character, [DESCRIPTION], magical aura, detailed fantasy elements, professional quality, rich colors, game-ready asset"
  },
  
  // Item templates
  [ASSET_TYPES.ITEM]: {
    [GAME_STYLES.PIXEL_ART]: "Pixel art game item, [DESCRIPTION], detailed pixel work, clean edges, vibrant colors, transparent background, game-ready asset",
    [GAME_STYLES.LOW_POLY]: "Low poly game item, [DESCRIPTION], simple geometric shape, minimal details, clean design, 3D game asset",
    [GAME_STYLES.CARTOON]: "Cartoon game item, [DESCRIPTION], bold outline, bright colors, exaggerated proportions, hand-drawn appearance, transparent background",
    [GAME_STYLES.REALISTIC]: "Realistic game item, [DESCRIPTION], photorealistic textures, accurate proportions, detailed materials, proper lighting, 3D game asset",
    [GAME_STYLES.ISOMETRIC]: "Isometric game item, [DESCRIPTION], isometric view, clean lines, consistent lighting, game-ready asset",
    [GAME_STYLES.FANTASY]: "Fantasy game item, [DESCRIPTION], magical aura, ornate details, glowing elements, fantasy style, transparent background"
  },
  
  // Background templates
  [ASSET_TYPES.BACKGROUND]: {
    [GAME_STYLES.PIXEL_ART]: "Pixel art game background, [DESCRIPTION], detailed environment, pixel art style, appropriate perspective, game-ready scene",
    [GAME_STYLES.LOW_POLY]: "Low poly game background, [DESCRIPTION], geometric landscape, minimal design, clean edges, 3D environment",
    [GAME_STYLES.CARTOON]: "Cartoon game background, [DESCRIPTION], vibrant scene, hand-painted appearance, expressive style, game-ready environment",
    [GAME_STYLES.REALISTIC]: "Realistic game background, [DESCRIPTION], photorealistic environment, detailed textures, proper lighting, atmospheric effects",
    [GAME_STYLES.ISOMETRIC]: "Isometric game background, [DESCRIPTION], isometric grid, clean design, consistent perspective, game-ready environment",
    [GAME_STYLES.FANTASY]: "Fantasy game background, [DESCRIPTION], magical atmosphere, fantasy elements, rich colors, epic scale, professional quality"
  },
  
  // Prop templates
  [ASSET_TYPES.PROP]: {
    [GAME_STYLES.PIXEL_ART]: "Pixel art game prop, [DESCRIPTION], detailed pixel design, high quality sprite, game-ready asset, transparent background",
    [GAME_STYLES.LOW_POLY]: "Low poly game prop, [DESCRIPTION], simple 3D design, clean geometry, game-ready asset",
    [GAME_STYLES.CARTOON]: "Cartoon game prop, [DESCRIPTION], stylized design, clean outlines, exaggerated features, transparent background",
    [GAME_STYLES.REALISTIC]: "Realistic game prop, [DESCRIPTION], detailed 3D model, realistic textures, proper lighting, professional quality",
    [GAME_STYLES.ISOMETRIC]: "Isometric game prop, [DESCRIPTION], isometric perspective, consistent style, game-ready asset",
    [GAME_STYLES.FANTASY]: "Fantasy game prop, [DESCRIPTION], magical details, fantasy style, ornate design, professional quality, game asset"
  }
};

/**
 * Generate a prompt using templates
 * 
 * @param {string} description - Basic description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @returns {string} Complete prompt for image generation
 */
function generateTemplatedPrompt(description, type, style) {
  // Get the template for this type and style
  const template = PROMPT_TEMPLATES[type]?.[style];
  
  if (!template) {
    throw new Error(`No template found for type: ${type} and style: ${style}`);
  }
  
  // Replace the placeholder with the description
  return template.replace('[DESCRIPTION]', description);
}

/**
 * Generate a game asset image using FLUX.1 via Replicate API
 * 
 * @param {string} prompt - Text description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @param {string} filename - Filename to save as (without extension)
 * @returns {Promise<string>} Path to the generated image
 */
async function generateGameAsset(prompt, type, style, filename, outputDir) {
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
  
  console.log(`Generating ${style} ${type} with FLUX.1: "${prompt}"`);
  
  try {
    // Start the prediction with Replicate API
    console.log('Starting FLUX.1 image generation...');
    
    // Create a prediction - determines which FLUX model to use based on style
    // For pixel art & low poly, use the faster model, for realistic & detailed styles use the dev model
    const fluxModel = style === GAME_STYLES.PIXEL_ART || style === GAME_STYLES.LOW_POLY 
      ? "blackforestlabs/flux:schnell" 
      : "blackforestlabs/flux:dev";
    
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
      },
      body: JSON.stringify({
        version: fluxModel,
        input: {
          prompt: prompt,
          num_inference_steps: 30,
          guidance_scale: 7.5, // How closely to follow the prompt (higher = closer)
          width: 768,
          height: 768,
          negative_prompt: "bad quality, low resolution, blurry, ugly, distorted proportions"
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error starting prediction: ${JSON.stringify(errorData)}`);
    }
    
    // Get the prediction ID
    const prediction = await response.json();
    const predictionId = prediction.id;
    console.log(`Prediction started with ID: ${predictionId}`);
    
    // Poll for completion
    console.log('Waiting for FLUX.1 to generate the image...');
    let completed = false;
    let resultUrl = null;
    
    while (!completed) {
      // Wait for 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check the prediction status
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });
      
      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(`Error checking prediction status: ${JSON.stringify(errorData)}`);
      }
      
      const statusData = await statusResponse.json();
      
      if (statusData.status === 'succeeded') {
        completed = true;
        resultUrl = statusData.output[0]; // The URL of the generated image
        console.log('Image generation completed successfully!');
      } else if (statusData.status === 'failed') {
        throw new Error(`Image generation failed: ${statusData.error}`);
      } else {
        process.stdout.write('.'); // Show progress
      }
    }
    
    if (!resultUrl) {
      throw new Error('No result URL found in the prediction output');
    }
    
    // Download the image
    console.log(`Downloading image from: ${resultUrl}`);
    const imageResponse = await fetch(resultUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    // Save the image to file
    const finalPath = path.join(outputDir, `${filename}.png`);
    console.log(`Saving image to: ${finalPath}`);
    
    const imageBuffer = await imageResponse.buffer();
    await fs.promises.writeFile(finalPath, imageBuffer);
    
    console.log(`Asset generated successfully: ${finalPath}`);
    return finalPath;
    
  } catch (error) {
    console.error('Error generating image with FLUX.1:', error.message);
    throw error;
  }
}

/**
 * Main function to generate an asset using templates and FLUX.1
 * 
 * @param {string} description - Basic description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @param {string} filename - Filename to save as (without extension)
 * @returns {Promise<string>} Path to the generated image
 */
async function generateManualAsset(description, type, style, filename) {
  try {
    // Ensure output directories exist
    const outputDir = path.join(__dirname, '../rpg-game/media/images/generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Step 1: Generate templated prompt
    const prompt = generateTemplatedPrompt(description, type, style);
    console.log("Generated prompt:", prompt);
    
    // Step 2: Generate image with FLUX.1
    return await generateGameAsset(prompt, type, style, filename, outputDir);
  } catch (error) {
    console.error('Error in manual asset generation:', error.message);
    throw error;
  }
}

/**
 * Command line interface for the script
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Display help if requested or no arguments provided
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Manual Game Asset Generator (Template + FLUX.1)

Usage:
  node generate-manual-asset.js [options]

Options:
  --description, -d  Basic description of the asset (required)
  --type, -t         Asset type: ${Object.values(ASSET_TYPES).join(', ')} (default: item)
  --style, -s        Visual style: ${Object.values(GAME_STYLES).join(', ')} (default: pixel art)
  --filename, -f     Output filename without extension (default: type_timestamp)
  --help, -h         Show this help message

Example:
  node generate-manual-asset.js --description "magic sword with blue glow" --type item --style "pixel art" --filename magic_sword
`);
    return;
  }
  
  // Check for API key (only if not displaying help)
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('Error: REPLICATE_API_TOKEN is required in your .env file');
    console.error('Get your free API token from https://replicate.com/');
    process.exit(1);
  }
  
  // Parse arguments
  let description, type = ASSET_TYPES.ITEM, style = GAME_STYLES.PIXEL_ART, filename;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    if ((arg === '--description' || arg === '-d') && nextArg) {
      description = nextArg;
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
  
  if (!description) {
    console.error('Error: --description is required');
    process.exit(1);
  }
  
  console.log('Arguments:');
  console.log('- Description:', description);
  console.log('- Type:', type);
  console.log('- Style:', style);
  console.log('- Filename:', filename || '(auto-generated)');
  
  try {
    await generateManualAsset(description, type, style, filename);
  } catch (error) {
    console.error('Failed to generate asset:', error.message);
    process.exit(1);
  }
}

// If this file is run directly (not imported)
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
  });
} else {
  // Export for use as a module
  module.exports = {
    generateManualAsset,
    generateTemplatedPrompt,
    ASSET_TYPES,
    GAME_STYLES,
    PROMPT_TEMPLATES
  };
} 