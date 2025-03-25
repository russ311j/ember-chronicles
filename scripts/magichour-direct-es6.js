/**
 * Magic Hour Direct API Client for The Ember Throne Chronicles
 * ES6 module version based directly on the sample code from the documentation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Calculate __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up directories
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const outputDir = path.resolve(__dirname, '../media/images/generated');
const magicHourDir = path.join(outputDir, 'magichour');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(magicHourDir)) {
  fs.mkdirSync(magicHourDir, { recursive: true });
}

// Setup logging
const logFilePath = path.join(logDir, 'magichour-es6.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  logStream.write(formattedMessage);
  console.log(message);
}

// Define images to generate
const images = [
  {
    id: 'title_page',
    name: 'Title Page - The Ember Throne Chronicles',
    prompt: 'Epic fantasy game title page, "The Ember Throne Chronicles", ornate magical throne with burning embers, phoenix and serpent symbols, fantasy RPG game art, professional quality, book cover style',
  },
  {
    id: 'page_1',
    name: 'Page 1 - A Mysterious Invitation',
    prompt: 'Fantasy village at twilight, hooded figure at door, mysterious envelope with burning phoenix and serpent wax seal, magical symbols, fantasy RPG game art, professional quality, cohesive game art style',
  },
  {
    id: 'page_2',
    name: 'Page 2 - Bold Acceptance',
    prompt: 'Character breaking wax seal on ancient parchment, reading elegantly written letter about the Ember Throne relic, fantasy RPG game art, professional quality, cohesive game art style',
  },
  {
    id: 'page_3',
    name: 'Page 3 - Inquisitive Investigation',
    prompt: 'Character examining cryptic letter with intricate script and enigmatic symbols, faded ink, candlelight, fantasy RPG game art, professional quality, cohesive game art style',
  },
  {
    id: 'page_4',
    name: 'Page 4 - Seeking Counsel',
    prompt: 'Wise village elder in cozy cottage with incense and herbs, listening to character showing mysterious letter, fantasy RPG game art, professional quality, cohesive game art style',
  },
  {
    id: 'page_5',
    name: 'Page 5 - Preparation for Journey',
    prompt: 'Character at fork in road with three paths - dark forest, rocky mountain trail, and clearing for camping, night sky, fantasy RPG game art, professional quality, cohesive game art style',
  }
];

// Create a Magic Hour Client class that matches the sample code
class Client {
  constructor(options) {
    this.token = options.token;
    this.baseUrl = 'https://api.magichour.ai/v1';
  }

  // Method to create a new image generation project
  async createImageGenerationProject(options) {
    log(`Creating image generation project with prompt: ${options.style.prompt.substring(0, 50)}...`);

    try {
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
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      log(`Project created with ID: ${data.id}`);
      return data;
    } catch (error) {
      log(`Error creating image generation project: ${error.message}`);
      throw error;
    }
  }

  // Method to check project status
  async getProject(id) {
    log(`Checking project status for ID: ${id}`);

    try {
      const response = await fetch(`${this.baseUrl}/image-projects/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      log(`Project status: ${data.status}`);
      return data;
    } catch (error) {
      log(`Error checking project status: ${error.message}`);
      throw error;
    }
  }
}

// Function to wait between operations
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to download image from URL
async function downloadImage(url, outputPath) {
  log(`Downloading image from ${url} to ${outputPath}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    log(`Successfully downloaded image to ${outputPath}`);
    return outputPath;
  } catch (error) {
    log(`Error downloading image: ${error.message}`);
    throw error;
  }
}

// Function to find placeholder image
function findPlaceholderImage() {
  // Different possible locations for placeholder images
  const possibleLocations = [
    path.resolve(__dirname, '../media/images/generated/loading_page.png'),
    path.resolve(__dirname, '../rpg-game/media/images/generated/loading_page.png'),
    path.resolve(__dirname, '../media/images/generated/page_1.png'),
    path.resolve(__dirname, '../rpg-game/media/images/generated/page_1.png'),
    path.resolve(__dirname, '../media/images/generated/title_page.png'),
    path.resolve(__dirname, '../rpg-game/media/images/generated/title_page.png')
  ];

  // Find the first file that exists
  for (const location of possibleLocations) {
    log(`Checking for placeholder at: ${location}`);
    if (fs.existsSync(location)) {
      log(`Found placeholder at: ${location}`);
      return location;
    }
  }

  // If we get here, no placeholder was found
  log('No placeholder image found in any expected location');
  return null;
}

// Function to create a fallback image
function createFallbackImage(outputPath) {
  // Find a suitable placeholder to copy
  const sourcePlaceholder = findPlaceholderImage();
  if (sourcePlaceholder) {
    fs.copyFileSync(sourcePlaceholder, outputPath);
    log(`Created fallback image from: ${sourcePlaceholder}`);
    return outputPath;
  } else {
    // Last resort: Create a 1x1 transparent pixel
    log(`Creating minimal 1x1 transparent pixel image as fallback`);
    const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKDWIGMxwAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(outputPath, transparentPixel);
    log(`Created minimal fallback image at: ${outputPath}`);
    return outputPath;
  }
}

// Function to generate an image for a single image entry
async function generateImage(client, image) {
  const imagePath = path.join(magicHourDir, `${image.id}.png`);
  log(`Generating "${image.name}" with prompt: ${image.prompt.substring(0, 50)}...`);

  try {
    // 1. Create the image generation project
    const createRes = await client.createImageGenerationProject({
      imageCount: 1,
      orientation: "landscape",
      style: {
        prompt: image.prompt,
      },
    });

    // 2. Poll for completion
    let attempts = 0;
    const maxAttempts = 20; // Maximum polling attempts (about 1 minute)

    while (attempts < maxAttempts) {
      attempts++;
      log(`Checking project status (attempt ${attempts}/${maxAttempts})...`);

      const res = await client.getProject(createRes.id);

      if (res.status === "complete") {
        log("Image generation complete!");
        if (res.downloads && res.downloads.length > 0) {
          await downloadImage(res.downloads[0].url, imagePath);
          log(`Image saved to ${imagePath}`);
          
          // Copy to main output directory
          const mainOutputPath = path.join(outputDir, `${image.id}.png`);
          fs.copyFileSync(imagePath, mainOutputPath);
          log(`Copied image to main output directory: ${mainOutputPath}`);
          
          return {
            success: true,
            path: imagePath
          };
        } else {
          throw new Error('No download URLs in the complete response');
        }
      } else if (res.status === "error") {
        throw new Error(`Image generation failed with status: ${res.status}`);
      } else {
        log(`Still processing (${res.status}), waiting 3 seconds...`);
        await wait(3000);
      }
    }

    throw new Error(`Timed out after ${maxAttempts} attempts`);
  } catch (error) {
    log(`Error generating image: ${error.message}`);
    
    // Create a fallback image
    try {
      createFallbackImage(imagePath);
      
      // Copy to main output directory
      const mainOutputPath = path.join(outputDir, `${image.id}.png`);
      fs.copyFileSync(imagePath, mainOutputPath);
      log(`Created and copied fallback image to: ${mainOutputPath}`);
    } catch (fallbackError) {
      log(`Error creating fallback image: ${fallbackError.message}`);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Main function that matches the sample code
async function main() {
  try {
    log('Starting Magic Hour ES6 client image generation process');
    
    // 1. Load environment variables
    const envPath = path.resolve(__dirname, '../.env');
    log(`Loading environment from ${envPath}`);
    
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file not found at ${envPath}`);
    }
    
    dotenv.config({ path: envPath });
    
    // 2. Get the API key
    const apiKey = process.env.MAGIC_HOUR_API_KEY || "mhk_live_1pFDyTr5CwSi6xHDjv9F7KIjaf8rbBjMj1GcwlmpZUlARtke8xLN8ZGbHci0fms6ZziqJtMY7T6XPZp7";
    if (!apiKey) {
      throw new Error('MAGIC_HOUR_API_KEY not found in .env file and no fallback provided');
    }
    
    log(`Initializing Magic Hour client with API key (length ${apiKey.length})`);
    
    // 3. Create client
    const client = new Client({ token: apiKey });
    
    // 4. Create a summary file
    const summaryPath = path.join(magicHourDir, 'es6-generation-summary.md');
    fs.writeFileSync(summaryPath, `# Magic Hour ES6 Client Image Generation
    
Started at: ${new Date().toISOString()}
Total images to generate: ${images.length}
API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}

## Images

`);
    
    // 5. Generate all images one by one
    const results = {
      success: [],
      failure: []
    };
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      log(`Processing image ${i+1}/${images.length}: ${image.name}`);
      
      const result = await generateImage(client, image);
      
      if (result.success) {
        // Update the summary file for success
        fs.appendFileSync(summaryPath, `
### ${image.name} (${image.id}.png)
✅ Success
- Generated at: ${new Date().toISOString()}
- Prompt: ${image.prompt}
`);
        results.success.push(image.id);
      } else {
        // Update the summary file for failure
        fs.appendFileSync(summaryPath, `
### ${image.name} (${image.id}.png)
❌ Failed
- Attempted at: ${new Date().toISOString()}
- Error: ${result.error}
- Prompt: ${image.prompt}
`);
        results.failure.push(image.id);
      }
      
      // Wait before processing the next image
      if (i < images.length - 1) {
        log(`Waiting 5 seconds before processing next image...`);
        await wait(5000);
      }
    }
    
    // 6. Add summary section
    fs.appendFileSync(summaryPath, `
## Summary

Total images processed: ${images.length}
Successful generations: ${results.success.length}
Failed generations: ${results.failure.length}

### Successful Images
${results.success.map(id => `- ${id}`).join('\n')}

### Failed Images
${results.failure.map(id => `- ${id}`).join('\n')}

Completed at: ${new Date().toISOString()}
`);
    
    log(`Image generation process completed. See summary at: ${summaryPath}`);
    
  } catch (error) {
    log(`ERROR: ${error.message}`);
    if (error.stack) {
      log(error.stack);
    }
  } finally {
    // Close log stream
    logStream.end();
  }
}

// Run the main function
main().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
}); 