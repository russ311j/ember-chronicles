/**
 * Asset Loader Module for Ember Throne
 * Handles loading and organizing game assets
 */

(function() {
  // Create a namespace for the asset loader
  window.GameX = window.GameX || {};
  
  // Log loaded assets
  function logAssetLoad(src, success) {
    if (window.GameX.logAsset) {
      window.GameX.logAsset(src, success);
    } else if (success) {
      console.log(`Loaded asset: ${src}`);
    } else {
      console.warn(`Failed to load asset: ${src}`);
    }
  }
  
  // Asset loader system
  GameX.AssetLoader = {
    // Default image paths
    defaults: {
      backgroundImage: '/ember-chronicles/media/images/generated/title_page.png'
    },
    
    // Asset mapping - maps story page IDs to image assets
    assetMap: {
      // Main backgrounds for story pages
      '1_1': '/ember-chronicles/media/images/generated/page_1.png', // A Mysterious Invitation
      '1_1_investigate': '/ember-chronicles/media/images/generated/page_3.png', // Inquisitive Investigation
      '1_1_advice': '/ember-chronicles/media/images/generated/page_4.png', // Seeking Counsel
      '1_1_dismiss': '/ember-chronicles/media/images/generated/page_1.png', // Reuse Mysterious Invitation
      '1_1_archive': '/ember-chronicles/media/images/generated/page_2.png', // Bold Acceptance
      '2_1': '/ember-chronicles/media/images/generated/page_5.png', // Preparation for Journey
      '2_1_guide': '/ember-chronicles/media/images/generated/page_6.png', // Entering the Dark Forest
      
      // The Ember Throne Chronicles story pages (1-30)
      'title_page': '/ember-chronicles/media/images/generated/title_page.png',
      'page_1': '/ember-chronicles/media/images/generated/page_1.png',
      'page_2': '/ember-chronicles/media/images/generated/page_2.png',
      'page_3': '/ember-chronicles/media/images/generated/page_3.png',
      'page_4': '/ember-chronicles/media/images/generated/page_4.png',
      'page_5': '/ember-chronicles/media/images/generated/page_5.png',
      'page_6': '/ember-chronicles/media/images/generated/page_6.png',
      'page_7': '/ember-chronicles/media/images/generated/page_7.png',
      'page_8': '/ember-chronicles/media/images/generated/page_8.png',
      'page_9': '/ember-chronicles/media/images/generated/page_9.png',
      'page_10': '/ember-chronicles/media/images/generated/page_10.png',
      'page_11': '/ember-chronicles/media/images/generated/page_11.png',
      'page_12': '/ember-chronicles/media/images/generated/page_12.png',
      'page_13': '/ember-chronicles/media/images/generated/page_13.png',
      'page_14': '/ember-chronicles/media/images/generated/page_14.png',
      'page_15': '/ember-chronicles/media/images/generated/page_15.png',
      'page_16': '/ember-chronicles/media/images/generated/page_16.png',
      'page_17': '/ember-chronicles/media/images/generated/page_17.png',
      'page_18': '/ember-chronicles/media/images/generated/page_18.png',
      'page_19': '/ember-chronicles/media/images/generated/page_19.png',
      'page_20': '/ember-chronicles/media/images/generated/page_20.png',
      'page_21': '/ember-chronicles/media/images/generated/page_21.png',
      'page_22': '/ember-chronicles/media/images/generated/page_22.png',
      'page_23': '/ember-chronicles/media/images/generated/page_23.png',
      'page_24': '/ember-chronicles/media/images/generated/page_24.png',
      'page_25': '/ember-chronicles/media/images/generated/page_25.png',
      'page_26': '/ember-chronicles/media/images/generated/page_26.png',
      'page_27': '/ember-chronicles/media/images/generated/page_27.png',
      'page_28': '/ember-chronicles/media/images/generated/page_28.png',
      'page_29': '/ember-chronicles/media/images/generated/page_29.png',
      'page_30': '/ember-chronicles/media/images/generated/page_30.png',
      
      // Scene illustrations
      'mysterious_letter': '/ember-chronicles/media/images/generated/mysterious_letter.png',
      
      // Character portraits
      'protagonist': '/ember-chronicles/media/images/generated/protagonist.png',
      'village_elder': '/ember-chronicles/media/images/generated/village_elder.png',
      'messenger': '/ember-chronicles/media/images/generated/mysterious_messenger.png',
      
      // Character class portraits (Baldur's Gate style)
      'warrior': '/ember-chronicles/media/images/generated/characters/warrior_portrait.png',
      'mage': '/ember-chronicles/media/images/generated/characters/mage_portrait.png',
      'rogue': '/ember-chronicles/media/images/generated/characters/rogue_portrait.png',
      'cleric': '/ember-chronicles/media/images/generated/characters/cleric_portrait.png',
      
      // UI elements
      'button_frame': '/ember-chronicles/media/images/generated/button_frame.png',
      'dialog_box': '/ember-chronicles/media/images/generated/dialog_box.png',
      'inventory_slot': '/ember-chronicles/media/images/generated/inventory_bg.png',
      'loading_screen': '/ember-chronicles/media/images/generated/loading_screen.png',
      'main_menu': '/ember-chronicles/media/images/generated/main_menu.png',
      'placeholder': '/ember-chronicles/media/images/placeholder.svg'
    },
    
    // Audio mapping - references to SoundManager.soundAssetMap for consistency
    audioMap: {
      // Scene themes mapped to locations
      'title_screen': 'title_theme',
      'village': 'village_theme',
      'forest': 'forest_theme',
      'mountain': 'mountain_theme',
      'temple': 'temple_theme',
      'battle': 'battle_theme',
      'victory': 'victory_theme',
      'game_over': 'game_over',
      
      // Scene ambient sounds
      'forest_ambient': 'forest_ambience',
      'village_ambient': 'village_ambience',
      'cave_ambient': 'cave_ambience', 
      'temple_ambient': 'temple_ambience',
      'mountain_ambient': 'mountain_wind',
      
      // UI sounds
      'ui_click': 'button_click',
      'ui_page': 'page_turn',
      
      // Character voices
      'narrator': 'intro_narration',
      'elder': 'village_elder_greeting',
      'messenger_voice': 'mysterious_messenger'
    },
    
    // Preload key assets
    preload: function(callback) {
      console.log('Preloading assets...');
      
      // Set the loading screen background if available
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.backgroundImage = `url(${this.defaults.backgroundImage})`;
      }
      
      const imagesToLoad = Object.values(this.defaults).concat(
        Object.values(this.assetMap)
      );
      
      // Remove duplicates
      const uniqueImages = [...new Set(imagesToLoad)];
      
      let loadedCount = 0;
      let errorCount = 0;
      const totalCount = uniqueImages.length;
      
      // Create a promise for each image
      const imagePromises = uniqueImages.map(imageSrc => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            logAssetLoad(imageSrc, true);
            
            // Update progress if we have a progress bar
            const progressBar = document.getElementById('loading-progress');
            if (progressBar) {
              progressBar.style.width = `${(loadedCount / totalCount) * 100}%`;
            }
            
            resolve(img);
          };
          
          img.onerror = () => {
            errorCount++;
            logAssetLoad(imageSrc, false);
            console.error(`Failed to load image: ${imageSrc}`);
            resolve(null);
          };
          
          img.src = imageSrc;
        });
      });
      
      // Wait for all images to load
      Promise.all(imagePromises)
        .then(() => {
          console.log('Assets preloaded successfully');
          if (errorCount > 0) {
            console.warn(`${errorCount} assets failed to load and will use placeholders`);
          }
          
          // Preload sounds if SoundManager is available
          this.preloadSounds().then(() => {
            if (typeof callback === 'function') {
              callback();
            }
          }).catch(error => {
            console.warn('Error preloading sounds, continuing without audio:', error);
            if (typeof callback === 'function') {
              callback();
            }
          });
        })
        .catch(error => {
          console.error('Error preloading assets:', error);
          if (typeof callback === 'function') {
            callback(error);
          }
        });
    },
    
    // Preload audio assets
    preloadSounds: function() {
      return new Promise((resolve, reject) => {
        // Check if SoundManager is available
        if (!window.GameX.SoundManager) {
          console.warn('SoundManager not available, skipping sound preloading');
          resolve();
          return;
        }
        
        // Preload essential sounds using SoundManager
        window.GameX.SoundManager.preloadEmberThroneSounds()
          .then(() => {
            console.log('Essential audio assets preloaded successfully');
            resolve();
          })
          .catch(error => {
            console.warn('Error preloading audio assets:', error);
            // Resolve anyway to not block the game loading
            resolve();
          });
      });
    },
    
    // Get the image path for a specific story page
    getImageForPage: function(pageId) {
      const imagePath = this.assetMap[pageId];
      if (!imagePath) {
        console.error(`No image found for page: ${pageId}`);
        return null;
      }
      return imagePath;
    },
    
    // Get the image path for a specific character class
    getCharacterPortrait: function(characterClass) {
      const imagePath = this.assetMap[characterClass.toLowerCase()];
      if (!imagePath) {
        console.error(`No portrait found for character class: ${characterClass}`);
        return null;
      }
      return imagePath;
    },
    
    // Get the image path for a UI element
    getUIAsset: function(elementName) {
      const imagePath = this.assetMap[elementName];
      if (!imagePath) {
        console.error(`No UI asset found for: ${elementName}`);
        return null;
      }
      return imagePath;
    },
    
    // Get the sound ID for a scene theme
    getSceneTheme: function(sceneId) {
      return this.audioMap[sceneId] || null;
    },
    
    // Get the sound ID for an ambient sound
    getAmbientSound: function(sceneId) {
      return this.audioMap[`${sceneId}_ambient`] || null;
    },
    
    // Update the scene image and audio based on the current story page
    updateScene: function(pageId) {
      // Update image
      this.updateSceneImage(pageId);
      
      // Update audio if SoundManager is available
      if (window.GameX.SoundManager) {
        // Determine appropriate theme for this page
        let theme = null;
        
        // Example mappings - these should be replaced with actual game logic
        if (pageId === 'title_page') {
          theme = this.getSceneTheme('title_screen');
        } else if (pageId.startsWith('1_1')) {
          theme = this.getSceneTheme('village');
        } else if (pageId.startsWith('2_1')) {
          theme = this.getSceneTheme('forest');
        }
        
        // Play theme if found
        if (theme) {
          window.GameX.SoundManager.playMusic(theme, 0.4, true);
        }
      }
    },
    
    // Update the scene image based on the current story page
    updateSceneImage: function(pageId) {
      const sceneImage = document.getElementById('scene-image');
      if (sceneImage) {
        const imagePath = this.getImageForPage(pageId);
        sceneImage.src = imagePath;
        sceneImage.alt = `Scene for page ${pageId}`;
      }
    },
    
    // Play a UI sound
    playUISound: function(type) {
      if (window.GameX.SoundManager) {
        window.GameX.SoundManager.playUISound(type);
      }
    },
    
    // Hide the loading screen when assets are ready
    hideLoadingScreen: function() {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    },
    
    // Show a loading indication
    showLoading: function() {
      const loadingElement = document.createElement('div');
      loadingElement.id = 'asset-loading';
      loadingElement.className = 'asset-loading';
      loadingElement.innerHTML = '<div class="loading-spinner"></div><p>Loading...</p>';
      
      document.body.appendChild(loadingElement);
      
      return loadingElement;
    },
    
    // Hide the loading indication
    hideLoading: function(element) {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      } else {
        const loadingElement = document.getElementById('asset-loading');
        if (loadingElement) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }
    }
  };
  
  // Initialize loading screen on page load
  document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Start preloading assets
      GameX.AssetLoader.preload(function(error) {
        if (error) {
          console.error('Failed to preload assets:', error);
        }
        
        // Hide loading screen after a short delay (for smoother experience)
        setTimeout(function() {
          GameX.AssetLoader.hideLoadingScreen();
        }, 500);
      });
    }
  });
  
  // Add a utility to log asset loading
  window.GameX.logAsset = function(src, success) {
    console.log(success ? `Loaded asset: ${src}` : `Failed to load asset: ${src}`);
  };
})(); 