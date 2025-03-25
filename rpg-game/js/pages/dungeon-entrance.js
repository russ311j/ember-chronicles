/**
 * Dungeon Entrance Page (P-09)
 * Dramatic entrance to the dungeon with initial setup and choices
 */

class DungeonEntrancePage extends PageTemplate {
    constructor() {
        super('dungeon-entrance', {
            title: 'The Ancient Dungeon',
            background: 'media/images/generated/dungeon_entrance.png',
            music: 'media/audio/dungeon_theme.mp3',
            allowBack: false,
            allowMenu: true,
            allowSave: true
        });

        this.entranceChoices = [
            {
                id: 'careful_approach',
                text: 'Examine the entrance carefully',
                description: 'Look for potential dangers and clues',
                traits: { observant: 1, cautious: 1 },
                requires: { observant: 1 }
            },
            {
                id: 'quick_entrance',
                text: 'Enter quickly and quietly',
                description: 'Move swiftly to avoid detection',
                traits: { agile: 1, decisive: 1 },
                requires: { agile: 1 }
            },
            {
                id: 'prepare_entrance',
                text: 'Prepare your equipment',
                description: 'Check and organize your supplies',
                traits: { organized: 1, prepared: 1 },
                requires: { inventory: ['supplies'] }
            }
        ];

        this.entranceTexts = [
            "The ancient dungeon looms before you, its weathered stone walls telling tales of forgotten ages...",
            "Strange symbols carved into the entrance archway pulse with a faint, otherworldly light...",
            "The air grows colder as you approach, carrying whispers of long-forgotten secrets...",
            "Your journey through the forest has led you here, to the heart of the mystery..."
        ];

        this.currentTextIndex = 0;
        this.textSpeed = 50;
        this.isTyping = false;
    }

    /**
     * Initialize the dungeon entrance page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.startEntranceSequence();
    }

    /**
     * Create the dungeon entrance content
     */
    createContent() {
        const content = this.elements.mainContent;
        
        // Create narrative container
        const narrativeContainer = document.createElement('div');
        narrativeContainer.className = 'narrative-container';
        content.appendChild(narrativeContainer);

        // Create text display
        const textDisplay = document.createElement('div');
        textDisplay.className = 'text-display';
        narrativeContainer.appendChild(textDisplay);

        // Create choices container (initially hidden)
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container';
        choicesContainer.style.display = 'none';
        narrativeContainer.appendChild(choicesContainer);

        // Create continue button (initially hidden)
        const continueButton = document.createElement('button');
        continueButton.className = 'continue-button';
        continueButton.textContent = 'Continue';
        continueButton.style.display = 'none';
        continueButton.onclick = () => this.handleContinue();
        narrativeContainer.appendChild(continueButton);

        // Store elements
        this.elements = {
            ...this.elements,
            textDisplay,
            choicesContainer,
            continueButton
        };
    }

    /**
     * Start the entrance sequence
     */
    async startEntranceSequence() {
        // Show first text
        await this.typeText(this.entranceTexts[0]);
        this.elements.continueButton.style.display = 'block';
    }

    /**
     * Type text with animation
     */
    async typeText(text) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.elements.textDisplay.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            this.elements.textDisplay.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, this.textSpeed));
        }
        
        this.isTyping = false;
    }

    /**
     * Handle continue button click
     */
    async handleContinue() {
        this.currentTextIndex++;
        
        if (this.currentTextIndex < this.entranceTexts.length) {
            // Show next text
            this.elements.continueButton.style.display = 'none';
            await this.typeText(this.entranceTexts[this.currentTextIndex]);
            this.elements.continueButton.style.display = 'block';
        } else {
            // Show entrance choices
            this.showEntranceChoices();
        }
    }

    /**
     * Show entrance choices
     */
    showEntranceChoices() {
        const choicesContainer = this.elements.choicesContainer;
        choicesContainer.style.display = 'block';
        this.elements.continueButton.style.display = 'none';

        // Add choice buttons
        this.entranceChoices.forEach(choice => {
            const choiceButton = this.createChoiceButton(choice);
            choicesContainer.appendChild(choiceButton);
        });
    }

    /**
     * Create a choice button
     */
    createChoiceButton(choice) {
        const button = document.createElement('button');
        button.className = 'choice-button';
        
        // Create choice content
        const title = document.createElement('div');
        title.className = 'choice-title';
        title.textContent = choice.text;
        
        const description = document.createElement('div');
        description.className = 'choice-description';
        description.textContent = choice.description;
        
        button.appendChild(title);
        button.appendChild(description);
        
        // Check requirements
        if (choice.requires) {
            const meetsRequirements = this.checkRequirements(choice.requires);
            button.disabled = !meetsRequirements;
        }
        
        // Add click handler
        button.onclick = () => this.handleChoice(choice);
        
        return button;
    }

    /**
     * Handle choice selection
     */
    async handleChoice(choice) {
        // Update character traits
        const character = stateManager.getState('character');
        Object.entries(choice.traits).forEach(([trait, value]) => {
            character.traits[trait] = (character.traits[trait] || 0) + value;
        });
        stateManager.setState('character', character);

        // Transition to first dungeon room
        await transitionManager.queueTransition('dungeon-entrance', 'dungeon-room-1', {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Check if requirements are met
     */
    checkRequirements(requirements) {
        if (requirements.inventory) {
            const inventory = stateManager.getState('inventory') || [];
            return requirements.inventory.every(item => inventory.includes(item));
        }
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
        if (event.key === 'Enter' || event.key === ' ') {
            if (this.isTyping) {
                // Skip typing animation
                this.elements.textDisplay.textContent = this.entranceTexts[this.currentTextIndex];
                this.isTyping = false;
                this.elements.continueButton.style.display = 'block';
            } else if (this.elements.continueButton.style.display === 'block') {
                this.handleContinue();
            }
        } else if (event.key >= '1' && event.key <= this.entranceChoices.length.toString()) {
            const index = parseInt(event.key) - 1;
            const choice = this.entranceChoices[index];
            if (!choice.requires || this.checkRequirements(choice.requires)) {
                this.handleChoice(choice);
            }
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // Update text speed based on settings
        const textSpeed = stateManager.getSetting('textSpeed');
        switch (textSpeed) {
            case 'fast':
                this.textSpeed = 25;
                break;
            case 'normal':
                this.textSpeed = 50;
                break;
            case 'slow':
                this.textSpeed = 75;
                break;
        }

        // Update choice buttons based on requirements
        this.elements.choicesContainer.querySelectorAll('.choice-button').forEach((button, index) => {
            const choice = this.entranceChoices[index];
            if (choice.requires) {
                button.disabled = !this.checkRequirements(choice.requires);
            }
        });
    }
}

// Export for use in other files
window.DungeonEntrancePage = DungeonEntrancePage; 