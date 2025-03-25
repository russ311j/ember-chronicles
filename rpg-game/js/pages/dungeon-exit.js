/**
 * Dungeon Exit Page (P-20)
 * Final page showing achievements and conclusion
 */

class DungeonExitPage extends PageTemplate {
    constructor() {
        super('dungeon-exit', {
            title: 'Dungeon Exit',
            background: 'media/images/generated/dungeon_exit.png',
            music: 'media/audio/victory_theme.mp3',
            allowBack: false,
            allowMenu: true,
            allowSave: true
        });

        this.achievements = [
            {
                id: 'boss_defeated',
                title: 'Boss Defeated',
                description: 'You have defeated the Ancient Guardian',
                reward: { brave: 2, powerful: 1 }
            },
            {
                id: 'treasure_collected',
                title: 'Treasure Hunter',
                description: 'You have collected valuable treasures',
                reward: { wealthy: 2, observant: 1 }
            },
            {
                id: 'knowledge_gained',
                title: 'Ancient Knowledge',
                description: 'You have learned powerful secrets',
                reward: { knowledgeable: 2, wise: 1 }
            }
        ];

        this.roomDescription = "As you emerge from the dungeon, the sunlight feels warm on your face. Your journey through the ancient halls has come to an end...";
    }

    /**
     * Initialize the dungeon exit page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.showRoomDescription();
        this.showAchievements();
    }

    /**
     * Create the dungeon exit content
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

        // Create achievements container
        const achievementsContainer = document.createElement('div');
        achievementsContainer.className = 'achievements-container';
        narrativeContainer.appendChild(achievementsContainer);

        // Create continue button
        const continueButton = document.createElement('button');
        continueButton.className = 'continue-button';
        continueButton.textContent = 'Continue Journey';
        continueButton.onclick = () => this.handleContinue();
        narrativeContainer.appendChild(continueButton);

        // Store elements
        this.elements = {
            ...this.elements,
            descriptionDisplay,
            achievementsContainer,
            continueButton
        };
    }

    /**
     * Show room description
     */
    async showRoomDescription() {
        await this.typeText(this.roomDescription);
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
     * Show achievements
     */
    async showAchievements() {
        const achievementsContainer = this.elements.achievementsContainer;
        achievementsContainer.innerHTML = '';

        // Add achievement header
        const header = document.createElement('div');
        header.className = 'achievements-header';
        header.textContent = 'Achievements';
        achievementsContainer.appendChild(header);

        // Add each achievement
        for (const achievement of this.achievements) {
            const achievementElement = this.createAchievementElement(achievement);
            achievementsContainer.appendChild(achievementElement);
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay between achievements
        }

        // Apply rewards
        this.applyAchievementRewards();
    }

    /**
     * Create achievement element
     */
    createAchievementElement(achievement) {
        const element = document.createElement('div');
        element.className = 'achievement-element';
        
        // Create achievement content
        const title = document.createElement('div');
        title.className = 'achievement-title';
        title.textContent = achievement.title;
        
        const description = document.createElement('div');
        description.className = 'achievement-description';
        description.textContent = achievement.description;
        
        element.appendChild(title);
        element.appendChild(description);
        
        return element;
    }

    /**
     * Apply achievement rewards
     */
    applyAchievementRewards() {
        const character = stateManager.getState('character');
        
        this.achievements.forEach(achievement => {
            if (achievement.reward) {
                Object.entries(achievement.reward).forEach(([trait, value]) => {
                    character.traits[trait] = (character.traits[trait] || 0) + value;
                });
            }
        });

        stateManager.setState('character', character);
    }

    /**
     * Handle continue button click
     */
    async handleContinue() {
        // Save game state
        await stateManager.saveGame();
        
        // Transition to next section
        await transitionManager.queueTransition('dungeon-exit', 'world-map', {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        // Handle continue with Enter key
        if (event.key === 'Enter') {
            this.handleContinue();
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // No UI updates needed for this page
    }
}

// Export for use in other files
window.DungeonExitPage = DungeonExitPage; 