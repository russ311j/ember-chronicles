/**
 * Character System Module for Ember Throne
 * Handles character creation, stats, leveling, and class mechanics
 */

(function() {
  // Create a namespace for the character system
  window.GameX = window.GameX || {};
  
  // Character classes with base stats and special abilities
  const CHARACTER_CLASSES = {
    warrior: {
      name: "Warrior",
      description: "A master of combat and physical prowess. Warriors excel at close combat and can withstand heavy damage.",
      baseStats: {
        strength: 4,
        dexterity: 2,
        intelligence: 0,
        constitution: 3,
        wisdom: 0,
        charisma: 1
      },
      specialAbilities: [
        {
          name: "Mighty Blow",
          description: "Deal double damage on a successful critical hit."
        },
        {
          name: "Second Wind",
          description: "Recover 25% of your maximum health once per combat."
        }
      ],
      startingEquipment: ["Iron Sword", "Wooden Shield", "Leather Armor", "Health Potion"],
      sprite: "media/images/generated/characters/warrior_portrait.png"
    },
    mage: {
      name: "Mage",
      description: "A wielder of arcane energies and mystical knowledge. Mages excel at magical combat and utility spells.",
      baseStats: {
        strength: 0,
        dexterity: 1,
        intelligence: 4,
        constitution: 1,
        wisdom: 3,
        charisma: 1
      },
      specialAbilities: [
        {
          name: "Arcane Blast",
          description: "Cast a powerful magical attack that ignores armor."
        },
        {
          name: "Magical Insight",
          description: "Automatically identify magical items and effects."
        }
      ],
      startingEquipment: ["Apprentice Staff", "Spellbook", "Cloth Robes", "Mana Potion"],
      sprite: "media/images/generated/characters/mage_portrait.png"
    },
    rogue: {
      name: "Rogue",
      description: "A master of stealth and subterfuge. Rogues excel at finding traps, picking locks, and dealing precision damage.",
      baseStats: {
        strength: 1,
        dexterity: 4,
        intelligence: 2,
        constitution: 1,
        wisdom: 1,
        charisma: 1
      },
      specialAbilities: [
        {
          name: "Backstab",
          description: "Deal extra damage when attacking from stealth or from behind."
        },
        {
          name: "Lockmaster",
          description: "Gain advantage on all attempts to pick locks or disarm traps."
        }
      ],
      startingEquipment: ["Daggers (2)", "Lockpicks", "Leather Armor", "Smoke Bomb"],
      sprite: "media/images/generated/characters/rogue_portrait.png"
    },
    cleric: {
      name: "Cleric",
      description: "A divine spellcaster with healing powers. Clerics excel at supporting allies and fighting undead.",
      baseStats: {
        strength: 2,
        dexterity: 0,
        intelligence: 1,
        constitution: 2,
        wisdom: 4,
        charisma: 1
      },
      specialAbilities: [
        {
          name: "Divine Healing",
          description: "Restore health to yourself or an ally during combat."
        },
        {
          name: "Turn Undead",
          description: "Force undead creatures to flee or take damage."
        }
      ],
      startingEquipment: ["Mace", "Holy Symbol", "Chain Mail", "Healing Potion"],
      sprite: "media/images/generated/characters/cleric_portrait.png"
    }
  };

  // Character System
  GameX.CharacterSystem = {
    /**
     * Create a new character
     * @param {string} name - Character name
     * @param {string} className - Character class
     * @param {Object} stats - Character stats
     * @returns {Object} Character object
     */
    createCharacter: function(name, className, stats) {
      if (!name || !className || !CHARACTER_CLASSES[className]) {
        console.error("Invalid character parameters");
        return null;
      }
      
      const classTemplate = CHARACTER_CLASSES[className];
      
      // Create the character object
      const character = {
        name: name,
        class: className,
        className: classTemplate.name,
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        health: 0,
        maxHealth: 0,
        mana: 0,
        maxMana: 0,
        stats: {
          strength: (stats && stats.strength) || classTemplate.baseStats.strength,
          dexterity: (stats && stats.dexterity) || classTemplate.baseStats.dexterity,
          intelligence: (stats && stats.intelligence) || classTemplate.baseStats.intelligence,
          constitution: (stats && stats.constitution) || classTemplate.baseStats.constitution,
          wisdom: (stats && stats.wisdom) || classTemplate.baseStats.wisdom,
          charisma: (stats && stats.charisma) || classTemplate.baseStats.charisma
        },
        abilities: classTemplate.specialAbilities,
        inventory: [...classTemplate.startingEquipment],
        gold: 10,
        questLog: [],
        flags: {}, // For tracking story decisions, visited locations, etc.
        sprite: classTemplate.sprite || `media/images/placeholder.svg`,
        created: new Date().toISOString()
      };
      
      // Calculate derived stats
      this.recalculateStats(character);
      
      // Heal to full on creation
      character.health = character.maxHealth;
      character.mana = character.maxMana;
      
      return character;
    },
    
    /**
     * Recalculate derived character stats
     * @param {Object} character - Character object to update
     */
    recalculateStats: function(character) {
      // Calculate max health based on constitution and level
      character.maxHealth = 10 + (character.stats.constitution * 2) + ((character.level - 1) * 5);
      
      // Calculate max mana based on intelligence/wisdom and level
      if (character.class === 'mage') {
        character.maxMana = 10 + (character.stats.intelligence * 3) + ((character.level - 1) * 5);
      } else if (character.class === 'cleric') {
        character.maxMana = 10 + (character.stats.wisdom * 3) + ((character.level - 1) * 5);
      } else {
        character.maxMana = 5 + ((character.level - 1) * 2);
      }
      
      // Cap stats if they exceed maximum
      character.health = Math.min(character.health, character.maxHealth);
      character.mana = Math.min(character.mana, character.maxMana);
    },
    
    /**
     * Add experience points to a character
     * @param {Object} character - Character to add XP to
     * @param {number} amount - Amount of XP to add
     * @returns {boolean} Whether the character leveled up
     */
    addExperience: function(character, amount) {
      if (!character || amount <= 0) {
        return false;
      }
      
      character.exp += amount;
      
      // Check for level up
      if (character.exp >= character.expToNextLevel) {
        this.levelUp(character);
        return true;
      }
      
      return false;
    },
    
    /**
     * Level up a character
     * @param {Object} character - Character to level up
     * @returns {Object} New stats gained
     */
    levelUp: function(character) {
      if (!character) {
        return null;
      }
      
      const oldMaxHealth = character.maxHealth;
      const oldMaxMana = character.maxMana;
      
      // Increase level
      character.level += 1;
      
      // Calculate XP for next level
      character.expToNextLevel = character.level * 100;
      
      // Generate stat improvements
      const statImprovements = {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        constitution: 0,
        wisdom: 0,
        charisma: 0
      };
      
      // Determine primary stat based on class
      let primaryStat;
      switch (character.class) {
        case 'warrior':
          primaryStat = 'strength';
          break;
        case 'mage':
          primaryStat = 'intelligence';
          break;
        case 'rogue':
          primaryStat = 'dexterity';
          break;
        case 'cleric':
          primaryStat = 'wisdom';
          break;
        default:
          primaryStat = 'strength';
      }
      
      // Primary stat always improves
      statImprovements[primaryStat] += 1;
      
      // 50% chance to improve constitution
      if (Math.random() < 0.5) {
        statImprovements.constitution += 1;
      }
      
      // Apply stat improvements
      for (const stat in statImprovements) {
        if (statImprovements[stat] > 0) {
          character.stats[stat] += statImprovements[stat];
        }
      }
      
      // Recalculate derived stats
      this.recalculateStats(character);
      
      // Heal character to full on level up
      character.health = character.maxHealth;
      character.mana = character.maxMana;
      
      // Return improvement details
      return {
        level: character.level,
        stats: statImprovements,
        healthGained: character.maxHealth - oldMaxHealth,
        manaGained: character.maxMana - oldMaxMana
      };
    },
    
    /**
     * Roll stats for a new character
     * @returns {Object} Generated stats
     */
    rollStats: function() {
      // Roll 2d6 for each stat
      const rollStat = () => {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        return Math.max(1, die1 + die2 - 7); // Convert 2-12 range to 1-5 range
      };
      
      // Generate stats
      const stats = {
        strength: rollStat(),
        dexterity: rollStat(),
        intelligence: rollStat(),
        constitution: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat()
      };
      
      return stats;
    },
    
    /**
     * Get class information
     * @param {string} className - Character class
     * @returns {Object} Class info
     */
    getClassInfo: function(className) {
      return CHARACTER_CLASSES[className] || null;
    },
    
    /**
     * Get all available character classes
     * @returns {Object} All character classes
     */
    getAllClasses: function() {
      return CHARACTER_CLASSES;
    },
    
    /**
     * Initialize character creation form
     * This function renders the character creation form in the appropriate container
     */
    initCreationForm: function() {
      const modal = document.getElementById('character-creation');
      const container = document.getElementById('character-creation-form');
      
      if (!modal || !container) {
        console.error("Character creation containers not found");
        return;
      }
      
      // Show the modal
      modal.classList.add('active');
      
      // Add back button functionality
      const backButton = document.querySelector('.back-to-main-menu');
      if (backButton) {
        backButton.addEventListener('click', () => {
          modal.classList.remove('active');
        });
      }
      
      // Render the character creation UI
      this.renderCharacterCreation(container, (character) => {
        if (character) {
          // Save character to session storage
          this.completeCharacterCreation(character);
          // Hide the modal
          modal.classList.remove('active');
        }
      });
    },
    
    /**
     * Render character creation UI
     * @param {HTMLElement} container - Container element to render the UI into
     * @param {Function} onComplete - Callback when character creation is complete
     */
    renderCharacterCreation: function(container, onComplete) {
      if (!container) return;
      
      // Individual stat values
      const stats = {
        strength: 8,
        dexterity: 8,
        intelligence: 8,
        constitution: 8,
        wisdom: 8,
        charisma: 8
      };
      
      let selectedClass = 'warrior';
      let rollsRemaining = 10; // Give player 10 individual rolls
      
      // Create character creation form
      const formHTML = `
        <div class="character-creation-container">
          <div class="character-class-selector">
            <h2>Choose Your Class</h2>
            <div class="class-options">
              ${Object.keys(CHARACTER_CLASSES).map(className => `
                <div class="class-option ${className === selectedClass ? 'selected' : ''}" data-class="${className}">
                  <div class="class-sprite">
                    <img src="${CHARACTER_CLASSES[className].sprite}" alt="${CHARACTER_CLASSES[className].name}" 
                      onerror="this.src='media/images/placeholder.svg'">
                  </div>
                  <h3>${CHARACTER_CLASSES[className].name}</h3>
                  <p class="class-desc">${CHARACTER_CLASSES[className].description}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="character-details">
            <div class="character-name-section">
              <h2>Your Hero</h2>
              <div class="form-group">
                <label for="character-name">Name:</label>
                <input type="text" id="character-name" placeholder="Enter your character's name">
              </div>
            </div>
            
            <div class="character-stats-section">
              <h2>Character Stats</h2>
              <p class="rolls-info">Individual Rolls Remaining: <span id="rolls-remaining">${rollsRemaining}</span></p>
              
              <div class="stats-container">
                ${Object.entries(stats).map(([statName, value]) => {
                  // Define tooltips for each stat
                  const tooltips = {
                    strength: "Physical power and muscle. Affects melee damage, carrying capacity, and some physical checks.",
                    dexterity: "Agility, reflexes, and balance. Affects ranged attacks, initiative, and stealth.",
                    intelligence: "Mental acuity, information recall, and analytical skill. Affects spell power for mages.",
                    constitution: "Health, stamina, and vital force. Affects total hit points and resistance to poison.",
                    wisdom: "Awareness, intuition, and insight. Affects spell power for clerics and perception.",
                    charisma: "Force of personality, persuasiveness, and leadership. Affects social interactions."
                  };
                  
                  // Define abbreviations for display
                  const abbr = {
                    strength: "STR",
                    dexterity: "DEX",
                    intelligence: "INT",
                    constitution: "CON",
                    wisdom: "WIS",
                    charisma: "CHA"
                  };
                  
                  return `
                    <div class="stat-row" title="${tooltips[statName]}">
                      <div class="stat-name">${abbr[statName]}</div>
                      <div class="stat-badge">${statName.charAt(0).toUpperCase() + statName.slice(1)}</div>
                      <div class="stat-value" id="stat-${statName}">${value}</div>
                      <button class="roll-button" data-stat="${statName}">
                        <span class="roll-text">Roll</span>
                        <span class="dice-icon">🎲</span>
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
          
          <div class="character-preview">
            <div class="character-sprite-preview">
              <img id="selected-class-sprite" src="${CHARACTER_CLASSES[selectedClass].sprite}" alt="${CHARACTER_CLASSES[selectedClass].name}"
                onerror="this.src='media/images/placeholder.svg'">
            </div>
            <div class="character-class-details">
              <h3>Class Details: <span id="preview-class-name">${CHARACTER_CLASSES[selectedClass].name}</span></h3>
              <p id="preview-class-desc">${CHARACTER_CLASSES[selectedClass].description}</p>
              
              <h4>Special Abilities:</h4>
              <ul id="preview-abilities">
                ${CHARACTER_CLASSES[selectedClass].specialAbilities.map(ability => `
                  <li><strong>${ability.name}:</strong> ${ability.description}</li>
                `).join('')}
              </ul>
              
              <h4>Starting Equipment:</h4>
              <ul id="preview-equipment">
                ${CHARACTER_CLASSES[selectedClass].startingEquipment.map(item => `
                  <li>${item}</li>
                `).join('')}
              </ul>
            </div>
          </div>
          
          <div class="form-actions">
            <button id="create-character" class="primary-button">Create Character</button>
          </div>
        </div>
      `;
      
      // Insert form HTML
      container.innerHTML = formHTML;
      
      // Add event listeners for class selection
      document.querySelectorAll('.class-option').forEach(option => {
        option.addEventListener('click', function() {
          // Remove selected class from all options
          document.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('selected'));
          // Add selected class to clicked option
          this.classList.add('selected');
          
          // Update selected class
          selectedClass = this.dataset.class;
          
          // Update preview
          const classData = CHARACTER_CLASSES[selectedClass];
          document.getElementById('selected-class-sprite').src = classData.sprite;
          document.getElementById('preview-class-name').textContent = classData.name;
          document.getElementById('preview-class-desc').textContent = classData.description;
          
          // Update abilities list
          document.getElementById('preview-abilities').innerHTML = classData.specialAbilities.map(ability => `
            <li><strong>${ability.name}:</strong> ${ability.description}</li>
          `).join('');
          
          // Update equipment list
          document.getElementById('preview-equipment').innerHTML = classData.startingEquipment.map(item => `
            <li>${item}</li>
          `).join('');
        });
      });
      
      // Add event listeners for stat rolling
      document.querySelectorAll('.roll-button').forEach(button => {
        button.addEventListener('click', function() {
          if (rollsRemaining <= 0) {
            alert('No more rolls remaining!');
            return;
          }
          
          const statName = this.dataset.stat;
          const statElement = document.getElementById(`stat-${statName}`);
          
          // Disable button during roll animation
          this.disabled = true;
          this.classList.add('rolling');
          
          // Animate roll
          let frame = 0;
          const totalFrames = 10;
          const rollInterval = setInterval(() => {
            const randomValue = Math.floor(Math.random() * 13) + 8; // Roll between 8-20
            statElement.textContent = randomValue;
            
            frame++;
            if (frame >= totalFrames) {
              clearInterval(rollInterval);
              this.disabled = false;
              this.classList.remove('rolling');
              
              // Update final value
              stats[statName] = parseInt(statElement.textContent);
              
              // Add dice-rolled class for animation
              statElement.classList.add('dice-rolled');
              
              // Remove the class after animation completes
              setTimeout(() => {
                statElement.classList.remove('dice-rolled');
              }, 1000);
              
              // Update rolls remaining
              rollsRemaining--;
              document.getElementById('rolls-remaining').textContent = rollsRemaining;
              
              // Disable all roll buttons if no rolls remaining
              if (rollsRemaining <= 0) {
                document.querySelectorAll('.roll-button').forEach(btn => {
                  btn.disabled = true;
                  btn.classList.add('disabled');
                });
              }
            }
          }, 50);
        });
      });
      
      // Add event listener for character creation
      document.getElementById('create-character').addEventListener('click', function() {
        const name = document.getElementById('character-name').value.trim();
        
        if (!name) {
          alert('Please enter a character name!');
          return;
        }
        
        // Create the character
        const character = GameX.CharacterSystem.createCharacter(name, selectedClass, stats);
        
        if (character) {
          // Save character to session storage
          sessionStorage.setItem('current-character', JSON.stringify(character));
          
          // Redirect to game page
          window.location.href = 'ember-throne.html';
        } else {
          alert('Error creating character. Please try again.');
        }
      });
    },
    
    /**
     * Create DOM element for the dice roll container if it doesn't exist
     * This ensures the dice roll animations have a place to appear
     */
    initDiceRollContainers: function() {
      // Check if the dice container for story actions exists, create if not
      if (!document.getElementById('dice-roll-container')) {
        const diceRollContainer = document.createElement('div');
        diceRollContainer.id = 'dice-roll-container';
        diceRollContainer.innerHTML = `
          <div id="dice-roll-visual">
            <div id="dice">
              <div id="dice-value">20</div>
            </div>
          </div>
          <div id="dice-roll-result">
            <p>You rolled a <span id="roll-value">20</span>!</p>
            <p id="roll-outcome">Success!</p>
          </div>
        `;
        document.body.appendChild(diceRollContainer);
      }
      
      // Check if stat roll container exists, create if not
      if (!document.getElementById('stat-roll-container')) {
        const statRollContainer = document.createElement('div');
        statRollContainer.id = 'stat-roll-container';
        statRollContainer.className = 'dice-roll-overlay';
        statRollContainer.innerHTML = `
          <div class="dice-roll-visual">
            <div class="dice-group">
              <div class="die">
                <div class="die-face" id="die-1">6</div>
              </div>
              <div class="die">
                <div class="die-face" id="die-2">6</div>
              </div>
              <div class="die">
                <div class="die-face" id="die-3">6</div>
              </div>
            </div>
          </div>
          <div class="dice-roll-result">
            <p>Rolling <span id="stat-name">Stat</span>: <span id="stat-roll-value">0</span></p>
          </div>
        `;
        document.body.appendChild(statRollContainer);
      }
    },
    
    completeCharacterCreation: function(character) {
      // Save character to session storage
      sessionStorage.setItem('current-character', JSON.stringify(character));
      
      // Redirect to ember-throne.html
      window.location.href = 'ember-throne.html';
    }
  };
  
  // Initialize dice roll containers when the DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    GameX.CharacterSystem.initDiceRollContainers();
  });
})(); 