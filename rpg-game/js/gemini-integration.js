/**
 * Gemini Integration
 * Loads environment variables and integrates Gemini AI capabilities with the game
 */

// Create GameX namespace if it doesn't exist
window.GameX = window.GameX || {};

// Gemini Integration
GameX.GeminiIntegration = (function() {
  // Private variables
  let config = {
    configUrl: '/api/config',
    apiKeyNames: {
      gemini: 'GEMINI_API_KEY',
      stability: 'STABILITY_API_KEY',
      flux: 'FLUX_API_KEY'
    },
    isInitialized: false,
    usePlaceholders: true // Enable placeholders for development
  };

  // Environment variables
  let envVars = {};

  // Initialize the integration
  async function init(options = {}) {
    try {
      // Apply options
      if (options.apiKey) {
        envVars[config.apiKeyNames.gemini] = options.apiKey;
      }
      
      // Load environment variables if apiKeys weren't provided
      if (!envVars[config.apiKeyNames.gemini] || 
          !envVars[config.apiKeyNames.stability] || 
          !envVars[config.apiKeyNames.flux]) {
        await loadConfigFromServer();
      }
      
      // Initialize the image generator if available
      if (typeof GameX.GeminiImageGenerator !== 'undefined') {
        GameX.GeminiImageGenerator.init({
          apiKeys: {
            gemini: envVars[config.apiKeyNames.gemini],
            stability: envVars[config.apiKeyNames.stability],
            flux: envVars[config.apiKeyNames.flux]
          },
          useCache: true,
          usePlaceholders: config.usePlaceholders,
          settings: envVars.settings || {}
        });
      } else {
        console.warn('GeminiImageGenerator not found. Image generation will not be available.');
      }
      
      console.log('Gemini Integration initialized successfully');
      if (envVars[config.apiKeyNames.flux]) {
        console.log('Flux API Key loaded successfully');
      }
      if (envVars[config.apiKeyNames.stability]) {
        console.log('Stability API Key loaded successfully');
      }
      if (envVars[config.apiKeyNames.gemini]) {
        console.log('Gemini API Key loaded successfully');
      }
      
      config.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini Integration:', error);
      return config.usePlaceholders; // Return true if placeholders enabled, false otherwise
    }
  }

  // Load configuration from server API endpoint
  async function loadConfigFromServer() {
    try {
      console.log('Loading configuration from server...');
      const response = await fetch(config.configUrl);
      if (!response.ok) {
        console.warn(`Failed to load config from server: ${response.status}. Using placeholder mode.`);
        return {}; // Return empty object and rely on placeholder mode
      }
      
      const data = await response.json();
      
      // Store API keys in our envVars object with the expected naming convention
      if (data.apiKeys) {
        envVars[config.apiKeyNames.gemini] = data.apiKeys.gemini || '';
        envVars[config.apiKeyNames.stability] = data.apiKeys.stability || '';
        envVars[config.apiKeyNames.flux] = data.apiKeys.flux || '';
      }
      
      // Store settings
      if (data.settings) {
        envVars.settings = data.settings;
      }
      
      console.log('Server configuration loaded successfully');
      console.log('Available API keys:',
        Object.keys(config.apiKeyNames)
          .filter(key => !!envVars[key])
          .join(', '));
      
      return envVars;
    } catch (error) {
      console.error('Error loading configuration from server:', error);
      console.log('Falling back to placeholder mode');
      return {};
    }
  }

  // Load environment variables from .env file (kept for backward compatibility)
  async function loadEnvVariables() {
    try {
      // Try to load from server config first
      const serverConfig = await loadConfigFromServer();
      if (Object.keys(serverConfig).length > 0) {
        return serverConfig;
      }
      
      console.warn('Server config not available, trying to load .env directly (this may not work in browser)');
      const response = await fetch(config.envUrl);
      if (!response.ok) {
        console.warn(`Failed to load .env file: ${response.status}. Using placeholder mode.`);
        return {}; // Return empty object and rely on placeholder mode
      }
      
      const text = await response.text();
      const lines = text.split('\n');
      
      // Parse each line and extract variables
      for (const line of lines) {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || line.trim() === '') {
          continue;
        }
        
        // Extract key and value
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          
          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          
          envVars[key] = value;
        }
      }
      
      console.log('Environment variables loaded successfully');
      console.log('Available API keys:',
        Object.keys(config.apiKeyNames)
          .filter(key => !!envVars[config.apiKeyNames[key]])
          .join(', '));
      
      return envVars;
    } catch (error) {
      console.error('Error loading environment variables:', error);
      // We'll now use placeholders instead of prompting
      console.log('Falling back to placeholder mode');
      return {};
    }
  }

  // Get the loaded environment variables
  function getEnvVariables() {
    return envVars;
  }

  // Generate a scene image
  async function generateSceneImage(sceneName, description) {
    if (!config.isInitialized) {
      await init();
    }
    
    if (typeof GameX.GeminiImageGenerator !== 'undefined') {
      return GameX.GeminiImageGenerator.generateSceneImage(sceneName, description);
    }
    
    console.error('Image generator not available');
    return generatePlaceholderImage(sceneName, description, 'scene');
  }

  // Generate a character image
  async function generateCharacterImage(characterClass, description) {
    if (!config.isInitialized) {
      await init();
    }
    
    if (typeof GameX.GeminiImageGenerator !== 'undefined') {
      return GameX.GeminiImageGenerator.generateCharacterImage(characterClass, description);
    }
    
    console.error('Image generator not available');
    return generatePlaceholderImage(characterClass, description, 'character');
  }

  // Generate an item image
  async function generateItemImage(itemName, description) {
    if (!config.isInitialized) {
      await init();
    }
    
    if (typeof GameX.GeminiImageGenerator !== 'undefined') {
      return GameX.GeminiImageGenerator.generateItemImage(itemName, description);
    }
    
    console.error('Image generator not available');
    return generatePlaceholderImage(itemName, description, 'item');
  }

  // Generate a UI element image
  async function generateUIElement(elementName, description) {
    if (!config.isInitialized) {
      await init();
    }
    
    if (typeof GameX.GeminiImageGenerator !== 'undefined') {
      return GameX.GeminiImageGenerator.generateUIElement(elementName, description);
    }
    
    console.error('Image generator not available');
    return generatePlaceholderImage(elementName, description, 'ui');
  }

  // Update assets with newly generated images
  async function updateAssetsFromRegistry(assetRegistry) {
    if (!config.isInitialized) {
      await init();
    }
    
    if (!assetRegistry || !Array.isArray(assetRegistry)) {
      console.error('Invalid asset registry');
      return;
    }
    
    // Process each asset that needs to be created
    for (const asset of assetRegistry) {
      // Skip if already created
      if (asset.status === 'Created') {
        continue;
      }
      
      // Generate based on asset type
      let imageUrl = null;
      
      switch (asset.assetType) {
        case 'Scene Illustration':
          imageUrl = await generateSceneImage(asset.name, asset.description || '');
          break;
        case 'Character Image':
          imageUrl = await generateCharacterImage(asset.name, asset.description || '');
          break;
        case 'Item Image':
          imageUrl = await generateItemImage(asset.name, asset.description || '');
          break;
        case 'UI Element':
          imageUrl = await generateUIElement(asset.name, asset.description || '');
          break;
      }
      
      if (imageUrl) {
        // Save the image (implementation depends on how you want to save it)
        saveGeneratedImage(imageUrl, asset.fileName, asset.assetType);
        
        // Update asset status
        asset.status = 'Created';
      }
    }
  }

  // Generate a placeholder image when API isn't available
  function generatePlaceholderImage(name, description, type) {
    // Simplified placeholder generation
    console.log(`Generating placeholder for ${type}: ${name}`);
    
    // For development, just return a path to our pre-generated placeholders
    const filename = name.toLowerCase().replace(/\s+/g, '_');
    
    // Map asset types to placeholder files we've already created
    let placeholderFile;
    switch (type) {
      case 'scene':
        if (name.includes('forest')) {
          placeholderFile = 'forest_path_ghost.png';
        } else if (name.includes('mountain')) {
          placeholderFile = 'mountain_pass.png';
        } else if (name.includes('tavern')) {
          placeholderFile = 'village_tavern.png';
        } else if (name.includes('letter')) {
          placeholderFile = 'mysterious_letter.png';
        } else if (name.includes('character')) {
          placeholderFile = 'character_creation_background.png';
        } else if (name.includes('menu')) {
          placeholderFile = 'main_menu_background.png';
        } else {
          placeholderFile = 'landing_page.png';
        }
        break;
      case 'character':
        placeholderFile = 'character_creation_background.png';
        break;
      case 'item':
        placeholderFile = 'mysterious_letter.png';
        break;
      case 'ui':
        placeholderFile = 'landing_page.png';
        break;
      default:
        placeholderFile = 'landing_page.png';
    }
    
    return `media/images/generated/${placeholderFile}`;
  }

  // Save a generated image
  function saveGeneratedImage(imageUrl, fileName, assetType) {
    // In a real implementation, this would save the image to the server
    // For now, just log it
    console.log(`Generated image for ${assetType}: ${fileName}`);
    
    // If it's a data URL, we could download it
    if (imageUrl.startsWith('data:')) {
      // Create a link to download the image
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = fileName;
      
      // Add to DOM, click and then remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // Public API
  return {
    init,
    generateSceneImage,
    generateCharacterImage,
    generateItemImage,
    generateUIElement,
    updateAssetsFromRegistry,
    saveGeneratedImage,
    getEnvVariables
  };
})(); 