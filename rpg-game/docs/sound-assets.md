# Sound Asset Documentation for Ember Throne Chronicles

This document provides a complete reference for all sound assets used in "The Ember Throne Chronicles" game, including implementation details and best practices.

## Asset Categories

The game uses four main categories of sound assets:

### 1. Background Music
Background music tracks that play during specific game contexts:

| ID | Description | Usage Context |
|----|-------------|--------------|
| `title_theme` | Epic fantasy title theme | Main menu, title screen |
| `village_theme` | Peaceful medieval village theme | Village scenes (Oakvale) |
| `forest_theme` | Mysterious forest exploration theme | Forest exploration |
| `mountain_theme` | Grand mountain journey theme | Mountain pass scenes |
| `temple_theme` | Ancient mystical temple theme | Temple and ruins |
| `battle_theme` | Intense battle music | Combat encounters |
| `victory_theme` | Triumphant short victory fanfare | After successful combat |
| `game_over` | Somber game over theme | Player defeat |

### 2. Sound Effects (SFX)
Short sounds that provide feedback for player actions and events:

| ID | Description | Usage |
|----|-------------|-------|
| `button_click` | UI button click | Menu interactions |
| `page_turn` | Paper page turning sound | Story page transitions |
| `item_pickup` | Fantasy item pickup sound | When acquiring items |
| `door_open` | Heavy wooden door opening | Entering new locations |
| `footsteps` | Footsteps on stone path | Movement animations |
| `magic_spell` | Magical spell casting | Using magical abilities |
| `sword_slash` | Quick sword slash | Combat actions |
| `treasure_found` | Treasure discovery fanfare | Finding valuable items |

### 3. Ambient Sounds
Looping environmental sounds that establish atmosphere:

| ID | Description | Usage |
|----|-------------|-------|
| `forest_ambience` | Deep forest sounds | Forest scenes |
| `village_ambience` | Medieval village sounds | Village scenes |
| `cave_ambience` | Echoing cave with water drops | Cave and dungeon scenes |
| `temple_ambience` | Ancient temple with magical hums | Ancient temple scenes |
| `mountain_wind` | High mountain wind | Mountain pass scenes |

### 4. Voice Narration
Narrative voice-overs for key story moments:

| ID | Description | Script |
|----|-------------|--------|
| `intro_narration` | Game introduction | "Welcome to The Ember Throne Chronicles, a tale of mystery and adventure..." |
| `village_elder_greeting` | Village elder | "Ah, young one. I've been expecting you. The letter you hold bears an ancient seal..." |
| `mysterious_messenger` | Mysterious figure | "The path you seek lies beyond the northern woods, through the mountain pass..." |

## Implementation

### Asset Loading

The sound assets are loaded by the `SoundManager` module located in `rpg-game/js/sound-manager.js`. The loading process works as follows:

1. The `AssetLoader` calls the `SoundManager.preloadEmberThroneSounds()` method at game initialization.
2. The sound assets are categorized and mapped in the `soundAssetMap` property.
3. Each asset is loaded asynchronously with appropriate error handling.

Example loading code:
```javascript
// From sound-manager.js
preloadEmberThroneSounds: function() {
  // Load critical UI sounds first
  this.preloadSound('button_click', this.soundAssetMap.sfx.button_click);
  this.preloadSound('page_turn', this.soundAssetMap.sfx.page_turn);
  
  // Then load main themes
  this.preloadSound('title_theme', this.soundAssetMap.music.title_theme);
  // ...and so on
}
```

### Playing Sounds

To play a sound in the game, use the appropriate `SoundManager` method:

```javascript
// Play a one-shot sound effect
GameX.SoundManager.playSound('button_click');

// Play background music with looping
GameX.SoundManager.playMusic('village_theme', {loop: true});

// Play ambient sound
GameX.SoundManager.playAmbient('forest_ambience', {volume: 0.5});

// Play voice narration
GameX.SoundManager.playVoice('intro_narration');
```

### Integration with Story System

The `StorySystem` module automatically plays appropriate sounds when displaying new story pages:

1. Scene-specific music based on location
2. Ambient sounds based on environment
3. Voice narration when available for the scene
4. UI sounds for page turns and choice selection

### Volume Control

The game includes a volume control system with separate channels:

- Master Volume: Controls overall game volume
- Music Volume: Controls background music
- SFX Volume: Controls sound effects
- Voice Volume: Controls voice narration
- Ambient Volume: Controls ambient sounds

These settings are saved in the player's preferences.

## Best Practices

1. **Preload Critical Sounds**: Always preload UI sounds and frequently used SFX during initial loading.
2. **Fade Transitions**: Use fade in/out when transitioning between music tracks.
3. **Fallbacks**: Provide fallbacks for when sound assets fail to load.
4. **Volume Levels**: Normalize volume levels across assets to prevent jarring volume jumps.
5. **Mobile Considerations**: Initialize audio only after user interaction on mobile devices.

## Development Workflow

1. **Sound Asset Generation**: Use the `sound-generator.js` script to generate placeholder or real sound assets:
   ```
   node scripts/sound-generator.js
   ```

2. **Testing Sounds**: Use the sound tester in the debug menu to preview all sounds before implementing them in the game.

3. **Adding New Sounds**: When adding new sounds:
   - Add the asset reference to `soundAssetMap` in `sound-manager.js`
   - Update the preloading function if it's a critical sound
   - Document the new sound in this documentation

## Future Improvements

Planned improvements for the sound system:

1. Dynamic music system with layered tracks that change based on game state
2. Positional audio for more immersive environmental sounds
3. Integration with Web Audio API for advanced audio processing
4. Additional character voices for dialogue
5. Adaptive music that responds to player choices and emotional tone 