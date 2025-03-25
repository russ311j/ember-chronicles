/**
 * Game Asset Generator Script
 * This script uses the Stability AI API to generate game assets from text prompts
 */

require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { generateAsync } = require('stability-client');
const sharp = require('sharp');

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
 * Generate a game asset image
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
  
  try {
    // Generate the image using Stability AI
    const result = await generateAsync({
      prompt: enhancedPrompt,
      apiKey: process.env.STABILITY_API_KEY,
      outDir: outputDir,
      width: 512,
      height: 512,
      engine: 'stable-diffusion-xl-1024-v1-0',
      cfgScale: 7,
      samples: 1,
      steps: 30
    });
    
    if (!result || !result.images || result.images.length === 0) {
      throw new Error('No images were generated');
    }
    
    // Get the generated image path
    const generatedPath = result.images[0].filePath;
    const extension = path.extname(generatedPath);
    const finalPath = path.join(outputDir, `${filename}${extension}`);
    
    // Process image if needed (resize, format conversion, etc)
    await sharp(generatedPath)
      .resize(512, 512)
      .toFile(finalPath);
    
    // Clean up temporary file if different from final path
    if (generatedPath !== finalPath) {
      await fs.remove(generatedPath);
    }
    
    console.log(`Asset generated successfully: ${finalPath}`);
    return finalPath;
  } catch (error) {
    console.error('Error generating asset:', error);
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
Game Asset Generator

Usage:
  node generate-asset.js [options]

Options:
  --prompt, -p      Text description of the asset (required)
  --type, -t        Asset type: ${Object.values(ASSET_TYPES).join(', ')} (default: item)
  --style, -s       Visual style: ${Object.values(GAME_STYLES).join(', ')} (default: pixel art)
  --filename, -f    Output filename without extension (default: type_timestamp)
  --help, -h        Show this help message

Example:
  node generate-asset.js --prompt "magic sword with blue glow" --type item --style "pixel art" --filename magic_sword
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