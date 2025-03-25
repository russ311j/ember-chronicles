require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { randomUUID } = require('crypto');
const fetch = require('node-fetch');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'media', 'images', 'generated');
const LOG_DIR = path.join(OUTPUT_DIR, 'logs');
const PLACEHOLDER_DIR = path.join(OUTPUT_DIR, 'placeholders');
const DEFAULT_WIDTH = 1344;
const DEFAULT_HEIGHT = 768;
const SDXL_MODEL = 'stable-diffusion-xl-1024-v1-0';
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// Style parameters to maintain consistent style across all images
const STYLE_PROMPT_SUFFIX = "fantasy RPG game art, professional quality, cohesive game art style";

// List of assets to generate
const ASSETS = [
  {
    name: "Loading Page",
    prompt: `Fantasy loading screen, mystical portal, magical runes around the edges, minimal design. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Landing Page",
    prompt: `Fantasy RPG landing page, magical scene with castle in distance, hero silhouette. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Main Menu Background",
    prompt: `Fantasy castle on mountain, starry night, dramatic lighting, torch flames. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Character Creation Background",
    prompt: `Mystical chamber with artifacts, glowing runes on stone walls, character silhouettes. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Mysterious Letter",
    prompt: `Ancient parchment, fantasy symbols, old paper with magical seal, fantasy RPG inventory item. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Forest Path (Ghost)",
    prompt: `Spooky forest path, ghostly apparition between trees, misty, moonlight filtering through. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Mountain Pass",
    prompt: `Mountain pass with rope bridge, fantasy scene, dramatic cliff, distant adventure. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  {
    name: "Village Tavern",
    prompt: `Medieval tavern interior, cozy inn, fireplace, patrons, fantasy RPG scene. ${STYLE_PROMPT_SUFFIX}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  }
];

// Ensure output directories exist
ensureDirectoryExists(OUTPUT_DIR);
ensureDirectoryExists(LOG_DIR);
ensureDirectoryExists(PLACEHOLDER_DIR);

