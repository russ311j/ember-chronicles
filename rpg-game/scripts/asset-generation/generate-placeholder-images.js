/**
 * Placeholder Image Generator
 * 
 * This script generates simple placeholder images for the game
 * without relying on external APIs. Uses node-canvas to create
 * basic colored backgrounds with text labels.
 * 
 * Requires: npm install canvas
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

// Define assets to generate
const assets = [
  {
    id: 'loading_page',
    name: 'Loading Page',
    color: '#1a1a2e',
    text: 'Loading Page'
  },
  {
    id: 'landing_page',
    name: 'Landing Page',
    color: '#16213e',
    text: 'Landing Page'
  },
  {
    id: 'main_menu_background',
    name: 'Main Menu Background',
    color: '#0f3460',
    text: 'Main Menu Background'
  },
  {
    id: 'character_creation_background',
    name: 'Character Creation Background',
    color: '#533483',
    text: 'Character Creation'
  },
  {
    id: 'mysterious_letter',
    name: 'Mysterious Letter',
    color: '#5c3c10',
    text: 'Mysterious Letter'
  },
  {
    id: 'forest_path_ghost',
    name: 'Forest Path (Ghost)',
    color: '#2c3639',
    text: 'Forest Path'
  },
  {
    id: 'mountain_pass',
    name: 'Mountain Pass',
    color: '#3f4e4f',
    text: 'Mountain Pass'
  },
  {
    id: 'village_tavern',
    name: 'Village Tavern',
    color: '#854d0e',
    text: 'Village Tavern'
  }
];

// Ensure output directory exists
const outputDir = path.resolve(__dirname, '../media/images/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

/**
 * Generate a placeholder image with a solid background and centered text
 */
function generatePlaceholderImage(asset) {
  console.log(`Generating placeholder image for ${asset.name}...`);
  
  // Create a canvas (1024x768 resolution)
  const width = 1024;
  const height = 768;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background with color
  ctx.fillStyle = asset.color;
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
  ctx.fillText(asset.text, width / 2, height / 2);
  
  // Add 'PLACEHOLDER' text
  ctx.font = '24px Arial';
  ctx.fillText('PLACEHOLDER IMAGE', width / 2, height / 2 + 60);
  
  // Save the image
  const outputPath = path.join(outputDir, `${asset.id}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`✅ Created placeholder image: ${outputPath}`);
  return outputPath;
}

/**
 * Generate all placeholder images
 */
async function generateAllPlaceholderImages() {
  console.log('Starting placeholder image generation...');
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const asset of assets) {
    try {
      const filePath = generatePlaceholderImage(asset);
      results.success.push({ id: asset.id, path: filePath });
    } catch (error) {
      console.error(`Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({ id: asset.id, error: error.message });
    }
  }
  
  // Write summary report
  console.log('\n=== GENERATION SUMMARY ===');
  console.log(`Total: ${assets.length}`);
  console.log(`Successful: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed assets:');
    results.failed.forEach(item => {
      console.log(`- ${item.id}: ${item.error}`);
    });
  }
  
  if (results.success.length > 0) {
    // Create documentation in the images folder
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Placeholder Game Assets

## Generated Images

These are placeholder images generated on ${new Date().toLocaleDateString()}.

**IMPORTANT: These images are meant to be replaced with actual game artwork.**

To regenerate these placeholder images:
1. Run \`npm install canvas\` (if not already installed)
2. Run \`node scripts/generate-placeholder-images.js\` from the rpg-game directory

## Available Images

${assets.map(asset => `- **${asset.name}** (\`${asset.id}.png\`): Simple placeholder with "${asset.text}" text`).join('\n')}

## Usage

These images are automatically loaded by the game. Do not modify the filenames.
`;

    fs.writeFileSync(docsPath, docsContent);
    console.log(`\nDocumentation written to: ${docsPath}`);
  }
  
  console.log('\nPlaceholder image generation complete!');
}

// Run the generator
generateAllPlaceholderImages().catch(err => {
  console.error('Fatal error during image generation:');
  console.error(err);
  process.exit(1);
}); 