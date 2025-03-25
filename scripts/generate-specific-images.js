import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Calculate __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Set up directories
const outputDir = path.resolve(__dirname, '../media/images/generated');
const magicHourDir = path.join(outputDir, 'magichour');
const uiDir = path.join(outputDir, 'ui');

// Create directories if they don't exist
for (const dir of [outputDir, magicHourDir, uiDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Define the specific assets to generate
const assetsToGenerate = [
  {
    id: 'main_menu',
    name: 'Main Menu Background',
    prompt: 'Majestic fantasy throne room with ornate marble pillars and gothic architecture, warm golden light streaming through tall stained glass windows, ethereal atmosphere with dust particles in light beams, dramatic shadows, no text overlay, no characters, professional quality digital art, 8K resolution, sharp focus, cohesive fantasy game art style, photorealistic rendering',
    category: 'ui'
  }
];

// Magic Hour Client class
class Client {
  constructor(options) {
    this.token = options.token;
    this.baseUrl = 'https://api.magichour.ai/v1';
  }

  async createImageGenerationProject(options) {
    console.log(`Creating image generation project for: ${options.style.prompt.substring(0, 50)}...`);

    const response = await fetch(`${this.baseUrl}/ai-image-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        image_count: options.imageCount || 1,
        orientation: options.orientation || 'landscape',
        style: {
          prompt: options.style.prompt
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    console.log(`Project created with ID: ${data.id}`);
    return data;
  }

  async getProject(id) {
    console.log(`Checking project status for ID: ${id}`);

    const response = await fetch(`${this.baseUrl}/image-projects/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    console.log(`Project status: ${data.status}`);
    return data;
  }
}

// Helper function to wait between operations
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to download image
async function downloadImage(url, outputPath) {
  console.log(`Downloading image to ${outputPath}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`Successfully downloaded image to ${outputPath}`);
  return outputPath;
}

// Function to generate a single image
async function generateImage(client, asset) {
  const outputDir = asset.category === 'ui' ? uiDir : magicHourDir;
  const imagePath = path.join(outputDir, `${asset.id}.png`);
  const mainOutputPath = path.join(outputDir, `${asset.id}.png`);

  console.log(`\nGenerating "${asset.name}"...`);

  try {
    // Always regenerate the images regardless of existence
    const createRes = await client.createImageGenerationProject({
      imageCount: 1,
      orientation: "landscape",
      style: {
        prompt: asset.prompt,
      },
    });

    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Checking project status (attempt ${attempts}/${maxAttempts})...`);

      const res = await client.getProject(createRes.id);

      if (res.status === "complete") {
        console.log("Image generation complete!");
        if (res.downloads && res.downloads.length > 0) {
          await downloadImage(res.downloads[0].url, imagePath);
          
          // Copy to main output directory if needed
          if (imagePath !== mainOutputPath) {
            fs.copyFileSync(imagePath, mainOutputPath);
          }
          
          return {
            success: true,
            path: imagePath
          };
        }
        throw new Error('No download URLs in the complete response');
      } else if (res.status === "error") {
        throw new Error(`Image generation failed with status: ${res.status}`);
      }
      
      console.log(`Still processing (${res.status}), waiting 3 seconds...`);
      await wait(3000);
    }

    throw new Error(`Timed out after ${maxAttempts} attempts`);
  } catch (error) {
    console.error(`Error generating image: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  try {
    console.log('Starting specific image generation for Ember Throne Chronicles');
    
    const apiKey = process.env.MAGIC_HOUR_API_KEY;
    if (!apiKey) {
      throw new Error('MAGIC_HOUR_API_KEY not found in .env file');
    }
    
    console.log('Initializing Magic Hour client...');
    const client = new Client({ token: apiKey });
    
    // Generate each image
    for (const asset of assetsToGenerate) {
      const result = await generateImage(client, asset);
      
      if (result.success) {
        console.log(`Successfully generated ${asset.id}.png`);
      } else {
        console.error(`Failed to generate ${asset.id}.png: ${result.error}`);
      }
      
      // Wait 5 seconds between generations
      if (asset !== assetsToGenerate[assetsToGenerate.length - 1]) {
        console.log('Waiting 5 seconds before next generation...');
        await wait(5000);
      }
    }
    
    console.log('\nImage generation complete!');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 