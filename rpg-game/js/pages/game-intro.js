/**
 * Game Introduction Page (P-03)
 * Narrative introduction to the game world and initial scenario
 */

class GameIntroPage extends PageTemplate {
    constructor() {
        super('game-intro', {
            title: 'The Beginning',
            background: 'media/images/generated/intro_scene.png',
            music: 'media/audio/intro_theme.mp3',
            allowBack: false,
            allowMenu: true,
            allowSave: true
        });

        this.currentTextIndex = 0;
        this.textSpeed = 50; // ms per character
        this.isTyping = false;
        this.introTexts = [
            "In a world where magic and technology intertwine, a great darkness threatens to consume all that is known...",
            "You are a chosen one, destined to face this darkness and determine the fate of the realm.",
            "Your journey begins in the peaceful village of Oakhaven, where the first signs of the coming darkness have appeared.",
            "The villagers speak of strange occurrences in the nearby forest, where shadows seem to move of their own accord.",
            "As you prepare to embark on your quest, you must first gather supplies and information from the village.",
            "The fate of the world rests in your hands. Choose your path wisely..."
        ];
    }

    /**
     * Initialize the game introduction page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.startIntroSequence();
    }

    /**
     * Create the game introduction content
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
            continueButton,
            narrativeContainer
        };
    }

    /**
     * Start the introduction sequence
     */
    async startIntroSequence() {
        // Show first text
        await this.typeText(this.introTexts[0]);
        
        // Show continue button
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
        
        if (this.currentTextIndex < this.introTexts.length) {
            // Show next text
            this.elements.continueButton.style.display = 'none';
            await this.typeText(this.introTexts[this.currentTextIndex]);
            this.elements.continueButton.style.display = 'block';
        } else {
            // Transition to forest journey
            await transitionManager.queueTransition('game-intro', 'forest-journey', {
                type: 'fade',
                duration: 1000
            });
        }
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            if (this.isTyping) {
                // Skip typing animation
                this.elements.textDisplay.textContent = this.introTexts[this.currentTextIndex];
                this.isTyping = false;
                this.elements.continueButton.style.display = 'block';
            } else {
                this.handleContinue();
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
    }
}

// Export for use in other files
window.GameIntroPage = GameIntroPage; 