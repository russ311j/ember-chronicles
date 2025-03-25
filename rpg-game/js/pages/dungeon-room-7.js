/**
 * Dungeon Room 7 Page (P-16)
 * Stealth chamber with hidden items and patrol mechanics
 */

class DungeonRoom7Page extends PageTemplate {
    constructor() {
        super('dungeon-room-7', {
            title: 'The Stealth Chamber',
            background: 'media/images/generated/dungeon_room_7.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'patrolling_guard',
                title: 'Patrolling Guard',
                description: 'A guard slowly walks through the chamber...',
                examineText: 'The guard seems to follow a specific pattern...',
                requires: { observant: 2 },
                traits: { stealth: 1 },
                items: ['guard_key'],
                stealth: {
                    type: 'patrol',
                    pattern: ['north', 'east', 'south', 'west'],
                    speed: 2,
                    detection: 0.3
                }
            },
            {
                id: 'hidden_chest',
                title: 'Hidden Chest',
                description: 'A shadowy corner of the chamber...',
                examineText: 'Something seems to be hidden in the shadows...',
                requires: { observant: 2 },
                traits: { stealth: 1 },
                items: ['shadow_gem'],
                stealth: {
                    type: 'hidden',
                    difficulty: 3,
                    detection: 0.2
                }
            },
            {
                id: 'noisy_floor',
                title: 'Noisy Floor',
                description: 'A section of floor covered in loose stones...',
                examineText: 'The stones look unstable and noisy...',
                requires: { agile: 2 },
                traits: { stealth: 1 },
                items: ['silence_potion'],
                stealth: {
                    type: 'trap',
                    difficulty: 2,
                    detection: 0.4
                }
            }
        ];

        this.exits = [
            {
                id: 'secret_passage',
                text: 'Secret Passage',
                description: 'A hidden passage leading deeper into the dungeon',
                requires: { stealth: 3 },
                nextPage: 'dungeon-room-15'
            },
            {
                id: 'guard_post',
                text: 'Guard Post',
                description: 'A well-lit guard post with valuable items',
                requires: { observant: 3 },
                nextPage: 'dungeon-room-16'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the previous chamber',
                requires: {},
                nextPage: 'dungeon-room-3'
            }
        ];

        this.roomDescription = "The seventh chamber is a dimly lit room with many shadows and obstacles. A guard patrols the area, and various hazards make movement difficult. Success here will require careful observation and stealthy movement...";
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

        if (element.stealth) {
            await this.handleStealth(element);
        } else {
            // Handle regular interaction
            this.handleRegularInteraction(element);
        }
    }

    /**
     * Handle stealth interaction
     */
    async handleStealth(element) {
        const stealth = element.stealth;
        let success = false;

        // Calculate success chance based on traits and difficulty
        const successChance = this.calculateStealthSuccess(element);
        success = Math.random() < successChance;

        if (success) {
            await this.handleStealthSuccess(element);
        } else {
            await this.handleStealthFailure(element);
        }
    }

    /**
     * Calculate success chance for stealth interaction
     */
    calculateStealthSuccess(element) {
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

        // Adjust for stealth difficulty
        baseChance -= (element.stealth.difficulty - 2) * 0.1;

        return Math.min(0.9, Math.max(0.1, baseChance));
    }

    /**
     * Handle stealth success
     */
    async handleStealthSuccess(element) {
        await this.typeText('Success! You have completed the stealth challenge!');
        this.handleRegularInteraction(element);
    }

    /**
     * Handle stealth failure
     */
    async handleStealthFailure(element) {
        await this.typeText('You have been detected! The guard is alerted to your presence...');
        // Handle failure consequences
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
        await transitionManager.queueTransition('dungeon-room-7', exit.nextPage, {
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
window.DungeonRoom7Page = DungeonRoom7Page; 