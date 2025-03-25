/**
 * Inventory System Module for GameX
 * Handles all inventory management for the game
 */

(function() {
  // Create a namespace for the inventory system
  window.GameX = window.GameX || {};
  
  // Initialize the inventory in the game state if it doesn't exist
  if (window.State && typeof window.State.variables.inventory === 'undefined') {
    window.State.variables.inventory = [];
  }
  
  // Helper function to format item names
  function formatItemName(name) {
    return name.replace(/_/g, ' ');
  }
  
  // Helper function to check if an array contains an item
  function arrayContains(array, item) {
    return array.some(element => element.name === item);
  }
  
  // Inventory system object
  GameX.Inventory = {
    /**
     * Add an item to the inventory
     * @param {string} name - The name of the item
     * @param {number} quantity - The quantity to add (default: 1)
     * @param {Object} properties - Additional properties for the item
     * @returns {boolean} Success status
     */
    addItem: function(name, quantity = 1, properties = {}) {
      if (!name || quantity <= 0) {
        console.error("Invalid item or quantity");
        return false;
      }
      
      // Make sure state and inventory exist
      if (!window.State || !window.State.variables.inventory) {
        console.error("Game state not initialized");
        return false;
      }
      
      const inventory = window.State.variables.inventory;
      const existingItem = inventory.find(item => item.name === name);
      
      if (existingItem) {
        // Item already exists, increase quantity
        existingItem.quantity += quantity;
      } else {
        // Create new item
        const newItem = {
          name: name,
          quantity: quantity,
          ...properties
        };
        inventory.push(newItem);
      }
      
      console.log(`Added ${quantity} ${formatItemName(name)} to inventory`);
      return true;
    },
    
    /**
     * Remove an item from the inventory
     * @param {string} name - The name of the item
     * @param {number} quantity - The quantity to remove (default: 1)
     * @returns {boolean} Success status
     */
    removeItem: function(name, quantity = 1) {
      if (!name || quantity <= 0) {
        console.error("Invalid item or quantity");
        return false;
      }
      
      // Make sure state and inventory exist
      if (!window.State || !window.State.variables.inventory) {
        console.error("Game state not initialized");
        return false;
      }
      
      const inventory = window.State.variables.inventory;
      const itemIndex = inventory.findIndex(item => item.name === name);
      
      if (itemIndex === -1) {
        console.error(`Item ${formatItemName(name)} not found in inventory`);
        return false;
      }
      
      const item = inventory[itemIndex];
      
      if (item.quantity <= quantity) {
        // Remove the item completely
        inventory.splice(itemIndex, 1);
        console.log(`Removed ${formatItemName(name)} from inventory`);
      } else {
        // Decrease the quantity
        item.quantity -= quantity;
        console.log(`Removed ${quantity} ${formatItemName(name)} from inventory`);
      }
      
      return true;
    },
    
    /**
     * Check if an item exists in the inventory
     * @param {string} name - The name of the item
     * @param {number} quantity - The quantity to check for (default: 1)
     * @returns {boolean} Whether the item exists in sufficient quantity
     */
    hasItem: function(name, quantity = 1) {
      if (!name || quantity <= 0) return false;
      
      // Make sure state and inventory exist
      if (!window.State || !window.State.variables.inventory) {
        return false;
      }
      
      const inventory = window.State.variables.inventory;
      const item = inventory.find(item => item.name === name);
      
      return item && item.quantity >= quantity;
    },
    
    /**
     * Get the quantity of an item in the inventory
     * @param {string} name - The name of the item
     * @returns {number} The quantity of the item (0 if not found)
     */
    getItemQuantity: function(name) {
      if (!name) return 0;
      
      // Make sure state and inventory exist
      if (!window.State || !window.State.variables.inventory) {
        return 0;
      }
      
      const inventory = window.State.variables.inventory;
      const item = inventory.find(item => item.name === name);
      
      return item ? item.quantity : 0;
    },
    
    /**
     * Use an item from the inventory (removes one unit)
     * @param {string} name - The name of the item
     * @returns {boolean} Success status
     */
    useItem: function(name) {
      return this.removeItem(name, 1);
    },
    
    /**
     * Get all items in the inventory
     * @returns {Array} Array of inventory items
     */
    getAllItems: function() {
      if (!window.State || !window.State.variables.inventory) {
        return [];
      }
      
      return [...window.State.variables.inventory];
    },
    
    /**
     * Get formatted inventory list as string
     * @returns {string} Formatted inventory list
     */
    getInventoryList: function() {
      const inventory = this.getAllItems();
      
      if (inventory.length === 0) {
        return "Your inventory is empty.";
      }
      
      return inventory.map(item => {
        const itemName = formatItemName(item.name);
        return `${itemName} (${item.quantity})`;
      }).join(", ");
    },
    
    /**
     * Clear the entire inventory
     */
    clearInventory: function() {
      if (window.State && window.State.variables.inventory) {
        window.State.variables.inventory = [];
        console.log("Inventory cleared");
      }
    }
  };
  
  // Register Twine/Harlowe macro for inventory management
  if (window.Macro) {
    Macro.add('inventory', {
      handler: function() {
        const args = this.args;
        
        if (args.length === 0) {
          // Display inventory if no arguments
          const inventoryList = GameX.Inventory.getInventoryList();
          jQuery(this.output).wiki(inventoryList);
          return;
        }
        
        const action = args[0].toLowerCase();
        const itemName = args[1];
        
        switch (action) {
          case 'add':
            if (args.length < 2) {
              return this.error('Missing item name for "add" action');
            }
            const quantity = args.length > 2 ? parseInt(args[2]) : 1;
            const properties = args.length > 3 ? JSON.parse(args[3]) : {};
            GameX.Inventory.addItem(itemName, quantity, properties);
            break;
            
          case 'remove':
            if (args.length < 2) {
              return this.error('Missing item name for "remove" action');
            }
            const removeQuantity = args.length > 2 ? parseInt(args[2]) : 1;
            GameX.Inventory.removeItem(itemName, removeQuantity);
            break;
            
          case 'has':
            if (args.length < 2) {
              return this.error('Missing item name for "has" action');
            }
            const checkQuantity = args.length > 2 ? parseInt(args[2]) : 1;
            const hasItem = GameX.Inventory.hasItem(itemName, checkQuantity);
            jQuery(this.output).wiki(hasItem.toString());
            break;
            
          case 'use':
            if (args.length < 2) {
              return this.error('Missing item name for "use" action');
            }
            GameX.Inventory.useItem(itemName);
            break;
            
          case 'count':
            if (args.length < 2) {
              return this.error('Missing item name for "count" action');
            }
            const itemCount = GameX.Inventory.getItemQuantity(itemName);
            jQuery(this.output).wiki(itemCount.toString());
            break;
            
          case 'list':
            const list = GameX.Inventory.getInventoryList();
            jQuery(this.output).wiki(list);
            break;
            
          case 'clear':
            GameX.Inventory.clearInventory();
            break;
            
          default:
            return this.error(`Unknown inventory action: ${action}`);
        }
      }
    });
  }
})(); 