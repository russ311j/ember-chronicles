/**
 * Ember Throne Chronicles - Complete Asset Generator
 * This script generates all required art assets for the game
 * using the Magic Hour API
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
const uiDir = path.join(outputDir, 'ui');
const charactersDir = path.join(outputDir, 'characters');
const locationsDir = path.join(outputDir, 'locations');
const itemsDir = path.join(outputDir, 'items');

// Create all required directories
for (const dir of [outputDir, magicHourDir, uiDir, charactersDir, locationsDir, itemsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Setup logging
const logFilePath = path.join(logDir, 'ember-throne-assets.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  logStream.write(formattedMessage);
  console.log(message);
}

// Define all assets to generate
const assets = {
  // Story pages (25+)
  story: [
    {
      id: 'title_page',
      name: 'Title Page - The Ember Throne Chronicles',
      prompt: 'Epic fantasy game title page, "The Ember Throne Chronicles", ornate magical throne with burning embers, phoenix and serpent symbols, fantasy RPG game art, professional quality, book cover style',
      category: 'story'
    },
    {
      id: 'page_1',
      name: 'Page 1 - A Mysterious Invitation',
      prompt: 'A cozy medieval parlor at twilight, with a single weathered envelope prominently displayed on a wooden table. The envelope bears an ornate wax seal showing a burning phoenix intertwined with a serpent, glowing with subtle magical energy. Warm candlelight from nearby windows illuminates the room, creating a mysterious atmosphere. The scene is viewed through a first-person perspective, with the envelope as the focal point. Photorealistic digital painting, dramatic lighting, professional fantasy art style.',
      category: 'story'
    },
    {
      id: 'page_2',
      name: 'Page 2 - Bold Acceptance',
      prompt: 'Character breaking wax seal on ancient parchment, reading elegantly written letter about the Ember Throne relic, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_3',
      name: 'Page 3 - Inquisitive Investigation',
      prompt: 'Character examining cryptic letter with intricate script and enigmatic symbols, faded ink, candlelight, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_4',
      name: 'Page 4 - Seeking Counsel',
      prompt: 'Wise village elder in cozy cottage with incense and herbs, listening to character showing mysterious letter, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_5',
      name: 'Page 5 - Preparation for Journey',
      prompt: 'Character at fork in road with three paths - dark forest, rocky mountain trail, and clearing for camping, night sky, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_6',
      name: 'Page 6 - Entering the Dark Forest',
      prompt: 'Character entering ominous dark forest with twisted trees, glowing eyes in darkness, mist, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_7',
      name: 'Page 7 - Peculiar Lights',
      prompt: 'Character discovering strange glowing mushrooms and will-o-wisps in dark forest, eerie light, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_8',
      name: 'Page 8 - Forest Guardian',
      prompt: 'Character encountering majestic deer with glowing antlers in forest clearing, magical presence, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_9',
      name: 'Page 9 - Ancient Stones',
      prompt: 'Character discovering ancient stone circle with runes, moonlight, forest setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_10',
      name: 'Page 10 - Forest Exit',
      prompt: 'Character emerging from dark forest into mountain foothills, dawn light, path ahead, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_11',
      name: 'Page 11 - Mountain Trail',
      prompt: 'Character climbing steep mountain trail, rocky terrain, eagles soaring overhead, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_12',
      name: 'Page 12 - Mountain Hermit',
      prompt: 'Character meeting elderly hermit outside simple mountain hut, offering shelter from storm, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_13',
      name: 'Page 13 - Hermit\'s Tale',
      prompt: 'Character and hermit inside hut, hermit gesturing while telling story of the Ember Throne, firelight, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_14',
      name: 'Page 14 - Ice Cave',
      prompt: 'Character discovering entrance to ice cave, glowing blue crystals, snow-covered mountain, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_15',
      name: 'Page 15 - Crystal Chamber',
      prompt: 'Character in vast underground crystal chamber with reflective surfaces, magical light, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_16',
      name: 'Page 16 - Ancient Library',
      prompt: 'Character finding hidden underground library with ancient scrolls and tomes, dust, magical preservation, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_17',
      name: 'Page 17 - Secret Knowledge',
      prompt: 'Character reading ancient tome about Ember Throne history, magical light illuminating text, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_18',
      name: 'Page 18 - Hidden Map',
      prompt: 'Character discovering secret map revealing location of the Ember Throne, hidden compartment in book, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_19',
      name: 'Page 19 - Mountain Summit',
      prompt: 'Character reaching mountain summit, panoramic view of kingdom, sunset, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_20',
      name: 'Page 20 - Ancient Temple',
      prompt: 'Character approaching ancient temple built into mountainside, ornate architecture, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_21',
      name: 'Page 21 - Temple Entrance',
      prompt: 'Character opening massive stone doors to ancient temple, magical symbols glowing, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_22',
      name: 'Page 22 - Hall of Trials',
      prompt: 'Character in grand hall with multiple doorways representing different trials, magical symbols, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_23',
      name: 'Page 23 - Trial of Wisdom',
      prompt: 'Character solving ancient puzzle with moving stone pieces, magical light, temple setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_24',
      name: 'Page 24 - Trial of Courage',
      prompt: 'Character crossing narrow bridge over seemingly endless chasm, temple setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_25',
      name: 'Page 25 - The Ember Throne',
      prompt: 'Character discovering the Ember Throne in massive chamber, ornate magical throne with eternal flame, phoenix and serpent motifs, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_26',
      name: 'Page 26 - The Guardian',
      prompt: 'Character confronting ancient guardian of the Ember Throne, magical being made of flame, temple setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_27',
      name: 'Page 27 - The Revelation',
      prompt: 'Character learning the true purpose of the Ember Throne through vision, magical light, temple setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_28',
      name: 'Page 28 - The Choice',
      prompt: 'Character presented with choice about the Ember Throne, magical swirling energies, temple setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_29',
      name: 'Page 29 - The Return',
      prompt: 'Character descending mountain with newfound knowledge, sunset, looking toward village in distance, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    },
    {
      id: 'page_30',
      name: 'Page 30 - Epilogue',
      prompt: 'Character sharing discovery with village council, hope and determination, evening setting, fantasy RPG game art, professional quality, cohesive game art style',
      category: 'story'
    }
  ],
  
  // UI elements
  ui: [
    {
      id: 'loading_screen',
      name: 'Loading Screen',
      prompt: 'Fantasy game loading screen, "The Ember Throne Chronicles", ornate magical throne with burning embers, minimal UI elements, dark background, fantasy RPG game art, professional quality',
      category: 'ui'
    },
    {
      id: 'main_menu',
      name: 'Main Menu Background',
      prompt: 'Fantasy game main menu background, ancient temple with magical throne, dramatic lighting, minimal, space for menu options, fantasy RPG game art, professional quality',
      category: 'ui'
    },
    {
      id: 'button_frame',
      name: 'UI Button Frame',
      prompt: 'Fantasy game UI button frame, ornate design with ember and flame motif, gold and red accents, isolated on transparent background, fantasy RPG game art, professional quality',
      category: 'ui'
    },
    {
      id: 'dialog_box',
      name: 'Dialog Box',
      prompt: 'Fantasy game dialog box, parchment appearance with ornate frame, ember and flame motif, isolated on transparent background, fantasy RPG game art, professional quality',
      category: 'ui'
    },
    {
      id: 'inventory_bg',
      name: 'Inventory Background',
      prompt: 'Fantasy game inventory background, aged leather with grid pattern for items, ornate frame, isolated on transparent background, fantasy RPG game art, professional quality',
      category: 'ui'
    }
  ],
  
  // Characters
  characters: [
    {
      id: 'protagonist',
      name: 'The Protagonist',
      prompt: 'Fantasy RPG game protagonist, determined adventurer, practical traveling clothes, modest equipment, neutral pose, full body portrait, isolated character, professional quality',
      category: 'characters'
    },
    {
      id: 'village_elder',
      name: 'Village Elder',
      prompt: 'Fantasy RPG game village elder, wise elderly person, traditional clothing, gentle expression, seated pose, full body portrait, isolated character, professional quality',
      category: 'characters'
    },
    {
      id: 'mysterious_messenger',
      name: 'Mysterious Messenger',
      prompt: 'Fantasy RPG game mysterious messenger, hooded figure, cryptic expression, carrying sealed message, standing pose, full body portrait, isolated character, professional quality',
      category: 'characters'
    },
    {
      id: 'forest_guardian',
      name: 'Forest Guardian',
      prompt: 'Fantasy RPG game forest guardian, ethereal deer-like creature with glowing antlers, magical aura, natural setting, full body portrait, isolated character, professional quality',
      category: 'characters'
    },
    {
      id: 'mountain_hermit',
      name: 'Mountain Hermit',
      prompt: 'Fantasy RPG game mountain hermit, weathered elderly person, simple rugged clothing, wise expression, leaning on staff, full body portrait, isolated character, professional quality',
      category: 'characters'
    },
    {
      id: 'temple_guardian',
      name: 'Temple Guardian',
      prompt: 'Fantasy RPG game temple guardian, ancient magical being made of flame, imposing presence, temple setting, full body portrait, isolated character, professional quality',
      category: 'characters'
    }
  ],
  
  // Locations
  locations: [
    {
      id: 'village',
      name: 'The Village',
      prompt: 'Fantasy RPG game small medieval village, cozy houses, town square, sunset lighting, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'dark_forest',
      name: 'The Dark Forest',
      prompt: 'Fantasy RPG game dark mysterious forest, twisted ancient trees, mist, eerie atmosphere, path winding through, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'mountain_trail',
      name: 'Mountain Trail',
      prompt: 'Fantasy RPG game mountain trail, rocky terrain, steep cliffs, sweeping vista, clear day, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'hermit_hut',
      name: 'Hermit\'s Hut',
      prompt: 'Fantasy RPG game mountain hermit\'s simple hut, stone and wood construction, smoke from chimney, mountainside location, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'ice_cave',
      name: 'Ice Cave',
      prompt: 'Fantasy RPG game ice cave entrance, glowing blue crystals, mountainside setting, snow and ice, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'ancient_library',
      name: 'Ancient Library',
      prompt: 'Fantasy RPG game hidden underground library, towering bookshelves, ancient scrolls, magical lighting, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'ancient_temple',
      name: 'Ancient Temple',
      prompt: 'Fantasy RPG game ancient temple built into mountainside, massive ornate entrance, magical symbols, dramatic lighting, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    },
    {
      id: 'ember_throne_chamber',
      name: 'Ember Throne Chamber',
      prompt: 'Fantasy RPG game massive chamber housing the Ember Throne, ornate magical throne with eternal flame, grand architecture, magical lighting, establishing shot, fantasy RPG game art, professional quality',
      category: 'locations'
    }
  ],
  
  // Items
  items: [
    {
      id: 'mysterious_letter',
      name: 'Mysterious Letter',
      prompt: 'Fantasy RPG game mysterious letter, ancient parchment with elegant script, wax seal with phoenix and serpent symbol, isolated item, fantasy RPG game art, professional quality',
      category: 'items'
    },
    {
      id: 'ancient_map',
      name: 'Ancient Map',
      prompt: 'Fantasy RPG game ancient map showing path to Ember Throne, weathered parchment, cryptic symbols, isolated item, fantasy RPG game art, professional quality',
      category: 'items'
    },
    {
      id: 'crystal_key',
      name: 'Crystal Key',
      prompt: 'Fantasy RPG game crystal key with magical glow, intricate design, flame motif, isolated item, fantasy RPG game art, professional quality',
      category: 'items'
    },
    {
      id: 'ember_amulet',
      name: 'Ember Amulet',
      prompt: 'Fantasy RPG game magical amulet with ember-like gem, gold and silver setting, flame motif, isolated item, fantasy RPG game art, professional quality',
      category: 'items'
    },
    {
      id: 'ancient_tome',
      name: 'Ancient Tome',
      prompt: 'Fantasy RPG game ancient tome about Ember Throne history, leather bound with metal accents, glowing runes, isolated item, fantasy RPG game art, professional quality',
      category: 'items'
    }
  ]
};

// Flatten assets for processing
const allAssets = [
  ...assets.story,
  ...assets.ui,
  ...assets.characters,
  ...assets.locations,
  ...assets.items
];

// Create a Magic Hour Client class
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
    path.resolve(__dirname, '../media/images/generated/page_1.png'),
    path.resolve(__dirname, '../media/images/generated/title_page.png')
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
async function generateImage(client, asset) {
  // Determine output directory based on category
  let categoryDir;
  switch (asset.category) {
    case 'ui':
      categoryDir = uiDir;
      break;
    case 'characters':
      categoryDir = charactersDir;
      break;
    case 'locations':
      categoryDir = locationsDir;
      break;
    case 'items':
      categoryDir = itemsDir;
      break;
    default:
      categoryDir = magicHourDir;
  }
  
  const imagePath = path.join(categoryDir, `${asset.id}.png`);
  const mainOutputPath = path.join(outputDir, `${asset.id}.png`);
  
  log(`Generating "${asset.name}" with prompt: ${asset.prompt.substring(0, 50)}...`);

  try {
    // Skip if the image already exists (to avoid regenerating unnecessarily)
    if (asset.id !== 'page_1' && fs.existsSync(imagePath) && fs.existsSync(mainOutputPath)) {
      log(`Image ${asset.id}.png already exists, skipping generation`);
      return {
        success: true,
        path: imagePath,
        skipped: true
      };
    }
    
    // 1. Create the image generation project
    const createRes = await client.createImageGenerationProject({
      imageCount: 1,
      orientation: "landscape",
      style: {
        prompt: asset.prompt,
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
          fs.copyFileSync(imagePath, mainOutputPath);
          log(`Copied image to main output directory: ${mainOutputPath}`);
          
          return {
            success: true,
            path: imagePath,
            generatedAt: new Date().toISOString()
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

// Main function
async function main() {
  try {
    log('Starting Ember Throne Chronicles complete asset generation process');
    
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
    
    // 4. Create summary files for each category
    const summaryPath = path.join(outputDir, 'ember-throne-assets-summary.md');
    fs.writeFileSync(summaryPath, `# Ember Throne Chronicles - Complete Asset Generation
    
Started at: ${new Date().toISOString()}
Total assets to generate: ${allAssets.length}
API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}

## Asset Categories
- Story Pages: ${assets.story.length}
- UI Elements: ${assets.ui.length}
- Characters: ${assets.characters.length}
- Locations: ${assets.locations.length}
- Items: ${assets.items.length}

## Generation Progress

`);
    
    // 5. Generate all images by category
    const results = {
      success: [],
      failure: [],
      skipped: []
    };
    
    // Process each category one by one
    const categories = Object.keys(assets);
    for (const category of categories) {
      log(`Processing category: ${category} (${assets[category].length} assets)`);
      fs.appendFileSync(summaryPath, `\n### ${category.toUpperCase()} (${assets[category].length} assets)\n\n`);
      
      for (let i = 0; i < assets[category].length; i++) {
        const asset = assets[category][i];
        log(`Processing ${category} asset ${i+1}/${assets[category].length}: ${asset.name}`);
        
        const result = await generateImage(client, asset);
        
        if (result.success) {
          if (result.skipped) {
            // Update the summary file for skipped
            fs.appendFileSync(summaryPath, `- **${asset.name}** (${asset.id}.png): Skipped (already exists)\n`);
            results.skipped.push(asset.id);
          } else {
            // Update the summary file for success
            fs.appendFileSync(summaryPath, `- **${asset.name}** (${asset.id}.png): ✅ Generated at ${result.generatedAt}\n`);
            results.success.push(asset.id);
          }
        } else {
          // Update the summary file for failure
          fs.appendFileSync(summaryPath, `- **${asset.name}** (${asset.id}.png): ❌ Failed - ${result.error}\n`);
          results.failure.push(asset.id);
        }
        
        // Wait before processing the next image to avoid rate limits
        if (i < assets[category].length - 1) {
          log(`Waiting 5 seconds before processing next asset...`);
          await wait(5000);
        }
      }
    }
    
    // 6. Add summary section
    fs.appendFileSync(summaryPath, `
## Final Summary

Total assets processed: ${allAssets.length}
Successfully generated: ${results.success.length}
Failed generations: ${results.failure.length}
Skipped (already existed): ${results.skipped.length}

Completed at: ${new Date().toISOString()}
`);
    
    log(`Asset generation process completed. See summary at: ${summaryPath}`);
    
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