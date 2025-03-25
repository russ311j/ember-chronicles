/**
 * Sound Generation Script
 * Generates sound effects and voice lines using ElevenLabs API
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const OUTPUT_DIR = path.join(__dirname, '../media/audio');

// Sound effects to generate
const soundEffects = [
    {
        id: 'click',
        text: 'Click',
        type: 'sfx',
        options: { stability: 0.3, similarityBoost: 0.5 }
    },
    {
        id: 'hover',
        text: 'Hover',
        type: 'sfx',
        options: { stability: 0.3, similarityBoost: 0.5 }
    },
    {
        id: 'success',
        text: 'Success',
        type: 'sfx',
        options: { stability: 0.3, similarityBoost: 0.5 }
    },
    {
        id: 'failure',
        text: 'Failure',
        type: 'sfx',
        options: { stability: 0.3, similarityBoost: 0.5 }
    },
    {
        id: 'combat',
        text: 'Combat',
        type: 'sfx',
        options: { stability: 0.3, similarityBoost: 0.5 }
    },
    {
        id: 'level_up',
        text: 'Level Up',
        type: 'sfx',
        options: { stability: 0.3, similarityBoost: 0.5 }
    }
];

// Voice lines to generate
const voiceLines = [
    {
        id: 'welcome',
        text: 'Welcome to the game, adventurer!',
        type: 'voice',
        options: { stability: 0.5, similarityBoost: 0.75 }
    },
    {
        id: 'level_up',
        text: 'Congratulations! You have leveled up!',
        type: 'voice',
        options: { stability: 0.5, similarityBoost: 0.75 }
    },
    {
        id: 'game_over',
        text: 'Game Over. Better luck next time!',
        type: 'voice',
        options: { stability: 0.5, similarityBoost: 0.75 }
    }
];

/**
 * Generate audio using ElevenLabs API
 */
async function generateAudio(text, options = {}) {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: options.stability || 0.5,
                    similarity_boost: options.similarityBoost || 0.75
                }
            })
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.statusText}`);
        }

        const buffer = await response.buffer();
        return buffer;
    } catch (error) {
        console.error('Failed to generate audio:', error);
        return null;
    }
}

/**
 * Save audio file
 */
async function saveAudio(buffer, filename) {
    const filepath = path.join(OUTPUT_DIR, filename);
    await fs.promises.writeFile(filepath, buffer);
    console.log(`Saved: ${filename}`);
}

/**
 * Main function to generate all sounds
 */
async function generateAllSounds() {
    // Create output directories if they don't exist
    await fs.promises.mkdir(path.join(OUTPUT_DIR, 'sfx'), { recursive: true });
    await fs.promises.mkdir(path.join(OUTPUT_DIR, 'voice'), { recursive: true });

    // Generate sound effects
    for (const sound of soundEffects) {
        const buffer = await generateAudio(sound.text, sound.options);
        if (buffer) {
            await saveAudio(buffer, `${sound.type}/${sound.id}.mp3`);
        }
    }

    // Generate voice lines
    for (const line of voiceLines) {
        const buffer = await generateAudio(line.text, line.options);
        if (buffer) {
            await saveAudio(buffer, `${line.type}/${line.id}.mp3`);
        }
    }
}

// Run the script
generateAllSounds().catch(console.error); 