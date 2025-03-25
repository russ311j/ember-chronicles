/**
 * GameX Core Module for Ember Throne
 * Main game engine and core functionality
 */

(function() {
  // Create a namespace for the game engine
  window.GameX = window.GameX || {};
  
  // Create a stand-in for Twine's State.variables
  window.State = {
    variables: {
      player: null,
      inventory: [],
      combat: {
        inCombat: false,
        enemy: null,
        log: [],
        round: 0
      },
      currentPassage: 'start',
      passages: {},
      gameStarted: false
    }
  };

  // Core game engine
  GameX.Core = {
    // Game configuration
    config: {
      debug: true,
      savePrefix: 'gamex_save_'
    },
    
    // Current UI state
    ui: {
      currentIllustration: null,
      passageHistory: [],
      soundEnabled: true
    },
    
    // Game state
    state: {
      currentPage: null,
      player: null,
      gameStarted: false,
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        textSpeed: 'normal'
      }
    },
    
    /**
     * Initialize the game engine
     */
    init: function() {
      console.log('GameX Core initializing...');
      
      // Initialize the sound manager
      if (GameX.SoundManager) {
        GameX.SoundManager.init();
      }
      
      // Load saved game if exists
      this.loadGame();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Check if we have a character
      const characterData = sessionStorage.getItem('current-character');
      if (characterData) {
        try {
          const character = JSON.parse(characterData);
          State.variables.player = character;
          State.variables.gameStarted = true;
          // Start the game with the first passage
          this.displayPassage('start');
        } catch (error) {
          console.error('Error loading character:', error);
          // If there's an error, redirect to character creation
          window.location.href = 'setup.html';
        }
      } else {
        // No character found, redirect to character creation
        window.location.href = 'setup.html';
      }
      
      console.log('GameX Core initialized');
    },
    
    /**
     * Set up event listeners for the game
     */
    setupEventListeners: function() {
      // Listen for dice roll events
      document.addEventListener('dice-rolled', function(event) {
        const result = event.detail;
        GameX.Core.showDiceRoll(result);
      });
      
      // Add event listener for window resize
      window.addEventListener('resize', function() {
        GameX.Core.handleResize();
      });
    },
    
    /**
     * Handle window resize event
     */
    handleResize: function() {
      // Adjust UI based on screen size
      const width = window.innerWidth;
      const container = document.getElementById('story');
      
      if (container) {
        if (width < 768) {
          container.classList.add('mobile-view');
        } else {
          container.classList.remove('mobile-view');
        }
      }
    },
    
    /**
     * Display a passage by name
     * @param {string} passageName - Name of the passage to display
     */
    displayPassage: function(passageName) {
      try {
        const passage = State.variables.passages[passageName];
        
        if (!passage) {
          console.error(`Passage "${passageName}" not found.`);
          return;
        }
        
        // Reset the view
        const narrativePane = document.querySelector('.narrative-pane');
        if (!narrativePane) {
          console.error('Narrative pane element not found');
          return;
        }
        
        narrativePane.innerHTML = passage.content;
        
        // Set illustration if available
        if (passage.illustration) {
          this.setIllustration(passage.illustration, passage.fallbackIllustration);
        }
        
        // Display choices
        this.displayOptions(passage.options || []);
        
        // Update current passage
        State.variables.currentPassage = passageName;
        
        // Scroll to top
        narrativePane.scrollTop = 0;
        
        // Special hook for after passage display
        if (typeof this.onPassageDisplay === 'function') {
          this.onPassageDisplay(passage, passageName);
        }
      } catch (error) {
        console.error('Error displaying passage:', error);
      }
    },
    
    /**
     * Display options for the current passage
     * @param {Array} options - Array of options to display
     */
    displayOptions: function(options) {
      const optionsPanel = document.querySelector('.options-panel');
      if (!optionsPanel) return;
      
      // Clear existing options
      optionsPanel.innerHTML = '';
      
      // Display new options
      options.forEach(option => {
        const button = document.createElement('a');
        button.className = 'choice-link';
        button.textContent = option.text;
        button.href = '#';
        button.addEventListener('click', function(e) {
          e.preventDefault();
          GameX.Core.displayPassage(option.target);
        });
        
        optionsPanel.appendChild(button);
      });
    },
    
    /**
     * Set the current illustration
     * @param {string} url - URL of the illustration
     * @param {string} fallbackUrl - Fallback URL if the main image fails to load
     */
    setIllustration: function(url, fallbackUrl) {
      const illustration = document.querySelector('.illustration');
      if (!illustration) return;
      
      // If no URL, try to use a fallback or default
      if (!url) {
        url = fallbackUrl || 'media/images/placeholder.svg';
      }
      
      // Default fallback
      const defaultFallback = 'media/images/placeholder.svg';
      
      // Set onerror handler before setting src
      illustration.onerror = function() {
        console.warn(`Failed to load illustration: ${url}`);
        
        // Check if we're already using the fallback to avoid infinite loops
        if (this.src === fallbackUrl || this.src.includes(defaultFallback)) {
          console.error(`Both main image and fallback failed: ${url} / ${fallbackUrl}`);
          return;
        }
        
        // Try the specific fallback first
        if (fallbackUrl) {
          console.log(`Trying fallback image: ${fallbackUrl}`);
          this.src = fallbackUrl;
        } else {
          // Use default fallback
          console.log(`Using default fallback image: ${defaultFallback}`);
          this.src = defaultFallback;
        }
      };
      
      // Set the image source
      illustration.src = url;
      this.ui.currentIllustration = url;
    },
    
    /**
     * Show dice roll animation and result
     * @param {Object} result - Dice roll result
     */
    showDiceRoll: function(result) {
      // Create dice display element if it doesn't exist
      let diceDisplay = document.querySelector('.dice-display');
      
      if (!diceDisplay) {
        diceDisplay = document.createElement('div');
        diceDisplay.className = 'dice-display';
        document.querySelector('.illustration-pane').appendChild(diceDisplay);
      }
      
      // Format and display result
      const formattedResult = GameX.DiceRoller.formatRollResult(result);
      diceDisplay.innerHTML = formattedResult;
      
      // Add critical class if applicable
      if (result.isCritical) {
        diceDisplay.classList.add('critical');
      } else {
        diceDisplay.classList.remove('critical');
      }
      
      // Show the dice display
      diceDisplay.style.display = 'block';
      
      // Hide after a delay
      setTimeout(function() {
        diceDisplay.style.display = 'none';
      }, 3000);
    },
    
    /**
     * Save the current game state
     * @param {string} slotName - Optional save slot name
     */
    saveGame: function(slotName) {
      const saveData = {
        player: State.variables.player,
        inventory: State.variables.inventory,
        currentPassage: State.variables.currentPassage,
        timestamp: new Date().toISOString()
      };
      
      const saveKey = this.config.savePrefix + (slotName || 'auto');
      
      try {
        localStorage.setItem(saveKey, JSON.stringify(saveData));
        console.log(`Game saved to ${saveKey}`);
      } catch (e) {
        console.error('Failed to save game:', e);
      }
    },
    
    /**
     * Load a saved game
     * @param {string} slotName - Optional save slot name
     * @returns {boolean} Success status
     */
    loadGame: function(slotName) {
      const saveKey = this.config.savePrefix + (slotName || 'auto');
      
      try {
        const saveData = localStorage.getItem(saveKey);
        
        if (!saveData) {
          return false;
        }
        
        const data = JSON.parse(saveData);
        
        // Restore state
        State.variables.player = data.player;
        State.variables.inventory = data.inventory;
        
        console.log(`Game loaded from ${saveKey}`);
        
        // Display the saved passage
        if (data.currentPassage) {
          this.displayPassage(data.currentPassage);
        }
        
        return true;
      } catch (e) {
        console.error('Failed to load game:', e);
        return false;
      }
    },
    
    /**
     * Reset the game to initial state
     */
    resetGame: function() {
      // Reset state
      State.variables.player = null;
      State.variables.inventory = [];
      State.variables.combat.inCombat = false;
      State.variables.combat.enemy = null;
      State.variables.combat.log = [];
      State.variables.combat.round = 0;
      
      // Reset UI
      this.ui.passageHistory = [];
      
      // Start from beginning
      this.displayPassage('start');
      
      console.log('Game reset');
    }
  };

  // Initialize when the DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Define the initial story passages
    State.variables.passages = {
      'start': {
        content: '<h1>Welcome to GameX</h1><p>Your adventure begins here. You receive a mysterious letter that beckons you to an adventure. What will you do?</p>',
        options: [
          { text: 'Follow the path through the dark forest', target: 'forest_path' },
          { text: 'Take the mountain pass', target: 'mountain_pass' },
          { text: 'Visit the village tavern for information', target: 'village_tavern' }
        ],
        illustration: 'media/images/generated/mysterious_letter.png',
        fallbackIllustration: 'media/images/placeholder.svg'
      },
      'forest_path': {
        content: '<h1>Forest Path</h1><p>You venture into the dense forest at night. The path is barely visible and the trees seem to close in around you. In the distance, you notice a ghostly figure watching you from between the trees.</p>',
        options: [
          { text: 'Approach the ghostly figure', target: 'ghost_encounter' },
          { text: 'Find another path', target: 'forest_crossroads' },
          { text: 'Return to where you started', target: 'start' }
        ],
        illustration: 'media/images/generated/forest_path_ghost.png',
        fallbackIllustration: 'media/images/placeholder.svg'
      },
      'mountain_pass': {
        content: '<h1>Mountain Pass</h1><p>You choose the treacherous mountain pass. As you cross an ancient stone bridge spanning a deep chasm, you notice storm clouds gathering overhead. The wind picks up, making the crossing more dangerous.</p>',
        options: [
          { text: 'Press forward despite the storm', target: 'mountain_storm' },
          { text: 'Seek shelter in a nearby cave', target: 'mountain_cave' },
          { text: 'Go back and choose another route', target: 'start' }
        ],
        illustration: 'media/images/generated/mountain_pass.png',
        fallbackIllustration: 'media/images/placeholder.svg'
      },
      'village_tavern': {
        content: '<h1>Village Tavern</h1><p>You enter the warm, bustling tavern. Patrons chat and drink merrily, but in the corner sits a mysterious hooded figure who seems to be watching you. The bartender nods in your direction.</p>',
        options: [
          { text: 'Approach the hooded figure', target: 'mysterious_stranger' },
          { text: 'Speak with the bartender', target: 'bartender_info' },
          { text: 'Leave the tavern and try another path', target: 'start' }
        ],
        illustration: 'media/images/generated/village_tavern.png',
        fallbackIllustration: 'media/images/placeholder.svg'
      },
      'cave_entrance': {
        content: '<h1>Cave Entrance</h1><p>You step into the cave. The light from outside quickly fades as you move deeper. You can make out two passages ahead - one to the left and one to the right.</p>',
        options: [
          { text: 'Take the left passage', target: 'left_passage' },
          { text: 'Take the right passage', target: 'right_passage' },
          { text: 'Go back outside', target: 'start' }
        ],
        illustration: 'media/images/cave_interior.svg'
      },
      'cave_exterior': {
        content: '<h1>Outside the Cave</h1><p>You survey the area around the cave entrance. You find an old torch and some flint lying nearby. These could be useful inside the dark cave.</p>',
        options: [
          { text: 'Take the torch and enter the cave', target: 'cave_entrance_with_torch' },
          { text: 'Enter the cave without the torch', target: 'cave_entrance' }
        ],
        illustration: 'media/images/cave_entrance.svg'
      },
      'cave_entrance_with_torch': {
        content: '<h1>Cave Entrance</h1><p>You light the torch, which illuminates the cave with a warm glow. You can now see the passages more clearly. The left passage slopes downward, while the right passage seems to lead slightly upward.</p>',
        options: [
          { text: 'Take the left passage', target: 'left_passage_lit' },
          { text: 'Take the right passage', target: 'right_passage_lit' },
          { text: 'Go back outside', target: 'start' }
        ],
        illustration: 'media/images/cave_interior.svg'
      },
      'left_passage': {
        content: '<h1>Dark Passage</h1><p>You cautiously move down the left passage in the darkness. Suddenly, you hear a growl ahead. Before you can react, a goblin leaps out at you!</p>',
        options: [
          { text: 'Fight the goblin', target: 'goblin_combat' },
          { text: 'Try to run back', target: 'run_from_goblin' }
        ],
        illustration: 'media/images/cave_interior.svg'
      },
      'goblin_combat': {
        content: '<h1>Combat: Goblin</h1><p>The goblin attacks with a crude dagger! You must defend yourself!</p>',
        options: [
          { text: 'Attack', target: 'goblin_combat_attack' },
          { text: 'Defend', target: 'goblin_combat_defend' },
          { text: 'Flee', target: 'run_from_goblin' }
        ],
        illustration: 'media/images/placeholder.svg'
      }
    };
    
    // Initialize the core engine
    GameX.Core.init();
  });
})(); 