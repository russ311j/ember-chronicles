/**
 * Scene Manager Module for Ember Throne
 * Handles scene transitions and image loading for story pages
 */

(function() {
  // Create a namespace for the scene manager
  window.GameX = window.GameX || {};
  
  // Scene Manager system
  GameX.SceneManager = {
    // Current scene state
    currentScene: null,
    sceneImage: null,
    isInitialized: false,
    
    // Initialize the scene manager
    init: function() {
      console.log('Initializing Scene Manager');
      
      // Find the scene image element
      this.sceneImage = document.getElementById('scene-image');
      
      // Listen for story page changes
      document.addEventListener('story-page-changed', this.handlePageChanged.bind(this));
      
      // Set up a MutationObserver to detect when new pages are rendered
      this.setupPageObserver();
      
      this.isInitialized = true;
      return this;
    },
    
    // Set up an observer to watch for page changes in the DOM
    setupPageObserver: function() {
      // Watch for changes to the story container
      const storyContainer = document.getElementById('story-container');
      if (!storyContainer) return;
      
      // Create a mutation observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if a new story page was added
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('story-page')) {
                const pageId = node.getAttribute('data-page-id');
                if (pageId) {
                  this.updateSceneForPage(pageId);
                }
              }
            });
          }
        });
      });
      
      // Start observing the container for changes
      observer.observe(storyContainer, { childList: true, subtree: true });
    },
    
    // Handle the story-page-changed event
    handlePageChanged: function(event) {
      if (event.detail && event.detail.pageId) {
        this.updateSceneForPage(event.detail.pageId);
      }
    },
    
    // Update the scene image and atmosphere for a specific page
    updateSceneForPage: function(pageId) {
      console.log('Updating scene for page:', pageId);
      this.currentScene = pageId;
      
      // Update the scene image using AssetLoader if available
      if (window.GameX.AssetLoader && this.sceneImage) {
        const imagePath = window.GameX.AssetLoader.getImageForPage(pageId);
        this.sceneImage.src = imagePath;
        this.sceneImage.alt = `Scene for page ${pageId}`;
        
        // Add a loading class while the image loads
        this.sceneImage.classList.add('loading');
        
        // Remove loading class when image loads
        this.sceneImage.onload = () => {
          this.sceneImage.classList.remove('loading');
          this.sceneImage.classList.add('loaded');
          
          // Create a custom event to notify that the scene is ready
          const event = new CustomEvent('scene-loaded', { 
            detail: { pageId: pageId }
          });
          document.dispatchEvent(event);
        };
        
        // Handle image load error
        this.sceneImage.onerror = () => {
          console.error('Failed to load image for page:', pageId);
          this.sceneImage.classList.remove('loading');
          this.sceneImage.classList.add('error');
          this.sceneImage.src = window.GameX.AssetLoader.defaults.missingImage;
        };
      }
      
      // Add custom atmosphere effects based on the page
      this.updateAtmosphere(pageId);
    },
    
    // Update the atmosphere (background effects, sounds, etc.) based on the page
    updateAtmosphere: function(pageId) {
      // Remove any existing atmosphere classes
      document.body.classList.remove('forest-scene', 'mountain-scene', 'village-scene', 'castle-scene', 'dungeon-scene');
      
      // Add appropriate atmosphere class based on the page ID or content
      if (pageId.includes('forest')) {
        document.body.classList.add('forest-scene');
      } else if (pageId.includes('mountain')) {
        document.body.classList.add('mountain-scene');
      } else if (pageId.includes('village')) {
        document.body.classList.add('village-scene');
      } else if (pageId.includes('castle') || pageId.includes('throne')) {
        document.body.classList.add('castle-scene');
      } else if (pageId.includes('dungeon')) {
        document.body.classList.add('dungeon-scene');
      }
      
      // Play atmospheric sounds if a sound manager exists
      if (window.GameX.SoundManager) {
        // Determine appropriate ambient sound based on the scene
        let ambientSound = 'ambient_default';
        
        if (pageId.includes('forest')) {
          ambientSound = 'ambient_forest';
        } else if (pageId.includes('mountain')) {
          ambientSound = 'ambient_mountain';
        } else if (pageId.includes('village')) {
          ambientSound = 'ambient_village';
        } else if (pageId.includes('castle') || pageId.includes('throne')) {
          ambientSound = 'ambient_castle';
        } else if (pageId.includes('dungeon')) {
          ambientSound = 'ambient_dungeon';
        }
        
        // Play the ambient sound
        window.GameX.SoundManager.playAmbient(ambientSound);
      }
    }
  };
  
  // Initialize the Scene Manager when the DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we need the scene manager on this page
    const hasSceneElements = document.getElementById('scene-image') || 
                            document.getElementById('story-container');
    
    if (hasSceneElements) {
      GameX.SceneManager.init();
    } else {
      console.log('No scene elements found on this page, skipping SceneManager initialization');
    }
  });
})(); 