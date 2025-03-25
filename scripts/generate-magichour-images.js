console.log('Creating Magic Hour script...');
/**
 * Game Asset Generator using Magic Hour API
 * 
 * This script generates high-quality game assets for The Ember Throne Chronicles
 * using the Magic Hour API and stores them as static assets in the media/images/generated directory.
 * 
 * Based on documentation from: https://docs.magichour.ai/integration/adding-api-to-your-app
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Load environment variables from the rpg-game directory
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });
console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.includes('API')));
console.log('MAGIC_HOUR_API_KEY exists:', !!process.env.MAGIC_HOUR_API_KEY);
if (process.env.MAGIC_HOUR_API_KEY) {
  const apiKey = process.env.MAGIC_HOUR_API_KEY;
  console.log('MAGIC_HOUR_API_KEY value:', apiKey === 'your_magic_hour_api_key_here' ? 'Default placeholder (needs to be replaced)' : 'Valid key provided');
}

// Define the assets to generate with fantasy RPG prompts
const assets = [
  {
    id: 'page_1',
    name: 'Page 1 - A Mysterious Invitation',
    prompt: 'Fantasy village at twilight, hooded figure at door, mysterious envelope with burning phoenix and serpent wax seal, magical symbols, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_2',
    name: 'Page 2 - Bold Acceptance',
    prompt: 'Character breaking wax seal on ancient parchment, reading elegantly written letter about the Ember Throne relic, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_3',
    name: 'Page 3 - Inquisitive Investigation',
    prompt: 'Character examining cryptic letter with intricate script and enigmatic symbols, faded ink, candlelight, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_4',
    name: 'Page 4 - Seeking Counsel',
    prompt: 'Wise village elder in cozy cottage with incense and herbs, listening to character showing mysterious letter, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_5',
    name: 'Page 5 - Preparation for Journey',
    prompt: 'Character at fork in road with three paths - dark forest, rocky mountain trail, and clearing for camping, night sky, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_6',
    name: 'Page 6 - The Dark Forest Path',
    prompt: 'Mysterious dark forest with thick canopy, slivers of moonlight, eerie shadows, twisted path, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_7',
    name: 'Page 7 - The Rocky Trail',
    prompt: 'Rocky mountain trail bathed in moonlight, distant ancient ruins, craggy outcrop, open night sky, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_8',
    name: 'Page 8 - A Moment of Rest',
    prompt: 'Small campfire in clearing surrounded by ancient trees, dancing shadows, starry night sky, character resting, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_9',
    name: 'Page 9 - Arrival at the Dungeon Entrance',
    prompt: 'Colossal ancient dungeon entrance with eldritch runes, imposing deity statues flanking massive arched gateway, radiant energy, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_10',
    name: 'Page 10 - Forcing the Gate',
    prompt: 'Character pushing against massive stone gate with magical sparks flying, ancient mechanisms awakening, raw magic surging, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_11',
    name: 'Page 11 - Searching for a Hidden Passage',
    prompt: 'Character discovering narrow hidden passage in intricately carved dungeon wall, subtle seam, secret corridor entrance, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_12',
    name: 'Page 12 - Disarming the Traps',
    prompt: 'Character carefully disarming magical traps and runes on dungeon entrance, steady hands, glowing enchantments, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_13',
    name: 'Page 13 - Inside the Dungeon',
    prompt: 'Dark dungeon interior with twisting corridors, cryptic wall inscriptions, fork in passage, cool damp air, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_14',
    name: 'Page 14 - The Left Corridor',
    prompt: 'Narrow dungeon corridor with enchanted torches, shifting light patterns on ancient stone walls, magical glow, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_15',
    name: 'Page 15 - The Right Corridor',
    prompt: 'Wide dark dungeon corridor shrouded in shadows, dripping water, ominous echoes, mysterious atmosphere, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_16',
    name: 'Page 16 - Investigating Unusual Sounds',
    prompt: 'Magical alcove with ethereal musical notes visible in air, ancient incense, magical shimmer, stone echoing chamber, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_17',
    name: 'Page 17 - Encounter with the Guardian',
    prompt: 'Grand chamber with towering guardian made of living stone, fierce glowing eyes, primordial energy, imposing columns with cryptic inscriptions, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_18',
    name: 'Page 18 - The Attack',
    prompt: 'Character battling towering stone guardian, fierce combat, clashing weapons, magical energy surging, ancient chamber, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_19',
    name: 'Page 19 - Attempting to Parley',
    prompt: 'Character diplomatically speaking to massive stone guardian, respectful stance, guardian\'s features softening, tension-filled chamber, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_20',
    name: 'Page 20 - Scouting for Weaknesses',
    prompt: 'Character stealthily observing stone guardian from distance, studying vulnerabilities, hidden in shadows, analyzing ancient form, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_21',
    name: 'Page 21 - Revelation of the Ember Throne',
    prompt: 'Magnificent Ember Throne glowing with otherworldly energy, carved with ancient wisdom symbols, vibrating elemental power, grand chamber, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_22',
    name: 'Page 22 - Healing the Realm',
    prompt: 'Character placing hands on Ember Throne, benevolent warm light flowing through body, healing energy spreading across chamber, hopeful expression, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_23',
    name: 'Page 23 - Dark Ambition',
    prompt: 'Character absorbing dark energy from Ember Throne, deep red ominous glow, shadowy power coursing through veins, seductive strength, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_24',
    name: 'Page 24 - The Destruction',
    prompt: 'Character shattering the Ember Throne, fragments scattering across chamber, explosive energy release, determined expression, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'page_25',
    name: 'Page 25 - Epilogue & Consequences',
    prompt: 'Panoramic view of transformed fantasy realm of Eldoria, character overlooking from high precipice, changed landscape based on choices, destiny fulfilled, fantasy RPG game art, professional quality, cohesive game art style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  },
  {
    id: 'title_page',
    name: 'Title Page - The Ember Throne Chronicles',
    prompt: 'Epic fantasy game title page, "The Ember Throne Chronicles", ornate magical throne with burning embers, phoenix and serpent symbols, fantasy RPG game art, professional quality, book cover style',
    width: 1024,
    height: 768,
    style: 'fantasy'
  }
];

// Ensure output directories exist
const outputDir = path.resolve(__dirname, '../media/images/generated');
const magicHourDir = path.join(outputDir, 'magichour');
const logDir = path.resolve(__dirname, '../logs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

if (!fs.existsSync(magicHourDir)) {
  fs.mkdirSync(magicHourDir, { recursive: true });
  console.log(`Created Magic Hour directory: ${magicHourDir}`);
}

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created log directory: ${logDir}`);
}

const logFile = path.join(logDir, 'magichour-image-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
}

// Get the Magic Hour API token
function getMagicHourApiKey() {
  const apiKey = process.env.MAGIC_HOUR_API_KEY;
  
  if (!apiKey || apiKey === 'your_magic_hour_api_key_here') {
    throw new Error('MAGIC_HOUR_API_KEY is missing or has default value in .env file. Please update with your actual API key.');
  }
  
  log(`Using Magic Hour API key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  return apiKey;
}

// Function to generate an image using Magic Hour API
async function generateWithMagicHour(asset) {
  return new Promise(async (resolve, reject) => {
    try {
      log(`Generating "${asset.name}" using Magic Hour API...`);
      
      const apiKey = getMagicHourApiKey();
      const { name, prompt, width, height, style } = asset;
      
      // Log the prompt
      log(`Prompt: ${prompt}`);
      
      // According to Magic Hour docs, make a POST request to their API
      const response = await fetch('https://api.magichour.ai/api/v1/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: "blurry, text, watermark, signature, bad quality",
          width: width,
          height: height,
          model: "masterpiece", // Use masterpiece or stylize models as suggested in docs
          style_preset: style || "fantasy"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        log(`Error generating ${name}: HTTP ${response.status}`);
        log(`API Error: ${errorText}`);
        reject(new Error(`API returned status ${response.status} for ${name}`));
        return;
      }
      
      const data = await response.json();
      log('API Response received successfully');
      
      if (data.images && data.images.length > 0) {
        const imageUrl = data.images[0].url;
        log(`Image URL: ${imageUrl}`);
        
        // Download the image
        const outputPath = await downloadImage(imageUrl, asset.id);
        log(`✅ Successfully generated and saved ${name}: ${outputPath}`);
        resolve(outputPath);
      } else {
        log(`Unexpected response format for ${name}`);
        log('API response: ' + JSON.stringify(data, null, 2));
        reject(new Error(`Unexpected response format for ${name}`));
      }
    } catch (error) {
      log(`Error with generation for ${asset.name}: ${error.message}`);
      reject(error);
    }
  });
}

// Function to download an image from a URL
async function downloadImage(url, id) {
  return new Promise((resolve, reject) => {
    // Save to both Magic Hour directory and main output directory
    const magicHourPath = path.join(magicHourDir, `${id}.png`);
    const mainOutputPath = path.join(outputDir, `${id}.png`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(magicHourPath);
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        
        // Copy to main output directory
        fs.copyFile(magicHourPath, mainOutputPath, (err) => {
          if (err) {
            reject(new Error(`Failed to copy image to main directory: ${err.message}`));
            return;
          }
          resolve(mainOutputPath);
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(magicHourPath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to wait for a specified duration
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate all assets
async function generateAllAssets() {
  log('Starting image generation process with Magic Hour API...');
  
  try {
    // Validate that we have a valid API key
    getMagicHourApiKey();
  } catch (e) {
    log(e.message);
    process.exit(1);
  }
  
  log(`Generating ${assets.length} images...`);
  
  const results = {
    success: [],
    failed: []
  };
  
  // Generate images sequentially to avoid rate limits
  for (const asset of assets) {
    try {
      const filePath = await generateWithMagicHour(asset);
      results.success.push({ id: asset.id, path: filePath });
      
      // Wait between requests to avoid rate limits
      log('Waiting 3 seconds before next request...');
      await wait(3000);
    } catch (error) {
      log(`Failed to generate ${asset.name}: ${error.message}`);
      results.failed.push({ id: asset.id, error: error.message });
      
      // Wait a bit longer if there was an error
      log('Error occurred, waiting 5 seconds before next request...');
      await wait(5000);
    }
  }
  
  // Write summary report
  log('\n=== GENERATION SUMMARY ===');
  log(`Total: ${assets.length}`);
  log(`Successful: ${results.success.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(item => {
      log(`- ${item.id}: ${item.error}`);
    });
  }
  
  if (results.success.length > 0) {
    // Create documentation in the images folder
    const docsPath = path.join(outputDir, 'README.md');
    const docsContent = `# Game Assets Generated With Magic Hour API
  
## Generated Images

These images were generated using Magic Hour API on ${new Date().toLocaleDateString()}.

**IMPORTANT: These images are static assets and should not be regenerated during normal gameplay.**

To regenerate these images (only if needed for design updates):
1. Run \`node scripts/generate-magichour-images.js\` from the rpg-game directory
2. Ensure your \`.env\` file contains a valid MAGIC_HOUR_API_KEY

## Available Images

${assets.map(asset => `- **${asset.name}** (\`${asset.id}.png\`): ${asset.prompt.substring(0, 50)}...`).join('\n')}

## Usage

These images are automatically loaded by the game. Do not modify the filenames.
`;

    fs.writeFileSync(docsPath, docsContent);
    log(`\nDocumentation written to: ${docsPath}`);
  }
  
  log('\nImage generation process complete!');
  
  // Close the log stream
  logStream.end();
}

// Run the generator
generateAllAssets().catch(err => {
  log('Fatal error during image generation:');
  log(err.message);
  process.exit(1);
});