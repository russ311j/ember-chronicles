/**
 * Forest Exploration Page (P-05)
 * Detailed exploration of the forest with discovery mechanics
 */

class ForestExplorationPage extends PageTemplate {
    constructor() {
        super('forest-exploration', {
            title: 'Forest Discoveries',
            background: 'media/images/generated/forest_exploration.png',
            music: 'media/audio/forest_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.discoveries = [
            {
                id: 'ancient_ruins',
                title: 'Ancient Ruins',
                description: 'You find the remains of an ancient structure, its stones covered in mysterious runes.',
                items: ['ancient_scroll', 'rune_stone'],
                traits: { observant: 1, curious: 1 },
                requires: { observant: 2 }
            },
            {
                id: 'herb_garden',
                title: 'Hidden Herb Garden',
                description: 'A small clearing contains rare medicinal herbs and plants.',
                items: ['healing_herb', 'mystic_flower'],
                traits: { cautious: 1, knowledgeable: 1 },
                requires: { observant: 1 }
            },
            {
                id: 'mysterious_pool',
                title: 'Mysterious Pool',
                description: 'A crystal-clear pool reflects the moonlight, its waters seeming to glow.',
                items: ['enchanted_water'],
                traits: { brave: 1, mystical: 1 },
                requires: { brave: 1 }
            }
        ];

        this.currentDiscovery = null;
        this.discoveredItems = new Set();
    }

    /**
     * Initialize the forest exploration page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.updateUI();
    }

    /**
     * Create the forest exploration content
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
        sceneDescription.textContent = "As you carefully explore the forest, you notice several interesting locations that might hold valuable information or resources...";
        narrativeContainer.appendChild(sceneDescription);

        // Create discoveries container
        const discoveriesContainer = document.createElement('div');
        discoveriesContainer.className = 'discoveries-container';
        narrativeContainer.appendChild(discoveriesContainer);

        // Add discovery buttons
        this.discoveries.forEach(discovery => {
            const discoveryButton = this.createDiscoveryButton(discovery);
            discoveriesContainer.appendChild(discoveryButton);
        });

        // Create details container (initially hidden)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'discovery-details';
        detailsContainer.style.display = 'none';
        narrativeContainer.appendChild(detailsContainer);

        // Store elements
        this.elements = {
            ...this.elements,
            narrativeContainer,
            sceneDescription,
            discoveriesContainer,
            detailsContainer
        };
    }

    /**
     * Create a discovery button
     */
    createDiscoveryButton(discovery) {
        const button = document.createElement('button');
        button.className = 'discovery-button';
        
        // Create discovery content
        const title = document.createElement('div');
        title.className = 'discovery-title';
        title.textContent = discovery.title;
        
        const description = document.createElement('div');
        description.className = 'discovery-description';
        description.textContent = discovery.description;
        
        button.appendChild(title);
        button.appendChild(description);
        
        // Add click handler
        button.onclick = () => this.handleDiscovery(discovery);
        
        return button;
    }

    /**
     * Handle discovery selection
     */
    async handleDiscovery(discovery) {
        this.currentDiscovery = discovery;
        
        // Create details content
        const details = this.elements.detailsContainer;
        details.innerHTML = '';
        
        // Add discovery details
        const title = document.createElement('h3');
        title.textContent = discovery.title;
        details.appendChild(title);
        
        const description = document.createElement('p');
        description.textContent = discovery.description;
        details.appendChild(description);
        
        // Add items found
        if (discovery.items) {
            const itemsList = document.createElement('ul');
            discovery.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                itemsList.appendChild(li);
            });
            details.appendChild(itemsList);
        }
        
        // Add action buttons
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'discovery-actions';
        
        const investigateButton = document.createElement('button');
        investigateButton.textContent = 'Investigate';
        investigateButton.onclick = () => this.investigateDiscovery(discovery);
        
        const leaveButton = document.createElement('button');
        leaveButton.textContent = 'Leave';
        leaveButton.onclick = () => this.hideDetails();
        
        actionsContainer.appendChild(investigateButton);
        actionsContainer.appendChild(leaveButton);
        details.appendChild(actionsContainer);
        
        // Show details
        details.style.display = 'block';
    }

    /**
     * Investigate a discovery
     */
    async investigateDiscovery(discovery) {
        // Update character traits
        const character = stateManager.getState('character');
        Object.entries(discovery.traits).forEach(([trait, value]) => {
            character.traits[trait] = (character.traits[trait] || 0) + value;
        });

        // Add items to inventory
        discovery.items.forEach(item => {
            this.discoveredItems.add(item);
        });

        // Save updated state
        stateManager.setState('character', character);
        stateManager.setState('inventory', Array.from(this.discoveredItems));

        // Hide details and update UI
        this.hideDetails();
        this.updateUI();
    }

    /**
     * Hide discovery details
     */
    hideDetails() {
        this.elements.detailsContainer.style.display = 'none';
        this.currentDiscovery = null;
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        if (event.key === 'Escape') {
            this.hideDetails();
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // Update discovery buttons based on character traits and discovered items
        const character = stateManager.getState('character');
        this.elements.discoveriesContainer.querySelectorAll('.discovery-button').forEach((button, index) => {
            const discovery = this.discoveries[index];
            
            // Disable if requirements not met
            if (discovery.requires && !this.meetsRequirements(discovery.requires, character)) {
                button.disabled = true;
            }
            
            // Mark as discovered if items were collected
            if (discovery.items.every(item => this.discoveredItems.has(item))) {
                button.classList.add('discovered');
            }
        });
    }

    /**
     * Check if character meets discovery requirements
     */
    meetsRequirements(requirements, character) {
        return Object.entries(requirements).every(([trait, value]) => {
            return (character.traits[trait] || 0) >= value;
        });
    }
}

// Export for use in other files
window.ForestExplorationPage = ForestExplorationPage; 