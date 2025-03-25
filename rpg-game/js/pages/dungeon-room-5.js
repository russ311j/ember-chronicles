/**
 * Dungeon Room 5 Page (P-14)
 * Combat chamber with different enemy types and challenges
 */

class DungeonRoom5Page extends PageTemplate {
    constructor() {
        super('dungeon-room-5', {
            title: 'The Combat Chamber',
            background: 'media/images/generated/dungeon_room_5.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'warrior_guardian',
                title: 'Warrior Guardian',
                description: 'A heavily armored warrior wields a massive sword...',
                examineText: 'The warrior\'s movements are slow but powerful...',
                requires: { brave: 2 },
                traits: { decisive: 1 },
                items: ['warrior_armor'],
                combat: {
                    type: 'warrior',
                    health: 25,
                    damage: 6,
                    defense: 3,
                    special: 'heavy_strike'
                }
            },
            {
                id: 'mage_guardian',
                title: 'Mage Guardian',
                description: 'A robed figure surrounded by magical energy...',
                examineText: 'The mage seems to be preparing powerful spells...',
                requires: { knowledgeable: 2 },
                traits: { wise: 1 },
                items: ['mage_staff'],
                combat: {
                    type: 'mage',
                    health: 15,
                    damage: 8,
                    defense: 1,
                    special: 'fireball'
                }
            },
            {
                id: 'rogue_guardian',
                title: 'Rogue Guardian',
                description: 'A shadowy figure moves silently through the chamber...',
                examineText: 'The rogue\'s movements are quick and unpredictable...',
                requires: { agile: 2 },
                traits: { observant: 1 },
                items: ['shadow_cloak'],
                combat: {
                    type: 'rogue',
                    health: 20,
                    damage: 5,
                    defense: 2,
                    special: 'backstab'
                }
            }
        ];

        this.exits = [
            {
                id: 'boss_chamber',
                text: 'Boss Chamber',
                description: 'A grand door leading to the dungeon\'s master',
                requires: { brave: 3 },
                nextPage: 'dungeon-room-11'
            },
            {
                id: 'treasure_vault',
                text: 'Treasure Vault',
                description: 'A secure vault filled with valuable items',
                requires: { observant: 3 },
                nextPage: 'dungeon-room-12'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the previous chamber',
                requires: {},
                nextPage: 'dungeon-room-2'
            }
        ];

        this.roomDescription = "The fifth chamber is a grand combat arena, with three distinct guardians waiting to test your strength. A warrior in heavy armor, a mage wielding powerful magic, and a rogue moving through the shadows. Each guardian represents a different combat style and challenge...";
    }

    /**
     * Initialize the dungeon room page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.showRoomDescription();
    }

    /**
     * Create the dungeon room content
     */
    createContent() {
        const content = this.elements.mainContent;
        
        // Create narrative container
        const narrativeContainer = document.createElement('div');
        narrativeContainer.className = 'narrative-container';
        content.appendChild(narrativeContainer);

        // Create room description
        const descriptionDisplay = document.createElement('div');
        descriptionDisplay.className = 'room-description';
        narrativeContainer.appendChild(descriptionDisplay);

        // Create interactive elements container
        const elementsContainer = document.createElement('div');
        elementsContainer.className = 'interactive-elements';
        narrativeContainer.appendChild(elementsContainer);

        // Create exits container
        const exitsContainer = document.createElement('div');
        exitsContainer.className = 'exits-container';
        narrativeContainer.appendChild(exitsContainer);

        // Store elements
        this.elements = {
            ...this.elements,
            descriptionDisplay,
            elementsContainer,
            exitsContainer
        };
    }

    /**
     * Show room description
     */
    async showRoomDescription() {
        await this.typeText(this.roomDescription);
        this.showInteractiveElements();
    }