// Main function
async function main() {
  console.log(`Loading .env from: ${path.resolve('../.env')}`);
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

  log('Starting hybrid image generation (API + Placeholders)...');
  log('');

  for (const asset of ASSETS) {
    log(`\n===== Processing: ${asset.name} =====`);
    
    let imagePath;
    let logData;

    // Try to generate with Stability API if we still have credits
    if (!outOfCredits) {
      try {
        const result = await generateWithStabilityAPI(asset);
        imagePath = result.imagePath;
        logData = result.logData;
        results.generated++;
        results.assets.push({
          name: asset.name,
          status: 'generated',
          engine: SDXL_MODEL,
          path: imagePath
        });
      } catch (error) {
        // Check if error is related to credits
        if (error.message.includes("insufficient_balance") || error.message.includes("429")) {
          log('❌ Out of credits for Stability API, switching to placeholder images for remaining assets');
          outOfCredits = true;
          // Fall back to placeholder for this asset
          const placeholderResult = await generatePlaceholder(asset);
          imagePath = placeholderResult.imagePath;
          results.placeholder++;
          results.assets.push({
            name: asset.name,
            status: 'placeholder',
            path: imagePath
          });
        } else {
          // For other API errors, also generate a placeholder
          log(`❌ API Error: ${error.message}`);
          const placeholderResult = await generatePlaceholder(asset);
          imagePath = placeholderResult.imagePath;
          results.placeholder++;
          results.assets.push({
            name: asset.name,
            status: 'placeholder',
            path: imagePath
          });
        }
      }
    } else {
      // Generate placeholder if we're out of credits
      const placeholderResult = await generatePlaceholder(asset);
      imagePath = placeholderResult.imagePath;
      results.placeholder++;
      results.assets.push({
        name: asset.name,
        status: 'placeholder',
        path: imagePath
      });
    }
    
    log(`Waiting 2 seconds before next asset...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate a summary markdown file
  await generateReadme(results);

  // Print summary
  log('\n===== GENERATION SUMMARY =====');
  log(`Total assets: ${results.total}`);
  log(`Generated with API: ${results.generated}`);
  log(`Generated as placeholders: ${results.placeholder}`);
  log(`Failed: ${results.failed}`);
  log('');

  if (results.generated > 0) {
    log('Successfully generated assets:');
    results.assets.filter(a => a.status === 'generated').forEach(asset => {
      log(`- ${asset.name}: Generated with ${asset.engine}`);
    });
    log('');
  }

  if (results.placeholder > 0) {
    log('Placeholder assets:');
    results.assets.filter(a => a.status === 'placeholder').forEach(asset => {
      log(`- ${asset.name}: Created placeholder image`);
    });
    log('');
  }

  if (results.failed > 0) {
    log('Failed assets:');
    results.assets.filter(a => a.status === 'failed').forEach(asset => {
      log(`- ${asset.name}: ${asset.error}`);
    });
    log('');
  }

  log('Created documentation at: ' + path.join(OUTPUT_DIR, 'README.md'));
  log('\nImage generation process complete!');
}

// Helper function to generate images with Stability API
async function generateWithStabilityAPI(asset) {
  const { name, prompt, width, height } = asset;
  
  log(`Generating "${name}" using Stability SDXL 1.0...`);
  log(`Dimensions: ${width}x${height}`);
  
  // Adjust dimensions if needed for SDXL model (must be multiples of 64)
  const adjustedWidth = Math.ceil(width / 64) * 64;
  const adjustedHeight = Math.ceil(height / 64) * 64;
  
  if (adjustedWidth !== width || adjustedHeight !== height) {
    log(`Adjusted dimensions to be multiples of 64: ${adjustedWidth}x${adjustedHeight}`);
  }
  
  // Generate a random seed
  const seed = Math.floor(Math.random() * 2147483647);
  
  log(`Making API request to: https://api.stability.ai/v1/generation/${SDXL_MODEL}/text-to-image`);
  log(`Engine: ${SDXL_MODEL}, Dimensions: ${adjustedWidth}x${adjustedHeight}, Seed: ${seed}`);
  log(`Full prompt: "${prompt}"`);
  
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
    log(`Error: Received status code ${response.status}`);
    log(`API Error: ${JSON.stringify(errorData, null, 2)}`);
    throw new Error(`API request failed with status ${response.status}: ${errorData.name}`);
  }
  
  const responseJSON = await response.json();
  const base64Image = responseJSON.artifacts[0].base64;
  const imageBuffer = Buffer.from(base64Image, 'base64');
  
  // Create output file paths
  const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${randomUUID().substring(0, 8)}`;
  const imagePath = path.join(OUTPUT_DIR, `${filename}.png`);
  const logPath = path.join(LOG_DIR, `${filename}.json`);
  
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
  
  log(`✅ Successfully generated and saved ${name}`);
  
  return { imagePath, logData };
}

// Helper function to generate placeholder images
async function generatePlaceholder(asset) {
  const { name, width, height } = asset;
  
  log(`Creating placeholder for "${name}" (${width}x${height})`);
  
  // Create a canvas with the specified dimensions
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background with a gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  
  // Choose colors based on the asset name for some visual variety
  let colorSet;
  if (name.includes('Loading') || name.includes('Landing')) {
    colorSet = ['#2c3e50', '#3498db']; // Blue gradient
  } else if (name.includes('Forest') || name.includes('Mountain')) {
    colorSet = ['#2c3e50', '#27ae60']; // Green gradient
  } else if (name.includes('Tavern')) {
    colorSet = ['#7f8c8d', '#e67e22']; // Orange-brown gradient
  } else if (name.includes('Letter')) {
    colorSet = ['#d35400', '#f39c12']; // Parchment-like
  } else {
    colorSet = ['#8e44ad', '#2980b9']; // Purple-blue gradient
  }
  
  gradient.addColorStop(0, colorSet[0]);
  gradient.addColorStop(1, colorSet[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add a grid pattern for visual reference
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x < width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y < height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Add text with asset name
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, width / 2, height / 2);
  
  // Add placeholder text
  ctx.font = '18px Arial';
  ctx.fillText('Placeholder Image', width / 2, height / 2 + 40);
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 70);
  
  // Save the image
  const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-placeholder`;
  const imagePath = path.join(PLACEHOLDER_DIR, `${filename}.png`);
  
  // Convert canvas to PNG and save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(imagePath, buffer);
  
  log(`✅ Created placeholder image for ${name}`);
  
  return { imagePath };
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
  return `### ${asset.name}
- Status: ${asset.status === 'generated' ? `Generated with ${asset.engine}` : 'Placeholder'}
- File: \`${path.basename(asset.path)}\`
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

// Helper function for logging
function log(message) {
  console.log(message);
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