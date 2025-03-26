/**
 * GameX Utilities Module for Ember Throne
 * Common utility functions and helpers
 */

(function() {
  // Create a namespace for utilities
  window.GameX = window.GameX || {};
  
  // Utility functions
  GameX.Utils = {
    /**
     * Roll a dice with the specified number of sides and modifier
     * This is a simplified version of the dice roller functionality
     * for use in utility contexts
     * 
     * @param {number} sides - Number of sides on the dice
     * @param {number} modifier - Bonus or penalty to add to the roll
     * @returns {number} The result of the roll
     */
    rollDice: function(sides, modifier = 0) {
      const roll = Math.floor(Math.random() * sides) + 1;
      return roll + modifier;
    },
    
    /**
     * Format an item name by replacing underscores with spaces
     * @param {string} name - The name to format
     * @returns {string} Formatted name
     */
    formatItemName: function(name) {
      if (!name) return '';
      return name.replace(/_/g, ' ');
    },
    
    /**
     * Check if an array contains a specific item
     * @param {Array} array - The array to check
     * @param {*} item - The item to look for
     * @param {string} [property] - Optional property name to compare
     * @returns {boolean} Whether the array contains the item
     */
    arrayContains: function(array, item, property) {
      if (!array || !Array.isArray(array)) return false;
      
      if (property) {
        return array.some(element => element[property] === item);
      }
      
      return array.includes(item);
    },
    
    /**
     * Safely get a nested property from an object with a default value
     * @param {Object} obj - The object to access
     * @param {string} path - The property path (e.g., 'user.profile.name')
     * @param {*} defaultValue - Default value if property doesn't exist
     * @returns {*} The property value or default value
     */
    safeGet: function(obj, path, defaultValue = null) {
      if (!obj || !path) return defaultValue;
      
      const keys = path.split('.');
      let result = obj;
      
      for (const key of keys) {
        if (result === null || result === undefined || typeof result !== 'object') {
          return defaultValue;
        }
        
        result = result[key];
        
        if (result === undefined) {
          return defaultValue;
        }
      }
      
      return result === undefined ? defaultValue : result;
    },
    
    /**
     * Safely update a game state variable
     * @param {string} property - Property name in State.variables
     * @param {*} value - Value to set
     * @returns {boolean} Success status
     */
    updateState: function(property, value) {
      if (!window.State || !window.State.variables) {
        console.error("Game state not initialized");
        return false;
      }
      
      window.State.variables[property] = value;
      return true;
    },
    
    /**
     * Clamp a number between a minimum and maximum value
     * @param {number} value - The value to clamp
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @returns {number} The clamped value
     */
    clamp: function(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Shuffle an array in place
     * @param {Array} array - The array to shuffle
     * @returns {Array} The shuffled array
     */
    shuffleArray: function(array) {
      if (!array || !Array.isArray(array)) return array;
      
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      
      return array;
    },
    
    /**
     * Format a number with commas as thousands separators
     * @param {number} number - The number to format
     * @returns {string} Formatted number
     */
    formatNumber: function(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * Show a notification message on screen
     * Requires a notification element with ID 'notification'
     * @param {string} message - The message to display
     * @param {string} type - Type of notification (info, success, warning, error)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: function(message, type = 'info', duration = 3000) {
      // Check if notification element exists
      let notificationEl = document.getElementById('notification');
      
      // Create notification element if it doesn't exist
      if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.id = 'notification';
        notificationEl.style.position = 'fixed';
        notificationEl.style.top = '20px';
        notificationEl.style.right = '20px';
        notificationEl.style.padding = '10px 20px';
        notificationEl.style.borderRadius = '5px';
        notificationEl.style.color = 'white';
        notificationEl.style.fontWeight = 'bold';
        notificationEl.style.zIndex = '1000';
        notificationEl.style.opacity = '0';
        notificationEl.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(notificationEl);
      }
      
      // Set color based on notification type
      let backgroundColor;
      switch (type) {
        case 'success':
          backgroundColor = '#4CAF50'; // Green
          break;
        case 'warning':
          backgroundColor = '#FF9800'; // Orange
          break;
        case 'error':
          backgroundColor = '#F44336'; // Red
          break;
        default:
          backgroundColor = '#2196F3'; // Blue
      }
      
      // Update notification element
      notificationEl.textContent = message;
      notificationEl.style.backgroundColor = backgroundColor;
      
      // Show notification
      notificationEl.style.opacity = '1';
      
      // Hide notification after duration
      setTimeout(() => {
        notificationEl.style.opacity = '0';
      }, duration);
    },
    
    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} html - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml: function(html) {
      if (!html) return '';
      
      return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },
    
    /**
     * Deep clone an object
     * @param {*} obj - The object to clone
     * @returns {*} Cloned object
     */
    deepClone: function(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      
      if (obj instanceof Array) {
        return obj.map(item => this.deepClone(item));
      }
      
      if (obj instanceof Object) {
        const copy = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = this.deepClone(obj[key]);
          }
        }
        return copy;
      }
      
      // If we got here, the type is not supported
      console.error('Unable to copy object. Unsupported type:', obj);
      return obj;
    },

    // Default placeholder image path
    PLACEHOLDER_IMAGE: '/media/images/placeholder/placeholder.svg',

    // Handle image loading errors
    handleImageError: function(img) {
        console.log('Image failed to load:', img.src);
        // Store the original source for potential retry
        img.dataset.originalSrc = img.src;
        // Set the placeholder image
        img.src = this.PLACEHOLDER_IMAGE;
        return true; // Prevent default error handling
    },

    // Initialize image error handling
    initImageErrorHandling: function() {
        // Add global image error handler
        document.addEventListener('error', function(e) {
            if (e.target.tagName.toLowerCase() === 'img') {
                GameX.Utils.handleImageError(e.target);
            }
        }, true);

        // Fix existing broken images
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete || img.naturalHeight === 0) {
                GameX.Utils.handleImageError(img);
            }
        });
    },

    // Handle CSS security errors
    fixCssBackgroundImages: function(brokenUrl) {
      // This fixes any CSS background-image properties that use the broken image
      const styleSheets = document.styleSheets;
      
      try {
        for (let i = 0; i < styleSheets.length; i++) {
          const sheet = styleSheets[i];
          let rules;
          
          try {
            // Only process same-origin stylesheets to avoid security errors
            if (sheet.href && new URL(sheet.href).origin !== window.location.origin) {
              console.log('Skipping cross-origin stylesheet:', sheet.href);
              continue;
            }
            
            rules = sheet.cssRules || sheet.rules;
          } catch (e) {
            console.warn('Cannot access rules in stylesheet. This is normal for cross-origin stylesheets.');
            continue;
          }
          
          if (!rules) continue;
          
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            
            if (!rule.style) continue;
            
            const bgImage = rule.style.backgroundImage;
            
            if (bgImage && bgImage.includes(brokenUrl)) {
              const newBgImage = `url('/media/images/placeholder.svg')`;
              console.log(`Fixing CSS background image: ${bgImage} -> ${newBgImage}`);
              
              // We can't directly modify the rule in some browsers, so we'll add a new style
              const selector = rule.selectorText;
              if (selector) {
                const styleEl = document.createElement('style');
                styleEl.textContent = `${selector} { background-image: ${newBgImage} !important; }`;
                document.head.appendChild(styleEl);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fixing CSS background images:', error);
      }
    },

    // Improved image error handling
    replaceBrokenImage: function(img) {
      if (!img) return;
      
      try {
        // Store the original src for debugging
        const originalSrc = img.src;
        
        // Set to placeholder
        img.src = GameX.Utils.PLACEHOLDER_IMAGE;
        
        // Log the replacement
        console.log(`Replaced broken image: ${originalSrc} -> ${GameX.Utils.PLACEHOLDER_IMAGE}`);
        
        // Try to fix background images in CSS
        GameX.Utils.fixCssBackgroundImages(originalSrc);
      } catch (error) {
        console.error('Error replacing broken image:', error);
      }
    },

    // Capture asset errors
    assetError: function(event) {
      if (!event.target) return;
      
      try {
        // Handle image loading failures
        if (event.target.tagName === 'IMG') {
          console.log('Failed to load asset:', event.target.src);
          GameX.Utils.replaceBrokenImage(event.target);
        }
        
        // Prevent default error handling
        event.preventDefault();
        return false;
      } catch (error) {
        console.error('Error in asset error handler:', error);
      }
    },

    // Random number generator
    random: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Format text with variables
    formatText: function(text, variables) {
      return text.replace(/\{(\w+)\}/g, function(match, key) {
        return variables[key] || match;
      });
    }
  };
  
  // Register with Twine/Harlowe if available
  if (window.setup && typeof window.setup.utils === 'undefined') {
    window.setup.utils = GameX.Utils;
  }
})();

