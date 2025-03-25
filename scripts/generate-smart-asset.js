/**
 * Smart Game Asset Generator
 * This script combines Gemini's prompt enhancement capabilities with FLUX.1's image generation
 */

require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Check for required API keys
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is required in your .env file');
  console.error('Get your API key from https://aistudio.google.com/');
  process.exit(1);
}

if (!process.env.REPLICATE_API_TOKEN) {
  console.error('Error: REPLICATE_API_TOKEN is required in your .env file');
  console.error('Get your free API token from https://replicate.com/');
  process.exit(1);
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
 * Generate enhanced prompt description using Gemini
 * 
 * @param {string} prompt - Basic description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @returns {Promise<string>} Enhanced detailed prompt
 */
async function generateEnhancedPrompt(prompt, type, style) {
  // Validate inputs
  if (!Object.values(ASSET_TYPES).includes(type)) {
    throw new Error(`Invalid asset type: ${type}. Must be one of: ${Object.values(ASSET_TYPES).join(', ')}`);
  }
  
  if (!Object.values(GAME_STYLES).includes(style)) {
    throw new Error(`Invalid style: ${style}. Must be one of: ${Object.values(GAME_STYLES).join(', ')}`);
  }
  
  console.log(`Generating enhanced prompt for ${style} ${type}: "${prompt}"`);
  
  try {
    // Access the model - use Gemini 1.5 Pro for best text quality
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro"
    });
    
    // Create a system prompt to instruct Gemini
    const systemPrompt = `You are an expert game asset designer. I need you to create a detailed text description for a ${style} style game ${type} based on the following basic description: "${prompt}".
    
    Your enhanced description should:
    1. Include specific visual details (colors, materials, lighting effects)
    2. Maintain the ${style} style consistently
    3. Be optimized for FLUX.1 image generator
    4. Focus on professional quality game assets 
    5. Include keywords like "transparent background" if appropriate
    6. Be 1-3 sentences long, comma-separated keywords and phrases
    7. Include specific details that would make this asset unique and interesting
    8. For FLUX.1, include some technical terms like "highly detailed", "sharp focus", "8k" if appropriate

    Return ONLY the enhanced description, nothing else.`;
    
    // Generate the enhanced prompt
    const result = await model.generateContent([systemPrompt]);
    
    // Get the response text
    const enhancedPrompt = result.response.text().trim();
    
    console.log("Enhanced prompt generated:");
    console.log(enhancedPrompt);
    
    return enhancedPrompt;
  } catch (error) {
    console.error('Error generating enhanced prompt with Gemini:', error.message);
    throw error;
  }
}

/**
 * Generate a game asset image using FLUX.1 via Replicate API
 * 
 * @param {string} prompt - Enhanced text description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @param {string} filename - Filename to save as (without extension)
 * @returns {Promise<string>} Path to the generated image
 */
async function generateImageWithFlux(prompt, type, style, filename) {
  if (!filename) {
    filename = `${type}_${Date.now()}`;
  }
  
  console.log(`Generating ${style} ${type} with FLUX.1...`);
  
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
    await fs.writeFile(finalPath, imageBuffer);
    
    console.log(`Asset generated successfully: ${finalPath}`);
    return finalPath;
    
  } catch (error) {
    console.error('Error generating image with FLUX.1:', error.message);
    throw error;
  }
}

/**
 * Main function to generate an asset using both Gemini and FLUX.1
 * 
 * @param {string} basicPrompt - Basic description of the asset
 * @param {string} type - Asset type (character, item, background, prop)
 * @param {string} style - Visual style (pixel, lowpoly, cartoon, etc)
 * @param {string} filename - Filename to save as (without extension)
 * @returns {Promise<string>} Path to the generated image
 */
async function generateSmartAsset(basicPrompt, type, style, filename) {
  try {
    // Step 1: Generate enhanced prompt with Gemini
    const enhancedPrompt = await generateEnhancedPrompt(basicPrompt, type, style);
    
    // Step 2: Generate image with FLUX.1
    return await generateImageWithFlux(enhancedPrompt, type, style, filename);
  } catch (error) {
    console.error('Error in smart asset generation:', error.message);
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
Smart Game Asset Generator (Gemini + FLUX.1)

Usage:
  node generate-smart-asset.js [options]

Options:
  --prompt, -p      Basic description of the asset (required)
  --type, -t        Asset type: ${Object.values(ASSET_TYPES).join(', ')} (default: item)
  --style, -s       Visual style: ${Object.values(GAME_STYLES).join(', ')} (default: pixel art)
  --filename, -f    Output filename without extension (default: type_timestamp)
  --help, -h        Show this help message

Example:
  node generate-smart-asset.js --prompt "magic sword" --type item --style "pixel art" --filename magic_sword
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
  
  console.log('Arguments:');
  console.log('- Prompt:', prompt);
  console.log('- Type:', type);
  console.log('- Style:', style);
  console.log('- Filename:', filename || '(auto-generated)');
  
  try {
    await generateSmartAsset(prompt, type, style, filename);
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
    generateSmartAsset,
    generateEnhancedPrompt,
    generateImageWithFlux,
    ASSET_TYPES,
    GAME_STYLES
  };
} 