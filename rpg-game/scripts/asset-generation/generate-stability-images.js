/**
 * Production-Quality Game Asset Generator
 * Using Stability AI's official SDK for consistent high-quality images
 * 
 * This script generates game assets with a consistent art style
 * and proper error handling with multiple fallback options.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { StabilityClient } = require('stability-client');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Validate API key
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
if (!STABILITY_API_KEY) {
  console.error('ERROR: STABILITY_API_KEY is not set in .env file');
  process.exit(1);
}
console.log(`STABILITY_API_KEY exists: ${!!STABILITY_API_KEY}`);
console.log(`STABILITY_API_KEY value: ${STABILITY_API_KEY.substring(0, 4)}...${STABILITY_API_KEY.substring(STABILITY_API_KEY.length - 4)}`);

// Define style guidance for consistent look across all images
const STYLE_GUIDANCE = {
  // This will be appended to all prompts to maintain style consistency
  stylePrompt: "fantasy RPG game art, professional quality, cohesive game art style",
  
  // Common parameters for all generations
  cfgScale: 7.5, // How strictly to follow the prompt (7-8 is a good balance)
  steps: 40,     // Higher values = more detail but slower
  sampler: "K_EULER_ANCESTRAL" // Good general purpose sampler
};

// Define the assets to generate
const assets = [
  {
    id: 'loading_page',
    name: 'Loading Page',
    prompt: 'Fantasy loading screen, mystical portal, magical runes around the edges, minimal design',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0" // 1024x1024 is best for this engine
  },
  {
    id: 'landing_page',
    name: 'Landing Page',
    prompt: 'Fantasy RPG landing page, magical scene with castle in distance, hero silhouette',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'main_menu_background',
    name: 'Main Menu Background',
    prompt: 'Fantasy castle on mountain, starry night, dramatic lighting, torch flames',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'character_creation_background',
    name: 'Character Creation Background',
    prompt: 'Mystical chamber with artifacts, glowing runes on stone walls, character silhouettes',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'mysterious_letter',
    name: 'Mysterious Letter',
    prompt: 'Ancient parchment, fantasy symbols, old paper with magical seal, fantasy RPG inventory item',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'forest_path_ghost',
    name: 'Forest Path (Ghost)',
    prompt: 'Spooky forest path, ghostly apparition between trees, misty, moonlight filtering through',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'mountain_pass',
    name: 'Mountain Pass',
    prompt: 'Mountain pass with rope bridge, fantasy scene, dramatic cliff, distant adventure',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  },
  {
    id: 'village_tavern',
    name: 'Village Tavern',
    prompt: 'Medieval tavern interior, cozy inn, fireplace, patrons, fantasy RPG scene',
    width: 1024,
    height: 768,
    engine: "stable-diffusion-xl-1024-v1-0"
  }
];

// Map of available engines with their capabilities
const ENGINES = {
  // Higher quality XL engines
  "stable-diffusion-xl-1024-v1-0": {
    displayName: "Stability SDXL 1.0",
    maxWidth: 1024,
    maxHeight: 1024,
    idealAspectRatio: "1:1",
    fallbackEngine: "stable-diffusion-v1-6"
  },
  // Standard engines as fallbacks
  "stable-diffusion-v1-6": {
    displayName: "Stable Diffusion 1.6",
    maxWidth: 1024, 
    maxHeight: 1024,
    idealAspectRatio: "1:1",
    fallbackEngine: "stable-diffusion-v1-5"
  },
  "stable-diffusion-v1-5": {
    displayName: "Stable Diffusion 1.5",
    maxWidth: 1024,
    maxHeight: 1024,
    idealAspectRatio: "1:1",
    fallbackEngine: null
  }
};

// Ensure output directory exists
const outputDir = path.resolve(__dirname, '../media/images/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Add log file creation
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created log directory: ${logDir}`);
}
const logFile = path.join(logDir, 'stability-image-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  console.log(formattedMessage);
  logStream.write(formattedMessage + '\n');
}

/**
 * Initialize the Stability client
 */
function createStabilityClient() {
  return new StabilityClient({
    key: STABILITY_API_KEY,
    baseUrl: 'https://api.stability.ai/v1',
    verbose: false
  });
}

/**
 * Adjust dimensions to be compatible with the selected engine
 */
function adjustDimensions(asset, engine) {
  const engineInfo = ENGINES[engine];
  
  if (!engineInfo) {
    log(`Warning: Engine ${engine} not found in engine configuration`);
    return { width: asset.width, height: asset.height };
  }
  
  // Check if dimensions are valid for this engine
  if (asset.width <= engineInfo.maxWidth && asset.height <= engineInfo.maxHeight) {
    return { width: asset.width, height: asset.height };
  }
  
  // Adjust dimensions while preserving aspect ratio
  log(`Adjusting dimensions for ${asset.name} to fit ${engineInfo.displayName}`);
  
  let newWidth = asset.width;
  let newHeight = asset.height;
  
  if (newWidth > engineInfo.maxWidth) {
    const ratio = engineInfo.maxWidth / newWidth;
    newWidth = engineInfo.maxWidth;
    newHeight = Math.floor(newHeight * ratio);
  }
  
  if (newHeight > engineInfo.maxHeight) {
    const ratio = engineInfo.maxHeight / newHeight;
    newHeight = engineInfo.maxHeight;
    newWidth = Math.floor(newWidth * ratio);
  }
  
  // Ensure dimensions are even numbers (required by some models)
  newWidth = Math.floor(newWidth / 2) * 2;
  newHeight = Math.floor(newHeight / 2) * 2;
  
  log(`Adjusted dimensions: ${asset.width}x${asset.height} -> ${newWidth}x${newHeight}`);
  
  return { width: newWidth, height: newHeight };
}