// Loading screen functionality
const loadingScreen = {
  element: null,
  progressBar: null,
  progressText: null,
  progress: 0,
  totalAssets: 7,
  loadedAssets: 0,
  placeholderFallback: '/media/images/placeholder.svg',

  init: function() {
    this.element = document.getElementById('loading-screen');
    this.progressBar = document.getElementById('loading-progress');
    this.progressText = document.getElementById('loading-text');
    
    if (!this.element || !this.progressBar || !this.progressText) {
      console.error('Loading screen elements not found');
      return;
    }
    
    // Preload our generated assets for Ember Throne Chronicles
    this.preloadAssets([
      '/media/images/generated/title_page.png',
      '/media/images/generated/main_menu.png',
      '/media/images/generated/loading_screen.png',
      '/media/images/generated/button_frame.png',
      '/media/images/generated/dialog_box.png',
      '/media/images/generated/inventory_bg.png',
      '/media/images/generated/page_1.png',
      '/media/images/generated/page_2.png',
      '/media/images/generated/page_3.png',
      '/media/images/generated/page_4.png',
      '/media/images/generated/page_5.png',
      '/media/images/generated/protagonist.png',
      '/media/images/generated/village_elder.png',
      '/media/images/generated/mysterious_messenger.png',
      '/media/images/generated/mysterious_letter.png'
    ]);
  },

  preloadAssets: function(assetUrls) {
    this.totalAssets = assetUrls.length;
    this.loadedAssets = 0;
    
    // Pre-check if placeholder exists
    this.checkPlaceholderExists();
    
    assetUrls.forEach(url => {
      const img = new Image();
      img.onload = () => this.assetLoaded(url);
      img.onerror = () => this.assetError(url);
      img.src = url;
    });
    
    // Fallback in case assets fail to load
    setTimeout(() => {
      if (this.loadedAssets < this.totalAssets) {
        console.warn('Some assets failed to load. Proceeding anyway.');
        this.hide();
      }
    }, 5000);
  },
  
  checkPlaceholderExists: function() {
    const placeholderImg = new Image();
    placeholderImg.onerror = () => {
      console.warn('Placeholder image not found at:', this.placeholderFallback);
      // Try to find any image that might work as a fallback
      this.placeholderFallback = '/media/images/placeholder.svg';
    };
    placeholderImg.src = this.placeholderFallback;
  },
  
  replaceBrokenImage: function(url) {
    // Replace any broken images in the DOM with the placeholder
    const selector = `img[src="${url}"]`;
    document.querySelectorAll(selector).forEach(img => {
      console.log(`Replacing broken image ${url} with placeholder`);
      img.src = this.placeholderFallback;
      
      // Add error handler to the image to handle future errors
      img.onerror = function() {
        if (this.src !== loadingScreen.placeholderFallback) {
          this.src = loadingScreen.placeholderFallback;
        }
      };
    });
    
    // Also handle background images in CSS
    this.fixCssBackgroundImages(url);
  },
  
  assetLoaded: function(url) {
    this.loadedAssets++;
    this.updateProgress();
    console.log(`Loaded asset: ${url}`);
    
    if (this.loadedAssets >= this.totalAssets) {
      setTimeout(() => this.hide(), 500); // Short delay for visual effect
    }
  },
  
  assetError: function(url) {
    console.error(`Failed to load asset: ${url}`);
    this.loadedAssets++;
    this.updateProgress();
    
    // Replace broken image with placeholder
    this.replaceBrokenImage(url);
    
    if (this.loadedAssets >= this.totalAssets) {
      setTimeout(() => this.hide(), 500);
    }
  },
  
  updateProgress: function() {
    const percent = Math.min(100, Math.round((this.loadedAssets / this.totalAssets) * 100));
    this.progress = percent;
    this.progressBar.style.width = `${percent}%`;
    this.progressText.textContent = `Loading game assets... ${percent}%`;
  },
  
  hide: function() {
    this.element.style.opacity = '0';
    setTimeout(() => {
      this.element.style.display = 'none';
      // Ensure main menu is properly displayed
      const mainMenu = document.getElementById('main-menu');
      if (mainMenu) {
        mainMenu.style.display = 'flex';
        mainMenu.style.opacity = '1';
        mainMenu.classList.add('active');
      }
    }, 500);
  }
};

