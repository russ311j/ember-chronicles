/**
 * Game Asset Generator Script using Google Gemini Flash 2.0
 * 
 * This script uses the Google Gemini API to generate game assets from text prompts
 */

require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is required in your .env file');
  console.error('Get your API key from https://aistudio.google.com/');
  process.exit(1);
}

console.log('Initializing Gemini API client...');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get image generation settings from .env or use defaults
const IMAGE_WIDTH = parseInt(process.env.IMAGE_GEN_WIDTH || '800', 10);
const IMAGE_HEIGHT = parseInt(process.env.IMAGE_GEN_HEIGHT || '600', 10);

// Ensure output directories exist
const outputDir = path.join(__dirname, '../rpg-game/media/images/generated');
fs.ensureDirSync(outputDir);
console.log(`Output directory: ${outputDir}`);

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
 * Generate a game asset image using Google Gemini Flash 2.0
 * 
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
  
  // Enhanced prompt with style information - explicitly ask for image generation
  const enhancedPrompt = `Generate a detailed ${style} game ${type} image of: ${prompt}. Make it professional quality, suitable as a game asset with transparent background.`;
  
  console.log(`Generating ${style} ${type} with Gemini Flash 2.0: "${prompt}"`);
  console.log(`Enhanced prompt: "${enhancedPrompt}"`);
  
  try {
    // Access the model - use the experimental model for image generation
    console.log('Accessing Gemini 2.0 Flash experimental model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"  // Use the experimental model for image generation
    });
    
    // Generate the image with the proper configuration
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: enhancedPrompt }] 
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        responseModalities: ["Text", "Image"],  // Allow both text and image responses
        maxOutputTokens: 2048
      }
    });
    
    console.log('Response received from Gemini API');
    
    // Get the response
    const response = result.response;
    
    console.log('Processing response data...');
    
    // Extract the image data from the response
    if (response.candidates && 
        response.candidates[0] && 
        response.candidates[0].content && 
        response.candidates[0].content.parts) {
      
      const parts = response.candidates[0].content.parts;
      let imageData = null;
      
      // Find the image part in the response
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
          console.log('Found image data in response');
          imageData = part.inlineData.data;
          break;
        }
      }
      
      if (imageData) {
        // Save the image to file
        const finalPath = path.join(outputDir, `${filename}.png`);
        console.log(`Saving image to: ${finalPath}`);
        
        const imageBuffer = Buffer.from(imageData, 'base64');
        
        await fs.writeFile(finalPath, imageBuffer);
        console.log(`Asset generated successfully: ${finalPath}`);
        
        return finalPath;
      } else {
        console.error('Error: No image data found in response');
        console.error('Response parts:', JSON.stringify(parts.map(p => typeof p), null, 2));
        throw new Error('No image data found in response');
      }
    } else {
      console.error('Error: Unexpected response structure from Gemini API');
      console.error('Response:', JSON.stringify(response, null, 2));
      throw new Error('Unexpected response structure from Gemini API');
    }
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    if (error.response) {
      console.error('API Response:', error.response);
    }
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
Game Asset Generator (Gemini Flash 2.0)

Usage:
  node generate-gemini-asset.js [options]

Options:
  --prompt, -p      Text description of the asset (required)
  --type, -t        Asset type: ${Object.values(ASSET_TYPES).join(', ')} (default: item)
  --style, -s       Visual style: ${Object.values(GAME_STYLES).join(', ')} (default: pixel art)
  --filename, -f    Output filename without extension (default: type_timestamp)
  --help, -h        Show this help message

Example:
  node generate-gemini-asset.js --prompt "magic sword with blue glow" --type item --style "pixel art" --filename magic_sword
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
    await generateGameAsset(prompt, type, style, filename);
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
    generateGameAsset,
    ASSET_TYPES,
    GAME_STYLES
  };
} 