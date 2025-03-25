/**
 * game-engine.js
 * Main game engine that handles rendering, game loop, and core game mechanics
 */

window.GameX = window.GameX || {};

window.GameX.GameEngine = (function() {
  // Private variables
  let canvas, ctx;
  let character;
  let gameMode = 'explore'; // explore, move, attack, interact
  let entities = [];
  let hoverEntity = null;
  let mapData = null;
  let playerPosition = { x: 5, y: 5 };
  
  // Map and tile data
  const TILE_SIZE = 40; // Size of each tile in pixels
  const MAP_WIDTH = 20; // Width of the map in tiles
  const MAP_HEIGHT = 10; // Height of the map in tiles
  
  // Asset loading
  const assets = {
    tiles: {},
    entities: {},
    loaded: 0,
    total: 0
  };
  
  // Tile type definitions
  const TILE_TYPES = {
    GRASS: 0,
    DIRT: 1,
    STONE: 2,
    WATER: 3,
    TREE: 4,
    WALL: 5
  };
  
  // Entity type definitions
  const ENTITY_TYPES = {
    PLAYER: 0,
    NPC: 1,
    ENEMY: 2,
    ITEM: 3,
    CHEST: 4,
    DOOR: 5
  };
  
  // Generate a simple test map
  function generateTestMap() {
    // Create an empty map filled with grass
    const map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH).fill(TILE_TYPES.GRASS));
    
    // Add some terrain features
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        // Create a river
        if (x === 3 && y > 2) {
          map[y][x] = TILE_TYPES.WATER;
        }
        
        // Create some trees
        if ((x === 8 && y === 2) || (x === 9 && y === 3) || (x === 7 && y === 4)) {
          map[y][x] = TILE_TYPES.TREE;
        }
        
        // Create a stone path
        if (y === 6 && x > 4 && x < 15) {
          map[y][x] = TILE_TYPES.STONE;
        }
        
        // Create some walls
        if ((y === 2 && x > 12 && x < 18) || (y === 8 && x > 12 && x < 18)) {
          map[y][x] = TILE_TYPES.WALL;
        }
        if ((x === 12 && y > 2 && y < 9) || (x === 17 && y > 2 && y < 9)) {
          map[y][x] = TILE_TYPES.WALL;
        }
      }
    }
    
    return map;
  }
  
  // Create test entities
  function generateTestEntities() {
    return [
      {
        id: 'player',
        type: ENTITY_TYPES.PLAYER,
        x: playerPosition.x,
        y: playerPosition.y,
        name: character ? character.name : 'Player',
        color: '#ffeb3b',
        canInteract: false
      },
      {
        id: 'npc1',
        type: ENTITY_TYPES.NPC,
        x: 7,
        y: 6,
        name: 'Village Elder',
        color: '#4caf50',
        dialogues: [
          'Welcome, adventurer! I\'ve been expecting you.',
          'The ancient temple to the east holds many secrets.',
          'Be careful on your journey. These lands have grown dangerous lately.'
        ],
        currentDialogue: 0,
        canInteract: true
      },
      {
        id: 'enemy1',
        type: ENTITY_TYPES.ENEMY,
        x: 10,
        y: 4,
        name: 'Forest Wolf',
        health: 25,
        maxHealth: 25,
        level: 3,
        damage: [3, 6],
        attackSpeed: 1.2,
        color: '#f44336',
        canInteract: true
      },
      {
        id: 'chest1',
        type: ENTITY_TYPES.CHEST,
        x: 15,
        y: 5,
        name: 'Treasure Chest',
        color: '#ff9800',
        loot: ['Health Potion', 'Gold Coin', 'Silver Dagger'],
        isOpen: false,
        canInteract: true
      }
    ];
  }
  
  // Load all game assets
  function loadAssets() {
    // Placeholder - normally we would load images here
    // Since we're just using colors for now, this function just simulates loading
    
    // Simulate asset loading with a short timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Load success
        resolve();
      }, 500);
    });
  }
  
  // Load generated assets from the generated directory
  function loadGeneratedAssets() {
    console.log('Loading generated assets for Ember Throne Chronicles...');
    
    // Image asset categories to load
    const assetCategories = [
      {
        type: 'pages',
        path: 'media/images/generated/pages/'
      },
      {
        type: 'characters',
        path: 'media/images/generated/characters/'
      },
      {
        type: 'locations',
        path: 'media/images/generated/locations/'
      },
      {
        type: 'items',
        path: 'media/images/generated/items/'
      },
      {
        type: 'ui',
        path: 'media/images/generated/ui/'
      }
    ];
    
    let totalAssetsLoaded = 0;
    let totalAssetsFailed = 0;
    
    // Create promises for each asset type
    const loadPromises = assetCategories.map(category => {
      return fetch(`${category.path}manifest.json`)
        .then(response => {
          if (!response.ok) {
            // If manifest doesn't exist, just skip this category
            console.log(`No manifest for ${category.type}, skipping`);
            return Promise.resolve([]);
          }
          return response.json();
        })
        .then(manifest => {
          if (!manifest || !manifest.assets) {
            return Promise.resolve([]);
          }
          
          console.log(`Loading ${manifest.assets.length} ${category.type} assets`);
          
          // Create an array of promises for each asset in the category
          const assetPromises = manifest.assets.map(asset => {
            // Use the AssetLoader to load each asset
            return this.AssetLoader.loadImage(asset.id, asset.path)
              .then(() => {
                totalAssetsLoaded++;
                return { id: asset.id, success: true };
              })
              .catch(error => {
                console.error(`Failed to load asset ${asset.id}: ${error}`);
                totalAssetsFailed++;
                return { id: asset.id, success: false, error };
              });
          });
          
          return Promise.all(assetPromises);
        })
        .catch(error => {
          console.warn(`Error loading ${category.type} assets:`, error);
          return Promise.resolve([]);
        });
    });
    
    // When all categories are loaded
    Promise.all(loadPromises)
      .then(() => {
        console.log(`Finished loading generated assets: ${totalAssetsLoaded} loaded, ${totalAssetsFailed} failed`);
        
        // After image assets are loaded, initiate sound asset loading
        if (this.SoundManager && this.SoundManager.isInitialized) {
          this.SoundManager.preloadEmberThroneSounds();
        } else {
          console.log('SoundManager not initialized, sound assets will be loaded on user interaction');
        }
        
        // Show the title screen or starting page
        if (this.StorySystem) {
          // Start with a fade-in effect
          document.getElementById('loading-screen').style.opacity = '0';
          setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            this.StorySystem.start();
            
            // Play title theme if sound manager is available
            if (this.SoundManager && this.SoundManager.isInitialized) {
              this.SoundManager.playMusic('title_theme', { fadeIn: 2 });
            }
          }, 1000);
        }
      })
      .catch(error => {
        console.error('Error during asset loading:', error);
      });
  }
  
  // Initialize the game engine
  function init(canvasId, playerCharacter) {
    canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas element with ID "${canvasId}" not found`);
      return null;
    }
    
    ctx = canvas.getContext('2d');
    character = playerCharacter;
    
    // Generate test map and entities
    mapData = generateTestMap();
    entities = generateTestEntities();
    
    // Start the game loop
    Promise.all([
      loadAssets(),
      loadGeneratedAssets()
    ]).then(() => {
      // Start the game loop
      requestAnimationFrame(gameLoop);
    }).catch(error => {
      console.error('Error loading assets:', error);
      // Start the game loop anyway, with fallback assets
      requestAnimationFrame(gameLoop);
    });
    
    // Return the public API
    return {
      enterMoveMode,
      enterAttackMode,
      enterInteractMode,
      enterExploreMode,
      handleCanvasClick,
      handleCanvasHover,
      handleKeyDown,
      getPlayerPosition: () => ({ ...playerPosition }),
      getEntities: () => [...entities]
    };
  }
  
  // Game loop
  function gameLoop(timestamp) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render the game world
    renderMap();
    renderEntities();
    renderUI();
    
    // Request the next frame
    requestAnimationFrame(gameLoop);
  }
  
  // Render the game map
  function renderMap() {
    if (!mapData) return;
    
    // Try to use forest background if available
    if (assets.background && assets.background.forest) {
      // Draw the background image stretched to fit the map
      ctx.drawImage(
        assets.background.forest,
        0,
        0,
        MAP_WIDTH * TILE_SIZE,
        MAP_HEIGHT * TILE_SIZE
      );
      
      // Draw a semi-transparent overlay to ensure the grid is visible
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    }
    
    // Draw the map tiles
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tileType = mapData[y][x];
        const tileX = x * TILE_SIZE;
        const tileY = y * TILE_SIZE;
        
        // If we're using a background image, only draw special tiles
        if (assets.background && assets.background.forest) {
          // Only render water, walls, and other special tiles
          if (tileType === TILE_TYPES.GRASS || tileType === TILE_TYPES.DIRT) {
            continue;
          }
        }
        
        // Set color based on tile type
        let color;
        switch (tileType) {
          case TILE_TYPES.GRASS:
            color = '#8bc34a'; // Light Green
            break;
          case TILE_TYPES.DIRT:
            color = '#795548'; // Brown
            break;
          case TILE_TYPES.STONE:
            color = '#9e9e9e'; // Gray
            break;
          case TILE_TYPES.WATER:
            color = 'rgba(33, 150, 243, 0.7)'; // Blue with transparency
            break;
          case TILE_TYPES.TREE:
            color = '#33691e'; // Dark Green
            break;
          case TILE_TYPES.WALL:
            color = '#5d4037'; // Dark Brown
            break;
          default:
            color = '#e0e0e0'; // Light Gray
        }
        
        // Draw the tile
        ctx.fillStyle = color;
        ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        
        // Draw tile border
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
  
  // Render game entities
  function renderEntities() {
    if (!entities) return;
    
    entities.forEach(entity => {
      const entityX = entity.x * TILE_SIZE;
      const entityY = entity.y * TILE_SIZE;
      
      // Try to use generated assets if available
      let useGeneratedAsset = false;
      
      if (entity.type === ENTITY_TYPES.PLAYER && assets.character && assets.character.wizard) {
        // Draw player using wizard character
        ctx.drawImage(
          assets.character.wizard,
          entityX, 
          entityY, 
          TILE_SIZE, 
          TILE_SIZE
        );
        useGeneratedAsset = true;
      } else if (entity.id === 'enemy1' && assets.character && assets.character.enemy) {
        // Draw enemy using enemy character
        ctx.drawImage(
          assets.character.enemy,
          entityX, 
          entityY, 
          TILE_SIZE, 
          TILE_SIZE
        );
        useGeneratedAsset = true;
      } else if (entity.type === ENTITY_TYPES.CHEST && assets.item && assets.item.sword && !entity.isOpen) {
        // Draw chest using sword item (to represent treasure)
        ctx.drawImage(
          assets.item.sword,
          entityX, 
          entityY, 
          TILE_SIZE, 
          TILE_SIZE
        );
        useGeneratedAsset = true;
      }
      
      // If no generated asset was used, fall back to colored rectangles
      if (!useGeneratedAsset) {
        // Draw entity background
        ctx.fillStyle = entity.color || '#ffffff';
        ctx.fillRect(entityX + 5, entityY + 5, TILE_SIZE - 10, TILE_SIZE - 10);
        
        // Draw entity border (highlight if hovered)
        if (entity === hoverEntity) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
        }
        ctx.strokeRect(entityX + 5, entityY + 5, TILE_SIZE - 10, TILE_SIZE - 10);
      }
      
      // Draw entity label
      ctx.font = '10px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(entity.name, entityX + TILE_SIZE / 2, entityY + TILE_SIZE - 15);
      
      // Draw entity health bar if it's an enemy
      if (entity.type === ENTITY_TYPES.ENEMY && entity.health !== undefined) {
        const healthBarWidth = TILE_SIZE - 10;
        const healthPercentage = entity.health / entity.maxHealth;
        
        // Health bar background
        ctx.fillStyle = '#e53935'; // Red
        ctx.fillRect(entityX + 5, entityY + 2, healthBarWidth, 3);
        
        // Current health
        ctx.fillStyle = '#43a047'; // Green
        ctx.fillRect(entityX + 5, entityY + 2, healthBarWidth * healthPercentage, 3);
      }
    });
  }
  
  // Render UI elements
  function renderUI() {
    // Render game mode indicator
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Mode: ${gameMode.toUpperCase()}`, 10, 10);
    
    // Render mini-map
    const miniMapSize = 150;
    const miniMapX = canvas.width - miniMapSize - 10;
    const miniMapY = 10;
    
    // Draw mini-map background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(miniMapX, miniMapY, miniMapSize, miniMapSize);
    
    // Draw mini-map border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(miniMapX, miniMapY, miniMapSize, miniMapSize);
    
    // Draw mini-map content
    if (mapData) {
      const cellSize = miniMapSize / Math.max(MAP_WIDTH, MAP_HEIGHT);
      
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          const tileType = mapData[y][x];
          const dotX = miniMapX + x * cellSize;
          const dotY = miniMapY + y * cellSize;
          
          // Set dot color based on tile type
          let color;
          switch (tileType) {
            case TILE_TYPES.GRASS:
              color = '#7cb342'; // Green
              break;
            case TILE_TYPES.WATER:
              color = '#2196f3'; // Blue
              break;
            case TILE_TYPES.TREE:
              color = '#2e7d32'; // Dark Green
              break;
            case TILE_TYPES.WALL:
              color = '#5d4037'; // Dark Brown
              break;
            default:
              color = '#9e9e9e'; // Gray for other types
          }
          
          // Draw the tile on minimap
          ctx.fillStyle = color;
          ctx.fillRect(dotX, dotY, cellSize, cellSize);
        }
      }
      
      // Draw entities on minimap
      entities.forEach(entity => {
        let color;
        switch (entity.type) {
          case ENTITY_TYPES.PLAYER:
            color = '#ffeb3b'; // Yellow
            break;
          case ENTITY_TYPES.NPC:
            color = '#4caf50'; // Green
            break;
          case ENTITY_TYPES.ENEMY:
            color = '#f44336'; // Red
            break;
          default:
            color = '#9e9e9e'; // Gray
        }
        
        const dotX = miniMapX + entity.x * cellSize;
        const dotY = miniMapY + entity.y * cellSize;
        
        // Draw the entity on minimap
        ctx.fillStyle = color;
        ctx.fillRect(dotX, dotY, cellSize, cellSize);
      });
    }
  }
  
  // Event handlers for user input
  function enterMoveMode() {
    gameMode = 'move';
    return gameMode;
  }
  
  function enterAttackMode() {
    gameMode = 'attack';
    return gameMode;
  }
  
  function enterInteractMode() {
    gameMode = 'interact';
    return gameMode;
  }
  
  function enterExploreMode() {
    gameMode = 'explore';
    return gameMode;
  }
  
  function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const clickY = Math.floor((event.clientY - rect.top) / TILE_SIZE);
    
    // Check if click is within map bounds
    if (clickX < 0 || clickX >= MAP_WIDTH || clickY < 0 || clickY >= MAP_HEIGHT) {
      return;
    }
    
    // Find clicked entity if any
    const clickedEntity = entities.find(entity => entity.x === clickX && entity.y === clickY);
    
    // Handle click based on game mode
    switch (gameMode) {
      case 'move':
        // Handle move action
        handleMoveAction(clickX, clickY);
        break;
      case 'attack':
        // Handle attack action
        handleAttackAction(clickedEntity);
        break;
      case 'interact':
        // Handle interact action
        handleInteractAction(clickedEntity);
        break;
      case 'explore':
      default:
        // In explore mode, just log click position
        console.log(`Clicked at (${clickX}, ${clickY})`);
        break;
    }
  }
  
  function handleCanvasHover(event) {
    const rect = canvas.getBoundingClientRect();
    const hoverX = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const hoverY = Math.floor((event.clientY - rect.top) / TILE_SIZE);
    
    // Check if hover is within map bounds
    if (hoverX < 0 || hoverX >= MAP_WIDTH || hoverY < 0 || hoverY >= MAP_HEIGHT) {
      hoverEntity = null;
      return;
    }
    
    // Find hovered entity if any
    hoverEntity = entities.find(entity => entity.x === hoverX && entity.y === hoverY);
  }
  
  function handleKeyDown(event) {
    // Handle keyboard input for player movement
    let newX = playerPosition.x;
    let newY = playerPosition.y;
    
    switch (event.key) {
      case 'ArrowUp':
        newY--;
        break;
      case 'ArrowDown':
        newY++;
        break;
      case 'ArrowLeft':
        newX--;
        break;
      case 'ArrowRight':
        newX++;
        break;
      case 'm':
        enterMoveMode();
        return;
      case 'a':
        enterAttackMode();
        return;
      case 'i':
        enterInteractMode();
        return;
      case 'e':
        enterExploreMode();
        return;
      default:
        return;
    }
    
    // Check if new position is valid
    if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT) {
      // Check if there's a wall or blocking entity at the new position
      const tileType = mapData[newY][newX];
      const entityAtPosition = entities.find(entity => entity.x === newX && entity.y === newY);
      
      if (tileType !== TILE_TYPES.WALL && tileType !== TILE_TYPES.WATER && tileType !== TILE_TYPES.TREE && !entityAtPosition) {
        // Update player position
        playerPosition.x = newX;
        playerPosition.y = newY;
        
        // Update player entity position
        const playerEntity = entities.find(entity => entity.id === 'player');
        if (playerEntity) {
          playerEntity.x = newX;
          playerEntity.y = newY;
        }
      }
    }
  }
  
  // Game action handlers
  function handleMoveAction(targetX, targetY) {
    // Check if new position is valid
    if (targetX >= 0 && targetX < MAP_WIDTH && targetY >= 0 && targetY < MAP_HEIGHT) {
      // Check if there's a wall or blocking entity at the new position
      const tileType = mapData[targetY][targetX];
      const entityAtPosition = entities.find(entity => entity.x === targetX && entity.y === targetY);
      
      if (tileType !== TILE_TYPES.WALL && tileType !== TILE_TYPES.WATER && tileType !== TILE_TYPES.TREE && !entityAtPosition) {
        // Update player position
        playerPosition.x = targetX;
        playerPosition.y = targetY;
        
        // Update player entity position
        const playerEntity = entities.find(entity => entity.id === 'player');
        if (playerEntity) {
          playerEntity.x = targetX;
          playerEntity.y = targetY;
        }
      }
    }
  }
  
  function handleAttackAction(targetEntity) {
    if (!targetEntity || targetEntity.type !== ENTITY_TYPES.ENEMY) {
      console.log('No valid target to attack');
      return;
    }
    
    // Check if target is in range (adjacent tile)
    const playerEntity = entities.find(entity => entity.id === 'player');
    const distance = Math.abs(playerEntity.x - targetEntity.x) + Math.abs(playerEntity.y - targetEntity.y);
    
    if (distance > 1) {
      console.log('Target is out of range');
      return;
    }
    
    // Calculate damage (random value between min and max)
    const damageMin = 1;
    const damageMax = 5;
    const damage = Math.floor(Math.random() * (damageMax - damageMin + 1)) + damageMin;
    
    // Apply damage to target
    targetEntity.health -= damage;
    console.log(`Dealt ${damage} damage to ${targetEntity.name}`);
    
    // Check if target is defeated
    if (targetEntity.health <= 0) {
      console.log(`Defeated ${targetEntity.name}`);
      
      // Remove the entity from the game
      const entityIndex = entities.findIndex(entity => entity === targetEntity);
      if (entityIndex !== -1) {
        entities.splice(entityIndex, 1);
      }
    }
  }
  
  function handleInteractAction(targetEntity) {
    if (!targetEntity || !targetEntity.canInteract) {
      console.log('No valid target to interact with');
      return;
    }
    
    // Check if target is in range (adjacent tile)
    const playerEntity = entities.find(entity => entity.id === 'player');
    const distance = Math.abs(playerEntity.x - targetEntity.x) + Math.abs(playerEntity.y - targetEntity.y);
    
    if (distance > 1) {
      console.log('Target is out of range');
      return;
    }
    
    // Handle interaction based on entity type
    switch (targetEntity.type) {
      case ENTITY_TYPES.NPC:
        // Show dialogue
        const dialogue = targetEntity.dialogues[targetEntity.currentDialogue];
        console.log(`${targetEntity.name}: "${dialogue}"`);
        
        // Advance to next dialogue
        targetEntity.currentDialogue = (targetEntity.currentDialogue + 1) % targetEntity.dialogues.length;
        break;
      case ENTITY_TYPES.CHEST:
        // Open chest
        if (!targetEntity.isOpen) {
          console.log(`Opened ${targetEntity.name}`);
          console.log(`Found: ${targetEntity.loot.join(', ')}`);
          targetEntity.isOpen = true;
          targetEntity.color = '#8d6e63'; // Dark Brown (open chest)
        } else {
          console.log(`${targetEntity.name} is already open`);
        }
        break;
      case ENTITY_TYPES.DOOR:
        // Open door
        console.log(`Opened ${targetEntity.name}`);
        break;
      default:
        console.log('Nothing happens...');
    }
  }
  
  // Return public API
  return {
    init
  };
})(); 