/**
 * Hybrid Image Generator
 * 
 * This script generates images for the game using a hybrid approach:
 * 1. Tries to use the Stability API with remaining credits
 * 2. Falls back to placeholder images when API credits are exhausted
 * 
 * Requires: 
 * - npm install canvas
 * - npm install node-fetch@2
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { randomUUID } = require('crypto');
const fetch = require('node-fetch');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'media', 'images', 'generated');
const API_DIR = path.join(OUTPUT_DIR, 'api');
const PLACEHOLDER_DIR = path.join(OUTPUT_DIR, 'placeholders');
const LOG_DIR = path.join(OUTPUT_DIR, 'logs');
const DEFAULT_WIDTH = 1344;
const DEFAULT_HEIGHT = 768;
const SDXL_MODEL = 'stable-diffusion-xl-1024-v1-0';
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// Style parameters to maintain consistent style across all images
const STYLE_PROMPT_SUFFIX = "fantasy RPG game art, professional quality, cohesive game art style";

// List of assets to generate
const ASSETS = [
  {
    id: 'loading_page',
    name: "Loading Page",
    prompt: `Fantasy loading screen, mystical portal, magical runes around the edges, minimal design. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#1a1a2e'
  },
  {
    id: 'landing_page',
    name: "Landing Page",
    prompt: `Fantasy RPG landing page, magical scene with castle in distance, hero silhouette. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#16213e'
  },
  {
    id: 'main_menu_background',
    name: "Main Menu Background",
    prompt: `Fantasy castle on mountain, starry night, dramatic lighting, torch flames. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#0f3460'
  },
  {
    id: 'character_creation_background',
    name: "Character Creation Background",
    prompt: `Mystical chamber with artifacts, glowing runes on stone walls, character silhouettes. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#533483'
  },
  {
    id: 'mysterious_letter',
    name: "Mysterious Letter",
    prompt: `Ancient parchment, fantasy symbols, old paper with magical seal, fantasy RPG inventory item. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#5c3c10'
  },
  {
    id: 'forest_path_ghost',
    name: "Forest Path (Ghost)",
    prompt: `Spooky forest path, ghostly apparition between trees, misty, moonlight filtering through. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#2c3639'
  },
  {
    id: 'mountain_pass',
    name: "Mountain Pass",
    prompt: `Mountain pass with rope bridge, fantasy scene, dramatic cliff, distant adventure. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#3f4e4f'
  },
  {
    id: 'village_tavern',
    name: "Village Tavern",
    prompt: `Medieval tavern interior, cozy inn, fireplace, patrons, fantasy RPG scene. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    color: '#854d0e'
  }
];

// Ensure output directories exist
ensureDirectoryExists(OUTPUT_DIR);
ensureDirectoryExists(API_DIR);
ensureDirectoryExists(PLACEHOLDER_DIR);
ensureDirectoryExists(LOG_DIR);

// Main function
async function main() {
  console.log(`Loading .env from: ${path.resolve(__dirname, '..', '.env')}`);
  console.log(`STABILITY_API_KEY exists: ${!!STABILITY_API_KEY}`);
  if (STABILITY_API_KEY) {
    console.log(`STABILITY_API_KEY value: ${STABILITY_API_KEY.substring(0, 5)}...${STABILITY_API_KEY.substring(STABILITY_API_KEY.length - 4)}`);
  }

  const results = {
    total: ASSETS.length,
    generated: 0,
    placeholder: 0,
    failed: 0,
    assets: []
  };

  let outOfCredits = false;

  console.log('Starting hybrid image generation (API + Placeholders)...');
  console.log('');

  for (const asset of ASSETS) {
    console.log(`\n===== Processing: ${asset.name} =====`);
    
    let imagePath;
    let logData;

    // Try to generate with Stability API if we still have credits
    if (!outOfCredits && STABILITY_API_KEY) {
      try {
        const result = await generateWithStabilityAPI(asset);
        imagePath = result.imagePath;
        logData = result.logData;
        results.generated++;
        results.assets.push({
          id: asset.id,
          name: asset.name,
          status: 'generated',
          engine: SDXL_MODEL,
          path: imagePath
        });
      } catch (error) {
        // Check if error is related to credits
        if (error.message.includes("insufficient_balance") || error.message.includes("429")) {
          console.log('❌ Out of credits for Stability API, switching to placeholder images for remaining assets');
          outOfCredits = true;
          // Fall back to placeholder for this asset
          const placeholderResult = await generatePlaceholder(asset);
          imagePath = placeholderResult;
          results.placeholder++;
          results.assets.push({
            id: asset.id,
            name: asset.name,
            status: 'placeholder',
            path: imagePath
          });
        } else {
          // For other API errors, also generate a placeholder
          console.log(`❌ API Error: ${error.message}`);
          const placeholderResult = await generatePlaceholder(asset);
          imagePath = placeholderResult;
          results.placeholder++;
          results.assets.push({
            id: asset.id,
            name: asset.name,
            status: 'placeholder',
            path: imagePath
          });
        }
      }
    } else {
      // Generate placeholder if we're out of credits
      const placeholderResult = await generatePlaceholder(asset);
      imagePath = placeholderResult;
      results.placeholder++;
      results.assets.push({
        id: asset.id,
        name: asset.name,
        status: 'placeholder',
        path: imagePath
      });
    }
    
    console.log(`Waiting 2 seconds before next asset...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate a summary markdown file
  await generateReadme(results);

  // Print summary
  console.log('\n===== GENERATION SUMMARY =====');
  console.log(`Total assets: ${results.total}`);
  console.log(`Generated with API: ${results.generated}`);
  console.log(`Generated as placeholders: ${results.placeholder}`);
  console.log(`Failed: ${results.failed}`);
  console.log('');

  if (results.generated > 0) {
    console.log('Successfully generated assets:');
    results.assets.filter(a => a.status === 'generated').forEach(asset => {
      console.log(`- ${asset.name}: Generated with ${asset.engine}`);
    });
    console.log('');
  }

  if (results.placeholder > 0) {
    console.log('Placeholder assets:');
    results.assets.filter(a => a.status === 'placeholder').forEach(asset => {
      console.log(`- ${asset.name}: Created placeholder image`);
    });
    console.log('');
  }

  if (results.failed > 0) {
    console.log('Failed assets:');
    results.assets.filter(a => a.status === 'failed').forEach(asset => {
      console.log(`- ${asset.name}: ${asset.error}`);
    });
    console.log('');
  }

  console.log('Created documentation at: ' + path.join(OUTPUT_DIR, 'README.md'));
  console.log('\nImage generation process complete!');
}

// Helper function to generate images with Stability API
async function generateWithStabilityAPI(asset) {
  const { name, prompt, width, height } = asset;
  
  console.log(`Generating "${name}" using Stability SDXL 1.0...`);
  console.log(`Dimensions: ${width}x${height}`);
  
  // Adjust dimensions if needed for SDXL model (must be multiples of 64)
  const adjustedWidth = Math.ceil(width / 64) * 64;
  const adjustedHeight = Math.ceil(height / 64) * 64;
  
  if (adjustedWidth !== width || adjustedHeight !== height) {
    console.log(`Adjusted dimensions to be multiples of 64: ${adjustedWidth}x${adjustedHeight}`);
  }
  
  // Generate a random seed
  const seed = Math.floor(Math.random() * 2147483647);
  
  console.log(`Making API request to: https://api.stability.ai/v1/generation/${SDXL_MODEL}/text-to-image`);
  console.log(`Engine: ${SDXL_MODEL}, Dimensions: ${adjustedWidth}x${adjustedHeight}, Seed: ${seed}`);
  console.log(`Full prompt: "${prompt}"`);
  
  const response = await fetch(
    `https://api.stability.ai/v1/generation/${SDXL_MODEL}/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: adjustedHeight,
        width: adjustedWidth,
        samples: 1,
        steps: 30,
        seed,
      }),
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    console.log(`Error: Received status code ${response.status}`);
    console.log(`API Error: ${JSON.stringify(errorData, null, 2)}`);
    throw new Error(`API request failed with status ${response.status}: ${errorData.name}`);
  }
  
  const responseJSON = await response.json();
  const base64Image = responseJSON.artifacts[0].base64;
  const imageBuffer = Buffer.from(base64Image, 'base64');
  
  // Create output file paths
  const imagePath = path.join(API_DIR, `${asset.id}.png`);
  const logPath = path.join(LOG_DIR, `${asset.id}.json`);
  
  // Save the image
  fs.writeFileSync(imagePath, imageBuffer);
  
  // Create log data
  const logData = {
    name,
    prompt,
    engine: SDXL_MODEL,
    seed,
    width: adjustedWidth,
    height: adjustedHeight,
    timestamp: new Date().toISOString(),
    status: 'success',
  };
  
  // Save log data
  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  
  // Create a symlink/copy in the main output directory
  const mainOutputPath = path.join(OUTPUT_DIR, `${asset.id}.png`);
  fs.copyFileSync(imagePath, mainOutputPath);
  
  console.log(`✅ Successfully generated and saved ${name}`);
  
  return { imagePath: mainOutputPath, logData };
}

// Helper function to generate placeholder images
async function generatePlaceholder(asset) {
  const { id, name, width, height, color } = asset;
  
  console.log(`Creating placeholder for "${name}" (${width}x${height})`);
  
  // Create a canvas with the specified dimensions
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background with color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Add diagonal stripes for visual interest
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 20;
  for (let i = -2 * width; i < 2 * height; i += 80) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(i, 0);
    ctx.stroke();
  }
  
  // Draw a frame around the edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  // Add centered text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, width / 2, height / 2);
  
  // Add 'PLACEHOLDER' text
  ctx.font = '24px Arial';
  ctx.fillText('PLACEHOLDER IMAGE', width / 2, height / 2 + 60);
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 100);
  
  // Save the image
  const placeholderPath = path.join(PLACEHOLDER_DIR, `${id}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(placeholderPath, buffer);
  
  // Create a copy in the main output directory
  const mainOutputPath = path.join(OUTPUT_DIR, `${id}.png`);
  fs.copyFileSync(placeholderPath, mainOutputPath);
  
  console.log(`✅ Created placeholder image for ${name}`);
  
  return mainOutputPath;
}

// Helper function to generate a README with documentation
async function generateReadme(results) {
  const readmePath = path.join(OUTPUT_DIR, 'README.md');
  
  const content = `# Game Assets

## Generated on ${new Date().toISOString()}

This directory contains images for the game, generated using a hybrid approach:
- ${results.generated} images created with Stability AI API
- ${results.placeholder} placeholder images

## Assets

${results.assets.map(asset => {
  return `### ${asset.name} (\`${asset.id}.png\`)
- **Status**: ${asset.status === 'generated' ? `Generated with ${asset.engine}` : 'Placeholder'}
- **Location**: \`${path.basename(asset.path)}\`
`;
}).join('\n')}

## Regenerating Images

To regenerate these images:

1. Run the hybrid image generator script:
   \`\`\`
   node scripts/generate-hybrid-images.js
   \`\`\`

2. This will attempt to use the Stability API when possible and fall back to placeholders when needed.
`;
  
  fs.writeFileSync(readmePath, content);
  
  return readmePath;
}

// Helper function to ensure a directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
