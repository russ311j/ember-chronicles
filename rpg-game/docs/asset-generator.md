# Asset Generator Documentation

## Overview

The Asset Generator is a tool designed to help create missing assets for the RPG game using the Google Gemini AI API. It automates the process of generating images for scenes, characters, items, and UI elements based on the asset registry.

## Key Components

### 1. Admin Interface

The admin interface (`admin.html`) provides a user-friendly way to interact with the Asset Generator. It includes:

- **API Configuration**: Set up and test the Google Gemini API connection
- **Asset Registry Viewer**: View and manage assets from the registry
- **Custom Asset Generation**: Create one-off assets with custom descriptions
- **Bulk Generation**: Generate all missing assets in the registry

### 2. Asset Generator Module

The `asset-generator.js` file contains the core functionality for parsing the asset registry and generating assets:

- **Registry Parsing**: Reads and parses the markdown-formatted asset registry
- **Asset Generation**: Uses the Gemini API to generate images based on asset descriptions
- **Registry Updates**: Updates the asset registry with the status of newly created assets

### 3. Gemini Integration

The integration with Google's Gemini AI is handled by two files:

- **`gemini-image-generator.js`**: Core functions for communicating with the Gemini API
- **`gemini-integration.js`**: Higher-level functions that connect the game to the Gemini services

## Usage Instructions

### Setting Up the API Key

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add the key to the `.env` file or enter it in the admin interface
3. Test the connection using the "Test Connection" button

### Generating Assets

#### Individual Asset Generation

1. Navigate to the Admin page
2. Select the "Custom Generation" tab
3. Choose the asset type (Scene, Character, Item, UI)
4. Enter a detailed description
5. Click "Generate" and wait for the result
6. Download or save the generated image

#### Bulk Asset Generation

1. Navigate to the Admin page
2. Click "Load Asset Registry" to view all assets
3. Use "Generate All Missing Assets" to create all missing assets
4. Alternatively, click individual "Generate" buttons next to specific assets

### Technical Details

#### Environment Variables

The following environment variables are used:

```
GEMINI_API_KEY=your_api_key_here
IMAGE_GEN_WIDTH=800
IMAGE_GEN_HEIGHT=600
IMAGE_GEN_QUALITY=high
```

#### Asset Registry Format

The asset registry is stored in markdown format with tables for each asset type. Each entry includes:

- Asset ID
- Asset Name
- File Name
- Asset Type
- Status (Created, Partially Created, Not Created)
- Notes

#### Prompt Engineering

The system uses descriptive prompts based on asset details to generate appropriate images. For example:

- Scene prompts include setting details and atmosphere
- Character prompts include physical appearance and class-based attributes
- Item prompts include functional and aesthetic aspects

## Integration with Game

The Asset Generator is designed to work seamlessly with the existing game architecture:

1. Generated images are stored in the `media/images/generated/` directory
2. The asset registry is updated to reflect new assets
3. The game can access these assets through standard asset loading processes

## Troubleshooting

### Common Issues

- **API Connection Failures**: Verify API key and check network connectivity
- **Low-Quality Images**: Try providing more detailed descriptions
- **Missing Asset Types**: Check if the asset registry contains the correct asset type

### Debugging

The admin interface includes detailed error messages and status indicators to help diagnose issues with asset generation.

## Future Enhancements

Planned improvements for the Asset Generator include:

- Batch processing with progress tracking
- Style transfer options for consistent game aesthetics
- Integration with version control for asset management
- Enhanced prompt templates for better AI generation results

## Credits

The Asset Generator leverages the Google Gemini Flash 2.0 AI system for image generation. 