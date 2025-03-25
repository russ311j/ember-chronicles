import os
import sys
import json
from scipy.io.wavfile import write as write_wav

# Set environment variables for better performance and less VRAM usage
os.environ["SUNO_USE_SMALL_MODELS"] = "True"
os.environ["SUNO_OFFLOAD_CPU"] = "True"

# Import Bark after setting environment variables
try:
    from bark import SAMPLE_RATE, generate_audio, preload_models
except ImportError:
    print("Error: Bark is not installed. Please install with:")
    print("pip install git+https://github.com/suno-ai/bark.git")
    sys.exit(1)

def generate_audio_file(text_prompt, output_path, voice_preset=None):
    """
    Generate audio from text and save it to a file
    
    Parameters:
    - text_prompt: The text to convert to audio
    - output_path: Where to save the WAV file
    - voice_preset: Optional voice preset (e.g., "v2/en_speaker_6")
    
    Returns:
    - Path to the generated audio file
    """
    try:
        print(f"Generating audio for: {text_prompt}")
        print(f"Using voice preset: {voice_preset if voice_preset else 'None (random voice)'}")
        
        # Make sure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Preload models if needed
        preload_models()
        
        # Generate audio
        audio_array = generate_audio(text_prompt, history_prompt=voice_preset)
        
        # Save to file
        write_wav(output_path, SAMPLE_RATE, audio_array)
        
        print(f"Audio successfully saved to: {output_path}")
        return output_path
    
    except Exception as e:
        print(f"Error generating audio: {str(e)}")
        return None

if __name__ == "__main__":
    # Check arguments
    if len(sys.argv) < 3:
        print("Usage: python bark_wrapper.py <text_prompt> <output_path> [voice_preset]")
        sys.exit(1)
    
    text_prompt = sys.argv[1]
    output_path = sys.argv[2]
    voice_preset = sys.argv[3] if len(sys.argv) > 3 else None
    
    generate_audio_file(text_prompt, output_path, voice_preset) 