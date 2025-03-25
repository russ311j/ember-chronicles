/**
 * Dungeon Room 8 Page (P-17)
 * Hazard chamber with environmental challenges and survival mechanics
 */

class DungeonRoom8Page extends PageTemplate {
    constructor() {
        super('dungeon-room-8', {
            title: 'The Hazard Chamber',
            background: 'media/images/generated/dungeon_room_8.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'poisonous_mist',
                title: 'Poisonous Mist',
                description: 'A thick, green mist hangs in the air...',
                examineText: 'The mist seems to be slowly spreading...',
                requires: { observant: 2 },
                traits: { knowledgeable: 1 },
                items: ['antidote'],
                hazard: {
                    type: 'poison',
                    damage: 3,
                    duration: 3,
                    resistance: 0.3
                }
            },
            {
                id: 'collapsing_floor',
                title: 'Collapsing Floor',
                description: 'The floor looks unstable in places...',
                examineText: 'Some sections seem ready to give way...',
                requires: { agile: 2 },
                traits: { observant: 1 },
                items: ['rope'],
                hazard: {
                    type: 'trap',
                    damage: 5,
                    difficulty: 3,
                    resistance: 0.4
                }
            },
            {
                id: 'flame_wall',
                title: 'Flame Wall',
                description: 'A wall of magical flames blocks the path...',
                examineText: 'The flames seem to follow a pattern...',
                requires: { knowledgeable: 2 },
                traits: { brave: 1 },
                items: ['fire_resistance'],
                hazard: {
                    type: 'fire',
                    damage: 4,
                    duration: 2,
                    resistance: 0.35
                }
            }
        ];

        this.exits = [
            {
                id: 'treasure_vault',
                text: 'Treasure Vault',
                description: 'A secure vault with valuable treasures',
                requires: { observant: 3 },
                nextPage: 'dungeon-room-17'
            },
            {
                id: 'boss_chamber',
                text: 'Boss Chamber',
                description: 'The final challenge awaits',
                requires: { brave: 3 },
                nextPage: 'dungeon-room-18'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the previous chamber',
                requires: {},
                nextPage: 'dungeon-room-3'
            }
        ];

        this.roomDescription = "The eighth chamber is filled with various environmental hazards. Poisonous mist, unstable floors, and magical flames create a dangerous environment. Success here will require careful observation and quick thinking...";
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

        if (element.hazard) {
            await this.handleHazard(element);
        } else {
            // Handle regular interaction
            this.handleRegularInteraction(element);
        }
    }

    /**
     * Handle hazard interaction
     */
    async handleHazard(element) {
        const hazard = element.hazard;
        let success = false;

        // Calculate success chance based on traits and hazard properties
        const successChance = this.calculateHazardSuccess(element);
        success = Math.random() < successChance;

        if (success) {
            await this.handleHazardSuccess(element);
        } else {
            await this.handleHazardFailure(element);
        }
    }

    /**
     * Calculate success chance for hazard interaction
     */
    calculateHazardSuccess(element) {
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

        // Adjust for hazard difficulty
        baseChance -= (element.hazard.difficulty - 2) * 0.1;

        // Apply resistance
        baseChance += element.hazard.resistance;

        return Math.min(0.9, Math.max(0.1, baseChance));
    }

    /**
     * Handle hazard success
     */
    async handleHazardSuccess(element) {
        await this.typeText('Success! You have safely navigated the hazard!');
        this.handleRegularInteraction(element);
    }

    /**
     * Handle hazard failure
     */
    async handleHazardFailure(element) {
        const hazard = element.hazard;
        const character = stateManager.getState('character');
        
        // Apply damage
        character.health = Math.max(0, character.health - hazard.damage);
        stateManager.setState('character', character);

        await this.typeText(`You have taken ${hazard.damage} damage from the hazard!`);
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
        await transitionManager.queueTransition('dungeon-room-8', exit.nextPage, {
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
window.DungeonRoom8Page = DungeonRoom8Page; 