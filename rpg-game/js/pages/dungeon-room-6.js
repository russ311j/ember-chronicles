/**
 * Dungeon Room 6 Page (P-15)
 * Puzzle chamber with riddles and logic challenges
 */

class DungeonRoom6Page extends PageTemplate {
    constructor() {
        super('dungeon-room-6', {
            title: 'The Puzzle Chamber',
            background: 'media/images/generated/dungeon_room_6.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'ancient_riddle',
                title: 'Ancient Riddle',
                description: 'An ancient stone tablet bears an enigmatic riddle...',
                examineText: 'The riddle seems to be written in an ancient language...',
                requires: { knowledgeable: 2 },
                traits: { wise: 1 },
                items: ['riddle_solution'],
                puzzle: {
                    type: 'riddle',
                    question: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
                    answer: 'keyboard',
                    attempts: 3,
                    hint: 'Think about modern technology...'
                }
            },
            {
                id: 'symbol_sequence',
                title: 'Symbol Sequence',
                description: 'A series of glowing symbols float in the air...',
                examineText: 'The symbols seem to follow a pattern...',
                requires: { observant: 2 },
                traits: { knowledgeable: 1 },
                items: ['symbol_key'],
                puzzle: {
                    type: 'sequence',
                    sequence: ['fire', 'water', 'earth', 'air'],
                    attempts: 3,
                    hint: 'The elements follow a natural order...'
                }
            },
            {
                id: 'logic_gate',
                title: 'Logic Gate',
                description: 'A complex mechanism with multiple levers and switches...',
                examineText: 'The mechanism seems to follow logical rules...',
                requires: { knowledgeable: 2 },
                traits: { observant: 1 },
                items: ['logic_core'],
                puzzle: {
                    type: 'logic',
                    gates: ['AND', 'OR', 'XOR'],
                    solution: ['1', '0', '1'],
                    attempts: 3,
                    hint: 'Think about binary logic...'
                }
            }
        ];

        this.exits = [
            {
                id: 'library_chamber',
                text: 'Library Chamber',
                description: 'A chamber filled with ancient knowledge',
                requires: { knowledgeable: 3 },
                nextPage: 'dungeon-room-13'
            },
            {
                id: 'artifact_vault',
                text: 'Artifact Vault',
                description: 'A secure vault containing powerful artifacts',
                requires: { observant: 3 },
                nextPage: 'dungeon-room-14'
            },
            {
                id: 'return_corridor',
                text: 'Return Corridor',
                description: 'The way back to the previous chamber',
                requires: {},
                nextPage: 'dungeon-room-2'
            }
        ];

        this.roomDescription = "The sixth chamber is a room of puzzles and riddles. Ancient stone tablets, floating symbols, and complex mechanisms challenge your mind. Each puzzle seems to require a different approach and set of skills...";
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
        let attempts = puzzle.attempts;

        // Create puzzle interface
        const puzzleContainer = document.createElement('div');
        puzzleContainer.className = 'puzzle-container';
        this.elements.mainContent.appendChild(puzzleContainer);

        // Create puzzle UI based on type
        switch (puzzle.type) {
            case 'riddle':
                await this.handleRiddlePuzzle(puzzle, puzzleContainer);
                break;
            case 'sequence':
                await this.handleSequencePuzzle(puzzle, puzzleContainer);
                break;
            case 'logic':
                await this.handleLogicPuzzle(puzzle, puzzleContainer);
                break;
        }
    }

    /**
     * Handle riddle puzzle
     */
    async handleRiddlePuzzle(puzzle, container) {
        const questionDisplay = document.createElement('div');
        questionDisplay.className = 'puzzle-question';
        questionDisplay.textContent = puzzle.question;
        container.appendChild(questionDisplay);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your answer...';
        container.appendChild(input);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Answer';
        submitButton.onclick = async () => {
            const answer = input.value.toLowerCase().trim();
            if (answer === puzzle.answer) {
                await this.handlePuzzleSuccess(puzzle);
            } else {
                await this.handlePuzzleFailure(puzzle);
            }
        };
        container.appendChild(submitButton);
    }

    /**
     * Handle sequence puzzle
     */
    async handleSequencePuzzle(puzzle, container) {
        const sequenceDisplay = document.createElement('div');
        sequenceDisplay.className = 'puzzle-sequence';
        sequenceDisplay.textContent = puzzle.sequence.join(' → ');
        container.appendChild(sequenceDisplay);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter the next element...';
        container.appendChild(input);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Answer';
        submitButton.onclick = async () => {
            const answer = input.value.toLowerCase().trim();
            if (answer === puzzle.sequence[puzzle.sequence.length - 1]) {
                await this.handlePuzzleSuccess(puzzle);
            } else {
                await this.handlePuzzleFailure(puzzle);
            }
        };
        container.appendChild(submitButton);
    }

    /**
     * Handle logic puzzle
     */
    async handleLogicPuzzle(puzzle, container) {
        const gatesDisplay = document.createElement('div');
        gatesDisplay.className = 'puzzle-gates';
        gatesDisplay.textContent = puzzle.gates.join(' → ');
        container.appendChild(gatesDisplay);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter the sequence (0 or 1)...';
        container.appendChild(input);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Answer';
        submitButton.onclick = async () => {
            const answer = input.value.split('').map(Number);
            if (JSON.stringify(answer) === JSON.stringify(puzzle.solution)) {
                await this.handlePuzzleSuccess(puzzle);
            } else {
                await this.handlePuzzleFailure(puzzle);
            }
        };
        container.appendChild(submitButton);
    }

    /**
     * Handle puzzle success
     */
    async handlePuzzleSuccess(puzzle) {
        await this.typeText('Success! You have solved the puzzle!');
        this.handleRegularInteraction(puzzle);
    }

    /**
     * Handle puzzle failure
     */
    async handlePuzzleFailure(puzzle) {
        puzzle.attempts--;
        if (puzzle.attempts > 0) {
            await this.typeText(`Incorrect! You have ${puzzle.attempts} attempts remaining. Hint: ${puzzle.hint}`);
        } else {
            await this.typeText('You have failed to solve the puzzle...');
        }
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
        await transitionManager.queueTransition('dungeon-room-6', exit.nextPage, {
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
window.DungeonRoom6Page = DungeonRoom6Page; 