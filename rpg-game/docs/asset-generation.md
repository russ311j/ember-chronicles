# Asset Generation in GameX RPG

## IMPORTANT: Static Assets

**GameX RPG uses static image assets that should only be generated once.**

The game's images are **not** dynamically generated during gameplay. Instead, they are:
1. Pre-generated once using the appropriate generation method (ideally Flux AI)
2. Stored in the `media/images/generated` directory
3. Used as static assets by the game

## Preferred Image Generation Method

The preferred method for generating game assets is using **Flux AI**. The game is configured to use high-quality images generated by Flux AI's powerful image generation capabilities. However, due to authentication issues with the current Flux API key, we are temporarily using Canvas-generated images.

### Generating with Flux AI (Preferred)

Once you have a valid Flux API key:

```bash
# From the rpg-game directory
node scripts/generate-flux-images.js
```

### Generating with Canvas (Temporary Fallback)

If Flux AI is not available:

```bash
# From the rpg-game directory
node scripts/generate-static-canvas-images.js
```

## Required API Keys for Flux

To generate assets with Flux AI, you need a valid API key in your `.env` file:

```
# Flux AI API Key (required for Flux image generation)
FLUX_API_KEY=your_valid_flux_key_here
```

**IMPORTANT API KEY FORMAT NOTE:**
- The Flux API key should NOT include the 'flux_' prefix
- It should be in the format shown on your Flux AI dashboard
- If authentication issues persist, verify your API key at https://flux.ai/

## Available Static Images

The following images are pre-generated:

1. **Landing Page** (`landing_page.png`) - The game's welcome screen
2. **Main Menu Background** (`main_menu_background.png`) - Background for the main menu
3. **Character Creation Background** (`character_creation_background.png`) - Background for character creation
4. **Mysterious Letter** (`mysterious_letter.png`) - Quest item in the game
5. **Forest Path (Ghost)** (`forest_path_ghost.png`) - Forest scene with ghost
6. **Mountain Pass** (`mountain_pass.png`) - Mountain crossing scene
7. **Village Tavern** (`village_tavern.png`) - Interior of the village tavern

## Implementation Details

The game is designed to:

1. **Always** use static pre-generated images first
2. Fall back to cached images if static images aren't available
3. Only attempt API generation as a last resort (not recommended for production)

This approach ensures:
- Consistent visual experience
- No API costs during normal gameplay
- Faster loading times
- No dependency on external services during gameplay

## Troubleshooting

If you're seeing placeholder or low-quality images:

1. Check if the static images exist in `media/images/generated/`
2. Verify your Flux API key is correct in the root `.env` file
   - Check that it's in the correct format (no 'flux_' prefix)
   - Ensure the API key is valid and active
3. If Flux API is not working, regenerate images using Canvas as a temporary fallback
4. Check the server console for error messages

## Flux API Integration Errors

If you encounter 401 Unauthorized errors with Flux API:
1. Verify your API key on the Flux AI dashboard
2. Make sure there are no spaces or special characters in the key
3. Try regenerating a new API key from your Flux AI account
4. Check that no prefix is being added to the API key

## Important Note for Developers

Never modify the game to dynamically generate images during normal gameplay. This will:
- Increase API costs
- Slow down the game
- Create inconsistent user experience
- Make the game dependent on external services

Instead, always use the pre-generated static images. 