// Initialize loading screen when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadingScreen.init();
  
  // Add global handler for image errors
  document.addEventListener('error', function(event) {
    // Only handle image errors
    if (event.target.tagName.toLowerCase() !== 'img') return;
    
    const img = event.target;
    const src = img.src;
    
    // Skip if already using placeholder
    if (src.includes('/media/images/placeholder.svg')) return;
    
    console.warn(`Global handler caught image load error: ${src}`);
    
    // Replace with placeholder
    img.src = '/media/images/placeholder.svg';
    
    // Prevent infinite error loops
    img.onerror = null;
  }, true); // Use capture phase to catch all errors
  
  // Fix background images that might not load
  setTimeout(fixBackgroundImages, 1000);

  GameX.Utils.initImageErrorHandling();
});

// Function to ensure background images have fallbacks
function fixBackgroundImages() {
  const elementsToCheck = [
    '#main-menu',
    '#character-creation',
    '#loading-screen'
  ];
  
  elementsToCheck.forEach(selector => {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const computedStyle = window.getComputedStyle(element);
    const bgImage = computedStyle.backgroundImage;
    
    // If no background or using placeholder, skip
    if (!bgImage || bgImage === 'none' || bgImage.includes('/media/images/placeholder.svg')) return;
    
    // Create a test image to check if the background loads
    const testImg = new Image();
    testImg.onerror = function() {
      console.warn(`Background image failed to load for ${selector}`);
      
      // Apply fallback style
      const style = document.createElement('style');
      style.textContent = `${selector} { background-image: url('/media/images/placeholder.svg') !important; }`;
      document.head.appendChild(style);
    };
    
    // Extract URL from background-image property
    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match && match[1]) {
      testImg.src = match[1];
    }
  });
}

// Other utility functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(amount) {
  return amount.toLocaleString() + ' gold';
}

function calculateDamage(attackStat, weaponDamage) {
  const baseDamage = weaponDamage;
  const statBonus = Math.floor(attackStat / 3);
  return baseDamage + statBonus;
}

function calculateHitChance(attackStat, targetDefense) {
  const baseChance = 70;
  const modifier = attackStat - targetDefense;
  return Math.min(95, Math.max(5, baseChance + modifier));
}

// Simplified weighted random selection from an array of options
function weightedRandom(options) {
  const totalWeight = options.reduce((sum, option) => sum + (option.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const option of options) {
    const weight = option.weight || 1;
    if (random < weight) return option;
    random -= weight;
  }
  
  return options[0]; // Fallback
} 