class DesolateMoorsPage extends PageTemplate {
    constructor() {
        super({
            id: 'desolate-moors',
            title: 'The Desolate Moors',
            backgroundImage: 'assets/images/backgrounds/moors.jpg',
            music: 'assets/music/moors.mp3',
            options: {
                back: true,
                menu: true,
                save: true
            }
        });

        this.currentStep = 0;
        this.moorsSteps = [
            {
                title: 'Entering the Moors',
                text: 'The desolate moors stretch before you, a vast expanse of mist-shrouded hills and treacherous bogs. The air is thick with an eerie stillness.',
                choices: [
                    { text: 'Take the high ground', nextStep: 1, trait: 'cautious' },
                    { text: 'Follow the mist', nextStep: 2, trait: 'curious' }
                ]
            },
            {
                title: 'The High Ground',
                text: 'From the elevated position, you can see the lay of the land better. There are several paths winding through the mist below.',
                choices: [
                    { text: 'Look for safe passage', nextStep: 3, trait: 'observant' },
                    { text: 'Mark the paths', nextStep: 4, trait: 'helpful' }
                ]
            },
            {
                title: 'Following the Mist',
                text: 'The mist seems to swirl in unnatural patterns, almost as if guiding you.',
                choices: [
                    { text: 'Follow the patterns', nextStep: 5, trait: 'curious' },
                    { text: 'Stay alert', nextStep: 6, trait: 'cautious' }
                ]
            },
            {
                title: 'Safe Passage',
                text: 'You spot a series of firm-looking stones that could provide a safe path through the bog.',
                choices: [
                    { text: 'Test the stones', nextStep: 7, trait: 'cautious' },
                    { text: 'Mark the path', nextStep: 8, trait: 'helpful' }
                ]
            },
            {
                title: 'Marking Paths',
                text: 'You create clear markers for the paths you can see from above.',
                choices: [
                    { text: 'Add warnings', nextStep: 9, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 10, trait: 'determined' }
                ]
            },
            {
                title: 'Mist Patterns',
                text: 'The mist patterns lead you to an ancient stone circle.',
                choices: [
                    { text: 'Examine the stones', nextStep: 11, trait: 'curious' },
                    { text: 'Stay back', nextStep: 12, trait: 'cautious' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'Your alertness helps you spot a hidden bog trap.',
                choices: [
                    { text: 'Mark the danger', nextStep: 13, trait: 'helpful' },
                    { text: 'Find another way', nextStep: 14, trait: 'cautious' }
                ]
            },
            {
                title: 'Testing Stones',
                text: 'You carefully test each stone before stepping.',
                choices: [
                    { text: 'Mark safe stones', nextStep: 15, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 16, trait: 'cautious' }
                ]
            },
            {
                title: 'Marking the Path',
                text: 'You create clear markers for the stone path.',
                choices: [
                    { text: 'Add details', nextStep: 17, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 18, trait: 'determined' }
                ]
            },
            {
                title: 'Adding Warnings',
                text: 'You add warning symbols to your path markers.',
                choices: [
                    { text: 'Add more details', nextStep: 19, trait: 'helpful' },
                    { text: 'Move on', nextStep: 20, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the marked paths.',
                choices: [
                    { text: 'Stay alert', nextStep: 21, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 22, trait: 'observant' }
                ]
            },
            {
                title: 'Examining Stones',
                text: 'The stone circle is covered in ancient runes.',
                choices: [
                    { text: 'Study the runes', nextStep: 23, trait: 'curious' },
                    { text: 'Leave quickly', nextStep: 24, trait: 'cautious' }
                ]
            },
            {
                title: 'Staying Back',
                text: 'You observe the stone circle from a safe distance.',
                choices: [
                    { text: 'Watch for activity', nextStep: 25, trait: 'patient' },
                    { text: 'Look for another way', nextStep: 26, trait: 'determined' }
                ]
            },
            {
                title: 'Marking Danger',
                text: 'You create clear warning markers for the bog trap.',
                choices: [
                    { text: 'Add details', nextStep: 27, trait: 'helpful' },
                    { text: 'Find safe path', nextStep: 28, trait: 'cautious' }
                ]
            },
            {
                title: 'Finding Another Way',
                text: 'You search for a safer path around the bog.',
                choices: [
                    { text: 'Mark safe path', nextStep: 29, trait: 'helpful' },
                    { text: 'Proceed carefully', nextStep: 30, trait: 'cautious' }
                ]
            },
            {
                title: 'Marking Safe Stones',
                text: 'You mark each safe stone with a clear symbol.',
                choices: [
                    { text: 'Add warnings', nextStep: 31, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 32, trait: 'cautious' }
                ]
            },
            {
                title: 'Crossing When Ready',
                text: 'You carefully cross using the marked stones.',
                choices: [
                    { text: 'Check other side', nextStep: 33, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 34, trait: 'determined' }
                ]
            },
            {
                title: 'Adding Details',
                text: 'You add detailed instructions to your path markers.',
                choices: [
                    { text: 'Add warnings', nextStep: 35, trait: 'helpful' },
                    { text: 'Move on', nextStep: 36, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You leave your markers behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 37, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 38, trait: 'observant' }
                ]
            },
            {
                title: 'Adding More Details',
                text: 'You add more helpful details to your warning markers.',
                choices: [
                    { text: 'Add distance markers', nextStep: 39, trait: 'helpful' },
                    { text: 'Move on', nextStep: 40, trait: 'determined' }
                ]
            },
            {
                title: 'Moving On',
                text: 'You leave your detailed markers behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 41, trait: 'cautious' },
                    { text: 'Look for more dangers', nextStep: 42, trait: 'observant' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'Your alertness helps you spot a hidden path.',
                choices: [
                    { text: 'Take the hidden path', nextStep: 43, trait: 'curious' },
                    { text: 'Stay on main path', nextStep: 44, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Landmarks',
                text: 'You search for recognizable features in the mist.',
                choices: [
                    { text: 'Mark your path', nextStep: 45, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 46, trait: 'determined' }
                ]
            },
            {
                title: 'Studying Runes',
                text: 'The runes tell of an ancient power sealed within the moors.',
                choices: [
                    { text: 'Take notes', nextStep: 47, trait: 'curious' },
                    { text: 'Leave quickly', nextStep: 48, trait: 'cautious' }
                ]
            },
            {
                title: 'Leaving Quickly',
                text: 'You quickly leave the stone circle area.',
                choices: [
                    { text: 'Stay alert', nextStep: 49, trait: 'cautious' },
                    { text: 'Look for signs', nextStep: 50, trait: 'observant' }
                ]
            },
            {
                title: 'Watching for Activity',
                text: 'You observe the stone circle from a safe distance.',
                choices: [
                    { text: 'Stay patient', nextStep: 51, trait: 'patient' },
                    { text: 'Look for another way', nextStep: 52, trait: 'determined' }
                ]
            },
            {
                title: 'Looking for Another Way',
                text: 'You search for an alternative path around the stone circle.',
                choices: [
                    { text: 'Mark safe path', nextStep: 53, trait: 'helpful' },
                    { text: 'Proceed carefully', nextStep: 54, trait: 'cautious' }
                ]
            },
            {
                title: 'Adding Details',
                text: 'You add detailed descriptions to your warning markers.',
                choices: [
                    { text: 'Add warnings', nextStep: 55, trait: 'helpful' },
                    { text: 'Move on', nextStep: 56, trait: 'determined' }
                ]
            },
            {
                title: 'Finding Safe Path',
                text: 'You discover a safer route around the bog.',
                choices: [
                    { text: 'Mark the path', nextStep: 57, trait: 'helpful' },
                    { text: 'Proceed carefully', nextStep: 58, trait: 'cautious' }
                ]
            },
            {
                title: 'Marking Safe Path',
                text: 'You create clear markers for the safe path.',
                choices: [
                    { text: 'Add details', nextStep: 59, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 60, trait: 'determined' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully through the bog.',
                choices: [
                    { text: 'Stay alert', nextStep: 61, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 62, trait: 'observant' }
                ]
            },
            {
                title: 'Adding Warnings',
                text: 'You add warning symbols to your stone markers.',
                choices: [
                    { text: 'Add more details', nextStep: 63, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 64, trait: 'cautious' }
                ]
            },
            {
                title: 'Crossing When Ready',
                text: 'You carefully cross using the marked stones.',
                choices: [
                    { text: 'Check other side', nextStep: 65, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 66, trait: 'determined' }
                ]
            },
            {
                title: 'Checking Other Side',
                text: 'You carefully check the far side of the bog.',
                choices: [
                    { text: 'Look for tracks', nextStep: 67, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 68, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the moors.',
                choices: [
                    { text: 'Stay alert', nextStep: 69, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 70, trait: 'observant' }
                ]
            },
            {
                title: 'Taking Hidden Path',
                text: 'You decide to take the hidden path.',
                choices: [
                    { text: 'Proceed carefully', nextStep: 71, trait: 'cautious' },
                    { text: 'Look for signs', nextStep: 72, trait: 'observant' }
                ]
            },
            {
                title: 'Staying on Main Path',
                text: 'You stick to the main path through the moors.',
                choices: [
                    { text: 'Continue forward', nextStep: 73, trait: 'determined' },
                    { text: 'Rest briefly', nextStep: 74, trait: 'cautious' }
                ]
            },
            {
                title: 'Marking Your Path',
                text: 'You mark your path through the moors.',
                choices: [
                    { text: 'Add details', nextStep: 75, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 76, trait: 'determined' }
                ]
            },
            {
                title: 'Taking Notes',
                text: 'You carefully record the runes\' meaning.',
                choices: [
                    { text: 'Study further', nextStep: 77, trait: 'curious' },
                    { text: 'Leave quickly', nextStep: 78, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Signs',
                text: 'You search for more signs in the area.',
                choices: [
                    { text: 'Study them', nextStep: 79, trait: 'curious' },
                    { text: 'Continue forward', nextStep: 80, trait: 'determined' }
                ]
            },
            {
                title: 'Staying Patient',
                text: 'You continue watching the stone circle.',
                choices: [
                    { text: 'Keep waiting', nextStep: 81, trait: 'patient' },
                    { text: 'Look for another way', nextStep: 82, trait: 'determined' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully on the hidden path.',
                choices: [
                    { text: 'Look for signs', nextStep: 83, trait: 'observant' },
                    { text: 'Stay alert', nextStep: 84, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Signs',
                text: 'You search for signs along the hidden path.',
                choices: [
                    { text: 'Study them', nextStep: 85, trait: 'curious' },
                    { text: 'Continue forward', nextStep: 86, trait: 'determined' }
                ]
            },
            {
                title: 'Resting Briefly',
                text: 'You take a short rest on the main path.',
                choices: [
                    { text: 'Stay alert', nextStep: 87, trait: 'cautious' },
                    { text: 'Continue forward', nextText: 'Exit Moors', nextStep: 88, trait: 'determined' }
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
        content.className = 'moors-journey-content';
        
        // Create the main content area
        const mainContent = document.createElement('div');
        mainContent.className = 'journey-main-content';
        
        // Create the title element
        const titleElement = document.createElement('h2');
        titleElement.className = 'journey-title';
        
        // Create the text element
        const textElement = document.createElement('div');
        textElement.className = 'journey-text';
        
        // Create the choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'journey-choices';
        
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
        const step = this.moorsSteps[this.currentStep];
        if (!step) return;

        // Update title
        const titleElement = this.container.querySelector('.journey-title');
        titleElement.textContent = step.title;

        // Update text with typing animation
        const textElement = this.container.querySelector('.journey-text');
        textElement.innerHTML = '';
        this.typeText(textElement, step.text);

        // Update choices
        const choicesContainer = this.container.querySelector('.journey-choices');
        choicesContainer.innerHTML = '';
        
        step.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'journey-choice-button';
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

        // Update character traits if applicable
        if (choice.trait) {
            const gameState = stateManager.getGameState();
            if (!gameState.character.traits) {
                gameState.character.traits = {};
            }
            gameState.character.traits[choice.trait] = (gameState.character.traits[choice.trait] || 0) + 1;
            stateManager.updateGameState(gameState);
        }

        if (choice.nextStep === 88) {
            // Transition to Labyrinth Entrance
            this.transitionToLabyrinth();
        } else {
            this.currentStep = choice.nextStep;
            this.showCurrentStep();
        }
    }

    transitionToLabyrinth() {
        // Save game state
        const gameState = stateManager.getGameState();
        gameState.currentPage = 'labyrinth-entrance';
        stateManager.updateGameState(gameState);

        // Transition to Labyrinth Entrance
        transitionManager.transitionTo(new LabyrinthEntrancePage());
    }

    goBack() {
        // Play back sound
        soundManager.playSound('back');
        
        // Go back to Forest Journey
        transitionManager.transitionTo(new ForestJourneyPage());
    }
} 