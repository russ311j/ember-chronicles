/**
 * Sound Asset Generator for Ember Throne Chronicles
 * 
 * This script generates sound effects, music, and voice narration using ElevenLabs API
 * and stores them as static assets in the media/audio directory.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables from the rpg-game directory
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Define audio directories
const MUSIC_DIR = path.resolve(__dirname, '../media/audio/music');
const SFX_DIR = path.resolve(__dirname, '../media/audio/sfx');
const AMBIENT_DIR = path.resolve(__dirname, '../media/audio/ambient');
const VOICE_DIR = path.resolve(__dirname, '../media/audio/voice');

// Ensure directories exist
for (const dir of [MUSIC_DIR, SFX_DIR, AMBIENT_DIR, VOICE_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Add log file creation
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created log directory: ${logDir}`);
}
const logFile = path.join(logDir, 'sound-generation-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
}

// Define voice narration text to generate
const voiceNarrations = [
  {
    id: 'intro_narration',
    text: "Welcome to The Ember Throne Chronicles, a tale of mystery and adventure. In the quiet village of Oakvale, an unexpected letter arrives, bearing an ancient symbol and a desperate plea for help.",
    voice_id: "yoZ06aMxZJJ28mfd3POQ" // Example ElevenLabs voice ID
  },
  {
    id: 'village_elder_greeting',
    text: "Ah, young one. I've been expecting you. The letter you hold bears an ancient seal, one I haven't seen in decades. The Ember Throne calls to you, as it once called to your mentor.",
    voice_id: "pNInz6obpgDQGcFmaJgB" // Female elder voice
  },
  {
    id: 'mysterious_messenger',
    text: "The path you seek lies beyond the northern woods, through the mountain pass. Few return from that journey. Are you certain you wish to proceed?",
    voice_id: "jBpfuIE2acCO8z3wKNLl" // Male mysterious voice
  }
];

// Define sound effects to generate
const soundEffects = [
  { id: 'button_click', description: 'UI button click, soft and pleasant' },
  { id: 'page_turn', description: 'Paper page turning sound, old book' },
  { id: 'item_pickup', description: 'Fantasy item pickup sound with slight magical shimmer' },
  { id: 'door_open', description: 'Heavy wooden door opening with slight creak' },
  { id: 'footsteps', description: 'Footsteps on stone path, medium pace' },
  { id: 'magic_spell', description: 'Magical spell casting with energy build-up and release' },
  { id: 'sword_slash', description: 'Quick sword slash through air' },
  { id: 'treasure_found', description: 'Treasure discovery fanfare, short and triumphant' }
];

// Define ambient sounds to generate
const ambientSounds = [
  { id: 'forest_ambience', description: 'Deep forest ambience with birds, rustling leaves, and distant animal calls' },
  { id: 'village_ambience', description: 'Medieval village ambient sounds with distant chatter, animals, and light activity' },
  { id: 'cave_ambience', description: 'Deep echoing cave with water drops and distant rumbles' },
  { id: 'temple_ambience', description: 'Ancient temple with subtle magical hums and distant whispers' },
  { id: 'mountain_wind', description: 'High mountain wind howling through rocky peaks' }
];

// Define music tracks to generate
const musicTracks = [
  { id: 'title_theme', description: 'Epic fantasy title theme with strings and choir, mysterious and inviting' },
  { id: 'village_theme', description: 'Peaceful medieval village theme with flutes and strings' },
  { id: 'forest_theme', description: 'Mysterious forest exploration theme with woodwinds and light percussion' },
  { id: 'mountain_theme', description: 'Grand mountain journey theme with soaring strings and horns' },
  { id: 'temple_theme', description: 'Ancient mystical temple theme with ethereal pads and choir' },
  { id: 'battle_theme', description: 'Intense battle music with driving percussion and brass' },
  { id: 'victory_theme', description: 'Triumphant short victory fanfare' },
  { id: 'game_over', description: 'Somber game over theme with minor chords and fading melody' }
];

// Get the ElevenLabs API key
function getElevenLabsToken() {
  const token = process.env.ELEVENLABS_API_KEY;
  
  if (!token) {
    throw new Error('ELEVENLABS_API_KEY is missing from .env file');
  }
  
  log(`Using ElevenLabs API key: ${token.substring(0, 4)}...${token.substring(token.length - 4)}`);
  return token;
}

// Generate voice narration using ElevenLabs API
async function generateVoiceNarration(narration) {
  return new Promise((resolve, reject) => {
    log(`Generating voice narration: "${narration.id}" using ElevenLabs API...`);
    
    // Create output path
    const outputPath = path.join(VOICE_DIR, `${narration.id}.mp3`);
    
    // API request data
    const data = JSON.stringify({
      text: narration.text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    });
    
    // Set up request options
    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${narration.voice_id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': getElevenLabsToken(),
        'Content-Length': data.length
      }
    };
    
    log(`Making API request to ElevenLabs for narration: ${narration.id}`);
    
    // Make request
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        // Create file write stream
        const file = fs.createWriteStream(outputPath);
        
        res.pipe(file);
        
        file.on('finish', () => {
          file.close();
          log(`✅ Successfully generated voice narration: ${narration.id}`);
          resolve(outputPath);
        });
        
        file.on('error', (err) => {
          fs.unlink(outputPath, () => {}); // Delete the file if an error occurs
          log(`Error saving voice narration: ${err.message}`);
          reject(err);
        });
      } else {
        // Handle API error
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          log(`Error generating voice narration. Status: ${res.statusCode}`);
          log(`Response: ${data}`);
          reject(new Error(`ElevenLabs API returned status ${res.statusCode}`));
        });
      }
    });
    
    req.on('error', (err) => {
      log(`Error making request to ElevenLabs: ${err.message}`);
      reject(err);
    });
    
    req.write(data);
    req.end();
  });
}

// Function to create placeholder files
// In a production environment, you would integrate with actual audio generation APIs
function createPlaceholderAudio(folder, id, description) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(folder, `${id}.mp3`);
    
    // Create a placeholder MP3 file
    // In reality, you would fetch real generated audio
    
    // For demonstration purposes, we're creating an empty file with metadata
    const metadata = {
      id: id,
      description: description,
      createdAt: new Date().toISOString(),
      placeholder: true
    };
    
    fs.writeFile(outputPath, JSON.stringify(metadata, null, 2), (err) => {
      if (err) {
        log(`Error creating placeholder for ${id}: ${err.message}`);
        reject(err);
        return;
      }
      
      log(`Created placeholder for ${id} at ${outputPath}`);
      resolve(outputPath);
    });
  });
}

// Generate all assets
async function generateAllSoundAssets() {
  log('Starting sound asset generation process...');
  
  const results = {
    success: [],
    failed: []
  };
  
  try {
    // Generate voice narrations using ElevenLabs API
    // Uncomment when ready to use actual API
    /*
    for (const narration of voiceNarrations) {
      try {
        const outputPath = await generateVoiceNarration(narration);
        results.success.push({ type: 'voice', id: narration.id, path: outputPath });
      } catch (err) {
        log(`Failed to generate voice narration ${narration.id}: ${err.message}`);
        results.failed.push({ type: 'voice', id: narration.id, error: err.message });
        
        // Create placeholder instead
        try {
          const placeholderPath = await createPlaceholderAudio(
            VOICE_DIR, 
            narration.id, 
            `Voice narration: ${narration.text.substring(0, 50)}...`
          );
          log(`Created placeholder for voice narration: ${narration.id}`);
        } catch (placeholderErr) {
          log(`Failed to create placeholder for ${narration.id}: ${placeholderErr.message}`);
        }
      }
    }
    */
    
    // For development, create placeholder files for all assets
    
    // Voice narrations
    for (const narration of voiceNarrations) {
      try {
        const outputPath = await createPlaceholderAudio(
          VOICE_DIR, 
          narration.id, 
          `Voice narration: ${narration.text.substring(0, 50)}...`
        );
        results.success.push({ type: 'voice', id: narration.id, path: outputPath });
      } catch (err) {
        log(`Failed to create placeholder for ${narration.id}: ${err.message}`);
        results.failed.push({ type: 'voice', id: narration.id, error: err.message });
      }
    }
    
    // Sound effects
    for (const sfx of soundEffects) {
      try {
        const outputPath = await createPlaceholderAudio(SFX_DIR, sfx.id, sfx.description);
        results.success.push({ type: 'sfx', id: sfx.id, path: outputPath });
      } catch (err) {
        log(`Failed to create placeholder for ${sfx.id}: ${err.message}`);
        results.failed.push({ type: 'sfx', id: sfx.id, error: err.message });
      }
    }
    
    // Ambient sounds
    for (const ambient of ambientSounds) {
      try {
        const outputPath = await createPlaceholderAudio(AMBIENT_DIR, ambient.id, ambient.description);
        results.success.push({ type: 'ambient', id: ambient.id, path: outputPath });
      } catch (err) {
        log(`Failed to create placeholder for ${ambient.id}: ${err.message}`);
        results.failed.push({ type: 'ambient', id: ambient.id, error: err.message });
      }
    }
    
    // Music tracks
    for (const track of musicTracks) {
      try {
        const outputPath = await createPlaceholderAudio(MUSIC_DIR, track.id, track.description);
        results.success.push({ type: 'music', id: track.id, path: outputPath });
      } catch (err) {
        log(`Failed to create placeholder for ${track.id}: ${err.message}`);
        results.failed.push({ type: 'music', id: track.id, error: err.message });
      }
    }
    
  } catch (err) {
    log(`Error during sound generation: ${err.message}`);
  }
  
  // Generate summary report
  log('\n=== SOUND GENERATION SUMMARY ===');
  log(`Total assets: ${voiceNarrations.length + soundEffects.length + ambientSounds.length + musicTracks.length}`);
  log(`Successfully generated/placeholder: ${results.success.length}`);
  log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    log('\nFailed assets:');
    results.failed.forEach(item => {
      log(`- ${item.type}/${item.id}: ${item.error}`);
    });
  }
  
  // Create documentation file
  const docsPath = path.join(path.resolve(__dirname, '../media/audio'), 'README.md');
  const docsContent = `# Audio Assets for Ember Throne Chronicles

These sound assets are for the interactive game "The Ember Throne Chronicles".

## Asset Types

### Voice Narrations
${voiceNarrations.map(n => `- **${n.id}**: ${n.text.substring(0, 100)}...`).join('\n')}

### Sound Effects
${soundEffects.map(s => `- **${s.id}**: ${s.description}`).join('\n')}

### Ambient Sounds
${ambientSounds.map(a => `- **${a.id}**: ${a.description}`).join('\n')}

### Music Tracks
${musicTracks.map(m => `- **${m.id}**: ${m.description}`).join('\n')}

## Generation Information
- Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
- Total assets: ${voiceNarrations.length + soundEffects.length + ambientSounds.length + musicTracks.length}
- Successfully generated: ${results.success.length}

## Usage

These assets are loaded by the game's sound manager system. See \`rpg-game/js/sound-manager.js\` for usage.

## Next Steps

1. Replace placeholder files with actual generated audio when available
2. These placeholder files describe the intended audio but don't contain actual sound data
3. Integrate with appropriate audio generation services to create the final assets
`;

  fs.writeFileSync(docsPath, docsContent);
  log(`\nDocumentation written to: ${docsPath}`);
  
  // Close the log stream properly and wait for it to finish
  return new Promise((resolve) => {
    log('\nSound generation process complete!');
    logStream.end();
    logStream.on('finish', () => {
      console.log('Log stream closed successfully');
      resolve();
    });
  });
}

// Run the generator
generateAllSoundAssets()
  .then(() => {
    console.log('Sound generation completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error during sound generation:');
    console.error(err.message);
    process.exit(1);
  }); 