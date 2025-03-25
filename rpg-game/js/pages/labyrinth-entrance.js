class LabyrinthEntrancePage extends PageTemplate {
    constructor() {
        super({
            id: 'labyrinth-entrance',
            title: 'The Labyrinth Entrance',
            backgroundImage: 'assets/images/backgrounds/labyrinth-entrance.jpg',
            music: 'assets/music/labyrinth-entrance.mp3',
            options: {
                back: true,
                menu: true,
                save: true
            }
        });
    }

    initialize() {
        super.initialize();
        this.createContent();
    }

    createContent() {
        const content = document.createElement('div');
        content.className = 'labyrinth-entrance-content';
        
        // Create the main content area
        const mainContent = document.createElement('div');
        mainContent.className = 'labyrinth-entrance-main-content';
        
        // Create the title element
        const titleElement = document.createElement('h2');
        titleElement.className = 'labyrinth-entrance-title';
        titleElement.textContent = 'The Ancient Labyrinth';
        
        // Create the description element
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'labyrinth-entrance-description';
        descriptionElement.innerHTML = `
            <p>Before you stands the entrance to an ancient labyrinth, its weathered stone walls rising high into the darkness. The air is thick with mystery and the weight of centuries past.</p>
            <p>Strange symbols are carved into the stone archway, glowing faintly with an otherworldly light. The ground beneath your feet is worn smooth by countless footsteps of those who came before.</p>
            <p>You can feel the power emanating from within, calling to you, challenging you to enter and face whatever mysteries lie ahead.</p>
        `;
        
        // Create the warning element
        const warningElement = document.createElement('div');
        warningElement.className = 'labyrinth-entrance-warning';
        warningElement.innerHTML = `
            <p>⚠️ Warning: Once you enter the labyrinth, there may be no turning back. The path ahead is fraught with challenges and tests of your character.</p>
            <p>Are you prepared to face the trials that await within?</p>
        `;
        
        // Create the choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'labyrinth-entrance-choices';
        
        // Create the enter button
        const enterButton = document.createElement('button');
        enterButton.className = 'labyrinth-entrance-button enter';
        enterButton.textContent = 'Enter the Labyrinth';
        enterButton.addEventListener('click', () => this.handleEnter());
        
        // Create the examine button
        const examineButton = document.createElement('button');
        examineButton.className = 'labyrinth-entrance-button examine';
        examineButton.textContent = 'Examine the Entrance';
        examineButton.addEventListener('click', () => this.handleExamine());
        
        // Add buttons to choices container
        choicesContainer.appendChild(enterButton);
        choicesContainer.appendChild(examineButton);
        
        // Add all elements to main content
        mainContent.appendChild(titleElement);
        mainContent.appendChild(descriptionElement);
        mainContent.appendChild(warningElement);
        mainContent.appendChild(choicesContainer);
        
        // Add main content to content container
        content.appendChild(mainContent);
        
        // Add content to page
        this.container.appendChild(content);
    }

    handleEnter() {
        // Play click sound
        soundManager.playSound('click');
        
        // Save game state
        const gameState = stateManager.getGameState();
        gameState.currentPage = 'labyrinth';
        stateManager.updateGameState(gameState);
        
        // Transition to Labyrinth
        transitionManager.transitionTo(new LabyrinthPage());
    }

    handleExamine() {
        // Play click sound
        soundManager.playSound('click');
        
        // Show examination modal
        const modal = document.createElement('div');
        modal.className = 'labyrinth-entrance-modal';
        modal.innerHTML = `
            <div class="labyrinth-entrance-modal-content">
                <h3>The Entrance Details</h3>
                <div class="labyrinth-entrance-modal-text">
                    <p>As you examine the entrance more closely, you notice:</p>
                    <ul>
                        <li>The symbols on the archway seem to tell an ancient story, though their meaning eludes you.</li>
                        <li>The stone appears to be of an unknown origin, unlike any material you've seen before.</li>
                        <li>There's a faint breeze coming from within, carrying with it the scent of old stone and something else you can't quite identify.</li>
                        <li>The ground shows signs of both recent and ancient activity, suggesting others have come this way.</li>
                    </ul>
                </div>
                <button class="labyrinth-entrance-modal-close">Close</button>
            </div>
        `;
        
        // Add modal to page
        this.container.appendChild(modal);
        
        // Add close button functionality
        const closeButton = modal.querySelector('.labyrinth-entrance-modal-close');
        closeButton.addEventListener('click', () => {
            soundManager.playSound('click');
            modal.remove();
        });
    }

    goBack() {
        // Play back sound
        soundManager.playSound('back');
        
        // Go back to previous page
        transitionManager.transitionTo(new ForestJourneyPage());
    }
}

// Export for use in other files
window.LabyrinthEntrancePage = LabyrinthEntrancePage; 