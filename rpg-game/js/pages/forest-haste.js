/**
 * Forest Haste Page (P-06)
 * Time-based challenges for players who chose to hurry through the forest
 */

class ForestHastePage extends PageTemplate {
    constructor() {
        super('forest-haste', {
            title: 'Racing Through the Forest',
            background: 'media/images/generated/forest_haste.png',
            music: 'media/audio/forest_theme.mp3',
            allowBack: false,
            allowMenu: true,
            allowSave: true
        });

        this.challenges = [
            {
                id: 'narrow_path',
                title: 'Narrow Path',
                description: 'A treacherous path requires quick reflexes to navigate.',
                difficulty: 2,
                timeLimit: 5000,
                success: {
                    traits: { decisive: 1, agile: 1 },
                    nextPage: 'path-success'
                },
                failure: {
                    traits: { cautious: 1 },
                    nextPage: 'path-failure'
                }
            },
            {
                id: 'river_crossing',
                title: 'River Crossing',
                description: 'A rushing river blocks your path. You must find a way across quickly.',
                difficulty: 3,
                timeLimit: 7000,
                success: {
                    traits: { brave: 1, resourceful: 1 },
                    nextPage: 'river-success'
                },
                failure: {
                    traits: { patient: 1 },
                    nextPage: 'river-failure'
                }
            },
            {
                id: 'dark_cave',
                title: 'Dark Cave',
                description: 'A shortcut through a dark cave could save time, but is it safe?',
                difficulty: 4,
                timeLimit: 9000,
                success: {
                    traits: { brave: 1, observant: 1 },
                    nextPage: 'cave-success'
                },
                failure: {
                    traits: { cautious: 1 },
                    nextPage: 'cave-failure'
                }
            }
        ];

        this.currentChallenge = null;
        this.timer = null;
        this.timeRemaining = 0;
        this.isActive = false;
    }

    /**
     * Initialize the forest haste page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.updateUI();
    }

    /**
     * Create the forest haste content
     */
    createContent() {
        const content = this.elements.mainContent;
        
        // Create narrative container
        const narrativeContainer = document.createElement('div');
        narrativeContainer.className = 'narrative-container';
        content.appendChild(narrativeContainer);

        // Add scene description
        const sceneDescription = document.createElement('div');
        sceneDescription.className = 'scene-description';
        sceneDescription.textContent = "Time is of the essence as you race through the forest. Each obstacle requires quick thinking and decisive action...";
        narrativeContainer.appendChild(sceneDescription);

        // Create challenges container
        const challengesContainer = document.createElement('div');
        challengesContainer.className = 'challenges-container';
        narrativeContainer.appendChild(challengesContainer);

        // Add challenge buttons
        this.challenges.forEach(challenge => {
            const challengeButton = this.createChallengeButton(challenge);
            challengesContainer.appendChild(challengeButton);
        });

        // Create challenge view (initially hidden)
        const challengeView = document.createElement('div');
        challengeView.className = 'challenge-view';
        challengeView.style.display = 'none';
        narrativeContainer.appendChild(challengeView);

        // Create timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        timerDisplay.style.display = 'none';
        narrativeContainer.appendChild(timerDisplay);

        // Store elements
        this.elements = {
            ...this.elements,
            narrativeContainer,
            sceneDescription,
            challengesContainer,
            challengeView,
            timerDisplay
        };
    }

    /**
     * Create a challenge button
     */
    createChallengeButton(challenge) {
        const button = document.createElement('button');
        button.className = 'challenge-button';
        
        // Create challenge content
        const title = document.createElement('div');
        title.className = 'challenge-title';
        title.textContent = challenge.title;
        
        const description = document.createElement('div');
        description.className = 'challenge-description';
        description.textContent = challenge.description;
        
        const difficulty = document.createElement('div');
        difficulty.className = 'challenge-difficulty';
        difficulty.textContent = `Difficulty: ${challenge.difficulty}`;
        
        button.appendChild(title);
        button.appendChild(description);
        button.appendChild(difficulty);
        
        // Add click handler
        button.onclick = () => this.startChallenge(challenge);
        
        return button;
    }

    /**
     * Start a challenge
     */
    async startChallenge(challenge) {
        this.currentChallenge = challenge;
        this.isActive = true;
        this.timeRemaining = challenge.timeLimit;
        
        // Update UI
        this.elements.challengesContainer.style.display = 'none';
        this.elements.challengeView.style.display = 'block';
        this.elements.timerDisplay.style.display = 'block';
        
        // Show challenge details
        const challengeView = this.elements.challengeView;
        challengeView.innerHTML = `
            <h3>${challenge.title}</h3>
            <p>${challenge.description}</p>
            <div class="challenge-controls">
                <button class="action-button" onclick="this.handleAction('success')">Succeed</button>
                <button class="action-button" onclick="this.handleAction('failure')">Fail</button>
            </div>
        `;
        
        // Start timer
        this.startTimer();
    }

    /**
     * Start the challenge timer
     */
    startTimer() {
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining -= 1000;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.handleAction('failure');
            }
        }, 1000);
    }

    /**
     * Update the timer display
     */
    updateTimerDisplay() {
        const seconds = Math.ceil(this.timeRemaining / 1000);
        this.elements.timerDisplay.textContent = `Time remaining: ${seconds}s`;
    }

    /**
     * Handle challenge action
     */
    async handleAction(result) {
        if (!this.isActive) return;
        
        // Clear timer
        clearInterval(this.timer);
        this.isActive = false;
        
        // Get outcome
        const outcome = this.currentChallenge[result];
        
        // Update character traits
        const character = stateManager.getState('character');
        Object.entries(outcome.traits).forEach(([trait, value]) => {
            character.traits[trait] = (character.traits[trait] || 0) + value;
        });
        
        // Save updated state
        stateManager.setState('character', character);
        
        // Transition to next page
        await transitionManager.queueTransition('forest-haste', outcome.nextPage, {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        if (!this.isActive) return;
        
        if (event.key === 's') {
            this.handleAction('success');
        } else if (event.key === 'f') {
            this.handleAction('failure');
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // Update challenge buttons based on character traits
        const character = stateManager.getState('character');
        this.elements.challengesContainer.querySelectorAll('.challenge-button').forEach((button, index) => {
            const challenge = this.challenges[index];
            
            // Disable if already completed
            if (this.completedChallenges.has(challenge.id)) {
                button.disabled = true;
                button.classList.add('completed');
            }
        });
    }
}

// Export for use in other files
window.ForestHastePage = ForestHastePage; 