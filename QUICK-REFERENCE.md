# GameX Quick Reference Guide

## GitHub Repository

### Push to GitHub

```bash
# Make sure your token is configured
git remote set-url origin https://YOUR_TOKEN@github.com/russ311j/gameX.git

# Commit your changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push -u origin your-branch-name
```

### Create a New Branch

```bash
# Create and checkout a new branch
git checkout -b feature/your-new-feature

# Push the new branch to GitHub
git push -u origin feature/your-new-feature
```

## Generate Art Assets

### Using FLUX.1 (Recommended)

```bash
# Generate an item
node scripts/generate-flux-asset.js --description "magical staff with glowing runes" --type item --style "pixel art" --filename magic_staff

# Generate a character
node scripts/generate-flux-asset.js --description "female warrior with armor and sword" --type character --style "pixel art" --filename warrior_character

# Generate a background
node scripts/generate-flux-asset.js --description "dark forest with mysterious fog" --type background --style "pixel art" --filename forest_background
```

### Using Gemini Enhanced Prompts

```bash
# Generate with enhanced prompts
node scripts/generate-smart-asset.js --prompt "magic sword" --type item --style "pixel art" --filename magic_sword
```

## Run Development Server

### Using HTTP Server

```bash
# Start server on port 8080
npx http-server rpg-game -p 8080

# If 8080 is busy, use a different port
npx http-server rpg-game -p 8081
```

### Using Express (if configured)

```bash
# From project root
cd rpg-game && node server.js
```

## Troubleshooting

### GitHub Authentication Issues
- Verify your token is valid and has not expired
- Make sure the token has the 'repo' scope
- Update remote URL with your token: `git remote set-url origin https://YOUR_TOKEN@github.com/russ311j/gameX.git`

### Server Port Already in Use
- Kill the process using the port: `npx kill-port 8080`
- Try a different port: `npx http-server rpg-game -p 8082`

### Asset Generation Failures
- Check your API keys in `.env` file
- Try a more detailed or different prompt
- Verify network connectivity to the API services

## Additional Documentation

For more detailed information, see:
- [Repository Guide](docs/repository-guide.md)
- [Gemini Asset Generation](docs/gemini-asset-generation.md)
- [RPG Game Documentation](rpg-game/README.md) 