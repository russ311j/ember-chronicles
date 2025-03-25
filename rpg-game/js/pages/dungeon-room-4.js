/**
 * Dungeon Room 4 Page (P-13)
 * Treasure room with rewards and choices
 */

class DungeonRoom4Page extends PageTemplate {
    constructor() {
        super('dungeon-room-4', {
            title: 'The Treasure Chamber',
            background: 'media/images/generated/dungeon_room_4.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'golden_chest',
                title: 'Golden Chest',
                description: 'A magnificent chest adorned with gold and jewels...',
                examineText: 'The chest appears to be locked with a complex mechanism...',
                requires: { knowledgeable: 2 },
                traits: { observant: 1 },
                items: ['golden_key', 'ancient_coin'],
                treasure: {
                    type: 'chest',
                    value: 100,
                    difficulty: 3
                }
            },
            {
                id: 'magical_tome',
                title: 'Magical Tome',
                description: 'An ancient book bound in strange leather...',
                examineText: 'The book seems to contain powerful spells...',
                requires: { knowledgeable: 2 },
                traits: { wise: 1 },
                items: ['spell_scroll'],
                treasure: {
                    type: 'knowledge',
                    value: 50,
                    difficulty: 2
                }
            },
            {
                id: 'enchanted_weapon',
                title: 'Enchanted Weapon',
                description: 'A weapon glowing with magical energy...',
                examineText: 'The weapon seems to choose its wielder...',
                requires: { brave: 2 },
                traits: { decisive: 1 },
                items: ['magic_sword'],
                treasure: {
                    type: 'weapon',
                    value: 75,
                    difficulty: 2
                }
            }
        ];

        this.exits = [
            {
                id: 'upper_chamber',
                text: 'Upper Chamber',
                description: 'A grand staircase leading upward',
                requires: { brave: 2 },
                nextPage: 'dungeon-room-9'
            },
            {
                id: 'secret_vault',
                text: 'Secret Vault',
                description: 'A hidden passage to a secure vault',
                requires: { observant: 2 },
                nextPage: 'dungeon-room-10'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the first chamber',
                requires: {},
                nextPage: 'dungeon-room-1'
            }
        ];

        this.roomDescription = "The fourth chamber is a magnificent treasure room, filled with valuable artifacts and magical items. Golden chests, ancient tomes, and enchanted weapons line the walls. The air is thick with the scent of old gold and powerful magic...";
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

        if (element.treasure) {
            await this.handleTreasure(element);
        } else {
            // Handle regular interaction
            this.handleRegularInteraction(element);
        }
    }

    /**
     * Handle treasure interaction
     */
    async handleTreasure(element) {
        const treasure = element.treasure;
        const character = stateManager.getState('character');
        let success = false;

        // Calculate success chance based on traits and difficulty
        const successChance = this.calculateTreasureSuccess(element);
        success = Math.random() < successChance;

        if (success) {
            await this.handleTreasureSuccess(element);
        } else {
            await this.handleTreasureFailure(element);
        }
    }

    /**
     * Calculate success chance for treasure interaction
     */
    calculateTreasureSuccess(element) {
        const character = stateManager.getState('character');
        let baseChance = 0.5;

        // Add trait bonuses
        if (element.requires) {
            Object.entries(element.requires).forEach(([trait, value]) => {
                const traitValue = character.traits[trait] || 0;
                if (traitValue >= value) {
                    baseChance += 0.2;
                }
            });
        }

        // Adjust for treasure difficulty
        baseChance -= (element.treasure.difficulty - 2) * 0.1;

        return Math.min(0.9, Math.max(0.1, baseChance));
    }

    /**
     * Handle treasure success
     */
    async handleTreasureSuccess(element) {
        const treasure = element.treasure;
        await this.typeText(`Success! You have obtained the treasure! (Value: ${treasure.value})`);
        
        // Update gold/inventory
        const gold = stateManager.getState('gold') || 0;
        stateManager.setState('gold', gold + treasure.value);
        
        this.handleRegularInteraction(element);
    }

    /**
     * Handle treasure failure
     */
    async handleTreasureFailure(element) {
        await this.typeText('You fail to obtain the treasure. Perhaps another time...');
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
        await transitionManager.queueTransition('dungeon-room-4', exit.nextPage, {
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
window.DungeonRoom4Page = DungeonRoom4Page; 