/**
 * Dice Roller Module for GameX RPG
 * Provides utilities for rolling dice and handling random events
 */

(function() {
  // Create a namespace for dice operations
  window.GameX = window.GameX || {};
  
  // Dice roller system
  GameX.DiceRoller = {
    /**
     * Roll a single die with the specified number of sides
     * @param {number} sides - Number of sides on the die
     * @returns {number} Result of the die roll (1 to sides)
     */
    rollDie: function(sides) {
      return Math.floor(Math.random() * sides) + 1;
    },
    
    /**
     * Roll multiple dice with the specified number of sides
     * @param {number} count - Number of dice to roll
     * @param {number} sides - Number of sides on each die
     * @returns {Object} Object containing the results array and sum
     */
    rollDice: function(count, sides) {
      const results = [];
      let sum = 0;
      
      for (let i = 0; i < count; i++) {
        const roll = this.rollDie(sides);
        results.push(roll);
        sum += roll;
      }
      
      return {
        results: results,
        sum: sum
      };
    },
    
    /**
     * Roll dice with the specified notation (e.g., "2d6+3")
     * @param {string} notation - Dice notation in the format XdY+Z
     * @returns {Object} Object with detailed roll information
     */
    rollNotation: function(notation) {
      // Parse the notation
      const regex = /(\d+)d(\d+)(?:([\+\-])(\d+))?/i;
      const match = notation.match(regex);
      
      if (!match) {
        throw new Error(`Invalid dice notation: ${notation}`);
      }
      
      const count = parseInt(match[1], 10);
      const sides = parseInt(match[2], 10);
      const hasModifier = match[3] !== undefined;
      const modifierType = hasModifier ? match[3] : null;
      const modifierValue = hasModifier ? parseInt(match[4], 10) : 0;
      
      // Roll the dice
      const diceRoll = this.rollDice(count, sides);
      let finalValue = diceRoll.sum;
      
      // Apply the modifier
      if (hasModifier) {
        if (modifierType === '+') {
          finalValue += modifierValue;
        } else if (modifierType === '-') {
          finalValue -= modifierValue;
        }
      }
      
      return {
        notation: notation,
        rolls: diceRoll.results,
        diceSum: diceRoll.sum,
        modifier: hasModifier ? `${modifierType}${modifierValue}` : null,
        modifierValue: hasModifier ? (modifierType === '+' ? modifierValue : -modifierValue) : 0,
        total: finalValue
      };
    },
    
    /**
     * Check if a roll succeeds against a difficulty class
     * @param {number} roll - The roll result to check
     * @param {number} dc - The difficulty class to beat
     * @returns {boolean} Whether the roll succeeded
     */
    checkSuccess: function(roll, dc) {
      return roll >= dc;
    },
    
    /**
     * Make an ability check using an ability modifier
     * @param {number} abilityMod - The ability modifier to use
     * @param {number} dc - The difficulty class to beat
     * @returns {Object} Object with roll details and success information
     */
    abilityCheck: function(abilityMod, dc) {
      const d20Roll = this.rollDie(20);
      const total = d20Roll + abilityMod;
      const success = this.checkSuccess(total, dc);
      
      return {
        d20: d20Roll,
        modifier: abilityMod,
        total: total,
        dc: dc,
        success: success,
        critical: d20Roll === 20,
        fumble: d20Roll === 1
      };
    },
    
    /**
     * Generate a result based on weighted probabilities
     * @param {Array} table - Array of objects with value and weight properties
     * @returns {*} The selected value
     */
    weightedRandom: function(table) {
      if (!table || table.length === 0) {
        return null;
      }
      
      // Calculate the total weight
      let totalWeight = 0;
      for (const entry of table) {
        totalWeight += entry.weight;
      }
      
      // Generate a random number between 0 and the total weight
      let random = Math.random() * totalWeight;
      
      // Find the selected entry
      for (const entry of table) {
        random -= entry.weight;
        if (random <= 0) {
          return entry.value;
        }
      }
      
      // Fallback to the last entry (should rarely happen due to floating-point rounding)
      return table[table.length - 1].value;
    },
    
    /**
     * Generate a random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number between min and max
     */
    randomRange: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Generate a random item from an array
     * @param {Array} array - Array to select from
     * @returns {*} Random item from the array
     */
    randomFromArray: function(array) {
      if (!array || array.length === 0) {
        return null;
      }
      
      const index = Math.floor(Math.random() * array.length);
      return array[index];
    },
    
    /**
     * Render the dice roll result in a visual format (for UI)
     * @param {Object} rollResult - The result from rollNotation
     * @returns {string} HTML representation of the dice roll
     */
    renderRoll: function(rollResult) {
      if (!rollResult) {
        return '';
      }
      
      let html = `<div class="dice-roll">`;
      html += `<span class="dice-notation">${rollResult.notation}</span>: `;
      
      // Render individual dice
      html += `<span class="dice-results">[`;
      html += rollResult.rolls.map(roll => `<span class="die-result">${roll}</span>`).join(', ');
      html += `]</span>`;
      
      // Render modifier
      if (rollResult.modifier) {
        html += ` <span class="dice-modifier">${rollResult.modifier}</span>`;
      }
      
      // Render total
      html += ` = <span class="dice-total">${rollResult.total}</span>`;
      html += `</div>`;
      
      return html;
    },
    
    /**
     * Display a visual dice roll animation on the page
     * @param {number} sides - Number of sides on the die
     * @param {Function} onComplete - Callback function when animation completes
     * @param {Object} options - Additional options for the animation
     * @returns {number} The final result of the roll
     */
    animateDiceRoll: function(sides, onComplete, options = {}) {
      const result = this.rollDie(sides);
      
      // Ensure dice roll container exists
      if (!document.getElementById('dice-roll-container') && typeof GameX.CharacterSystem !== 'undefined') {
        GameX.CharacterSystem.initDiceRollContainers();
      }
      
      const containerSelector = options.containerSelector || '#dice-roll-container';
      const diceFaceSelector = options.diceFaceSelector || '#dice-value';
      const resultSelector = options.resultSelector || '#roll-value';
      const outcomeSelector = options.outcomeSelector || '#roll-outcome';
      const animationDuration = options.duration || 1500;
      
      // Get the dice container elements
      const container = document.querySelector(containerSelector);
      const diceFace = document.querySelector(diceFaceSelector);
      const resultDisplay = document.querySelector(resultSelector);
      const outcomeDisplay = document.querySelector(outcomeSelector);
      
      if (!container || !diceFace) {
        console.error('Dice container elements not found');
        if (typeof onComplete === 'function') {
          onComplete(result);
        }
        return result;
      }
      
      // Set up initial state
      container.classList.remove('active');
      
      // Animation frames
      const frameCount = 10;
      const frameDelay = animationDuration / frameCount;
      let frame = 0;
      
      // Flash random numbers during animation
      const animationInterval = setInterval(() => {
        frame++;
        
        if (frame < frameCount) {
          // Show random values during animation
          const randomValue = this.rollDie(sides);
          diceFace.textContent = randomValue;
        } else {
          // Show final value and clear interval
          diceFace.textContent = result;
          clearInterval(animationInterval);
          
          // Set the result text
          if (resultDisplay) {
            if (options.modifier !== undefined) {
              resultDisplay.textContent = `${result} + ${options.modifier} = ${result + options.modifier}`;
            } else {
              resultDisplay.textContent = result;
            }
          }
          
          // Set success/failure outcome if needed
          if (outcomeDisplay && options.difficulty !== undefined) {
            const total = options.modifier !== undefined ? result + options.modifier : result;
            const success = total >= options.difficulty;
            
            outcomeDisplay.textContent = success ? 'Success!' : 'Failure!';
            outcomeDisplay.className = success ? 'success' : 'failure';
          }
          
          // Complete the animation after a short delay
          setTimeout(() => {
            if (typeof onComplete === 'function') {
              onComplete(result);
            }
            
            // Hide the animation after a delay (unless specified to keep visible)
            if (!options.keepVisible) {
              setTimeout(() => {
                container.classList.remove('active');
              }, 1000);
            }
          }, 500);
        }
      }, frameDelay);
      
      // Show the dice container
      container.classList.add('active');
      
      return result;
    },
    
    /**
     * Roll a d20 for ability checks and display the animation
     * @param {number} modifier - Ability modifier to add to the roll
     * @param {number} difficulty - Difficulty class to check against
     * @param {Function} onComplete - Callback when roll is complete
     * @param {Object} options - Additional options for the animation
     * @returns {Object} Roll result information
     */
    animateD20Roll: function(modifier = 0, difficulty = null, onComplete = null, options = {}) {
      // Merge default options with provided options
      const rollOptions = {
        ...options,
        modifier: modifier,
        difficulty: difficulty
      };
      
      // Perform the animated roll
      const rollResult = this.animateDiceRoll(20, (result) => {
        const total = result + modifier;
        const success = difficulty === null ? null : total >= difficulty;
        
        const rollData = {
          d20: result,
          modifier: modifier,
          total: total,
          difficulty: difficulty,
          success: success,
          critical: result === 20,
          fumble: result === 1
        };
        
        if (typeof onComplete === 'function') {
          onComplete(rollData);
        }
      }, rollOptions);
      
      return rollResult;
    },
    
    /**
     * Roll dice for stat generation and display the animation
     * @param {string} statName - Name of the stat being rolled
     * @param {Function} onComplete - Callback when roll is complete
     * @param {Object} options - Additional options for the animation
     * @returns {number} The total result of the roll
     */
    animateStatRoll: function(statName, onComplete) {
      const result = this.randomRange(1, 5); // Stats are 1-5 for our game
      
      // If we don't have the container, just return the result
      const container = document.getElementById('stat-roll-container');
      if (!container) {
        if (typeof onComplete === 'function') {
          onComplete(result);
        }
        return result;
      }
      
      // Show the container
      container.style.display = 'flex';
      
      // Update the stat name
      const statNameElement = document.getElementById('stat-name');
      if (statNameElement) {
        statNameElement.textContent = statName;
      }
      
      // Animate the dice
      const diceElements = [
        document.getElementById('die-1'),
        document.getElementById('die-2'),
        document.getElementById('die-3')
      ];
      
      let frame = 0;
      const totalFrames = 10;
      const interval = setInterval(() => {
        frame++;
        
        // Update dice values with random numbers
        diceElements.forEach(die => {
          if (die) {
            die.textContent = Math.floor(Math.random() * 6) + 1;
          }
        });
        
        // On last frame, show the final result
        if (frame >= totalFrames) {
          clearInterval(interval);
          
          // Update the result display
          const resultElement = document.getElementById('stat-roll-value');
          if (resultElement) {
            resultElement.textContent = result;
          }
          
          // Hide the container after a short delay
          setTimeout(() => {
            container.style.display = 'none';
            if (typeof onComplete === 'function') {
              onComplete(result);
            }
          }, 1000);
        }
      }, 100);
      
      return result;
    }
  };
})(); 

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Create the dice roll container if it doesn't exist
  if (!document.getElementById('stat-roll-container')) {
    const container = document.createElement('div');
    container.id = 'stat-roll-container';
    container.className = 'dice-roll-overlay';
    container.innerHTML = `
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
    document.body.appendChild(container);
  }
}); 