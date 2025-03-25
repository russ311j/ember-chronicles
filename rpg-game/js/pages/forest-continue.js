/**
 * Forest Continue Page (P-08)
 * Transition point after completing any forest path
 */

class ForestContinuePage extends PageTemplate {
    constructor() {
        super('forest-continue', {
            title: 'Continuing the Journey',
            background: 'media/images/generated/forest_continue.png',
            music: 'media/audio/forest_theme.mp3',
            allowBack: false,
            allowMenu: true,
            allowSave: true
        });

        this.outcomes = {
            exploration: {
                title: 'The Fruits of Exploration',
                description: 'Your careful exploration has revealed valuable knowledge and resources.',
                traits: { observant: 1, knowledgeable: 1 },
                items: ['forest_map', 'herb_guide']
            },
            haste: {
                title: 'Swift Progress',
                description: 'Your quick actions have brought you closer to your goal.',
                traits: { decisive: 1, agile: 1 },
                items: ['speed_potion']
            },
            traveler: {
                title: 'A New Ally',
                description: 'The traveler\'s gratitude has provided you with valuable insights.',
                traits: { compassionate: 1, diplomatic: 1 },
                items: ['traveler_guide']
            }
        };
    }

    /**
     * Initialize the forest continue page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.updateUI();
    }

    /**
     * Create the forest continue content
     */
    createContent() {
        const content = this.elements.mainContent;
        
        // Create narrative container
        const narrativeContainer = document.createElement('div');
        narrativeContainer.className = 'narrative-container';
        content.appendChild(narrativeContainer);

        // Create outcome container
        const outcomeContainer = document.createElement('div');
        outcomeContainer.className = 'outcome-container';
        narrativeContainer.appendChild(outcomeContainer);

        // Create continue button
        const continueButton = document.createElement('button');
        continueButton.className = 'continue-button';
        continueButton.textContent = 'Continue Journey';
        continueButton.onclick = () => this.handleContinue();
        narrativeContainer.appendChild(continueButton);

        // Store elements
        this.elements = {
            ...this.elements,
            narrativeContainer,
            outcomeContainer,
            continueButton
        };
    }

    /**
     * Determine the outcome based on previous choices
     */
    determineOutcome() {
        const character = stateManager.getState('character');
        const traits = character.traits || {};

        // Check which path was taken based on character traits
        if (traits.observant > 0 && traits.knowledgeable > 0) {
            return this.outcomes.exploration;
        } else if (traits.decisive > 0 && traits.agile > 0) {
            return this.outcomes.haste;
        } else if (traits.compassionate > 0 && traits.diplomatic > 0) {
            return this.outcomes.traveler;
        }

        // Default outcome if no clear path is detected
        return {
            title: 'The Journey Continues',
            description: 'You press forward, ready for whatever lies ahead.',
            traits: {},
            items: []
        };
    }

    /**
     * Update the UI with the determined outcome
     */
    updateUI() {
        const outcome = this.determineOutcome();
        const outcomeContainer = this.elements.outcomeContainer;

        // Clear previous content
        outcomeContainer.innerHTML = '';

        // Add outcome title
        const title = document.createElement('h2');
        title.textContent = outcome.title;
        outcomeContainer.appendChild(title);

        // Add outcome description
        const description = document.createElement('p');
        description.textContent = outcome.description;
        outcomeContainer.appendChild(description);

        // Add rewards if any
        if (outcome.items.length > 0) {
            const rewardsList = document.createElement('ul');
            rewardsList.className = 'rewards-list';
            outcome.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                rewardsList.appendChild(li);
            });
            outcomeContainer.appendChild(rewardsList);
        }

        // Apply outcome effects
        this.applyOutcome(outcome);
    }

    /**
     * Apply the outcome effects
     */
    applyOutcome(outcome) {
        // Update character traits
        if (outcome.traits) {
            const character = stateManager.getState('character');
            Object.entries(outcome.traits).forEach(([trait, value]) => {
                character.traits[trait] = (character.traits[trait] || 0) + value;
            });
            stateManager.setState('character', character);
        }

        // Add items to inventory
        if (outcome.items) {
            const inventory = stateManager.getState('inventory') || [];
            outcome.items.forEach(item => {
                if (!inventory.includes(item)) {
                    inventory.push(item);
                }
            });
            stateManager.setState('inventory', inventory);
        }
    }

    /**
     * Handle continue button click
     */
    async handleContinue() {
        // Transition to next page
        await transitionManager.queueTransition('forest-continue', 'dungeon-entrance', {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.handleContinue();
        }
    }
}

// Export for use in other files
window.ForestContinuePage = ForestContinuePage; 