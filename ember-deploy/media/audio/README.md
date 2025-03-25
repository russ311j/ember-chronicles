# Game Audio Assets

This directory contains all audio assets used in the game, organized by type:

## Directory Structure

- `voice/` - Character voices and narration
- `sfx/` - Sound effects (e.g., spells, doors, combat)
- `ambient/` - Background environmental sounds
- `music/` - Game music (themes, battle music, etc.)

## Audio Generation

Most audio assets are generated using AI tools:

1. **Voice Narration** - Generated using either:
   - ElevenLabs API (high quality, character-specific)
   - Bark (more flexible, handles non-speech sounds)

2. **Sound Effects** - Generated using Bark's versatile audio generation capabilities

3. **Ambient Sounds** - Generated using Bark's environmental sound creation

4. **Music** - Generated using Bark's music capabilities (for short themes/motifs)

## Tools and Scripts

To generate audio assets:

1. **Install Bark**:
   ```
   npm run install-bark
   ```

2. **Generate Audio**:
   ```
   npm run generate-audio
   ```

3. **Create Placeholders** (if Bark isn't available):
   ```
   npm run generate-audio-placeholders
   ```

## Usage in the Game

Audio assets are loaded by the SoundManager system, which handles:
- Background music playback
- Sound effect triggering
- Ambient sound management
- Voice-over narration

The system handles preloading and dynamic loading to optimize performance.
