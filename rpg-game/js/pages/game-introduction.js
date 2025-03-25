class GameIntroductionPage extends PageTemplate {
    constructor() {
        super({
            id: 'game-introduction',
            title: 'The Beginning',
            backgroundImage: 'assets/images/backgrounds/tavern.jpg',
            music: 'assets/music/tavern.mp3',
            options: {
                back: false,
                menu: true,
                save: true
            }
        });

        this.currentStep = 0;
        this.introductionSteps = [
            {
                title: 'Welcome to the Tavern',
                text: 'You find yourself in a cozy tavern, the air thick with the smell of ale and wood smoke. The warm glow of lanterns casts dancing shadows on the wooden walls.',
                choices: [
                    { text: 'Look around', nextStep: 1 }
                ]
            },
            {
                title: 'The Tavern Keeper',
                text: 'Behind the bar stands a weathered old man with kind eyes. He notices you and gives you a welcoming nod.',
                choices: [
                    { text: 'Approach the bar', nextStep: 2 }
                ]
            },
            {
                title: 'A Mysterious Map',
                text: '"Welcome, traveler," the tavern keeper says. "I have something that might interest you." He pulls out an ancient map from under the counter.',
                choices: [
                    { text: 'Examine the map', nextStep: 3 }
                ]
            },
            {
                title: 'The Quest Begins',
                text: '"This map leads to the legendary Dragon\'s Lair," he explains. "Many have tried to reach it, but none have returned. Perhaps you\'ll be different."',
                choices: [
                    { text: 'Accept the quest', nextStep: 4 },
                    { text: 'Ask for more information', nextStep: 5 }
                ]
            },
            {
                title: 'The Journey Ahead',
                text: '"Excellent choice," the tavern keeper says with a smile. "The path won\'t be easy, but fortune favors the brave. Here\'s a small token to help you on your way."',
                choices: [
                    { text: 'Take the supplies', nextStep: 6 }
                ]
            },
            {
                title: 'More Information',
                text: '"The Dragon\'s Lair is said to hold unimaginable treasures," the tavern keeper explains. "But it\'s protected by powerful magic and dangerous creatures. Only the most skilled adventurers have a chance."',
                choices: [
                    { text: 'Accept the quest', nextStep: 4 },
                    { text: 'Decline the quest', nextStep: 7 }
                ]
            },
            {
                title: 'Ready to Begin',
                text: 'The tavern keeper hands you a small pouch containing some basic supplies. "Good luck, adventurer. May your journey be fruitful."',
                choices: [
                    { text: 'Leave the tavern', nextStep: 8 }
                ]
            },
            {
                title: 'Declining the Quest',
                text: '"I understand," the tavern keeper says with a shrug. "Not everyone is cut out for such adventures. Perhaps another time."',
                choices: [
                    { text: 'Change your mind', nextStep: 4 },
                    { text: 'Leave the tavern', nextStep: 8 }
                ]
            },
            {
                title: 'The Adventure Begins',
                text: 'With your supplies in hand, you step out of the tavern into the crisp morning air. The path to the Dragon\'s Lair awaits.',
                choices: [
                    { text: 'Head to the dungeon entrance', nextStep: 9 }
                ]
            },
            {
                title: 'The Dungeon Entrance',
                text: 'After a short walk, you arrive at the entrance to the dungeon. The ancient stone archway looms before you, its surface covered in mysterious runes.',
                choices: [
                    { text: 'Enter the dungeon', nextStep: 10 }
                ]
            }
        ];
    }

    initialize() {
        super.initialize();
        this.createContent();
        this.showCurrentStep();
    }

    createContent() {
        const content = document.createElement('div');
        content.className = 'game-intro-content';
        
        // Create the main content area
        const mainContent = document.createElement('div');
        mainContent.className = 'intro-main-content';
        
        // Create the title element
        const titleElement = document.createElement('h2');
        titleElement.className = 'intro-title';
        
        // Create the text element
        const textElement = document.createElement('div');
        textElement.className = 'intro-text';
        
        // Create the choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'intro-choices';
        
        // Add elements to main content
        mainContent.appendChild(titleElement);
        mainContent.appendChild(textElement);
        mainContent.appendChild(choicesContainer);
        
        // Add main content to content container
        content.appendChild(mainContent);
        
        // Add content to page
        this.container.appendChild(content);
    }

    showCurrentStep() {
        const step = this.introductionSteps[this.currentStep];
        if (!step) return;

        // Update title
        const titleElement = this.container.querySelector('.intro-title');
        titleElement.textContent = step.title;

        // Update text with typing animation
        const textElement = this.container.querySelector('.intro-text');
        textElement.innerHTML = '';
        this.typeText(textElement, step.text);

        // Update choices
        const choicesContainer = this.container.querySelector('.intro-choices');
        choicesContainer.innerHTML = '';
        
        step.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'intro-choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.handleChoice(choice));
            choicesContainer.appendChild(button);
        });
    }

    async typeText(element, text) {
        element.innerHTML = '';
        for (let char of text) {
            const span = document.createElement('span');
            span.textContent = char;
            element.appendChild(span);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }

    handleChoice(choice) {
        // Play click sound
        soundManager.playSound('click');

        if (choice.nextStep === 10) {
            // Transition to dungeon entrance
            this.transitionToDungeon();
        } else {
            this.currentStep = choice.nextStep;
            this.showCurrentStep();
        }
    }

    transitionToDungeon() {
        // Save initial game state
        const gameState = stateManager.getGameState();
        gameState.currentPage = 'dungeon-entrance';
        gameState.flags.introductionCompleted = true;
        stateManager.updateGameState(gameState);

        // Transition to dungeon entrance
        transitionManager.transitionTo(new DungeonEntrancePage());
    }

    goBack() {
        // Play back sound
        soundManager.playSound('back');
        
        // Go back to character creation
        transitionManager.transitionTo(new CharacterCreationPage());
    }
} 