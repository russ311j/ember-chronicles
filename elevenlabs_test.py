import requests

response = requests.post(
    'https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9',
    headers={
        'xi-api-key': 'sk_8b410baa7170bba2f1987f0f6353cd2758dd89a7e794bd4b',
        'Content-Type': 'application/json'
    },
    json={
        'text': 'Welcome to The Ember Throne Chronicles',
        'model_id': 'eleven_monolingual_v1'
    },
    stream=True
)

with open('media/audio/test-bark/eleven_test.mp3', 'wb') as f:
    for chunk in response.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
    
print('Saved audio to media/audio/test-bark/eleven_test.mp3') 