# GameX Repository Guide

## Git Repository Management

### Repository Setup

This project uses GitHub for version control. The repository is located at:
```
https://github.com/russ311j/gameX.git
```

### Authentication

GitHub requires authentication for pushing changes. There are several methods to authenticate:

#### 1. Using Personal Access Token (Recommended)

1. **Generate a GitHub Personal Access Token (PAT)**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Click "Generate new token" (classic)
   - Select the appropriate scopes (repo, workflow, etc.)
   - Copy your token immediately after generation

2. **Configure Repository Authentication**:

   ```bash
   # Set the remote URL with embedded token
   git remote set-url origin https://YOUR_TOKEN@github.com/russ311j/gameX.git
   ```

   For this project specifically, we store the GitHub token in the `.env` file. You can use it directly:
   
   ```bash
   # Using the token from .env file (PowerShell)
   $token = (Get-Content .env | Select-String "GITHUB_TOKEN").ToString().Split("=")[1]
   git remote set-url origin https://$token@github.com/russ311j/gameX.git
   
   # Using the token from .env file (Bash)
   token=$(grep GITHUB_TOKEN .env | cut -d '=' -f2)
   git remote set-url origin https://$token@github.com/russ311j/gameX.git
   ```

   Or manually set the token after retrieving it from the `.env` file:
   
   ```bash
   # Example with a specific token
   git remote set-url origin https://github_pat_YOUR_TOKEN_HERE@github.com/russ311j/gameX.git
   ```

   Alternatively, for better security:

   ```bash
   # Configure Git to store credentials
   git config --global credential.helper store
   
   # The next time you push, enter your token when prompted
   git push origin your-branch
   ```

#### 2. Using the GitHub CLI

If you have GitHub CLI installed:

```bash
# Login with GitHub CLI
gh auth login

# Then push normally
git push origin your-branch
```

### Common Authentication Issues

If you encounter `fatal: repository 'https://github.com/russ311j/gameX.git/' not found` or similar errors:

1. Check that your personal access token is valid and not expired
2. Ensure the token has correct permissions (repo scope at minimum)
3. Verify the remote URL is correct
4. Try updating the remote URL with your token as shown above

### Troubleshooting Example - What Worked

When we faced authentication issues, the following approach resolved them:

```bash
# 1. First we created the repository on GitHub through the API
$token = "your_github_token_here"
curl -H "Authorization: token $token" -d '{"name":"gameX"}' https://api.github.com/user/repos

# 2. Then we updated the remote URL with the token embedded
git remote set-url origin https://your_github_token_here@github.com/russ311j/gameX.git

# 3. Finally we pushed the branch
git push -u origin feature/twine-migration
```

This solution embedded the token directly in the URL, which avoided GitHub credential prompts and allowed successful pushing to the repository.

### Branching Strategy

We use feature branches for development:

1. **Main Branches**:
   - `main`: Production-ready code
   - `develop`: Integration branch for features

2. **Feature Branches**:
   - Create a new branch for each feature or bug fix
   - Use naming convention: `feature/feature-name` or `bugfix/issue-description`

   ```bash
   # Create a new feature branch
   git checkout -b feature/your-feature-name
   
   # Push to remote repository
   git push -u origin feature/your-feature-name
   ```

## Art Asset Generation

### Available Methods

The project supports multiple methods for generating game art assets:

#### 1. Using Gemini + FLUX.1 (Recommended)

This method combines Google's Gemini API for prompt enhancement with the FLUX.1 model for image generation.

```bash
# Generate an asset using the smart hybrid approach
node scripts/generate-smart-asset.js --prompt "magic sword" --type item --style "pixel art" --filename magic_sword
```

#### 2. Using FLUX.1 Directly

For direct image generation without Gemini:

```bash
# Generate using FLUX.1 with predefined templates
node scripts/generate-flux-asset.js --description "magical staff with glowing runes" --type item --style "pixel art" --filename magic_staff
```

#### 3. Using Stability AI

For higher quality but credit-based generation:

```bash
# Generate using Stability AI
node scripts/generate-asset-direct.js --prompt "detailed description" --type item --filename your_filename
```

### Asset Types and Styles

The generation scripts support various asset types and styles:

#### Types
- `character`: Game characters and NPCs
- `item`: Weapons, armor, consumables, etc.
- `background`: Environmental scenes and locations
- `prop`: Interactive objects and decorative elements

#### Styles
- `pixel art`: Retro pixel-based graphics
- `low poly`: Simple 3D-like graphics with flat colors
- `cartoon`: Stylized cartoon aesthetic
- `realistic`: Photo-realistic imagery
- `isometric`: Pseudo-3D angled view
- `fantasy`: Fantasy-themed with magical elements

### API Key Setup

To use the generation methods, you need to set up API keys in your `.env` file:

1. **For Gemini (optional - enhances prompts)**:
   - Get your API key from: https://aistudio.google.com/
   - Add to `.env`: `GEMINI_API_KEY=your_key_here`

2. **For FLUX.1 (image generation)**:
   - Get your API key from: https://fal.ai/
   - Add to `.env`: `FAL_KEY=your_key_here`

3. **For Stability AI (optional)**:
   - Get your API key from: https://platform.stability.ai/
   - Add to `.env`: `STABILITY_API_KEY=your_key_here`

4. **For GitHub (repository authentication)**:
   - Get your token from: https://github.com/settings/tokens
   - Add to `.env`: `GITHUB_TOKEN=your_github_token_here`

### Generated Asset Management

All generated assets are stored in:
```
rpg-game/media/images/generated/
```

The filenames follow the convention specified in your generation command:
```
[filename].[extension]
```

### Troubleshooting Asset Generation

If you encounter issues with asset generation:

1. **API Key Errors**: Verify your API keys are correctly set in `.env`
2. **Generation Failures**: Sometimes image generation may fail if the prompt is unclear, try rephrasing
3. **Network Issues**: If you get timeout errors, the API service might be experiencing high load
4. **Invalid Parameters**: Ensure you're using supported asset types and styles

## Development Workflow

1. **Create a feature branch for your work**:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes and commit them**:
   ```bash
   git add .
   git commit -m "Descriptive message about your changes"
   ```

3. **Push your branch to GitHub**:
   ```bash
   git push -u origin feature/your-feature
   ```

4. **Create a Pull Request** on GitHub to merge your changes into the main branch

## Server Management

To run the development server:

```bash
# Start the development server on port 8080
npx http-server rpg-game -p 8080

# If port 8080 is already in use, try a different port
npx http-server rpg-game -p 8081
```

Access the game at:
```
http://localhost:8080  # or other port if specified
``` 