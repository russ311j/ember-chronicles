const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const MAGIC_HOUR_API_KEY = process.env.MAGIC_HOUR_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../rpg-game/media/images/generated');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const portraits = [
  {
    id: 'title_page',
    prompt: 'Epic fantasy title page, medieval throne room with an ornate golden throne, ember crystals glowing with magical energy, dramatic lighting with rays of light through stained glass windows, dark fantasy oil painting style, professional digital art, intricate architectural details, painted look, fantasy game art style, 8K resolution'
  },
  {
    id: 'page_5',
    prompt: 'Fantasy adventurer preparing for journey, medieval marketplace scene, bustling with activity, merchants selling supplies and equipment, warm morning light, dark fantasy oil painting style, professional digital art, detailed environment and characters, painted look, fantasy game art style, 8K resolution'
  }
];

async function generatePortrait(portrait) {
  try {
    console.log(`Generating ${portrait.id}...`);
    
    // Create image generation project
    const createResponse = await axios.post('https://api.magichour.ai/v1/ai-image-generator', {
      image_count: 1,
      orientation: 'landscape',
      style: {
        prompt: portrait.prompt
      }
    }, {
      headers: {
        'Authorization': `Bearer ${MAGIC_HOUR_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!createResponse.data || !createResponse.data.id) {
      throw new Error('No project ID in response');
    }

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 20; // Maximum polling attempts (about 1 minute)

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Checking project status (attempt ${attempts}/${maxAttempts})...`);

      const statusResponse = await axios.get(`https://api.magichour.ai/v1/image-projects/${createResponse.data.id}`, {
        headers: {
          'Authorization': `Bearer ${MAGIC_HOUR_API_KEY}`
        }
      });

      if (statusResponse.data.status === 'complete') {
        console.log('Image generation complete!');
        if (statusResponse.data.downloads && statusResponse.data.downloads.length > 0) {
          const imageResponse = await axios.get(statusResponse.data.downloads[0].url, { responseType: 'arraybuffer' });
          const outputPath = path.join(OUTPUT_DIR, `${portrait.id}.png`);
          fs.writeFileSync(outputPath, imageResponse.data);
          console.log(`Successfully generated ${portrait.id}`);
          return true;
        } else {
          throw new Error('No download URLs in the complete response');
        }
      } else if (statusResponse.data.status === 'error') {
        throw new Error(`Image generation failed with status: ${statusResponse.data.status}`);
      } else {
        console.log(`Still processing (${statusResponse.data.status}), waiting 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    throw new Error(`Timed out after ${maxAttempts} attempts`);
  } catch (error) {
    console.error(`Error generating ${portrait.id}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function generateAllPortraits() {
  for (const portrait of portraits) {
    await generatePortrait(portrait);
    // Wait 5 seconds between generations to avoid rate limits
    if (portrait !== portraits[portraits.length - 1]) {
      console.log('Waiting 5 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

generateAllPortraits(); 