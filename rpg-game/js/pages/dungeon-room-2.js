/**
 * Dungeon Room 2 Page (P-11)
 * Puzzle room with combat mechanics and environmental challenges
 */

class DungeonRoom2Page extends PageTemplate {
    constructor() {
        super('dungeon-room-2', {
            title: 'The Puzzle Chamber',
            background: 'media/images/generated/dungeon_room_2.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'stone_pedestal',
                title: 'Stone Pedestal',
                description: 'A pedestal with three rotating rings...',
                examineText: 'The rings are covered in ancient symbols that seem to align in specific patterns...',
                requires: { observant: 2 },
                traits: { knowledgeable: 1 },
                items: ['pedestal_key'],
                puzzle: {
                    type: 'rotation',
                    solution: ['dragon', 'moon', 'star'],
                    attempts: 3
                }
            },
            {
                id: 'guardian_statue',
                title: 'Guardian Statue',
                description: 'A massive stone statue holding a sword...',
                examineText: 'The statue\'s eyes seem to follow your movements...',
                requires: { brave: 2 },
                traits: { decisive: 1 },
                items: ['guardian_sword'],
                combat: {
                    difficulty: 3,
                    health: 20,
                    damage: 5
                }
            },
            {
                id: 'mysterious_portal',
                title: 'Mysterious Portal',
                description: 'A swirling portal of magical energy...',
                examineText: 'The portal seems to require a specific sequence of actions to activate...',
                requires: { knowledgeable: 2 },
                traits: { observant: 1 },
                items: ['portal_stone'],
                puzzle: {
                    type: 'sequence',
                    solution: ['touch', 'chant', 'offer'],
                    attempts: 3
                }
            }
        ];

        this.exits = [
            {
                id: 'lower_chamber',
                text: 'Lower Chamber',
                description: 'A dark passage leading downward',
                requires: { brave: 2 },
                nextPage: 'dungeon-room-5'
            },
            {
                id: 'secret_passage',
                text: 'Secret Passage',
                description: 'A hidden passage behind a tapestry',
                requires: { observant: 2 },
                nextPage: 'dungeon-room-6'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the first chamber',
                requires: {},
                nextPage: 'dungeon-room-1'
            }
        ];

        this.roomDescription = "The second chamber is more elaborate than the first, with intricate carvings covering the walls. Three distinct areas draw your attention: a stone pedestal with rotating rings, a massive guardian statue, and a mysterious portal. The air crackles with magical energy...";
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

        if (element.puzzle) {
            await this.handlePuzzle(element);
        } else if (element.combat) {
            await this.handleCombat(element);
        } else {
            // Handle regular interaction
            this.handleRegularInteraction(element);
        }
    }

    /**
     * Handle puzzle interaction
     */
    async handlePuzzle(element) {
        const puzzle = element.puzzle;
        let attempts = 0;

        while (attempts < puzzle.attempts) {
            // Show puzzle interface
            const puzzleContainer = document.createElement('div');
            puzzleContainer.className = 'puzzle-container';
            this.elements.mainContent.appendChild(puzzleContainer);

            // Create puzzle elements based on type
            if (puzzle.type === 'rotation') {
                await this.handleRotationPuzzle(puzzleContainer, puzzle.solution);
            } else if (puzzle.type === 'sequence') {
                await this.handleSequencePuzzle(puzzleContainer, puzzle.solution);
            }

            attempts++;
        }

        // Handle puzzle completion
        if (attempts < puzzle.attempts) {
            await this.handlePuzzleSuccess(element);
        } else {
            await this.handlePuzzleFailure(element);
        }
    }

    /**
     * Handle combat interaction
     */
    async handleCombat(element) {
        const combat = element.combat;
        let health = combat.health;

        // Show combat interface
        const combatContainer = document.createElement('div');
        combatContainer.className = 'combat-container';
        this.elements.mainContent.appendChild(combatContainer);

        // Create combat UI
        const healthDisplay = document.createElement('div');
        healthDisplay.className = 'health-display';
        healthDisplay.textContent = `Guardian Health: ${health}`;
        combatContainer.appendChild(healthDisplay);

        // Handle combat rounds
        while (health > 0) {
            // Player attack
            const damage = this.calculateDamage();
            health -= damage;
            healthDisplay.textContent = `Guardian Health: ${health}`;

            if (health <= 0) {
                await this.handleCombatSuccess(element);
                break;
            }

            // Guardian attack
            const playerHealth = stateManager.getState('playerHealth') || 20;
            const newHealth = Math.max(0, playerHealth - combat.damage);
            stateManager.setState('playerHealth', newHealth);

            if (newHealth <= 0) {
                await this.handleCombatFailure(element);
                break;
            }
        }
    }

    /**
     * Calculate combat damage
     */
    calculateDamage() {
        const character = stateManager.getState('character');
        const baseDamage = 5;
        const traitBonus = (character.traits.brave || 0) * 2;
        return baseDamage + traitBonus;
    }

    /**
     * Handle puzzle success
     */
    async handlePuzzleSuccess(element) {
        await this.typeText('Success! The puzzle has been solved.');
        this.handleRegularInteraction(element);
    }

    /**
     * Handle puzzle failure
     */
    async handlePuzzleFailure(element) {
        await this.typeText('The puzzle remains unsolved. Perhaps another time...');
    }

    /**
     * Handle combat success
     */
    async handleCombatSuccess(element) {
        await this.typeText('The guardian has been defeated!');
        this.handleRegularInteraction(element);
    }

    /**
     * Handle combat failure
     */
    async handleCombatFailure(element) {
        await this.typeText('You have been defeated by the guardian...');
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
        await transitionManager.queueTransition('dungeon-room-2', exit.nextPage, {
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
window.DungeonRoom2Page = DungeonRoom2Page; 