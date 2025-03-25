# GameX RPG

A browser-based role-playing game featuring character creation, inventory management, and an immersive fantasy storyline.

## Quick Start

There are two ways to run GameX RPG:

### Option 1: Direct Browser Access
1. Start the server by running `npm start` from the project root
2. Open your browser and navigate to `http://localhost:3000`
3. Create a new character and begin your adventure!

### Option 2: VS Code Debugging (Recommended)
1. Open the project in VS Code using the `gamex.code-workspace` file
2. Press F5 or click the "Run and Debug" icon in the sidebar
3. Select "Server + Chrome" from the dropdown menu
4. Click the green play button to start both the server and Chrome browser automatically

## Project Structure

The project has been reorganized for better maintainability. For complete details, see [Project Structure Documentation](docs/PROJECT-STRUCTURE.md).

- `js/` - Game JavaScript modules
  - Core engine files and game systems
- `media/` - Game assets
  - Audio, images, and fonts
- `scripts/` - Utility scripts (organized by purpose)
  - `asset-generation/` - Image generation scripts
  - `audio/` - Audio generation scripts 
  - `utils/` - Utility scripts
  - `deployment/` - Deployment scripts

## Development

### Starting the Server

Run the development server with auto-reload:
```
npm run dev
```

Or run the standard server:
```
npm start
```

### Alternative Server Method

If you encounter issues with the main server or prefer to use a simple HTTP server:

```bash
npx http-server . -p 8080
```

If port 8080 is already in use, try using a different port:

```bash
npx http-server . -p 8081
```

### Repository Management

For details on Git repository setup, authentication, and troubleshooting, please refer to our comprehensive [Repository Guide](../docs/repository-guide.md).

### Asset Generation

#### Image Generation
- Run `npm run generate-images` to generate all game image assets using Stability API
- Run `npm run generate-aiml-images` to use AIML API instead
- Run `npm run generate-flux-images` to use Flux API instead
- Run `npm run generate-magichour-images` to use Magic Hour API instead
- Ensure your `.env` file contains valid API keys
- Generated images are stored in `media/images/generated/`

#### Sound Generation (Using ElevenLabs)
- Run `npm run generate-sounds` to generate all game sound effects and voice lines
- Ensure your `.env` file contains a valid ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID
- Generated audio files are stored in `media/audio/`

### Debugging

The project includes VS Code launch configurations for:
- Server: Runs the Node.js server with debugging
- Chrome: Opens Chrome with the debugger attached
- Server + Chrome: Runs both simultaneously (recommended)

## Game Features

- **Streamlined Character Creation**: Begin your adventure immediately with a pre-configured warrior character, or use the character creation system to customize your hero
- **Inventory System**: Collect and use items as you progress through your adventure
- **Combat System**: Engaging combat with dice rolls and strategic decisions
- **Save/Load System**: Save your progress and continue your adventure later
- **Immersive Story**: Explore a rich fantasy world with branching narratives

## License

This project is licensed under the ISC License.

Copyright (c) 2025 GameX RPG

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies. 