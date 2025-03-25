/**
 * Asset Generator Fix
 * 
 * This script automatically generates missing game assets that are causing errors
 * in the browser console. It identifies the required assets and uses the Flux and Stability API
 * to generate them appropriately.
 */

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Starting Asset Generation Fix...');
  
  // Initialize the asset generator
  if (GameX.AssetGenerator) {
    // Array of required assets that need to be generated
    const requiredAssets = [
      {
        id: 'SCENE-09',
        name: 'Landing Page',
        fileName: 'media/images/generated/landing_page.png',
        assetType: 'Scene Illustration',
        description: 'Fantasy RPG game landing page with magical elements and atmospheric lighting'
      },
      {
        id: 'SCENE-10',
        name: 'Main Menu Background',
        fileName: 'media/images/generated/main_menu_background.png',
        assetType: 'Scene Illustration',
        description: 'Epic fantasy landscape with castle in the distance for main menu background'
      },
      {
        id: 'SCENE-11',
        name: 'Character Creation Background',
        fileName: 'media/images/generated/character_creation_background.png',
        assetType: 'Scene Illustration',
        description: 'Mystical character creation room with magical elements and character silhouettes'
      },
      {
        id: 'SCENE-04',
        name: 'Mysterious Letter',
        fileName: 'media/images/generated/mysterious_letter.png',
        assetType: 'Scene Illustration',
        description: 'Ancient parchment letter with mysterious symbols and wax seal'
      },
      {
        id: 'SCENE-12',
        name: 'Forest Path (Ghost)',
        fileName: 'media/images/generated/forest_path_ghost.png',
        assetType: 'Scene Illustration',
        description: 'Eerie forest path with ghostly figure in the mist and twisted trees'
      },
      {
        id: 'SCENE-13',
        name: 'Mountain Pass',
        fileName: 'media/images/generated/mountain_pass.png',
        assetType: 'Scene Illustration',
        description: 'Treacherous mountain pass with rope bridge over a deep canyon'
      },
      {
        id: 'SCENE-14',
        name: 'Village Tavern',
        fileName: 'media/images/generated/village_tavern.png',
        assetType: 'Scene Illustration',
        description: 'Cozy medieval tavern interior with fireplace and patrons'
      }
    ];

    // Initialize the generator
    GameX.AssetGenerator.init().then(() => {
      // Queue up the assets for generation
      console.log('Asset generator initialized. Starting asset generation...');
      
      // Update the asset registry with our required assets
      GameX.AssetGenerator.updateAssetsWithRequired(requiredAssets);
      
      // Start generating the assets
      GameX.AssetGenerator.generateRequiredAssets().then((generatedCount) => {
        console.log(`Generated ${generatedCount} assets successfully.`);
      }).catch(error => {
        console.error('Failed to generate assets:', error);
      });
    }).catch(error => {
      console.error('Failed to initialize asset generator:', error);
    });
  } else {
    console.error('Asset Generator not available. Make sure asset-generator.js is loaded.');
  }
});

// Add this method to the AssetGenerator
(function() {
  if (!window.GameX || !window.GameX.AssetGenerator) return;
  
  // Add method to update asset registry with required assets
  GameX.AssetGenerator.updateAssetsWithRequired = function(requiredAssets) {
    // If we have the registry already loaded
    if (this.assetRegistry && this.assetRegistry.length > 0) {
      // Update or add required assets
      requiredAssets.forEach(requiredAsset => {
        const existingAsset = this.assetRegistry.find(asset => asset.id === requiredAsset.id);
        if (existingAsset) {
          // Mark as not created so it will be regenerated
          existingAsset.status = 'Not Created';
          existingAsset.description = requiredAsset.description;
        } else {
          // Add the new asset to the registry
          this.assetRegistry.push({
            ...requiredAsset,
            status: 'Not Created'
          });
        }
      });
    } else {
      // Just use the required assets as our registry for now
      this.assetRegistry = requiredAssets.map(asset => ({
        ...asset,
        status: 'Not Created'
      }));
    }
    
    console.log('Asset registry updated with required assets.');
  };
  
  // Add method to generate only the required assets
  GameX.AssetGenerator.generateRequiredAssets = async function() {
    if (!this.assetRegistry || this.assetRegistry.length === 0) {
      console.error('No assets in registry.');
      return 0;
    }
    
    // Find assets that need to be created from our required list
    const missingAssets = this.assetRegistry.filter(asset => 
      asset.status === 'Not Created' || 
      asset.status === 'Partially Created' ||
      asset.status === 'Failed');
    
    if (missingAssets.length === 0) {
      console.log('All required assets are already created!');
      return 0;
    }
    
    console.log(`Found ${missingAssets.length} assets to generate`);
    
    // Clear and build queue
    this.generationQueue = missingAssets.map(asset => ({...asset}));
    
    // Start the generation process
    if (!this.isGenerating) {
      await this.processGenerationQueue();
    }
    
    return missingAssets.length;
  };
})(); 