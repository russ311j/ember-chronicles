# The Ember Throne Chronicles

## Overview

The Ember Throne Chronicles is an interactive narrative experience within the GameX RPG framework. Players embark on a journey to discover the secrets of a mysterious invitation, navigate treacherous landscapes, and ultimately face the Guardian of the Ember Throne.

## Key Features

- **Branching Narrative**: Player choices directly impact story progression
- **Dice-Based Challenges**: Key encounters use dice mechanics for randomized outcomes
- **Character Development**: Player attributes affect available choices and outcomes
- **Multiple Endings**: Five distinct endings based on player decisions

## Running The Game

1. Start the GameX RPG server:
   ```
   cd rpg-game
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. From the main menu, select "The Ember Throne Chronicles" to begin your adventure.

## Documentation

The Ember Throne Chronicles includes comprehensive documentation to assist developers and content creators:

- [Story Outline](story-outline.md): The complete narrative structure with all branches and endings
- [Asset Registry](ember-throne-asset-registry.md): A detailed tracking system for all visual and audio assets

## Asset Generation

Game assets for The Ember Throne Chronicles are generated using the Stability AI API. To generate new assets:

1. Ensure your `.env` file contains a valid `STABILITY_API_KEY`.
2. Run the asset generation script:
   ```
   cd rpg-game
   node scripts/generate-stability-images.js
   ```

3. Generated images will be saved to the appropriate media directories.

## Development Roadmap

- **Phase 1**: Complete asset generation for all scenes
- **Phase 2**: Implement character customization with persistent sessions
- **Phase 3**: Add audio narration and sound effects
- **Phase 4**: Expand narrative branches and implement additional endings
- **Phase 5**: Integrate inventory system with unique items

## Technical Requirements

- Node.js 14+ for running the server
- Modern web browser (Chrome, Firefox, Edge recommended)
- 1024x768 minimum screen resolution for optimal experience

---

*The Ember Throne Chronicles is part of the GameX RPG project.* 