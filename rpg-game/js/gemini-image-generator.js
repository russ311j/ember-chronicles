/**
 * Gemini Image Generator
 * Uses multiple AI image generation APIs to create high-quality game assets
 */

// Create GameX namespace if it doesn't exist
window.GameX = window.GameX || {};

// Gemini Image Generator
GameX.GeminiImageGenerator = (function() {
  // Private variables
  let config = {
    apiKeys: {
      gemini: null,
      stability: null,
      flux: null
    },
    models: {
      gemini: 'gemini-1.5-flash',
      stability: 'stable-diffusion-xl-1024-v1-0',
      flux: 'flux-3'
    },
    useCache: true,
    cachePrefix: 'gemini-cache-',
    baseUrls: {
      gemini: 'https://generativelanguage.googleapis.com/v1beta',
      stability: 'https://api.stability.ai/v1/generation',
      flux: 'https://api.flux.ai/v1/generate'
    },
    imageSettings: {
      width: 1024,
      height: 768,
      quality: 'high'
    },
    isInitialized: false,
    preferredService: 'stability' // Default to stability for higher quality
  };

  // Initialize the generator
  function init(options = {}) {
    try {
      // Merge options with default config
      if (options.apiKeys) {
        config.apiKeys.gemini = options.apiKeys.gemini || config.apiKeys.gemini;
        config.apiKeys.stability = options.apiKeys.stability || config.apiKeys.stability;
        config.apiKeys.flux = options.apiKeys.flux || config.apiKeys.flux;
      } else if (options.apiKey) {
        // Backward compatibility
        config.apiKeys.gemini = options.apiKey;
      }
      
      // Apply other options
      config.useCache = options.useCache !== undefined ? options.useCache : config.useCache;
      config.usePlaceholders = options.usePlaceholders !== undefined ? options.usePlaceholders : false;
      
      // Apply settings if provided
      if (options.settings) {
        if (options.settings.imageWidth) config.imageSettings.width = options.settings.imageWidth;
        if (options.settings.imageHeight) config.imageSettings.height = options.settings.imageHeight;
        if (options.settings.quality) config.imageSettings.quality = options.settings.quality;
        if (options.settings.preferredService) config.preferredService = options.settings.preferredService;
      }
      
      // Load image settings from .env if available
      if (GameX.GeminiIntegration && GameX.GeminiIntegration.getEnvVariables) {
        const envVars = GameX.GeminiIntegration.getEnvVariables();
        if (envVars.IMAGE_GEN_WIDTH) config.imageSettings.width = parseInt(envVars.IMAGE_GEN_WIDTH, 10);
        if (envVars.IMAGE_GEN_HEIGHT) config.imageSettings.height = parseInt(envVars.IMAGE_GEN_HEIGHT, 10);
        if (envVars.IMAGE_GEN_QUALITY) config.imageSettings.quality = envVars.IMAGE_GEN_QUALITY;
        if (envVars.PREFERRED_SERVICE) config.preferredService = envVars.PREFERRED_SERVICE;
      }
      
      // Check if we have at least one API key
      if (!config.apiKeys.gemini && !config.apiKeys.stability && !config.apiKeys.flux) {
        console.error('At least one API key is required');
        return config.usePlaceholders;
      }
      
      // Determine which service to use as default
      if (config.preferredService === 'stability' && !config.apiKeys.stability) {
        if (config.apiKeys.flux) {
          config.preferredService = 'flux';
        } else if (config.apiKeys.gemini) {
          config.preferredService = 'gemini';
        }
      }
      
      console.log('Image Generator initialized successfully - Using', config.preferredService, 'as primary service');
      console.log('Available services:', Object.keys(config.apiKeys).filter(k => !!config.apiKeys[k]).join(', '));
      config.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Image Generator:', error);
      return config.usePlaceholders;
    }
  }

  // Generate an image using available AI services
  async function generateImage(prompt, type = 'scene') {
    if (!config.isInitialized) {
      if (!init()) {
        return generatePlaceholderImage(prompt, type);
      }
    }
    
    // Always use static pre-generated images first - this is now the preferred approach
    const staticImage = getStaticImage(prompt, type);
    if (staticImage) {
      console.log('Using pre-generated static image for:', prompt);
      return staticImage;
    }
    
    // Check cache next if enabled
    if (config.useCache) {
      const cachedImage = checkImageCache(prompt, type);
      if (cachedImage) {
        console.log('Using cached image for:', prompt);
        return cachedImage;
      }
    }
    
    // If we don't have a static or cached image, only then try the API
    console.warn('No static image found for:', prompt);
    console.warn('Using API generation as fallback (not recommended for production)');
    
    // Try to generate with the preferred service first
    try {
      let imageUrl = null;
      
      switch (config.preferredService) {
        case 'stability':
          if (config.apiKeys.stability) {
            imageUrl = await generateWithStability(prompt, type);
          }
          break;
        case 'flux':
          if (config.apiKeys.flux) {
            imageUrl = await generateWithFlux(prompt, type);
          }
          break;
        case 'gemini':
        default:
          if (config.apiKeys.gemini) {
            imageUrl = await generateWithGemini(prompt, type);
          }
          break;
      }
      
      // If primary service failed, try alternatives
      if (!imageUrl) {
        if (config.apiKeys.stability && config.preferredService !== 'stability') {
          console.log('Primary service failed, trying Stability AI');
          imageUrl = await generateWithStability(prompt, type);
        }
        
        if (!imageUrl && config.apiKeys.flux && config.preferredService !== 'flux') {
          console.log('Trying Flux AI');
          imageUrl = await generateWithFlux(prompt, type);
        }
        
        if (!imageUrl && config.apiKeys.gemini && config.preferredService !== 'gemini') {
          console.log('Trying Gemini AI');
          imageUrl = await generateWithGemini(prompt, type);
        }
      }
      
      // If all services failed, use static placeholder
      if (!imageUrl) {
        console.warn('All image generation services failed, using placeholder');
        return generatePlaceholderImage(prompt, type);
      }
      
      // Cache the image if successful
      if (config.useCache) {
        cacheImage(prompt, type, imageUrl);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return generatePlaceholderImage(prompt, type);
    }
  }

  // Generate with Gemini
  async function generateWithGemini(prompt, type) {
    // Enhance the prompt based on the image type
    const enhancedPrompt = enhancePrompt(prompt, type, 'gemini');
    
    try {
      const response = await fetch(`${config.baseUrls.gemini}/models/${config.models.gemini}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKeys.gemini}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generation_config: {
            response_mime_type: 'image/png',
            temperature: 0.7,
            top_p: 1,
            top_k: 32,
            candidate_count: 1
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        return null;
      }
      
      const data = await response.json();
      
      // Extract image data from response
      let imageUrl = null;
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const imagePart = data.candidates[0].content.parts.find(part => part.file_data && part.file_data.mime_type.startsWith('image/'));
        if (imagePart && imagePart.file_data) {
          imageUrl = 'data:' + imagePart.file_data.mime_type + ';base64,' + imagePart.file_data.data;
        }
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error with Gemini generation:', error);
      return null;
    }
  }

  // Generate with Stability AI
  async function generateWithStability(prompt, type) {
    // Enhance the prompt based on the image type
    const enhancedPrompt = enhancePrompt(prompt, type, 'stability');
    
    try {
      const response = await fetch(`${config.baseUrls.stability}/${config.models.stability}/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKeys.stability}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: enhancedPrompt,
              weight: 1.0
            }
          ],
          cfg_scale: 7,
          height: config.imageSettings.height,
          width: config.imageSettings.width,
          samples: 1,
          steps: 30
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Stability API error:', errorData);
        return null;
      }
      
      const data = await response.json();
      
      // Extract image data from response
      let imageUrl = null;
      if (data.artifacts && data.artifacts.length > 0) {
        imageUrl = 'data:image/png;base64,' + data.artifacts[0].base64;
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error with Stability generation:', error);
      return null;
    }
  }

  // Generate with Flux AI
  async function generateWithFlux(prompt, type) {
    // Enhance the prompt based on the image type
    const enhancedPrompt = enhancePrompt(prompt, type, 'flux');
    
    try {
      console.log(`Generating image with Flux AI: "${enhancedPrompt.substring(0, 50)}..."`);
      
      // Verify API key is present
      if (!config.apiKeys.flux) {
        console.error('Flux API Key is missing or invalid');
        return null;
      }
      
      const response = await fetch(`${config.baseUrls.flux}/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKeys.flux}`
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          model: config.models.flux,
          width: config.imageSettings.width,
          height: config.imageSettings.height,
          num_images: 1
        })
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Flux API error:', errorData);
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch (e) {
          // If we can't parse JSON, just use the status text
          errorMessage += ` - ${response.statusText}`;
        }
        console.error(errorMessage);
        return null;
      }
      
      const data = await response.json();
      
      // Extract image data from response
      let imageUrl = null;
      if (data.images && data.images.length > 0) {
        imageUrl = 'data:image/png;base64,' + data.images[0];
        console.log('Successfully generated image with Flux AI');
      } else {
        console.error('Flux API returned no images:', data);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error with Flux generation:', error);
      return null;
    }
  }

  // Get a static pre-generated image if available
  function getStaticImage(prompt, type) {
    console.log(`Looking for static image for ${type}: ${prompt}`);
    
    // Map common prompt keywords to our static image files
    let staticFile = null;
    
    const name = prompt.toLowerCase();
    
    // Map based on specific keywords in the prompt
    if (name.includes('landing page') || name.includes('welcome')) {
      staticFile = 'landing_page.png';
    } else if (name.includes('main menu') || name.includes('menu background')) {
      staticFile = 'main_menu_background.png';
    } else if (name.includes('character creation') || name.includes('create character')) {
      staticFile = 'character_creation_background.png';
    } else if (name.includes('letter') || name.includes('scroll') || name.includes('parchment')) {
      staticFile = 'mysterious_letter.png';
    } else if (name.includes('forest') || name.includes('ghost')) {
      staticFile = 'forest_path_ghost.png';
    } else if (name.includes('mountain') || name.includes('pass') || name.includes('bridge')) {
      staticFile = 'mountain_pass.png';
    } else if (name.includes('tavern') || name.includes('inn') || name.includes('pub')) {
      staticFile = 'village_tavern.png';
    }
    
    // If we found a mapping, return the path to the static image
    if (staticFile) {
      return `media/images/generated/${staticFile}`;
    }
    
    // No static image matched
    return null;
  }

  // Generate a placeholder image when static images and API aren't available
  function generatePlaceholderImage(prompt, type) {
    console.log(`Using placeholder for ${type}: ${prompt}`);
    
    // Reuse our static images as placeholders
    let placeholderFile;
    const name = prompt.toLowerCase();
    
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

  // Enhanced prompts for different image types
  function enhancePrompt(prompt, type, service = 'gemini') {
    // Base style guides for different services
    const styles = {
      gemini: "photorealistic, highly detailed, vivid colors, fantasy art style, cinematic lighting, no text, no UI elements, no watermarks",
      stability: "detailed fantasy concept art, high quality, 4K, photorealistic, fantasy world, trending on artstation, highly detailed environment, cinematic, epic lighting, no text, no labels, no UI",
      flux: "high-resolution, cinematic, detailed fantasy illustration by professional artist, epic lighting, atmospheric, no text overlays, no watermarks"
    };
    
    const style = styles[service] || styles.stability;
    
    let enhancedPrompt = "";
    
    switch (type.toLowerCase()) {
      case 'scene':
        enhancedPrompt = `${style}, scene: ${prompt}. Fantasy RPG game environment, no text, no UI elements, no watermarks, no signatures.`;
        break;
      case 'character':
        enhancedPrompt = `${style}, character portrait for a fantasy RPG game: ${prompt}. Detailed outfit, expressive pose, fantasy game character, no text, no labels, no UI.`;
        break;
      case 'item':
        enhancedPrompt = `${style}, fantasy item: ${prompt}. Centered, detailed magical object, glowing effects, isolated on background, no text, no labels, no UI.`;
        break;
      case 'ui':
        enhancedPrompt = `${style}, UI element for a fantasy game: ${prompt}. Clean design, game interface style, fantasy-themed button or panel, no text, no labels inside the image.`;
        break;
      default:
        enhancedPrompt = `${style}, fantasy illustration: ${prompt}. No text, no labels, no UI elements.`;
    }
    
    return enhancedPrompt;
  }

  // Check if an image is already cached
  function checkImageCache(prompt, type) {
    if (!localStorage) return null;
    
    const cacheKey = getCacheKey(prompt, type);
    return localStorage.getItem(cacheKey);
  }

  // Cache an image in localStorage
  function cacheImage(prompt, type, imageUrl) {
    if (!localStorage) return;
    
    const cacheKey = getCacheKey(prompt, type);
    try {
      localStorage.setItem(cacheKey, imageUrl);
    } catch (e) {
      // Local storage might be full, clear some items
      console.warn('Local storage full, clearing cache');
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, imageUrl);
      } catch (e2) {
        console.error('Failed to cache image even after clearing cache');
      }
    }
  }

  // Get a cache key for the image
  function getCacheKey(prompt, type) {
    return `${config.cachePrefix}${type}-${hashString(prompt)}`;
  }

  // Simple hash function for strings
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Clear old items from cache if storage is full
  function clearOldCache() {
    if (!localStorage) return;
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(config.cachePrefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove half of the cached items
    const removeCount = Math.ceil(keysToRemove.length / 2);
    for (let i = 0; i < removeCount; i++) {
      localStorage.removeItem(keysToRemove[i]);
    }
  }

  // Helper functions for different asset types
  async function generateSceneImage(sceneName, description) {
    const prompt = description || `A ${sceneName} scene`;
    return generateImage(prompt, 'scene');
  }

  async function generateCharacterImage(characterClass, description) {
    const prompt = description || `A ${characterClass} character`;
    return generateImage(prompt, 'character');
  }

  async function generateItemImage(itemName, description) {
    const prompt = description || `A ${itemName}`;
    return generateImage(prompt, 'item');
  }

  async function generateUIElement(elementName, description) {
    const prompt = description || `A ${elementName} button or UI element`;
    return generateImage(prompt, 'ui');
  }

  // Public API
  return {
    init,
    generateImage,
    generateSceneImage,
    generateCharacterImage,
    generateItemImage,
    generateUIElement
  };
})(); 