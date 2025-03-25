/**
 * Traveler Encounter Page (P-07)
 * Dialogue and healing mechanics for helping an injured traveler
 */

class TravelerEncounterPage extends PageTemplate {
    constructor() {
        super('traveler-encounter', {
            title: 'The Injured Traveler',
            background: 'media/images/generated/traveler_encounter.png',
            music: 'media/audio/forest_theme.mp3',
            allowBack: false,
            allowMenu: true,
            allowSave: true
        });

        this.dialogue = [
            {
                id: 'initial',
                text: "You find a weary traveler resting against a tree, their leg wrapped in a makeshift bandage.",
                options: [
                    {
                        text: "Approach carefully",
                        next: 'approach',
                        traits: { cautious: 1 }
                    },
                    {
                        text: "Rush to help",
                        next: 'rush',
                        traits: { compassionate: 1 }
                    }
                ]
            },
            {
                id: 'approach',
                text: "The traveler looks up at your careful approach, their eyes showing both pain and relief.",
                options: [
                    {
                        text: "Offer healing herbs",
                        next: 'heal',
                        requires: { inventory: ['healing_herb'] },
                        traits: { knowledgeable: 1 }
                    },
                    {
                        text: "Ask about their injury",
                        next: 'talk',
                        traits: { observant: 1 }
                    }
                ]
            },
            {
                id: 'rush',
                text: "The traveler startles at your sudden appearance, but quickly relaxes seeing your intent to help.",
                options: [
                    {
                        text: "Apply first aid",
                        next: 'aid',
                        traits: { brave: 1 }
                    },
                    {
                        text: "Share your supplies",
                        next: 'share',
                        requires: { inventory: ['supplies'] },
                        traits: { generous: 1 }
                    }
                ]
            },
            {
                id: 'heal',
                text: "The traveler gratefully accepts the healing herbs, and you help them apply them properly.",
                options: [
                    {
                        text: "Ask about their journey",
                        next: 'journey',
                        traits: { curious: 1 }
                    },
                    {
                        text: "Offer to escort them",
                        next: 'escort',
                        traits: { brave: 1, compassionate: 1 }
                    }
                ]
            },
            {
                id: 'talk',
                text: "The traveler explains they were attacked by a wild animal while gathering herbs.",
                options: [
                    {
                        text: "Share your own story",
                        next: 'story',
                        traits: { charismatic: 1 }
                    },
                    {
                        text: "Offer protection",
                        next: 'protect',
                        traits: { brave: 1 }
                    }
                ]
            },
            {
                id: 'aid',
                text: "Your quick actions help stabilize the traveler's injury.",
                options: [
                    {
                        text: "Teach them self-defense",
                        next: 'teach',
                        traits: { knowledgeable: 1 }
                    },
                    {
                        text: "Share your knowledge of the forest",
                        next: 'knowledge',
                        traits: { observant: 1 }
                    }
                ]
            },
            {
                id: 'share',
                text: "The traveler is touched by your generosity and shares some valuable information about the forest.",
                options: [
                    {
                        text: "Accept their guidance",
                        next: 'guidance',
                        traits: { humble: 1 }
                    },
                    {
                        text: "Offer to trade knowledge",
                        next: 'trade',
                        traits: { diplomatic: 1 }
                    }
                ]
            }
        ];

        this.currentDialogue = null;
        this.dialogueHistory = [];
        this.inventory = new Set();
    }

    /**
     * Initialize the traveler encounter page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.startDialogue('initial');
    }

    /**
     * Create the traveler encounter content
     */
    createContent() {
        const content = this.elements.mainContent;
        
        // Create narrative container
        const narrativeContainer = document.createElement('div');
        narrativeContainer.className = 'narrative-container';
        content.appendChild(narrativeContainer);

        // Create dialogue container
        const dialogueContainer = document.createElement('div');
        dialogueContainer.className = 'dialogue-container';
        narrativeContainer.appendChild(dialogueContainer);

        // Create options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        narrativeContainer.appendChild(optionsContainer);

        // Store elements
        this.elements = {
            ...this.elements,
            narrativeContainer,
            dialogueContainer,
            optionsContainer
        };
    }

    /**
     * Start a dialogue sequence
     */
    startDialogue(dialogueId) {
        this.currentDialogue = this.dialogue.find(d => d.id === dialogueId);
        if (!this.currentDialogue) return;

        // Update dialogue text
        this.elements.dialogueContainer.textContent = this.currentDialogue.text;

        // Clear previous options
        this.elements.optionsContainer.innerHTML = '';

        // Add new options
        this.currentDialogue.options.forEach(option => {
            const optionButton = this.createOptionButton(option);
            this.elements.optionsContainer.appendChild(optionButton);
        });

        // Add to history
        this.dialogueHistory.push(dialogueId);
    }

    /**
     * Create an option button
     */
    createOptionButton(option) {
        const button = document.createElement('button');
        button.className = 'dialogue-option';
        
        // Create option content
        const text = document.createElement('div');
        text.className = 'option-text';
        text.textContent = option.text;
        
        button.appendChild(text);
        
        // Check requirements
        if (option.requires) {
            const meetsRequirements = this.checkRequirements(option.requires);
            button.disabled = !meetsRequirements;
        }
        
        // Add click handler
        button.onclick = () => this.handleOption(option);
        
        return button;
    }

    /**
     * Handle option selection
     */
    async handleOption(option) {
        // Update character traits
        if (option.traits) {
            const character = stateManager.getState('character');
            Object.entries(option.traits).forEach(([trait, value]) => {
                character.traits[trait] = (character.traits[trait] || 0) + value;
            });
            stateManager.setState('character', character);
        }

        // Handle inventory requirements
        if (option.requires?.inventory) {
            option.requires.inventory.forEach(item => {
                this.inventory.add(item);
            });
            stateManager.setState('inventory', Array.from(this.inventory));
        }

        // Move to next dialogue or end encounter
        if (option.next) {
            this.startDialogue(option.next);
        } else {
            await this.endEncounter();
        }
    }

    /**
     * Check if requirements are met
     */
    checkRequirements(requirements) {
        if (requirements.inventory) {
            return requirements.inventory.every(item => this.inventory.has(item));
        }
        return true;
    }

    /**
     * End the encounter
     */
    async endEncounter() {
        // Save final state
        stateManager.setState('inventory', Array.from(this.inventory));
        
        // Transition to next page
        await transitionManager.queueTransition('traveler-encounter', 'forest-continue', {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        if (event.key >= '1' && event.key <= this.currentDialogue.options.length.toString()) {
            const index = parseInt(event.key) - 1;
            const option = this.currentDialogue.options[index];
            if (!option.requires || this.checkRequirements(option.requires)) {
                this.handleOption(option);
            }
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // Update option buttons based on inventory and traits
        this.elements.optionsContainer.querySelectorAll('.dialogue-option').forEach((button, index) => {
            const option = this.currentDialogue.options[index];
            
            if (option.requires) {
                button.disabled = !this.checkRequirements(option.requires);
            }
        });
    }
}

// Export for use in other files
window.TravelerEncounterPage = TravelerEncounterPage; 