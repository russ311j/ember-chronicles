const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
let loadImage, createCanvas;

try {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
} catch (e) {
  console.log('Canvas module not available, using mock implementation');
  // Mock implementations for testing MCP functionality
  createCanvas = (width, height) => {
    return {
      width,
      height,
      getContext: () => ({
        drawImage: () => {},
        fillText: () => {},
        font: '',
        fillStyle: '',
        textAlign: '',
        fillRect: () => {}
      }),
      toBuffer: () => Buffer.from('Mock image buffer')
    };
  };
  loadImage = async (src) => {
    console.log(`Would load image from: ${src}`);
    return { width: 800, height: 600 };
  };
}

require('dotenv').config();

// FAL.AI token for using FLUX.1
const FAL_KEY = process.env.FAL_KEY || 'your_fal_api_key_here';

// Define the assets we need to create
const assets = [
  {
    description: "Fantasy RPG game landing page with ancient ruins, magical portal, and a hero silhouette against a dramatic sky",
    type: "background",
    style: "fantasy art",
    filename: "landing_page"
  },
  {
    description: "Main menu background with medieval fantasy theme, castle in distance, mountains, and magical elements",
    type: "background",
    style: "fantasy art",
    filename: "main_menu_background"
  },
  {
    description: "Character creation screen backdrop with four character classes displayed - warrior, wizard, rogue, and cleric",
    type: "background",
    style: "fantasy character design",
    filename: "character_creation_background"
  },
  {
    description: "Ancient parchment with elegant handwriting and a mysterious wax seal, slightly glowing with magical energy",
    type: "prop",
    style: "fantasy",
    filename: "mysterious_letter"
  },
  {
    description: "Dense forest path at night with a ghostly figure in the distance",
    type: "background",
    style: "dark fantasy",
    filename: "forest_path_ghost"
  },
  {
    description: "Mountain pass with stone bridge over a chasm, storm clouds gathering",
    type: "background",
    style: "fantasy landscape",
    filename: "mountain_pass"
  },
  {
    description: "Village tavern interior with patrons and a mysterious hooded figure in the corner",
    type: "background",
    style: "fantasy interior",
    filename: "village_tavern"
  }
];

// Ensure the output directory exists
const outputDir = path.join('rpg-game', 'media', 'images', 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const testOnly = args.includes('--test-only');

/**
 * Generate a template based on asset type and style
 */
function getTemplate(assetType, style) {
  const templates = {
    background: {
      base: "Create a detailed {style} background showing {description}. The image should be landscape orientation with good composition.",
      fantasy: "Create a detailed fantasy background with magical elements showing {description}. Use rich colors and dramatic lighting.",
      "dark fantasy": "Create a dark, atmospheric fantasy scene showing {description}. Use shadows and limited light sources for a mysterious mood.",
      "fantasy landscape": "Create a sweeping fantasy landscape showing {description}. Include distant landmarks and interesting sky elements.",
      "fantasy interior": "Create a detailed fantasy interior scene showing {description}. Pay attention to lighting, textures, and atmosphere."
    },
    character: {
      base: "Create a character portrait in {style} style showing {description}. Focus on facial features and upper body.",
      fantasy: "Create a fantasy character portrait showing {description}. Include distinctive clothing, weapons or magical items that define this character.",
      "pixel art": "Create a pixel art character sprite showing {description}. Use a limited color palette and clear silhouette."
    },
    item: {
      base: "Create an image of {description} in {style} style. The item should be centered and detailed.",
      fantasy: "Create a fantasy item showing {description}. Add magical effects, interesting details, and appropriate lighting."
    },
    prop: {
      base: "Create an image of {description} in {style} style. The prop should be clearly visible and centered.",
      fantasy: "Create a detailed fantasy prop showing {description}. The object should have an interesting design with magical or ancient elements."
    }
  };

  const typeTemplates = templates[assetType] || templates.background;
  const specificTemplate = typeTemplates[style] || typeTemplates.base;
  
  return specificTemplate;
}

/**
 * Generate the prompt for FLUX.1
 */
function generatePrompt(asset) {
  const template = getTemplate(asset.type, asset.style);
  return template.replace('{description}', asset.description).replace('{style}', asset.style);
}

/**
 * Generate an image using FLUX.1
 */
async function generateImage(prompt, outputPath) {
  if (testOnly) {
    console.log(`✅ Would generate image for: ${outputPath}`);
    // Create a sample output file for testing
    fs.writeFileSync(outputPath, 'Test image placeholder');
    return true;
  }
  
  console.log(`Generating image with prompt: ${prompt}`);
  
  try {
    const response = await fetch('https://fal.run/fal-ai/flux-1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: "1024x1024",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate image: ${response.status} ${response.statusText}, ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.images || result.images.length === 0) {
      throw new Error('No images generated');
    }
    
    const imageData = result.images[0].data;
    
    if (!imageData) {
      throw new Error('No image data found in response');
    }
    
    // Save the image
    const buffer = Buffer.from(imageData, 'base64');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Image saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error generating image:', error);
    return false;
  }
}

/**
 * Process all assets
 */
async function processAssets() {
  console.log('Game Asset Generator - Starting...');
  
  if (testOnly) {
    console.log('TEST MODE: Will simulate successful asset generation');
  }
  
  console.log(`Starting to generate ${assets.length} assets...`);
  
  for (const asset of assets) {
    const outputPath = path.join(outputDir, `${asset.filename}.png`);
    const prompt = generatePrompt(asset);
    
    console.log(`\n==== Generating: ${asset.filename} ====`);
    const success = await generateImage(prompt, outputPath);
    
    if (success) {
      console.log(`✅ Successfully generated ${asset.filename}`);
    } else {
      console.log(`❌ Failed to generate ${asset.filename}`);
    }
  }
  
  console.log('\nAsset generation complete!');
}

// Start the process
if (testOnly) {
  console.log('Running in test-only mode - will simulate success without API calls');
  processAssets();
} else {
  processAssets();
} 