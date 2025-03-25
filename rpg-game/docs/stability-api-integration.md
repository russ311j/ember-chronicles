# Stability AI API Integration Guide

This document provides comprehensive guidance on using the Stability AI API for generating high-quality game assets for GameX RPG.

## Overview

GameX RPG utilizes static image assets to create a rich visual experience. These assets are generated using the Stability AI API, which provides access to advanced image generation models like Stable Diffusion XL.

The assets should be generated once during development or when design changes occur. They are not generated during gameplay.

## API Key Configuration

### Recommended: Stability AI API

1. **Create an account** at [Stability AI](https://platform.stability.ai/)
2. **Subscribe to a paid plan** for higher quality and more generations
3. **Generate an API key** from the dashboard
4. **Add the key to your `.env` file**:
   ```
   STABILITY_API_KEY=your-api-key-here
   ```

> **Note**: Make sure you add the API key exactly as provided, with no prefix.

## API Request Format

### Stability AI Endpoint

```
https://api.stability.ai/v1/generation/stable-diffusion-xl-1.0/text-to-image
```

### Request Payload

```json
{
  "text_prompts": [
    {
      "text": "Your detailed prompt here",
      "weight": 1
    }
  ],
  "cfg_scale": 7,
  "samples": 1,
  "steps": 30,
  "height": 768,
  "width": 1024
}
```

### Headers

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Accept: application/json
```

## Available Models

Stability AI offers several models that can be selected based on your needs:

| Model ID | Description | Recommended Use |
|----------|-------------|-----------------|
| stable-diffusion-xl-1.0 | Latest SDXL model | High-quality scene backgrounds |
| stable-diffusion-v1.6 | Stable Diffusion 1.6 | General purpose imagery |
| stable-diffusion-512-v2.1 | SD 2.1 512px model | Smaller UI elements |

## Running the Generator

To generate all static assets using the configured Stability API key:

```bash
cd rpg-game
node scripts/generate-stability-images.js
```

The script will attempt to generate all required images, saving them to the appropriate directories and creating a detailed log of the process.

## Troubleshooting

### Common Errors

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Check that your API key is correct in the `.env` file |
| 400 Bad Request | Ensure your prompt doesn't exceed token limits |
| 429 Too Many Requests | You've reached your tier's rate limit. Wait or upgrade your plan |
| 404 Not Found | Check that the model ID is correct |

### Best Practices for Prompts

1. **Be specific**: Include details about style, lighting, and composition
2. **Use artistic references**: Terms like "high fantasy art," "concept art," or "digital illustration"
3. **Specify what to exclude**: Use negative prompts to avoid unwanted elements
4. **Maintain consistent style**: Use similar language across prompts for a cohesive look

## Asset Sources

Generated assets are stored in the following directory structure:

```
rpg-game/
  └── media/
      └── images/
          ├── backgrounds/
          │   ├── title_screen_bg.png
          │   ├── scene1_invitation_bg.png
          │   └── ...
          └── ui/
              ├── buttons/
              ├── icons/
              └── panels/
```

## Future Improvements

When budget allows, we recommend:

1. **Upgrade to a paid Stability AI plan** for higher quality and more generations
2. **Use a more advanced model** like SDXL for better image quality
3. **Implement custom fine-tuning** for a more consistent game aesthetic
4. **Add automated batching** to efficiently generate many assets
5. **Implement image post-processing** for more consistent visuals

## Additional Resources

- [Stability AI Documentation](https://platform.stability.ai/docs/api-reference)
- [Stable Diffusion Prompt Guide](https://stability.ai/blog/how-to-write-prompts-for-stable-diffusion)
- [GameX RPG Asset Documentation](ember-throne-asset-registry.md)

---

This documentation is maintained alongside the GameX RPG project. For questions or updates, please contact the development team. 