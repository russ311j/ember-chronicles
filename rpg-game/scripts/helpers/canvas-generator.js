/**
 * Canvas Image Generator
 * 
 * This helper creates fallback images using the Canvas API when
 * external image generation services fail.
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

/**
 * Generates a placeholder image using Canvas
 * @param {string} id - The asset ID
 * @param {string} prompt - The prompt used to describe the image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<string>} - Path to the generated image file
 */
async function generateCanvasImage(id, prompt, width, height) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Generating canvas image for "${id}"...`);
      
      // Create a canvas with the specified dimensions
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // Create a gradient background that matches the asset type
      createBackground(ctx, id, width, height);
      
      // Add some visual elements based on the image type
      await addVisualElements(ctx, id, width, height);
      
      // Add title and description
      addText(ctx, id, prompt, width, height);
      
      // Save the canvas to a file
      const outputDir = path.resolve(__dirname, '../../media/images/generated');
      const outputPath = path.join(outputDir, `${id}.png`);
      
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`Canvas image saved to: ${outputPath}`);
      resolve(outputPath);
    } catch (error) {
      console.error('Error generating canvas image:', error);
      reject(error);
    }
  });
}

/**
 * Creates a background gradient based on the asset type
 */
function createBackground(ctx, id, width, height) {
  let gradient;
  
  // Create different gradient styles based on the image type
  if (id.includes('forest')) {
    // Forest - dark greens
    gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0A2F0A');
    gradient.addColorStop(0.7, '#1A4F1A');
    gradient.addColorStop(1, '#1A3F1A');
  } else if (id.includes('tavern') || id.includes('interior')) {
    // Warm interior
    gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#4A3000');
    gradient.addColorStop(1, '#2A1800');
  } else if (id.includes('mountain')) {
    // Mountain scene
    gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0A1A3F');
    gradient.addColorStop(0.6, '#2A3A5F');
    gradient.addColorStop(1, '#5A6A8F');
  } else if (id.includes('letter') || id.includes('parchment')) {
    // Aged parchment
    gradient = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, height);
    gradient.addColorStop(0, '#D8C9A3');
    gradient.addColorStop(1, '#B09A73');
  } else if (id.includes('menu')) {
    // Epic fantasy scene
    gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0A1A4F');
    gradient.addColorStop(0.7, '#1A2A6F');
    gradient.addColorStop(1, '#4A5A9F');
  } else {
    // Default fantasy gradient
    gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1A237E');
    gradient.addColorStop(1, '#283593');
  }
  
  // Fill the background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Adds visual elements to make the image more interesting
 */
async function addVisualElements(ctx, id, width, height) {
  // Add visual elements based on the image type
  if (id.includes('forest')) {
    // Add misty fog effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 100 + 50;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add trees silhouettes
    ctx.fillStyle = 'rgba(10, 20, 10, 0.8)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const treeWidth = Math.random() * 60 + 40;
      const treeHeight = Math.random() * 300 + 200;
      ctx.fillRect(x, height - treeHeight, treeWidth, treeHeight);
    }
  } else if (id.includes('mountain')) {
    // Add mountains
    ctx.fillStyle = '#2A3A4F';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    
    // Create jagged mountain range
    let x = 0;
    while (x < width) {
      const peakHeight = Math.random() * height * 0.4 + height * 0.1;
      ctx.lineTo(x, height - peakHeight);
      x += Math.random() * 100 + 50;
    }
    ctx.lineTo(width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    
    // Add stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.6;
      const size = Math.random() * 2 + 1;
      ctx.fillRect(x, y, size, size);
    }
  } else if (id.includes('tavern')) {
    // Draw wooden floor
    ctx.fillStyle = '#5A2800';
    ctx.fillRect(0, height * 0.8, width, height * 0.2);
    
    // Draw table
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(width * 0.3, height * 0.6, width * 0.4, height * 0.1);
    ctx.fillRect(width * 0.35, height * 0.7, width * 0.05, height * 0.1);
    ctx.fillRect(width * 0.6, height * 0.7, width * 0.05, height * 0.1);
    
    // Draw fireplace
    ctx.fillStyle = '#4A3000';
    ctx.fillRect(width * 0.1, height * 0.4, width * 0.2, height * 0.4);
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(width * 0.12, height * 0.6, width * 0.16, height * 0.18);
  } else if (id.includes('letter')) {
    // Add parchment texture effect
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random();
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.03})`;
      ctx.fillRect(x, y, size, size);
    }
    
    // Add seal
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.3, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Add seal pattern
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.3, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add rune-like symbols on the parchment
    ctx.fillStyle = 'rgba(50, 30, 10, 0.7)';
    for (let i = 0; i < 10; i++) {
      ctx.font = '20px serif';
      ctx.fillText('†ꙮ⁂₪', width * 0.2 + i * 50, height * 0.4 + i * 25);
    }
  } else if (id.includes('menu')) {
    // Add starry sky
    ctx.fillStyle = 'white';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.7;
      const size = Math.random() * 2 + 1;
      ctx.fillRect(x, y, size, size);
    }
    
    // Add a castle silhouette
    ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
    // Castle base
    ctx.fillRect(width * 0.3, height * 0.4, width * 0.4, height * 0.3);
    // Towers
    ctx.fillRect(width * 0.25, height * 0.3, width * 0.1, height * 0.4);
    ctx.fillRect(width * 0.65, height * 0.3, width * 0.1, height * 0.4);
    // Tower tops
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.3);
    ctx.lineTo(width * 0.3, height * 0.2);
    ctx.lineTo(width * 0.35, height * 0.3);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(width * 0.65, height * 0.3);
    ctx.lineTo(width * 0.7, height * 0.2);
    ctx.lineTo(width * 0.75, height * 0.3);
    ctx.fill();
  }
}

/**
 * Adds text to the image
 */
function addText(ctx, id, prompt, width, height) {
  // Get a friendly name from the ID
  const nameMap = {
    'landing_page': 'Landing Page',
    'main_menu_background': 'Main Menu',
    'character_creation_background': 'Character Creation',
    'mysterious_letter': 'Mysterious Letter',
    'forest_path_ghost': 'Spooky Forest Path',
    'mountain_pass': 'Mountain Pass',
    'village_tavern': 'Village Tavern'
  };
  
  const name = nameMap[id] || id.replace(/_/g, ' ');
  
  // Add title
  ctx.font = 'bold 40px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(name, width / 2, height / 2 - 20);
  
  // Add a note about being a placeholder
  ctx.font = '20px serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Fallback image - Canvas generated', width / 2, height / 2 + 20);
  
  // Add shortened prompt as description
  ctx.font = 'italic 16px serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  const shortPrompt = prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt;
  ctx.fillText(`"${shortPrompt}"`, width / 2, height / 2 + 50);
}

module.exports = generateCanvasImage; 