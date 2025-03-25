# MCP Server Configuration

This document describes the Model Context Protocol (MCP) servers configured in the project.

## Configuration File

All MCP servers are configured in the root `mcp.json` file. This is the single source of truth for MCP server configurations.

## Available Servers

### 1. GitHub MCP Server
- **Purpose**: GitHub integration for repository operations
- **Command**: `npx @modelcontextprotocol/server-github`
- **Required Environment Variables**:
  - `GITHUB_TOKEN`: GitHub Personal Access Token

### 2. Stability AI MCP Server
- **Purpose**: High-quality image generation using Stability AI
- **Command**: `npx @modelcontextprotocol/server-stability`
- **Required Environment Variables**:
  - `STABILITY_API_KEY`: Your Stability AI API key
  - `IMAGE_WIDTH`: Image width (default: 800)
  - `IMAGE_HEIGHT`: Image height (default: 600)
  - `IMAGE_QUALITY`: Image quality setting (default: "high")
  - `OUTPUT_DIR`: Directory for generated images (default: "assets/stability")

### 3. Google Gemini MCP Server
- **Purpose**: Image generation using Google's Gemini AI
- **Command**: `npx @modelcontextprotocol/server-gemini`
- **Required Environment Variables**:
  - `GEMINI_API_KEY`: Your Google Gemini API key
  - `IMAGE_WIDTH`: Image width (default: 800)
  - `IMAGE_HEIGHT`: Image height (default: 600)
  - `IMAGE_QUALITY`: Image quality setting (default: "high")
  - `OUTPUT_DIR`: Directory for generated images (default: "assets/gemini")

### 4. FAL.ai MCP Server
- **Purpose**: AI-powered image processing and generation
- **Command**: `npx @modelcontextprotocol/server-fal`
- **Required Environment Variables**:
  - `FAL_KEY`: Your FAL.ai API key
  - `OUTPUT_DIR`: Directory for generated assets (default: "assets/fal")

### 5. Browser Tools MCP Server
- **Purpose**: Browser automation and tools
- **Command**: `wsl bash -c '/home/[username]/.nvm/versions/node/v20.18.0/bin/npx @agentdeskai/browser-tools-mcp@1.2.0'`
- **Note**: Replace `[username]` with your actual WSL username

### 6. ElevenLabs MCP Server
- **Purpose**: Text-to-speech audio generation
- **Command**: `uvx elevenlabs-mcp-server`
- **Required Environment Variables**:
  - `ELEVENLABS_API_KEY`: Your ElevenLabs API key
  - `ELEVENLABS_VOICE_ID`: Voice ID to use
  - `ELEVENLABS_MODEL_ID`: Model ID (default: "eleven_flash_v2")
  - `ELEVENLABS_STABILITY`: Stability setting (default: 0.5)
  - `ELEVENLABS_SIMILARITY_BOOST`: Similarity boost (default: 0.75)
  - `ELEVENLABS_STYLE`: Style setting (default: 0.1)
  - `ELEVENLABS_OUTPUT_DIR`: Output directory (default: "output")

### 7. Game Assets MCP Server
- **Purpose**: AI-powered game asset generation (2D and 3D)
- **Command**: `npx @modelcontextprotocol/server-game-assets`
- **Required Environment Variables**:
  - `HUGGINGFACE_TOKEN`: Your Hugging Face API token
  - `ASSET_OUTPUT_DIR`: Directory for generated assets (default: "assets/generated")
- **Features**:
  - Generates 2D sprites, textures, and UI elements
  - Creates 3D models and animations
  - Supports various art styles and formats
  - Integrates with Hugging Face models for asset generation

### 8. Flux AI MCP Server
- **Purpose**: High-quality image generation
- **Command**: `npx @modelcontextprotocol/server-flux`
- **Required Environment Variables**:
  - `FLUX_API_KEY`: Your Flux AI API key
  - `FLUX_MODEL`: Model to use (default: "flux-1.1-pro")
  - `FLUX_OUTPUT_DIR`: Directory for generated images (default: "assets/flux")
  - `FLUX_QUALITY`: Image quality setting (default: "high")
  - `FLUX_STYLE`: Image style setting (default: "photorealistic")
- **Features**:
  - Photorealistic image generation
  - High-resolution output
  - Style customization
  - Batch processing support

## Environment Variables

All environment variables should be set in your `.env` file. The MCP configuration uses the `${VARIABLE_NAME}` syntax to reference these variables.

## Important Notes

1. The `mcp.json` file in the root directory is the only configuration file that should be used for MCP servers.
2. Do not create separate MCP configuration files in subdirectories.
3. All MCP servers must have the `enabled` flag set to `true` to be active.
4. Environment variables must be properly set before starting the servers.
5. Generated images will be saved in their respective output directories under the `assets` folder.
6. Generated game assets will be saved in the specified `ASSET_OUTPUT_DIR`.
7. Flux AI generated images will be saved in the specified `FLUX_OUTPUT_DIR`.

## Troubleshooting

If you encounter issues with any MCP server:
1. Verify that all required environment variables are set
2. Check that the server is enabled in `mcp.json`
3. Ensure all required dependencies are installed
4. Check the server logs for specific error messages
5. For image generation servers:
   - Verify your API keys are valid and have sufficient credits
   - Check that the output directories exist and are writable
   - Ensure your image generation requests are within the API limits
6. For game assets generation:
   - Verify your Hugging Face token has sufficient permissions
   - Ensure the output directory exists and is writable
   - Check model compatibility with your desired asset types
7. For Flux AI image generation:
   - Verify your Flux API key is valid and has sufficient credits
   - Check that the output directory exists and is writable 