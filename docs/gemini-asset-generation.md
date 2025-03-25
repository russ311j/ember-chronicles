# Gemini Asset Generation

This documentation outlines the current state of using Google's Gemini models for game asset generation in the GameX project.

## Current Status

As of testing (March 2025), our findings about Gemini image generation capabilities:

1. The Gemini models available through the Node.js Gemini API (`gemini-1.5-pro` and `gemini-1.5-flash`) can provide detailed textual descriptions but cannot directly generate images.
2. The experimental model `gemini-2.0-flash-exp` for image generation appears to be mentioned in documentation but is not yet available through the JavaScript SDK.

## Conclusion

After extensive testing of the Gemini API for game asset generation, we've found that:

1. The current available Gemini models through the JavaScript SDK (`gemini-1.5-pro` and `gemini-1.5-flash`) are excellent at generating detailed textual descriptions but cannot generate images directly.
2. The `gemini-2.0-flash-exp` model mentioned in documentation is not yet available through the JavaScript SDK.
3. Stability AI offers good image generation but operates on a credit-based system.

## Alternative Approaches

We've implemented multiple approaches for game asset generation:

1. **Gemini for Text-Only**: Using Gemini to generate detailed asset descriptions with `generate-prompt.js`.
2. **Stability AI**: Using the Stability AI API for direct image generation with `generate-asset.js`.
3. **FLUX.1 (Free Alternative)**: Using the FLUX.1 open-source model via Replicate API with `generate-flux-asset.js`.
4. **Smart Hybrid Approach**: Combining Gemini's prompt enhancement with FLUX.1's image generation in `generate-smart-asset.js`.

### Our Recommended Workflow

For the best results with free/low-cost options, we recommend:

1. Use `generate-smart-asset.js` which:
   - Starts with a basic prompt like "magic sword"
   - Uses Gemini 1.5 Pro to enhance it into a detailed, image-optimized description
   - Sends the enhanced prompt to FLUX.1 via Replicate's API
   - Downloads and saves the generated image to your game's media directory

Example usage:
```
node generate-smart-asset.js --prompt "magic sword" --type item --style "pixel art" --filename magic_sword
```

### Gemini-Free Alternative

If you prefer not to use the Gemini API, we've also created a template-based approach:

1. Use `generate-manual-asset.js` which:
   - Uses pre-defined templates for different asset types and styles
   - Combines your basic description with appropriate template text
   - Sends the templated prompt to FLUX.1 via Replicate's API
   - Downloads and saves the generated image to your game's media directory
   
Example usage:
```
node generate-manual-asset.js --description "magic sword with blue glow" --type item --style "pixel art" --filename magic_sword
```

This approach doesn't require a Gemini API key, only the Replicate API token for FLUX.1.

### FLUX.1 Benefits

FLUX.1 has several advantages over other image generation models:

- **Open-Source Model**: FLUX.1 is an open-source model from Black Forest Labs
- **Free Access**: Available through the fal.ai API platform 
- **Excellent Text Rendering**: FLUX.1 excels at rendering text within images
- **Strong on Complex Compositions**: Better handling of hands and complex scenes

### API Setup

To use the image generation functionality, you'll need to set up the following API keys in your `.env` file:

1. **For Gemini (optional - enhances prompts)**: 
   - Get your API key from: https://aistudio.google.com/
   - Add to `.env`: `GEMINI_API_KEY=your_key_here`

2. **For FLUX.1 (image generation)**:
   - Get your API key from: https://fal.ai/
   - Add to `.env`: `FAL_KEY=your_key_here`

The API keys are now properly referenced in `.env.example` for your reference.

### Troubleshooting

If you encounter issues with asset generation:

1. **API Key Errors**: Verify your API keys are correctly set in `.env`
2. **Generation Failures**: Sometimes image generation may fail if the prompt is unclear, try rephrasing
3. **Network Issues**: If you get timeout errors, the API service might be experiencing high load

### Resource Usage

- **Gemini API**: Free tier includes 60 queries per minute
- **fal.ai API**: Free tier includes limited credits, monitor your usage on the platform

This approach gives you the best of both worlds - Gemini's natural language understanding for creating detailed asset descriptions, and FLUX.1's high-quality image generation capabilities, all while minimizing costs.

## Gemini for Creative Assistance

While direct image generation is not currently available, Gemini models excel at:

1. **Detailed Asset Descriptions**: Creating detailed descriptions that can be used with other image generation tools
2. **Creative Variations**: Suggesting variations on existing assets
3. **Thematic Consistency**: Ensuring consistent themes and styles across multiple game assets
4. **Game Design Suggestions**: Proposing new asset ideas based on game context

## Recommended Workflow

After testing multiple approaches, we recommend the following workflow for asset generation:

1. **Generate Enhanced Prompts**: Use Gemini 1.5 Pro to create detailed descriptions.
   ```bash
   node scripts/generate-prompt.js --prompt "magic sword" --type item --style "fantasy"
   ```

2. **Generate Images with Stability AI**: Use Stability AI for the actual image generation.
   ```bash
   node scripts/generate-asset-direct.js --prompt "your enhanced prompt" --type item --filename your_filename
   ```

3. **Iterate as Needed**: If the first image doesn't meet your requirements, ask Gemini for variations or refinements, and then generate new images.

This approach combines Gemini's strength in detailed descriptions with Stability AI's proven image generation capabilities. The generated assets are saved in the `rpg-game/media/images/generated` directory and can be referenced in your game.

## Future Developments

We'll continue to monitor developments in the Gemini API and update our implementation when image generation becomes available. For now, we recommend using the existing Stability AI implementation for actual image generation.

## Troubleshooting

- **API Key Issues**: Ensure your API key is valid and properly set in the `.env` file.
- **Network Errors**: Check your internet connection.
- **Unsupported Models**: If you encounter "model not found" errors, stick with the supported models (`gemini-1.5-pro` and `gemini-1.5-flash`).

## Resource Usage

- Check the [Google AI Studio documentation](https://ai.google.dev/docs) for the latest information on available models, capabilities, and pricing. 