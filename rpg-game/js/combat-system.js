/**
 * Combat System Module for GameX
 * Handles all combat mechanics for the game
 */

(function() {
  // Create a namespace for the combat system
  window.GameX = window.GameX || {};
  
  // Initialize combat state in the game if it doesn't exist
  if (window.State && typeof window.State.variables.combat === 'undefined') {
    window.State.variables.combat = {
      inCombat: false,
      enemy: null,
      log: [],
      round: 0
    };
  }
  
  // Helper function to safely update game state
  function updateState(property, value) {
    if (window.State && window.State.variables) {
      if (typeof window.State.variables.combat === 'undefined') {
        window.State.variables.combat = {
          inCombat: false,
          enemy: null,
          log: [],
          round: 0
        };
      }
      
      window.State.variables.combat[property] = value;
    }
  }
  
  // Helper function to clamp a value between min and max
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  
  // Combat system object
  GameX.Combat = {
    /**
     * Start combat with an enemy
     * @param {Object} enemy - The enemy to fight
     * @returns {boolean} Success status
     */
    startCombat: function(enemy) {
      if (!enemy || !enemy.name) {
        console.error("Invalid enemy");
        return false;
      }
      
      // Set combat state
      updateState('inCombat', true);
      updateState('enemy', enemy);
      updateState('log', []);
      updateState('round', 1);
      
      // Log the start of combat
      this.logEvent(`Combat has begun with ${enemy.name}!`);
      this.logEvent(`${enemy.name} has ${enemy.health} health.`);
      
      return true;
    },
    
    /**
     * End combat
     * @param {boolean} victory - Whether the player won
     * @returns {boolean} Success status
     */
    endCombat: function(victory = false) {
      if (!this.isInCombat()) {
        return false;
      }
      
      const enemy = this.getEnemy();
      this.logEvent(`Combat with ${enemy.name} has ended.`);
      
      if (victory) {
        this.logEvent(`You have defeated ${enemy.name}!`);
        
        // Award experience if available
        if (enemy.exp && window.State && window.State.variables.player) {
          const exp = enemy.exp;
          window.State.variables.player.exp = (window.State.variables.player.exp || 0) + exp;
          this.logEvent(`You gained ${exp} experience points.`);
        }
      } else {
        this.logEvent(`You have been defeated by ${enemy.name}!`);
      }
      
      // Reset combat state
      updateState('inCombat', false);
      updateState('enemy', null);
      
      return true;
    },
    
    /**
     * Check if in combat
     * @returns {boolean} Whether in combat
     */
    isInCombat: function() {
      return window.State && 
             window.State.variables.combat && 
             window.State.variables.combat.inCombat;
    },
    
    /**
     * Get the current enemy
     * @returns {Object} The current enemy or null
     */
    getEnemy: function() {
      if (!this.isInCombat()) {
        return null;
      }
      
      return window.State.variables.combat.enemy;
    },
    
    /**
     * Player attacks the enemy
     * @param {string} attackType - The type of attack (normal, heavy, quick)
     * @returns {Object} Result of the attack
     */
    attack: function(attackType = 'normal') {
      if (!this.isInCombat()) {
        console.error("Not in combat");
        return null;
      }
      
      const enemy = this.getEnemy();
      const player = window.State.variables.player;
      
      if (!player) {
        console.error("Player state not initialized");
        return null;
      }
      
      // Get attack modifiers based on attack type
      let damageModifier = 1;
      let hitModifier = 0;
      
      switch (attackType) {
        case 'heavy':
          damageModifier = 1.5;
          hitModifier = -2;
          break;
        case 'quick':
          damageModifier = 0.7;
          hitModifier = 2;
          break;
        default: // normal
          damageModifier = 1;
          hitModifier = 0;
      }
      
      // Roll to hit
      const accuracyBonus = player.dexterity ? Math.floor(player.dexterity / 2) : 0;
      const hitRoll = GameX.DiceRoller.roll(20, accuracyBonus + hitModifier);
      
      // Enemy defense check
      const enemyDefense = enemy.defense || 10;
      
      if (hitRoll.total < enemyDefense) {
        // Attack missed
        this.logEvent(`Your ${attackType} attack missed ${enemy.name}!`);
        return { hit: false, damage: 0, critical: false };
      }
      
      // Calculate damage
      const strengthBonus = player.strength ? Math.floor(player.strength / 2) : 0;
      const weaponDamage = player.weapon ? player.weapon.damage : 4; // default d4 damage
      
      const damageRoll = GameX.DiceRoller.roll(weaponDamage, strengthBonus);
      let damage = Math.floor(damageRoll.total * damageModifier);
      let critical = hitRoll.isCritical;
      
      if (critical) {
        damage = damage * 2;
        this.logEvent(`CRITICAL HIT! Your ${attackType} attack deals ${damage} damage to ${enemy.name}!`);
      } else {
        this.logEvent(`Your ${attackType} attack hits ${enemy.name} for ${damage} damage.`);
      }
      
      // Apply damage to enemy
      enemy.health = Math.max(0, enemy.health - damage);
      this.logEvent(`${enemy.name} has ${enemy.health} health remaining.`);
      
      // Check if enemy is defeated
      if (enemy.health <= 0) {
        this.endCombat(true);
      }
      
      return { hit: true, damage: damage, critical: critical };
    },
    
    /**
     * Enemy attacks the player
     * @returns {Object} Result of the attack
     */
    enemyAttack: function() {
      if (!this.isInCombat()) {
        console.error("Not in combat");
        return null;
      }
      
      const enemy = this.getEnemy();
      const player = window.State.variables.player;
      
      if (!player) {
        console.error("Player state not initialized");
        return null;
      }
      
      // Roll to hit
      const enemyAccuracy = enemy.accuracy || 0;
      const hitRoll = GameX.DiceRoller.roll(20, enemyAccuracy);
      
      // Player defense check
      const playerDefense = player.defense || 10;
      
      if (hitRoll.total < playerDefense) {
        // Attack missed
        this.logEvent(`${enemy.name}'s attack missed you!`);
        return { hit: false, damage: 0, critical: false };
      }
      
      // Calculate damage
      const enemyDamage = enemy.damage || { sides: 4, modifier: 0 };
      const damageRoll = GameX.DiceRoller.roll(enemyDamage.sides, enemyDamage.modifier);
      let damage = damageRoll.total;
      let critical = hitRoll.isCritical;
      
      if (critical) {
        damage = damage * 2;
        this.logEvent(`CRITICAL HIT! ${enemy.name}'s attack deals ${damage} damage to you!`);
      } else {
        this.logEvent(`${enemy.name}'s attack hits you for ${damage} damage.`);
      }
      
      // Apply damage to player
      player.health = Math.max(0, player.health - damage);
      this.logEvent(`You have ${player.health} health remaining.`);
      
      // Check if player is defeated
      if (player.health <= 0) {
        this.endCombat(false);
      }
      
      return { hit: true, damage: damage, critical: critical };
    },
    
    /**
     * Player defends (reduces incoming damage)
     * @returns {boolean} Success status
     */
    defend: function() {
      if (!this.isInCombat()) {
        console.error("Not in combat");
        return false;
      }
      
      const player = window.State.variables.player;
      
      if (!player) {
        console.error("Player state not initialized");
        return false;
      }
      
      // Add defense bonus for the next round
      player.defending = true;
      player.defenseBonus = player.defenseBonus || 0;
      player.defenseBonus += 5; // +5 to defense for defending
      
      this.logEvent("You take a defensive stance, increasing your defense.");
      
      return true;
    },
    
    /**
     * Player uses an item during combat
     * @param {string} itemName - The name of the item to use
     * @returns {boolean} Success status
     */
    useItem: function(itemName) {
      if (!this.isInCombat()) {
        console.error("Not in combat");
        return false;
      }
      
      if (!GameX.Inventory.hasItem(itemName)) {
        this.logEvent(`You don't have a ${itemName} to use.`);
        return false;
      }
      
      const player = window.State.variables.player;
      const enemy = this.getEnemy();
      
      if (!player || !enemy) {
        console.error("Player or enemy state not initialized");
        return false;
      }
      
      // Apply item effects based on its type
      switch (itemName) {
        case 'health_potion':
          const healAmount = 20;
          player.health = Math.min(player.health + healAmount, player.maxHealth || 100);
          this.logEvent(`You drink a health potion and restore ${healAmount} health.`);
          this.logEvent(`You now have ${player.health} health.`);
          break;
          
        case 'fire_bomb':
          const damage = 15;
          enemy.health = Math.max(0, enemy.health - damage);
          this.logEvent(`You throw a fire bomb at ${enemy.name} dealing ${damage} damage!`);
          this.logEvent(`${enemy.name} has ${enemy.health} health remaining.`);
          
          if (enemy.health <= 0) {
            this.endCombat(true);
          }
          break;
          
        case 'smoke_bomb':
          // Chance to escape combat
          const escapeRoll = GameX.DiceRoller.roll(20, player.dexterity ? Math.floor(player.dexterity / 2) : 0);
          const escapeDC = enemy.preventEscape || 12;
          
          if (escapeRoll.total >= escapeDC) {
            this.logEvent("You throw a smoke bomb and escape from combat!");
            this.endCombat(true);
          } else {
            this.logEvent("You throw a smoke bomb, but fail to escape!");
          }
          break;
          
        default:
          this.logEvent(`You can't use ${itemName} in combat.`);
          return false;
      }
      
      // Remove the item from inventory
      GameX.Inventory.removeItem(itemName, 1);
      
      return true;
    },
    
    /**
     * Log a combat event
     * @param {string} message - The message to log
     */
    logEvent: function(message) {
      if (!message) return;
      
      // Make sure state and combat log exist
      if (window.State && window.State.variables.combat) {
        if (!Array.isArray(window.State.variables.combat.log)) {
          window.State.variables.combat.log = [];
        }
        
        window.State.variables.combat.log.push(message);
        console.log(message);
      }
    },
    
    /**
     * Get the combat log
     * @param {number} lines - Number of lines to retrieve (0 for all)
     * @returns {Array} The combat log messages
     */
    getLog: function(lines = 0) {
      if (!window.State || !window.State.variables.combat || !Array.isArray(window.State.variables.combat.log)) {
        return [];
      }
      
      const log = window.State.variables.combat.log;
      
      if (lines <= 0 || lines >= log.length) {
        return [...log];
      }
      
      return log.slice(-lines);
    },
    
    /**
     * Get the formatted combat log as a string
     * @param {number} lines - Number of lines to retrieve (0 for all)
     * @returns {string} Formatted combat log
     */
    getFormattedLog: function(lines = 0) {
      const log = this.getLog(lines);
      
      if (log.length === 0) {
        return "No combat log available.";
      }
      
      return log.join('\n');
    }
  };
  
  // Register Twine/Harlowe macro for combat
  if (window.Macro) {
    Macro.add('combat', {
      handler: function() {
        const args = this.args;
        
        if (args.length === 0) {
          return this.error('Missing combat action');
        }
        
        const action = args[0].toLowerCase();
        
        switch (action) {
          case 'start':
            if (args.length < 2) {
              return this.error('Missing enemy data for "start" action');
            }
            
            // Parse enemy data
            let enemyData;
            try {
              enemyData = typeof args[1] === 'object' ? args[1] : JSON.parse(args[1]);
            } catch (e) {
              return this.error('Invalid enemy data format');
            }
            
            GameX.Combat.startCombat(enemyData);
            break;
            
          case 'attack':
            const attackType = args.length > 1 ? args[1] : 'normal';
            GameX.Combat.attack(attackType);
            
            // Enemy counter-attack
            if (GameX.Combat.isInCombat()) {
              GameX.Combat.enemyAttack();
            }
            break;
            
          case 'defend':
            GameX.Combat.defend();
            
            // Enemy still attacks
            if (GameX.Combat.isInCombat()) {
              GameX.Combat.enemyAttack();
            }
            break;
            
          case 'use':
            if (args.length < 2) {
              return this.error('Missing item name for "use" action');
            }
            
            const itemName = args[1];
            GameX.Combat.useItem(itemName);
            
            // Enemy still attacks unless combat ended
            if (GameX.Combat.isInCombat()) {
              GameX.Combat.enemyAttack();
            }
            break;
            
          case 'end':
            const victory = args.length > 1 ? args[1] === 'true' || args[1] === true : false;
            GameX.Combat.endCombat(victory);
            break;
            
          case 'log':
            const lines = args.length > 1 ? parseInt(args[1]) : 0;
            const log = GameX.Combat.getFormattedLog(lines);
            jQuery(this.output).wiki(log);
            break;
            
          case 'status':
            if (!GameX.Combat.isInCombat()) {
              jQuery(this.output).wiki("Not in combat.");
              break;
            }
            
            const enemy = GameX.Combat.getEnemy();
            const player = window.State.variables.player;
            
            let status = `In combat with ${enemy.name}\n`;
            status += `${enemy.name}: ${enemy.health} HP\n`;
            status += `You: ${player.health} HP`;
            
            jQuery(this.output).wiki(status);
            break;
            
          default:
            return this.error(`Unknown combat action: ${action}`);
        }
      }
    });
  }
})(); 