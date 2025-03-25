/**
 * Novel Style Engine
 * Provides novel-like presentation and AI image generation for GameX RPG
 */

// Create GameX namespace if it doesn't exist
window.GameX = window.GameX || {};

// Novel Style Engine
GameX.NovelStyleEngine = (function() {
  // Private variables
  let config = {
    defaultStyle: 'fantasy book illustration, dramatic lighting',
    cacheImages: true,
    imageWidth: 800,
    imageHeight: 600
  };
  
  let imageCache = {};
  let currentChapter = '';
  let currentPage = 1;
  let isNovelStyleEnabled = true;

  // DOM elements
  let pageNumberElement = null;
  let chapterTitleElement = null;
  let sceneImageElement = null;
  let novelContainerElement = null;
  
  // Initialize the engine
  function init(userConfig = {}) {
    // Merge user config with defaults
    config = {...config, ...userConfig};
    
    console.log('Novel Style Engine initialized with config:', config);
    
    // Create novel style elements if they don't exist
    createNovelElements();
    
    // Set default page number and chapter
    updatePageNumber(1);
    
    // Apply novel style if enabled
    if (isNovelStyleEnabled) {
      document.body.classList.add('novel-style');
    }
    
    // Initialize references to DOM elements
    pageNumberElement = document.getElementById('novel-page-number');
    chapterTitleElement = document.getElementById('novel-chapter-title');
    sceneImageElement = document.getElementById('scene-image');
    novelContainerElement = document.getElementById('novel-ui-container');
    
    return true;
  }
  
  // Create novel style elements
  function createNovelElements() {
    // Create novel UI container if it doesn't exist
    if (!document.getElementById('novel-ui-container')) {
      const novelContainer = document.createElement('div');
      novelContainer.id = 'novel-ui-container';
      
      // Create page number element
      const pageNumber = document.createElement('div');
      pageNumber.id = 'novel-page-number';
      pageNumber.className = 'novel-page-number';
      pageNumber.innerHTML = '<span>Page 1</span>';
      
      // Create chapter title element
      const chapterTitle = document.createElement('div');
      chapterTitle.id = 'novel-chapter-title';
      chapterTitle.className = 'novel-chapter-title';
      chapterTitle.innerHTML = '<span>Chapter I</span>';
      
      // Create book corners
      const cornerElements = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      cornerElements.forEach(corner => {
        const cornerElement = document.createElement('div');
        cornerElement.className = `novel-corner ${corner}-corner`;
        novelContainer.appendChild(cornerElement);
      });
      
      // Create book binding
      const binding = document.createElement('div');
      binding.className = 'novel-binding';
      
      // Add elements to container
      novelContainer.appendChild(pageNumber);
      novelContainer.appendChild(chapterTitle);
      novelContainer.appendChild(binding);
      
      // Add container to the document
      document.body.appendChild(novelContainer);
    }
  }
  
  // Update page number
  function updatePageNumber(page) {
    currentPage = page;
    
    // Update DOM if element exists
    if (pageNumberElement) {
      pageNumberElement.innerHTML = `<span>Page ${page}</span>`;
    } else if (document.getElementById('novel-page-number')) {
      document.getElementById('novel-page-number').innerHTML = `<span>Page ${page}</span>`;
    }
  }
  
  // Set chapter title
  function setChapterTitle(title) {
    currentChapter = title;
    
    // Update DOM if element exists
    if (chapterTitleElement) {
      chapterTitleElement.innerHTML = `<span>${title}</span>`;
    } else if (document.getElementById('novel-chapter-title')) {
      document.getElementById('novel-chapter-title').innerHTML = `<span>${title}</span>`;
    }
  }
  
  // Enable/disable novel style
  function toggleNovelStyle() {
    isNovelStyleEnabled = !isNovelStyleEnabled;
    
    if (isNovelStyleEnabled) {
      document.body.classList.add('novel-style');
    } else {
      document.body.classList.remove('novel-style');
    }
    
    return isNovelStyleEnabled;
  }
  
  // Generate background image using AI
  function generateBackground(prompt) {
    return new Promise((resolve, reject) => {
      // Check if image is cached
      const cacheKey = `bg_${prompt}`;
      if (config.cacheImages && imageCache[cacheKey]) {
        console.log('Using cached image for prompt:', prompt);
        resolve(imageCache[cacheKey]);
        return;
      }
      
      // Show loading state
      if (novelContainerElement) {
        novelContainerElement.classList.add('loading');
      }
      
      // Check if MCP is available
      if (!window.MCP || !window.MCP.gameAssets) {
        console.warn('MCP Game Assets API not available. Using placeholder image.');
        reject(new Error('MCP not available'));
        return;
      }
      
      // Use the full prompt with style
      const fullPrompt = `${prompt}, ${config.defaultStyle}`;
      
      console.log('Generating image with prompt:', fullPrompt);
      
      // Call MCP API to generate image
      window.MCP.gameAssets.generateImage({
        prompt: fullPrompt,
        width: config.imageWidth,
        height: config.imageHeight,
        outputFormat: 'url'
      })
      .then(result => {
        console.log('Image generated successfully');
        
        // Cache the result if caching is enabled
        if (config.cacheImages) {
          imageCache[cacheKey] = result.url;
        }
        
        // Hide loading state
        if (novelContainerElement) {
          novelContainerElement.classList.remove('loading');
        }
        
        resolve(result.url);
      })
      .catch(error => {
        console.error('Error generating image:', error);
        
        // Hide loading state
        if (novelContainerElement) {
          novelContainerElement.classList.remove('loading');
        }
        
        reject(error);
      });
    });
  }
  
  // Apply background image to the scene
  function applyBackground(imageUrl) {
    if (!imageUrl) return false;
    
    // Apply to scene image element if it exists
    if (sceneImageElement) {
      sceneImageElement.src = imageUrl;
      return true;
    } else if (document.getElementById('scene-image')) {
      document.getElementById('scene-image').src = imageUrl;
      return true;
    }
    
    return false;
  }
  
  // Generate background image if none is provided
  function ensureBackground(passage) {
    if (!passage || !passage.imagePrompt) return;
    
    generateBackground(passage.imagePrompt)
      .then(imageUrl => {
        applyBackground(imageUrl);
      })
      .catch(error => {
        console.error('Error ensuring background:', error);
        
        // Fallback to the default image
        if (passage.image) {
          if (sceneImageElement) {
            sceneImageElement.src = passage.image;
          } else if (document.getElementById('scene-image')) {
            document.getElementById('scene-image').src = passage.image;
          }
        }
      });
  }
  
  // Fallback method for image generation without MCP
  function fallbackImageGeneration(prompt) {
    console.warn('Using fallback image generation for prompt:', prompt);
    
    // In a real implementation, this might call a server-side endpoint
    // For now, we'll just return the placeholder image
    return Promise.resolve('media/images/placeholder.svg');
  }
  
  // Clear image cache
  function clearImageCache() {
    imageCache = {};
    console.log('Image cache cleared');
  }
  
  // Public API
  return {
    init,
    generateBackground,
    applyBackground,
    updatePageNumber,
    setChapterTitle,
    toggleNovelStyle,
    ensureBackground,
    clearImageCache
  };
})(); 