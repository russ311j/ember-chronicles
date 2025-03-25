import requests
import os
import json

# Variables
ELEVENLABS_API_KEY = 'sk_8b410baa7170bba2f1987f0f6353cd2758dd89a7e794bd4b'
OUTPUT_DIR = 'media/audio'
VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'  # Default voice

# Audio data to generate
audio_data = [
    {
        'id': 'intro_narration',
        'text': 'Welcome to The Ember Throne Chronicles, a tale of mystery and adventure.',
        'dir': 'voice'
    },
    {
        'id': 'village_elder_greeting',
        'text': 'Ah, young one. The Ember Throne calls to you, as it once called to your mentor.',
        'dir': 'voice'
    },
    {
        'id': 'mysterious_messenger',
        'text': 'The path you seek lies beyond the northern woods. Few return from that journey.',
        'dir': 'voice'
    },
    {
        'id': 'button_click',
        'text': '[soft click sound]',
        'dir': 'sfx'
    },
    {
        'id': 'page_turn',
        'text': '[page turning sound]',
        'dir': 'sfx'
    },
    {
        'id': 'item_pickup',
        'text': '[magical item pickup sound]',
        'dir': 'sfx'
    },
    {
        'id': 'door_open',
        'text': '[heavy door opening]',
        'dir': 'sfx'
    },
    {
        'id': 'footsteps',
        'text': '[footsteps on stone path]',
        'dir': 'sfx'
    },
    {
        'id': 'magic_spell',
        'text': '[magical spell casting with energy build-up and release]',
        'dir': 'sfx'
    },
    {
        'id': 'sword_slash',
        'text': '[quick sword slash through air]',
        'dir': 'sfx'
    },
    {
        'id': 'treasure_found',
        'text': '[short triumphant fanfare]',
        'dir': 'sfx'
    },
    {
        'id': 'forest_ambience',
        'text': '[forest ambient sounds with birds chirping and leaves rustling]',
        'dir': 'ambient'
    },
    {
        'id': 'village_ambience',
        'text': '[medieval village ambient sounds with distant chatter and animals]',
        'dir': 'ambient'
    },
    {
        'id': 'title_theme',
        'text': '[gentle fantasy music with strings and flute]',
        'dir': 'music'
    }
]

# Create directories if they don't exist
for directory in ['voice', 'sfx', 'ambient', 'music']:
    os.makedirs(os.path.join(OUTPUT_DIR, directory), exist_ok=True)

# Log function
def log(message):
    print(message)
    with open('elevenlabs_generation_log.txt', 'a') as f:
        f.write(message + '\n')

log('Starting ElevenLabs audio generation...')

# Generate audio files
success_count = 0
failed_count = 0

for item in audio_data:
    output_path = os.path.join(OUTPUT_DIR, item['dir'], f"{item['id']}.mp3")
    log(f"Generating {item['id']} in {item['dir']}...")
    
    try:
        response = requests.post(
            f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}',
            headers={
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            json={
                'text': item['text'],
                'model_id': 'eleven_monolingual_v1'
            },
            stream=True
        )
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            log(f"✅ Successfully generated {item['id']}")
            success_count += 1
        else:
            error_msg = f'Error: HTTP {response.status_code}, {response.text}'
            log(error_msg)
            failed_count += 1
    except Exception as e:
        log(f"Exception generating {item['id']}: {str(e)}")
        failed_count += 1

# Write summary
log('\n=== GENERATION SUMMARY ===')
log(f'Total assets: {len(audio_data)}')
log(f'Successfully generated: {success_count}')
log(f'Failed: {failed_count}')
log('Audio generation process complete!') 