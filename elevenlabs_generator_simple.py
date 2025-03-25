import requests
import os
import json
import datetime

# Variables
ELEVENLABS_API_KEY = 'sk_8b410baa7170bba2f1987f0f6353cd2758dd89a7e794bd4b'
OUTPUT_DIR = 'media/audio'
VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'  # Default voice
LOG_FILE = 'elevenlabs_generation_log.txt'

# Audio data to generate - just two simple examples
audio_data = [
    {
        "id": "intro_narration",
        "text": "Welcome to The Ember Throne Chronicles, a tale of mystery and adventure.",
        "dir": "voice"
    },
    {
        "id": "button_click",
        "text": "[soft click sound]",
        "dir": "sfx"
    }
]

# Create directories if they don't exist
for directory in ['voice', 'sfx', 'ambient', 'music']:
    os.makedirs(os.path.join(OUTPUT_DIR, directory), exist_ok=True)

# Initialize log file with header
with open(LOG_FILE, 'w') as f:
    f.write(f"=== ElevenLabs Audio Generation Log ===\n")
    f.write(f"Started at: {datetime.datetime.now()}\n\n")

# Log function
def log(message):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    formatted_message = f"[{timestamp}] {message}"
    print(formatted_message)
    with open(LOG_FILE, 'a') as f:
        f.write(formatted_message + "\n")

log('Starting ElevenLabs audio generation...')
log(f'Using API key: {ELEVENLABS_API_KEY[:4]}...{ELEVENLABS_API_KEY[-4:]}')
log(f'Voice ID: {VOICE_ID}')
log(f'Output directory: {os.path.abspath(OUTPUT_DIR)}')
log(f'Audio files to generate: {len(audio_data)}')

# Generate audio files
success_count = 0
failed_count = 0

for item in audio_data:
    output_path = os.path.join(OUTPUT_DIR, item["dir"], f"{item['id']}.mp3")
    log(f"Generating {item['id']} in {item['dir']}...")
    log(f"  Text: '{item['text']}'")
    log(f"  Output: {output_path}")
    
    try:
        response = requests.post(
            f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}',
            headers={
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            json={
                'text': item["text"],
                'model_id': 'eleven_monolingual_v1'
            },
            stream=True
        )
        
        log(f"  HTTP status: {response.status_code}")
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            file_size = os.path.getsize(output_path)
            log(f"✅ Successfully generated {item['id']} ({file_size} bytes)")
            success_count += 1
        else:
            try:
                error_text = response.text
            except:
                error_text = "Could not extract response text"
            error_msg = f'Error: HTTP {response.status_code}, {error_text}'
            log(f"❌ {error_msg}")
            failed_count += 1
    except Exception as e:
        log(f"❌ Exception generating {item['id']}: {str(e)}")
        failed_count += 1

# Write summary
log('\n=== GENERATION SUMMARY ===')
log(f'Total assets: {len(audio_data)}')
log(f'Successfully generated: {success_count}')
log(f'Failed: {failed_count}')
log('Audio generation process complete!') 