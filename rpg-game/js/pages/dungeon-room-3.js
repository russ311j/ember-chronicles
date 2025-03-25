/**
 * Dungeon Room 3 Page (P-12)
 * Environmental hazards and stealth mechanics
 */

class DungeonRoom3Page extends PageTemplate {
    constructor() {
        super('dungeon-room-3', {
            title: 'The Hazard Chamber',
            background: 'media/images/generated/dungeon_room_3.png',
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
                examineText: 'The mist seems to be emanating from cracks in the floor...',
                requires: { observant: 2 },
                traits: { cautious: 1 },
                items: ['antidote'],
                hazard: {
                    type: 'poison',
                    damage: 3,
                    duration: 3,
                    avoidable: true
                }
            },
            {
                id: 'collapsing_floor',
                title: 'Collapsing Floor',
                description: 'The floor appears unstable in places...',
                examineText: 'You notice a pattern in the floor tiles...',
                requires: { agile: 2 },
                traits: { observant: 1 },
                items: ['floor_map'],
                hazard: {
                    type: 'trap',
                    damage: 5,
                    avoidable: true
                }
            },
            {
                id: 'patrolling_guard',
                title: 'Patrolling Guard',
                description: 'A heavily armored guard paces the room...',
                examineText: 'The guard seems to follow a specific pattern...',
                requires: { stealth: 2 },
                traits: { observant: 1 },
                items: ['guard_schedule'],
                hazard: {
                    type: 'enemy',
                    damage: 4,
                    avoidable: true
                }
            }
        ];

        this.exits = [
            {
                id: 'north_passage',
                text: 'North Passage',
                description: 'A narrow passage leading deeper into the dungeon',
                requires: { stealth: 2 },
                nextPage: 'dungeon-room-7'
            },
            {
                id: 'east_corridor',
                text: 'East Corridor',
                description: 'A well-lit corridor with multiple doors',
                requires: { observant: 2 },
                nextPage: 'dungeon-room-8'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the first chamber',
                requires: {},
                nextPage: 'dungeon-room-1'
            }
        ];

        this.roomDescription = "The third chamber is a treacherous place, filled with environmental hazards and patrolling guards. Poisonous mist hangs in the air, the floor appears unstable in places, and a heavily armored guard paces the room. Success here will require careful observation and precise timing...";
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
        const character = stateManager.getState('character');
        let success = false;

        // Check if hazard can be avoided
        if (hazard.avoidable) {
            // Calculate success chance based on traits
            const successChance = this.calculateSuccessChance(element);
            success = Math.random() < successChance;
        }

        if (success) {
            await this.handleHazardSuccess(element);
        } else {
            await this.handleHazardFailure(element);
        }
    }

    /**
     * Calculate success chance for hazard avoidance
     */
    calculateSuccessChance(element) {
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

        return Math.min(0.9, baseChance);
    }

    /**
     * Handle hazard success
     */
    async handleHazardSuccess(element) {
        await this.typeText('You successfully navigate the hazard!');
        this.handleRegularInteraction(element);
    }

    /**
     * Handle hazard failure
     */
    async handleHazardFailure(element) {
        const hazard = element.hazard;
        const playerHealth = stateManager.getState('playerHealth') || 20;
        const newHealth = Math.max(0, playerHealth - hazard.damage);
        stateManager.setState('playerHealth', newHealth);

        await this.typeText(`You take ${hazard.damage} damage from the hazard!`);

        if (newHealth <= 0) {
            await this.handleDeath();
        }
    }

    /**
     * Handle player death
     */
    async handleDeath() {
        await this.typeText('You have succumbed to the hazards of the dungeon...');
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
        await transitionManager.queueTransition('dungeon-room-3', exit.nextPage, {
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
window.DungeonRoom3Page = DungeonRoom3Page; 