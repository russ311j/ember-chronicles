# Flux AI Integration for GameX RPG

This document provides instructions for properly configuring and using the Flux AI API for generating high-quality game assets.

## Overview

GameX RPG uses static image assets to create a rich visual experience. These assets should be generated only once during development or when design changes are required. The preferred method for generating these assets is using the Flux AI API, which provides high-quality, artistic image generation.

## API Key Configuration

### AIML API (Recommended)

The most reliable way to use Flux is through the AIML API. To set this up:

1. Visit [https://aimlapi.com/app/billing/](https://aimlapi.com/app/billing/) to create an account
2. Subscribe to a paid plan (the free tier is limited to 512 tokens, which is insufficient for our prompts)
3. Generate an API key from your account dashboard
4. Add the API key to your `.env` file in the project root:

```
FLUX_API_KEY=your_api_key_here
```

**Important:** Do not include any prefix like 'flux_' in your API key.

### API Request Format

The correct format for AIML API requests:

```javascript
// API endpoint
const endpoint = 'https://api.aimlapi.com/v1/images/generations/';

// Request payload
const payload = {
  prompt: "Your detailed image prompt",
  model: "flux-pro"  // Use flux-pro for highest quality
};

// Headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};
```

## Available Models

The following Flux models are available through the AIML API:

- `flux-pro` - Highest quality, recommended for production assets
- `flux-pro/v1.1-ultra` - Ultra high-quality model
- `flux-realism` - Specialized for realistic images
- `flux/dev` - Development version
- `flux/dev/image-to-image` - For image-to-image transformations
- `flux/schnell` - Faster generation with slightly lower quality

## Running the Generator

To generate all static assets:

```
cd rpg-game
node scripts/generate-flux-images.js
```

This will attempt to generate all game assets using the configured Flux API key. If the API request fails, the script will fall back to Canvas-based generation, which creates placeholder images.

## Troubleshooting

### Common Errors

1. **Free-tier limit error**: "This request takes more than 512 tokens to complete"
   - Solution: Upgrade to a paid tier on AIML API

2. **Authentication errors**:
   - Check that your API key is correct and doesn't have any extra characters
   - Ensure the key is properly set in your `.env` file
   - Verify the Authorization header format: `Bearer {api_key}`

3. **Version Required Error**:
   - This is common with the Replicate API, which requires a specific model version
   - Stick with the AIML API which doesn't require version specification

## Canvas Fallback

If API generation fails, the system will fall back to Canvas-based image generation. These images are suitable for development but should be replaced with proper Flux-generated images before production release.

The Canvas generator creates themed placeholder images based on the asset type:
- Forest scenes have dark green backgrounds with trees
- Tavern interiors have warm brown colors
- Mountain scenes have blue/gray gradients with mountains
- Letters have a parchment appearance

## Asset Sources

All generated assets are stored in the `media/images/generated` directory with the following structure:

- `landing_page.png` - Game landing page
- `main_menu_background.png` - Main menu background
- `character_creation_background.png` - Character creation screen background
- `mysterious_letter.png` - Mysterious letter item
- `forest_path_ghost.png` - Forest path with ghostly figure
- `mountain_pass.png` - Mountain pass scene
- `village_tavern.png` - Village tavern interior

## Future Improvements

When budget allows, we recommend:

1. Subscribing to a paid AIML API plan
2. Regenerating all assets using the Flux API
3. Customizing the prompts for better results
4. Exploring additional assets that could enhance gameplay

## Additional Resources

- [AIML API Documentation](https://docs.aimlapi.com/api-references/model-database#image-models)
- [Flux AI Official Site](https://flux.ai/)
- [GameX RPG Asset Documentation](../media/images/generated/README.md) 