    /**
     * Type text with animation
     */
    async typeText(text) {
        this.elements.descriptionDisplay.textContent = '';
        for (let i = 0; i < text.length; i++) {
            this.elements.descriptionDisplay.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    /**
     * Show interactive elements
     */
    showInteractiveElements() {
        const elementsContainer = this.elements.elementsContainer;
        elementsContainer.innerHTML = '';

        // Add room elements
        this.roomElements.forEach(element => {
            const elementButton = this.createElementButton(element);
            elementsContainer.appendChild(elementButton);
        });

        // Add exits
        this.showExits();
    }

    /**
     * Create an interactive element button
     */
    createElementButton(element) {
        const button = document.createElement('button');
        button.className = 'element-button';
        
        // Create element content
        const title = document.createElement('div');
        title.className = 'element-title';
        title.textContent = element.title;
        
        const description = document.createElement('div');
        description.className = 'element-description';
        description.textContent = element.description;
        
        button.appendChild(title);
        button.appendChild(description);
        
        // Check requirements
        if (element.requires) {
            const meetsRequirements = this.checkRequirements(element.requires);
            button.disabled = !meetsRequirements;
        }
        
        // Add click handler
        button.onclick = () => this.handleElementInteraction(element);
        
        return button;
    }

    /**
     * Show exit options
     */
    showExits() {
        const exitsContainer = this.elements.exitsContainer;
        exitsContainer.innerHTML = '';

        this.exits.forEach(exit => {
            const exitButton = this.createExitButton(exit);
            exitsContainer.appendChild(exitButton);
        });
    }

    /**
     * Create an exit button
     */
    createExitButton(exit) {
        const button = document.createElement('button');
        button.className = 'exit-button';
        
        // Create exit content
        const title = document.createElement('div');
        title.className = 'exit-title';
        title.textContent = exit.text;
        
        const description = document.createElement('div');
        description.className = 'exit-description';
        description.textContent = exit.description;
        
        button.appendChild(title);
        button.appendChild(description);
        
        // Check requirements
        if (exit.requires) {
            const meetsRequirements = this.checkRequirements(exit.requires);
            button.disabled = !meetsRequirements;
        }
        
        // Add click handler
        button.onclick = () => this.handleExit(exit);
        
        return button;
    }

    /**
     * Handle element interaction
     */
    async handleElementInteraction(element) {
        // Show examine text
        await this.typeText(element.examineText);

        if (element.combat) {
            await this.handleCombat(element);
        } else {
            // Handle regular interaction
            this.handleRegularInteraction(element);
        }
    }

    /**
     * Handle combat interaction
     */
    async handleCombat(element) {
        const combat = element.combat;
        let health = combat.health;
        let round = 1;

        // Show combat interface
        const combatContainer = document.createElement('div');
        combatContainer.className = 'combat-container';
        this.elements.mainContent.appendChild(combatContainer);

        // Create combat UI
        const healthDisplay = document.createElement('div');
        healthDisplay.className = 'health-display';
        healthDisplay.textContent = `${element.title} Health: ${health}`;
        combatContainer.appendChild(healthDisplay);

        // Handle combat rounds
        while (health > 0) {
            await this.typeText(`Round ${round}:`);
            
            // Player attack
            const damage = this.calculateDamage(element);
            health -= Math.max(0, damage - combat.defense);
            healthDisplay.textContent = `${element.title} Health: ${health}`;
            await this.typeText(`You deal ${Math.max(0, damage - combat.defense)} damage!`);

            if (health <= 0) {
                await this.handleCombatSuccess(element);
                break;
            }

            // Enemy attack
            const playerHealth = stateManager.getState('playerHealth') || 20;
            const enemyDamage = this.calculateEnemyDamage(combat);
            const newHealth = Math.max(0, playerHealth - enemyDamage);
            stateManager.setState('playerHealth', newHealth);
            await this.typeText(`${element.title} deals ${enemyDamage} damage!`);

            if (newHealth <= 0) {
                await this.handleCombatFailure(element);
                break;
            }

            round++;
        }
    }

    /**
     * Calculate player damage
     */
    calculateDamage(element) {
        const character = stateManager.getState('character');
        const baseDamage = 5;
        let traitBonus = 0;

        // Add trait bonuses based on enemy type
        switch (element.combat.type) {
            case 'warrior':
                traitBonus = (character.traits.brave || 0) * 2;
                break;
            case 'mage':
                traitBonus = (character.traits.knowledgeable || 0) * 2;
                break;
            case 'rogue':
                traitBonus = (character.traits.agile || 0) * 2;
                break;
        }

        return baseDamage + traitBonus;
    }

    /**
     * Calculate enemy damage
     */
    calculateEnemyDamage(combat) {
        const baseDamage = combat.damage;
        let finalDamage = baseDamage;

        // Apply special attack
        if (Math.random() < 0.3) { // 30% chance for special attack
            switch (combat.special) {
                case 'heavy_strike':
                    finalDamage *= 1.5;
                    break;
                case 'fireball':
                    finalDamage *= 2;
                    break;
                case 'backstab':
                    finalDamage *= 1.75;
                    break;
            }
        }

        return Math.floor(finalDamage);
    }

    /**
     * Handle combat success
     */
    async handleCombatSuccess(element) {
        await this.typeText(`You have defeated the ${element.title}!`);
        this.handleRegularInteraction(element);
    }

    /**
     * Handle combat failure
     */
    async handleCombatFailure(element) {
        await this.typeText(`You have been defeated by the ${element.title}...`);
        // Handle game over or return to previous state
    }

    /**
     * Handle regular interaction
     */
    handleRegularInteraction(element) {
        // Update character traits
        if (element.traits) {
            const character = stateManager.getState('character');
            Object.entries(element.traits).forEach(([trait, value]) => {
                character.traits[trait] = (character.traits[trait] || 0) + value;
            });
            stateManager.setState('character', character);
        }

        // Add items to inventory
        if (element.items) {
            const inventory = stateManager.getState('inventory') || [];
            element.items.forEach(item => {
                if (!inventory.includes(item)) {
                    inventory.push(item);
                }
            });
            stateManager.setState('inventory', inventory);
        }

        // Remove the element from the room
        this.roomElements = this.roomElements.filter(e => e.id !== element.id);
        this.showInteractiveElements();
    }

    /**
     * Handle exit selection
     */
    async handleExit(exit) {
        // Transition to next room
        await transitionManager.queueTransition('dungeon-room-5', exit.nextPage, {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Check if requirements are met
     */
    checkRequirements(requirements) {
        if (requirements.traits) {
            const character = stateManager.getState('character');
            return Object.entries(requirements.traits).every(([trait, value]) => {
                return (character.traits[trait] || 0) >= value;
            });
        }
        return true;
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        // Handle element interactions (1-3)
        if (event.key >= '1' && event.key <= this.roomElements.length.toString()) {
            const index = parseInt(event.key) - 1;
            const element = this.roomElements[index];
            if (!element.requires || this.checkRequirements(element.requires)) {
                this.handleElementInteraction(element);
            }
        }
        // Handle exits (4-6)
        else if (event.key >= '4' && event.key <= (3 + this.exits.length).toString()) {
            const index = parseInt(event.key) - 4;
            const exit = this.exits[index];
            if (!exit.requires || this.checkRequirements(exit.requires)) {
                this.handleExit(exit);
            }
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // Update element buttons based on requirements
        this.elements.elementsContainer.querySelectorAll('.element-button').forEach((button, index) => {
            const element = this.roomElements[index];
            if (element.requires) {
                button.disabled = !this.checkRequirements(element.requires);
            }
        });

        // Update exit buttons based on requirements
        this.elements.exitsContainer.querySelectorAll('.exit-button').forEach((button, index) => {
            const exit = this.exits[index];
            if (exit.requires) {
                button.disabled = !this.checkRequirements(exit.requires);
            }
        });
    }
}

// Export for use in other files
window.DungeonRoom5Page = DungeonRoom5Page; 