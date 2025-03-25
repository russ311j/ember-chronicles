/**
 * Generate Enhanced Asset Prompts using Gemini
 * This script uses Gemini to create detailed text descriptions that can be used with image generation tools
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

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    3. Be optimized for text-to-image generators
    4. Focus on professional quality game assets
    5. Include keywords like "transparent background" if appropriate
    6. Be 1-3 sentences long, comma-separated keywords and phrases

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
 * Command line interface for the script
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Display help if requested or no arguments provided
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Enhanced Prompt Generator (Gemini)

Usage:
  node generate-prompt.js [options]

Options:
  --prompt, -p      Basic description of the asset (required)
  --type, -t        Asset type: ${Object.values(ASSET_TYPES).join(', ')} (default: item)
  --style, -s       Visual style: ${Object.values(GAME_STYLES).join(', ')} (default: pixel art)
  --help, -h        Show this help message

Example:
  node generate-prompt.js --prompt "magic sword" --type item --style "fantasy"
    `);
    return;
  }
  
  // Parse arguments
  let prompt, type = ASSET_TYPES.ITEM, style = GAME_STYLES.PIXEL_ART;
  
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
    }
  }
  
  if (!prompt) {
    console.error('Error: --prompt is required');
    process.exit(1);
  }
  
  try {
    const enhancedPrompt = await generateEnhancedPrompt(prompt, type, style);
    
    // Output the enhanced prompt to stdout
    console.log("\n=== ENHANCED PROMPT FOR IMAGE GENERATION ===");
    console.log(enhancedPrompt);
    console.log("\n=== USE WITH ===");
    console.log(`node scripts/generate-asset-direct.js --prompt "${enhancedPrompt}" --type ${type} --style "${style}"`);
  } catch (error) {
    console.error('Failed to generate enhanced prompt:', error.message);
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
    generateEnhancedPrompt,
    ASSET_TYPES,
    GAME_STYLES
  };
} 