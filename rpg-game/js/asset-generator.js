/**
 * Asset Generator
 * 
 * Automates the generation of game assets using AI models based on the asset registry
 * Uses Gemini for images and other AI services as configured
 */

// Create GameX namespace if it doesn't exist
window.GameX = window.GameX || {};

// Asset Generator
GameX.AssetGenerator = (function() {
  // Private variables
  let config = {
    assetRegistry: null,
    outputPath: 'media/images/generated/',
    isInitialized: false
  };

  // Asset Registry cache
  let assetRegistry = [];
  let generationQueue = [];
  let isGenerating = false;

  // Initialize the generator
  async function init() {
    try {
      // Initialize the Gemini integration
      if (typeof GameX.GeminiIntegration !== 'undefined') {
        await GameX.GeminiIntegration.init();
      } else {
        console.warn('GeminiIntegration not found. Gemini image generation will not be available.');
      }
      
      // Load the asset registry
      await loadAssetRegistry();
      
      console.log('Asset Generator initialized successfully');
      config.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Asset Generator:', error);
      return false;
    }
  }

  // Load the asset registry from the MD file
  async function loadAssetRegistry() {
    try {
      // Fetch the asset registry markdown file
      const response = await fetch('docs/asset-registry.md');
      if (!response.ok) {
        throw new Error(`Failed to load asset registry: ${response.status}`);
      }
      
      const text = await response.text();
      assetRegistry = parseAssetRegistryMarkdown(text);
      
      return assetRegistry;
    } catch (error) {
      console.error('Error loading asset registry:', error);
      // Create an empty registry if we can't load it
      assetRegistry = [];
      return assetRegistry;
    }
  }

  // Parse the asset registry markdown file
  function parseAssetRegistryMarkdown(markdownText) {
    const assets = [];
    const lines = markdownText.split('\n');
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect section headers
      if (line.startsWith('##')) {
        currentSection = line.replace(/^##\s+/, '');
        continue;
      }
      
      // Skip non-table lines and table headers
      if (!line.startsWith('|') || line.startsWith('| Asset ID') || line.startsWith('|--')) {
        continue;
      }
      
      // Parse table row
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length >= 6) {
        const asset = {
          id: cells[0],
          name: cells[1],
          fileName: cells[2],
          assetType: cells[3],
          status: cells[4],
          notes: cells[5],
          section: currentSection
        };
        
        // Extract description from notes if possible
        if (asset.notes.includes('Description:')) {
          asset.description = asset.notes.split('Description:')[1].trim();
        }
        
        assets.push(asset);
      }
    }
    
    return assets;
  }

  // Update the asset registry with generation status
  function updateAssetStatus(assetId, status, notes) {
    const asset = assetRegistry.find(a => a.id === assetId);
    if (asset) {
      asset.status = status || asset.status;
      if (notes) {
        asset.notes = notes;
      }
    }
  }

  // Generate assets that need to be created
  async function generateMissingAssets() {
    if (!config.isInitialized) {
      await init();
    }
    
    // Find assets that need to be created
    const missingAssets = assetRegistry.filter(asset => 
      asset.status === 'Not Created' || 
      asset.status === 'Partially Created');
    
    if (missingAssets.length === 0) {
      console.log('All assets are already created!');
      return 0;
    }
    
    console.log(`Found ${missingAssets.length} assets to generate`);
    
    // Sort by type and add to queue
    const sortedAssets = [...missingAssets].sort((a, b) => {
      // Sort by type priority: UI > Character > Item > Scene
      const typePriority = {
        'UI Element': 1,
        'Character Image': 2,
        'Item Image': 3,
        'Scene Illustration': 4
      };
      
      const aPriority = typePriority[a.assetType] || 5;
      const bPriority = typePriority[b.assetType] || 5;
      
      return aPriority - bPriority;
    });
    
    // Clear and build queue
    generationQueue = sortedAssets.map(asset => ({...asset}));
    
    // Start the generation process
    if (!isGenerating) {
      await processGenerationQueue();
    }
    
    return missingAssets.length;
  }

  // Process the generation queue
  async function processGenerationQueue() {
    if (generationQueue.length === 0) {
      isGenerating = false;
      console.log('Asset generation complete!');
      return;
    }
    
    isGenerating = true;
    const asset = generationQueue.shift();
    
    try {
      console.log(`Generating ${asset.assetType}: ${asset.name}`);
      updateAssetStatus(asset.id, 'Generating');
      
      // Call the appropriate generator based on asset type
      let imageUrl = null;
      
      if (typeof GameX.GeminiIntegration !== 'undefined') {
        switch (asset.assetType) {
          case 'Scene Illustration':
            imageUrl = await GameX.GeminiIntegration.generateSceneImage(asset.name, asset.description);
            break;
          case 'Character Image':
            imageUrl = await GameX.GeminiIntegration.generateCharacterImage(asset.name, asset.description);
            break;
          case 'Item Image':
            imageUrl = await GameX.GeminiIntegration.generateItemImage(asset.name, asset.description);
            break;
          case 'UI Element':
            imageUrl = await GameX.GeminiIntegration.generateUIElement(asset.name, asset.description);
            break;
        }
      }
      
      if (imageUrl) {
        // Save the image and update status
        saveGeneratedImage(imageUrl, asset.fileName, asset);
        updateAssetStatus(asset.id, 'Created', asset.notes + ' [Generated by AI]');
      } else {
        updateAssetStatus(asset.id, 'Failed', asset.notes + ' [Generation failed]');
      }
    } catch (error) {
      console.error(`Error generating asset ${asset.name}:`, error);
      updateAssetStatus(asset.id, 'Failed', asset.notes + ` [Error: ${error.message}]`);
    }
    
    // Add a delay to prevent rate limiting
    setTimeout(() => {
      processGenerationQueue();
    }, 2000);
  }

  // Save a generated image
  function saveGeneratedImage(imageUrl, fileName, asset) {
    // Create a link to download the image
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    
    // Add to DOM, click and then remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    console.log(`Generated and downloaded ${asset.assetType}: ${fileName}`);
    
    // Display the generated image if we're in the admin interface
    if (window.displayGeneratedAsset) {
      window.displayGeneratedAsset(imageUrl, asset);
    }
  }

  // Get all assets of a specific type
  function getAssetsByType(assetType) {
    return assetRegistry.filter(asset => asset.assetType === assetType);
  }

  // Get an asset by ID
  function getAssetById(assetId) {
    return assetRegistry.find(asset => asset.id === assetId);
  }

  // Stop the generation process
  function stopGeneration() {
    generationQueue = [];
    isGenerating = false;
    console.log('Asset generation stopped');
  }

  // Public API
  return {
    init,
    loadAssetRegistry,
    generateMissingAssets,
    getAssetsByType,
    getAssetById,
    stopGeneration
  };
})(); 