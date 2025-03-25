# Project Structure Documentation

## Overview

This document outlines the standard project structure for The Ember Throne Chronicles. Following these guidelines will help maintain a clean, organized codebase and prevent duplication of code and resources.

## Directory Structure

```
rpg-game/
├── .vscode/                 # VS Code configuration
├── css/                     # Stylesheets
├── docs/                    # Documentation 
├── js/                      # Game JavaScript modules
│   ├── asset-loader.js      # Asset loading system
│   ├── character-system.js  # Character management
│   ├── combat-system.js     # Combat mechanics
│   ├── dice-roller.js       # Random number generation
│   ├── game-engine.js       # Core game engine
│   ├── gamex-utils.js       # Utility functions
│   ├── scene-manager.js     # Scene management
│   ├── sound-manager.js     # Audio system
│   └── story-system.js      # Narrative engine
├── logs/                    # Log files
├── media/                   # Game assets
│   ├── audio/               # Audio files
│   │   ├── music/           # Background music
│   │   ├── sfx/             # Sound effects
│   │   ├── ambient/         # Ambient sounds
│   │   └── voice/           # Voice narration
│   ├── images/              # Image assets
│   │   └── generated/       # AI-generated images
│   └── fonts/               # Typography
├── node_modules/            # Node.js dependencies
├── pages/                   # HTML pages
├── scripts/                 # Utility scripts
│   ├── asset-generation/    # Image generation scripts
│   ├── audio/               # Audio generation scripts
│   ├── deployment/          # Deployment scripts
│   ├── helpers/             # Helper functions
│   ├── python/              # Python scripts
│   └── utils/               # Utility scripts
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
├── README.md                # Project overview
└── server.js                # Development server
```

## Best Practices

### 1. Single Source of Truth

- **Dependencies**: All dependencies should be managed in a single `package.json` file in the `rpg-game` directory.
- **Environment Variables**: Use a single `.env` file in the project root. Never commit this file to version control.
- **Generated Assets**: Store all generated assets in dedicated subdirectories within `media/`.

### 2. Script Organization

- **Asset Generation**: Place all asset generation scripts in `scripts/asset-generation/`.
- **Audio Generation**: Place all audio generation scripts in `scripts/audio/`.
- **Utility Scripts**: Place utility scripts in `scripts/utils/`.
- **Deployment Scripts**: Place deployment scripts in `scripts/deployment/`.
- **Script Size**: Keep scripts under 300 lines of code. Refactor larger scripts into modules.

### 3. Code Reuse

- **Utility Functions**: Place reusable functions in appropriate utility files.
- **Check Existing Code**: Before creating new functionality, check if similar code already exists.
- **Modular Design**: Break down complex systems into smaller, reusable modules.

### 4. Dependency Management

- **Version Control**: Specify versions for all dependencies in `package.json`.
- **Minimal Dependencies**: Only install dependencies that are actually used in the project.
- **Audit Regularly**: Run `npm audit` regularly to check for security vulnerabilities.

### 5. File Structure Guidelines

- **Directory Naming**: Use kebab-case for directory names (e.g., `asset-generation`).
- **File Naming**: Use kebab-case for file names (e.g., `generate-flux-images.js`).
- **Configuration Files**: Place configuration files in the project root.
- **Documentation**: Place documentation in the `docs/` directory.

### 6. Asset Management

- **Asset Regeneration**: Only regenerate assets when design changes are required.
- **Asset Documentation**: Document all generated assets with README files in their directories.
- **Asset Versioning**: Include version information in asset filenames if they change frequently.

## Preventing Duplication

1. **Before Creating New Files**:
   - Search the codebase for similar functionality
   - Check if the functionality can be added to an existing module
   - Consider refactoring existing code to accommodate new requirements

2. **Before Adding Dependencies**:
   - Check if the functionality is already available in existing dependencies
   - Verify that the dependency is actively maintained
   - Consider the impact on bundle size

3. **Before Generating Assets**:
   - Check if the asset already exists
   - Consider if the asset can be parameterized instead of duplicated
   - Document all asset generation in the appropriate README

By following these guidelines, we can maintain a clean, efficient codebase and prevent the issues of duplication that arose previously. 