/**
 * Generate an image using Stability API
 */
async function generateImage(asset, engineId) {
  log(`Generating "${asset.name}" using ${ENGINES[engineId]?.displayName || engineId}...`);
  
  // Combine the asset prompt with style guidance
  const fullPrompt = `${asset.prompt}. ${STYLE_GUIDANCE.stylePrompt}`;
  log(`Full prompt: "${fullPrompt}"`);
  
  // Adjust dimensions for the selected engine
  const { width, height } = adjustDimensions(asset, engineId);
  
  try {
    const client = createStabilityClient();
    
    // Generate the image
    const result = await client.generateImage({
      engineId: engineId,
      prompt: fullPrompt,
      width: width,
      height: height,
      samples: 1,
      cfgScale: STYLE_GUIDANCE.cfgScale,
      steps: STYLE_GUIDANCE.steps,
      sampler: STYLE_GUIDANCE.sampler,
      // Aesthetic score to prefer more visually appealing images
      aesthetic_score: 0.75,
      // To generate consistent results
      seed: Math.floor(Math.random() * 2147483647),
      // Include these negative prompts for better quality
      negative_prompt: "blurry, distorted, low quality, bad anatomy, worst quality, low resolution, text, watermark"
    });
    
    // Extract the base64 image data
    if (result.artifacts && result.artifacts.length > 0) {
      // Save image to disk
      const outputPath = path.join(outputDir, `${asset.id}.png`);
      const imageBuffer = Buffer.from(result.artifacts[0].binary, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);
      
      log(`✅ Successfully generated and saved ${asset.name}`);
      return { 
        path: outputPath, 
        engine: engineId 
      };
    } else {
      throw new Error("No image artifacts returned from the API");
    }
  } catch (error) {
    log(`Error generating image with ${engineId}: ${error.message}`);
    
    // Check if we have a fallback engine defined
    const fallbackEngine = ENGINES[engineId]?.fallbackEngine;
    if (fallbackEngine) {
      log(`Attempting fallback to ${ENGINES[fallbackEngine]?.displayName || fallbackEngine}...`);
      return generateImage(asset, fallbackEngine);
    } else {
      throw new Error(`Failed with all engines: ${error.message}`);
    }
  }
}

/**
 * Main function to generate all assets
 */
async function generateAllAssets() {
  log('Starting high-quality image generation with Stability API...');
  
  const results = {
    success: [],
    failed: []
  };
  
  // Process each asset one by one
  for (const asset of assets) {
    try {
      log(`\n===== Processing: ${asset.name} =====`);
      const result = await generateImage(asset, asset.engine);
      
      results.success.push({
        id: asset.id,
        name: asset.name,
        engine: result.engine,
        path: result.path
      });
    } catch (error) {
      log(`❌ Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({
        id: asset.id,
        name: asset.name,
        error: error.message
      });
    }
    
    // Add delay between requests to avoid rate limiting
    log('Waiting 2 seconds before next request...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate summary report
  log('\n\n===== GENERATION SUMMARY =====');
  log(`Total assets: ${assets.length}`);
  log(`Successfully generated: ${results.success.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(item => {
      log(`- ${item.name}: ${item.error}`);
    });
  }
  
  if (results.success.length > 0) {
    log('\nSuccessful assets:');
    results.success.forEach(item => {
      log(`- ${item.name}: Generated with ${ENGINES[item.engine]?.displayName || item.engine}`);
    });
    
    // Create documentation
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Production-Quality Game Assets

## Generated Images

These images were generated on ${new Date().toLocaleDateString()} using Stability AI's advanced models.

**IMPORTANT:** These images are static assets and should not be regenerated during normal gameplay.

## Available Images

${results.success.map(item => 
  `- **${item.name}** (\`${item.id}.png\`): Generated using ${ENGINES[item.engine]?.displayName || item.engine}`
).join('\n')}

${results.failed.length > 0 ? 
  `\n## Failed Images\n\n${
    results.failed.map(item => `- **${item.name}** (\`${item.id}.png\`): ${item.error}`).join('\n')
  }` : ''}

## Style Details

All images were generated with the following style guidance to ensure consistency:
- \`${STYLE_GUIDANCE.stylePrompt}\`
- Configuration Scale: ${STYLE_GUIDANCE.cfgScale}
- Steps: ${STYLE_GUIDANCE.steps}
- Sampler: ${STYLE_GUIDANCE.sampler}

## Regeneration Instructions

To regenerate these images (only if needed for design updates):
1. Ensure your \`.env\` file contains a valid STABILITY_API_KEY
2. Run \`node scripts/generate-stability-images.js\` from the project directory
`;

    fs.writeFileSync(docsPath, docsContent);
    log(`Created documentation at: ${docsPath}`);
  }
  
  log('\nImage generation process complete!');
  logStream.end();
  
  return results;
}

// Execute the generation process
generateAllAssets()
  .then(results => {
    // Check if we have any failures. If so, exit with error code
    if (results.failed.length > 0 && results.success.length === 0) {
      console.error('\nAll image generation failed. Please check the logs.');
      process.exit(1);
    } else if (results.failed.length > 0) {
      console.warn('\nSome images failed to generate. Check the logs for details.');
    } else {
      console.log('\nAll images generated successfully!');
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 