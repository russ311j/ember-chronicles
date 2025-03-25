class LabyrinthPage extends PageTemplate {
    constructor() {
        super({
            id: 'labyrinth',
            title: 'The Ancient Labyrinth',
            backgroundImage: 'assets/images/backgrounds/labyrinth.jpg',
            music: 'assets/music/labyrinth.mp3',
            options: {
                back: true,
                menu: true,
                save: true
            }
        });

        this.currentStep = 0;
        this.labyrinthSteps = [
            {
                title: 'Entering the Labyrinth',
                text: 'The ancient labyrinth stretches before you, its walls covered in mysterious symbols. The air is thick with anticipation and the sound of distant echoes.',
                choices: [
                    { text: 'Follow the left path', nextStep: 1, trait: 'intuition' },
                    { text: 'Take the right path', nextStep: 2, trait: 'logic' }
                ]
            },
            {
                title: 'The Left Path',
                text: 'The left path leads to a chamber with three doors. Each door bears a different symbol.',
                choices: [
                    { text: 'Choose the door with the sun symbol', nextStep: 3, trait: 'wisdom' },
                    { text: 'Select the door with the moon symbol', nextStep: 4, trait: 'mystery' },
                    { text: 'Pick the door with the star symbol', nextStep: 5, trait: 'guidance' }
                ]
            },
            {
                title: 'The Right Path',
                text: 'The right path leads to a circular room with a central pedestal. The walls are covered in ancient writing.',
                choices: [
                    { text: 'Examine the pedestal', nextStep: 6, trait: 'curiosity' },
                    { text: 'Study the writing', nextStep: 7, trait: 'knowledge' }
                ]
            },
            {
                title: 'The Sun Door',
                text: 'The sun door leads to a bright chamber filled with mirrors. Light reflects in complex patterns.',
                choices: [
                    { text: 'Follow the light patterns', nextStep: 8, trait: 'perception' },
                    { text: 'Examine the mirrors', nextStep: 9, trait: 'investigation' }
                ]
            },
            {
                title: 'The Moon Door',
                text: 'The moon door opens into a dark chamber. Strange shadows move on the walls.',
                choices: [
                    { text: 'Stay in the shadows', nextStep: 10, trait: 'stealth' },
                    { text: 'Light a torch', nextStep: 11, trait: 'courage' }
                ]
            },
            {
                title: 'The Star Door',
                text: 'The star door reveals a chamber with a map of constellations on the ceiling.',
                choices: [
                    { text: 'Study the constellations', nextStep: 12, trait: 'wisdom' },
                    { text: 'Look for patterns', nextStep: 13, trait: 'analysis' }
                ]
            },
            {
                title: 'The Pedestal',
                text: 'The pedestal holds an ancient artifact. It seems to pulse with energy.',
                choices: [
                    { text: 'Touch the artifact', nextStep: 14, trait: 'courage' },
                    { text: 'Study it from afar', nextStep: 15, trait: 'caution' }
                ]
            },
            {
                title: 'The Ancient Writing',
                text: 'The writing appears to be a riddle or puzzle. Solving it might reveal the way forward.',
                choices: [
                    { text: 'Try to solve the riddle', nextStep: 16, trait: 'intelligence' },
                    { text: 'Look for clues', nextStep: 17, trait: 'perception' }
                ]
            },
            {
                title: 'Following the Light',
                text: 'The light patterns lead you through a series of chambers, each more complex than the last.',
                choices: [
                    { text: 'Continue following', nextStep: 18, trait: 'determination' },
                    { text: 'Take a different path', nextStep: 19, trait: 'adaptability' }
                ]
            },
            {
                title: 'Examining the Mirrors',
                text: 'The mirrors seem to show different versions of the labyrinth.',
                choices: [
                    { text: 'Look for the real path', nextStep: 20, trait: 'perception' },
                    { text: 'Study the reflections', nextStep: 21, trait: 'analysis' }
                ]
            },
            {
                title: 'In the Shadows',
                text: 'Moving through the shadows, you spot a hidden passage.',
                choices: [
                    { text: 'Take the hidden passage', nextStep: 22, trait: 'stealth' },
                    { text: 'Wait and observe', nextStep: 23, trait: 'patience' }
                ]
            },
            {
                title: 'Lighting the Torch',
                text: 'The torch reveals ancient paintings on the walls, telling a story.',
                choices: [
                    { text: 'Study the paintings', nextStep: 24, trait: 'knowledge' },
                    { text: 'Follow the story', nextStep: 25, trait: 'intuition' }
                ]
            },
            {
                title: 'The Constellations',
                text: 'The constellations seem to form a map of the labyrinth.',
                choices: [
                    { text: 'Follow the map', nextStep: 26, trait: 'navigation' },
                    { text: 'Look for more patterns', nextStep: 27, trait: 'analysis' }
                ]
            },
            {
                title: 'Finding Patterns',
                text: 'You notice that the star patterns match certain symbols on the floor.',
                choices: [
                    { text: 'Follow the symbols', nextStep: 28, trait: 'perception' },
                    { text: 'Study the connection', nextStep: 29, trait: 'wisdom' }
                ]
            },
            {
                title: 'Touching the Artifact',
                text: 'The artifact pulses with energy as you touch it, revealing a hidden passage.',
                choices: [
                    { text: 'Enter the passage', nextStep: 30, trait: 'courage' },
                    { text: 'Wait for more signs', nextStep: 31, trait: 'caution' }
                ]
            },
            {
                title: 'Studying from Afar',
                text: 'From a distance, you notice patterns in the artifact\'s energy pulses.',
                choices: [
                    { text: 'Decode the patterns', nextStep: 32, trait: 'analysis' },
                    { text: 'Look for more clues', nextStep: 33, trait: 'perception' }
                ]
            },
            {
                title: 'Solving the Riddle',
                text: 'Your solution to the riddle reveals a new path through the labyrinth.',
                choices: [
                    { text: 'Take the new path', nextStep: 34, trait: 'wisdom' },
                    { text: 'Double-check your answer', nextStep: 35, trait: 'caution' }
                ]
            },
            {
                title: 'Looking for Clues',
                text: 'You find additional clues that help piece together the labyrinth\'s secrets.',
                choices: [
                    { text: 'Follow the clues', nextStep: 36, trait: 'investigation' },
                    { text: 'Study the patterns', nextStep: 37, trait: 'analysis' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'Following the light patterns leads you deeper into the labyrinth.',
                choices: [
                    { text: 'Stay on the path', nextStep: 38, trait: 'determination' },
                    { text: 'Look for shortcuts', nextStep: 39, trait: 'adaptability' }
                ]
            },
            {
                title: 'Taking a Different Path',
                text: 'You find a new route through the labyrinth.',
                choices: [
                    { text: 'Explore further', nextStep: 40, trait: 'curiosity' },
                    { text: 'Mark your path', nextStep: 41, trait: 'preparation' }
                ]
            },
            {
                title: 'Finding the Real Path',
                text: 'You identify the true path through the mirror maze.',
                choices: [
                    { text: 'Follow it carefully', nextStep: 42, trait: 'caution' },
                    { text: 'Move quickly', nextStep: 43, trait: 'speed' }
                ]
            },
            {
                title: 'Studying Reflections',
                text: 'The reflections reveal important details about the labyrinth\'s structure.',
                choices: [
                    { text: 'Use this knowledge', nextStep: 44, trait: 'wisdom' },
                    { text: 'Look for more details', nextStep: 45, trait: 'perception' }
                ]
            },
            {
                title: 'The Hidden Passage',
                text: 'The hidden passage leads to a secret chamber.',
                choices: [
                    { text: 'Enter carefully', nextStep: 46, trait: 'caution' },
                    { text: 'Observe first', nextStep: 47, trait: 'patience' }
                ]
            },
            {
                title: 'Waiting and Observing',
                text: 'Your patience reveals a pattern in the guard movements.',
                choices: [
                    { text: 'Use the pattern', nextStep: 48, trait: 'strategy' },
                    { text: 'Wait longer', nextStep: 49, trait: 'patience' }
                ]
            },
            {
                title: 'The Ancient Paintings',
                text: 'The paintings tell the story of the labyrinth\'s creation.',
                choices: [
                    { text: 'Learn from the story', nextStep: 50, trait: 'wisdom' },
                    { text: 'Look for practical clues', nextStep: 51, trait: 'practicality' }
                ]
            },
            {
                title: 'Following the Story',
                text: 'The story reveals important information about the labyrinth\'s purpose.',
                choices: [
                    { text: 'Use this knowledge', nextStep: 52, trait: 'wisdom' },
                    { text: 'Look for more details', nextStep: 53, trait: 'curiosity' }
                ]
            },
            {
                title: 'Following the Map',
                text: 'The constellation map guides you through the labyrinth.',
                choices: [
                    { text: 'Stay on course', nextStep: 54, trait: 'determination' },
                    { text: 'Look for landmarks', nextStep: 55, trait: 'navigation' }
                ]
            },
            {
                title: 'More Patterns',
                text: 'You discover additional patterns that enhance your understanding.',
                choices: [
                    { text: 'Apply the patterns', nextStep: 56, trait: 'wisdom' },
                    { text: 'Study further', nextStep: 57, trait: 'knowledge' }
                ]
            },
            {
                title: 'Following Symbols',
                text: 'The floor symbols lead you through the labyrinth.',
                choices: [
                    { text: 'Follow carefully', nextStep: 58, trait: 'caution' },
                    { text: 'Move quickly', nextStep: 59, trait: 'speed' }
                ]
            },
            {
                title: 'Studying the Connection',
                text: 'You understand how the symbols and stars are connected.',
                choices: [
                    { text: 'Use this knowledge', nextStep: 60, trait: 'wisdom' },
                    { text: 'Look for more connections', nextStep: 61, trait: 'analysis' }
                ]
            },
            {
                title: 'Entering the Passage',
                text: 'The hidden passage leads to a crucial part of the labyrinth.',
                choices: [
                    { text: 'Proceed carefully', nextStep: 62, trait: 'caution' },
                    { text: 'Look for traps', nextStep: 63, trait: 'perception' }
                ]
            },
            {
                title: 'Waiting for Signs',
                text: 'More signs appear, confirming the correct path.',
                choices: [
                    { text: 'Follow the signs', nextStep: 64, trait: 'wisdom' },
                    { text: 'Wait for more', nextStep: 65, trait: 'patience' }
                ]
            },
            {
                title: 'Decoding Patterns',
                text: 'You successfully decode the artifact\'s energy patterns.',
                choices: [
                    { text: 'Use the patterns', nextStep: 66, trait: 'wisdom' },
                    { text: 'Study further', nextStep: 67, trait: 'knowledge' }
                ]
            },
            {
                title: 'More Clues',
                text: 'Additional clues help you understand the labyrinth better.',
                choices: [
                    { text: 'Follow the clues', nextStep: 68, trait: 'investigation' },
                    { text: 'Look for patterns', nextStep: 69, trait: 'analysis' }
                ]
            },
            {
                title: 'The New Path',
                text: 'The riddle\'s solution reveals a clear path forward.',
                choices: [
                    { text: 'Take the path', nextStep: 70, trait: 'determination' },
                    { text: 'Check for dangers', nextStep: 71, trait: 'caution' }
                ]
            },
            {
                title: 'Double-Checking',
                text: 'Your careful verification confirms the correct path.',
                choices: [
                    { text: 'Proceed confidently', nextStep: 72, trait: 'wisdom' },
                    { text: 'Stay alert', nextStep: 73, trait: 'caution' }
                ]
            },
            {
                title: 'Following Clues',
                text: 'The clues lead you through a series of chambers.',
                choices: [
                    { text: 'Stay on track', nextStep: 74, trait: 'determination' },
                    { text: 'Look for shortcuts', nextStep: 75, trait: 'adaptability' }
                ]
            },
            {
                title: 'Studying Patterns',
                text: 'The patterns reveal important information about the labyrinth.',
                choices: [
                    { text: 'Use this knowledge', nextStep: 76, trait: 'wisdom' },
                    { text: 'Look for more patterns', nextStep: 77, trait: 'analysis' }
                ]
            },
            {
                title: 'Staying on Path',
                text: 'You maintain your course through the labyrinth.',
                choices: [
                    { text: 'Continue forward', nextStep: 78, trait: 'determination' },
                    { text: 'Rest briefly', nextStep: 79, trait: 'caution' }
                ]
            },
            {
                title: 'Looking for Shortcuts',
                text: 'You search for faster routes through the labyrinth.',
                choices: [
                    { text: 'Take a shortcut', nextStep: 80, trait: 'speed' },
                    { text: 'Stay on safe path', nextStep: 81, trait: 'caution' }
                ]
            },
            {
                title: 'Exploring Further',
                text: 'Your exploration reveals new possibilities.',
                choices: [
                    { text: 'Take the new route', nextStep: 82, trait: 'curiosity' },
                    { text: 'Mark your path', nextStep: 83, trait: 'preparation' }
                ]
            },
            {
                title: 'Marking Your Path',
                text: 'You create clear markers for your journey.',
                choices: [
                    { text: 'Add details', nextStep: 84, trait: 'preparation' },
                    { text: 'Continue forward', nextStep: 85, trait: 'determination' }
                ]
            },
            {
                title: 'Following Carefully',
                text: 'You move carefully along the identified path.',
                choices: [
                    { text: 'Stay alert', nextStep: 86, trait: 'caution' },
                    { text: 'Move forward', nextStep: 87, trait: 'determination' }
                ]
            },
            {
                title: 'Moving Quickly',
                text: 'You move quickly through the known safe path.',
                choices: [
                    { text: 'Check for pursuers', nextStep: 88, trait: 'caution' },
                    { text: 'Continue forward', nextStep: 89, trait: 'speed' }
                ]
            },
            {
                title: 'Using Knowledge',
                text: 'You apply your understanding of the labyrinth.',
                choices: [
                    { text: 'Follow your instincts', nextStep: 90, trait: 'wisdom' },
                    { text: 'Stay alert', nextStep: 91, trait: 'caution' }
                ]
            },
            {
                title: 'More Details',
                text: 'You search for additional details in your surroundings.',
                choices: [
                    { text: 'Study them', nextStep: 92, trait: 'perception' },
                    { text: 'Move forward', nextStep: 93, trait: 'determination' }
                ]
            },
            {
                title: 'Entering Carefully',
                text: 'You carefully enter the secret chamber.',
                choices: [
                    { text: 'Look for dangers', nextStep: 94, trait: 'caution' },
                    { text: 'Study the chamber', nextStep: 95, trait: 'investigation' }
                ]
            },
            {
                title: 'Observing First',
                text: 'You observe the chamber from a safe distance.',
                choices: [
                    { text: 'Wait longer', nextStep: 96, trait: 'patience' },
                    { text: 'Look for another way', nextStep: 97, trait: 'adaptability' }
                ]
            },
            {
                title: 'Using the Pattern',
                text: 'You use the pattern in the guard movements to your advantage.',
                choices: [
                    { text: 'Move quickly', nextStep: 98, trait: 'speed' },
                    { text: 'Stay hidden', nextStep: 99, trait: 'stealth' }
                ]
            },
            {
                title: 'Waiting Longer',
                text: 'Your patience reveals more about the chamber\'s secrets.',
                choices: [
                    { text: 'Use this knowledge', nextStep: 100, trait: 'wisdom' },
                    { text: 'Look for more clues', nextStep: 101, trait: 'patience' }
                ]
            },
            {
                title: 'Learning from Story',
                text: 'The story of the labyrinth\'s creation provides valuable insights.',
                choices: [
                    { text: 'Apply the lessons', nextStep: 102, trait: 'wisdom' },
                    { text: 'Look for more details', nextStep: 103, trait: 'curiosity' }
                ]
            },
            {
                title: 'Practical Clues',
                text: 'You find practical information about navigating the labyrinth.',
                choices: [
                    { text: 'Use the information', nextStep: 104, trait: 'practicality' },
                    { text: 'Look for more clues', nextStep: 105, trait: 'investigation' }
                ]
            },
            {
                title: 'Using Knowledge',
                text: 'You apply the knowledge gained from the story.',
                choices: [
                    { text: 'Follow your instincts', nextStep: 106, trait: 'wisdom' },
                    { text: 'Stay alert', nextStep: 107, trait: 'caution' }
                ]
            },
            {
                title: 'More Details',
                text: 'You search for additional details in the story.',
                choices: [
                    { text: 'Study them', nextStep: 108, trait: 'knowledge' },
                    { text: 'Move forward', nextStep: 109, trait: 'determination' }
                ]
            },
            {
                title: 'Staying on Course',
                text: 'You maintain your course according to the map.',
                choices: [
                    { text: 'Continue forward', nextStep: 110, trait: 'determination' },
                    { text: 'Check your position', nextStep: 111, trait: 'navigation' }
                ]
            },
            {
                title: 'Looking for Landmarks',
                text: 'You search for recognizable features to confirm your location.',
                choices: [
                    { text: 'Mark your position', nextStep: 112, trait: 'navigation' },
                    { text: 'Continue forward', nextStep: 113, trait: 'determination' }
                ]
            },
            {
                title: 'Applying Patterns',
                text: 'You use the patterns you\'ve discovered to guide you.',
                choices: [
                    { text: 'Follow the patterns', nextStep: 114, trait: 'wisdom' },
                    { text: 'Stay alert', nextStep: 115, trait: 'caution' }
                ]
            },
            {
                title: 'Studying Further',
                text: 'You spend more time studying the patterns.',
                choices: [
                    { text: 'Learn more', nextStep: 116, trait: 'knowledge' },
                    { text: 'Move forward', nextStep: 117, trait: 'determination' }
                ]
            },
            {
                title: 'Following Carefully',
                text: 'You carefully follow the symbols on the floor.',
                choices: [
                    { text: 'Stay alert', nextStep: 118, trait: 'caution' },
                    { text: 'Move forward', nextStep: 119, trait: 'determination' }
                ]
            },
            {
                title: 'Moving Quickly',
                text: 'You move quickly along the symbol-marked path.',
                choices: [
                    { text: 'Check for dangers', nextStep: 120, trait: 'caution' },
                    { text: 'Continue forward', nextStep: 121, trait: 'speed' }
                ]
            },
            {
                title: 'Using Knowledge',
                text: 'You apply your understanding of the symbols and stars.',
                choices: [
                    { text: 'Follow your instincts', nextStep: 122, trait: 'wisdom' },
                    { text: 'Stay alert', nextStep: 123, trait: 'caution' }
                ]
            },
            {
                title: 'More Connections',
                text: 'You search for more connections between symbols and stars.',
                choices: [
                    { text: 'Study them', nextStep: 124, trait: 'analysis' },
                    { text: 'Move forward', nextStep: 125, trait: 'determination' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully in the hidden passage.',
                choices: [
                    { text: 'Look for traps', nextStep: 126, trait: 'caution' },
                    { text: 'Study the passage', nextStep: 127, trait: 'investigation' }
                ]
            },
            {
                title: 'Looking for Traps',
                text: 'Your careful examination reveals several potential hazards.',
                choices: [
                    { text: 'Avoid them', nextStep: 128, trait: 'caution' },
                    { text: 'Study them', nextStep: 129, trait: 'knowledge' }
                ]
            },
            {
                title: 'Following Signs',
                text: 'You follow the signs that have appeared.',
                choices: [
                    { text: 'Stay alert', nextStep: 130, trait: 'caution' },
                    { text: 'Move forward', nextStep: 131, trait: 'determination' }
                ]
            },
            {
                title: 'Waiting for More',
                text: 'You wait for additional signs to appear.',
                choices: [
                    { text: 'Stay patient', nextStep: 132, trait: 'patience' },
                    { text: 'Look for another way', nextStep: 133, trait: 'adaptability' }
                ]
            },
            {
                title: 'Using Patterns',
                text: 'You use the decoded patterns to guide you.',
                choices: [
                    { text: 'Follow the patterns', nextStep: 134, trait: 'wisdom' },
                    { text: 'Stay alert', nextStep: 135, trait: 'caution' }
                ]
            },
            {
                title: 'Studying Further',
                text: 'You spend more time studying the patterns.',
                choices: [
                    { text: 'Learn more', nextStep: 136, trait: 'knowledge' },
                    { text: 'Move forward', nextStep: 137, trait: 'determination' }
                ]
            },
            {
                title: 'Following Clues',
                text: 'You follow the clues you\'ve discovered.',
                choices: [
                    { text: 'Stay on track', nextStep: 138, trait: 'determination' },
                    { text: 'Look for shortcuts', nextStep: 139, trait: 'adaptability' }
                ]
            },
            {
                title: 'Looking for Patterns',
                text: 'You search for more patterns in your surroundings.',
                choices: [
                    { text: 'Study them', nextStep: 140, trait: 'analysis' },
                    { text: 'Move forward', nextStep: 141, trait: 'determination' }
                ]
            },
            {
                title: 'Taking the Path',
                text: 'You take the path revealed by the riddle.',
                choices: [
                    { text: 'Stay alert', nextStep: 142, trait: 'caution' },
                    { text: 'Move forward', nextStep: 143, trait: 'determination' }
                ]
            },
            {
                title: 'Checking for Dangers',
                text: 'You carefully check for potential dangers.',
                choices: [
                    { text: 'Avoid them', nextStep: 144, trait: 'caution' },
                    { text: 'Study them', nextStep: 145, trait: 'knowledge' }
                ]
            },
            {
                title: 'Proceeding Confidently',
                text: 'You move forward with confidence in your solution.',
                choices: [
                    { text: 'Stay alert', nextStep: 146, trait: 'caution' },
                    { text: 'Move quickly', nextStep: 147, trait: 'speed' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'You remain alert as you proceed.',
                choices: [
                    { text: 'Look for dangers', nextStep: 148, trait: 'caution' },
                    { text: 'Continue forward', nextStep: 149, trait: 'determination' }
                ]
            },
            {
                title: 'Staying on Track',
                text: 'You maintain your course through the labyrinth.',
                choices: [
                    { text: 'Continue forward', nextStep: 150, trait: 'determination' },
                    { text: 'Check your position', nextStep: 151, trait: 'navigation' }
                ]
            },
            {
                title: 'Looking for Shortcuts',
                text: 'You search for faster routes through the labyrinth.',
                choices: [
                    { text: 'Take a shortcut', nextStep: 152, trait: 'speed' },
                    { text: 'Stay on safe path', nextStep: 153, trait: 'caution' }
                ]
            },
            {
                title: 'Adding Details',
                text: 'You add more details to your path markers.',
                choices: [
                    { text: 'Add warnings', nextStep: 154, trait: 'preparation' },
                    { text: 'Continue forward', nextStep: 155, trait: 'determination' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the labyrinth.',
                choices: [
                    { text: 'Stay alert', nextStep: 156, trait: 'caution' },
                    { text: 'Look for landmarks', nextStep: 157, trait: 'navigation' }
                ]
            },
            {
                title: 'Resting Briefly',
                text: 'You take a short rest to recover your strength.',
                choices: [
                    { text: 'Stay alert', nextStep: 158, trait: 'caution' },
                    { text: 'Continue forward', nextText: 'Exit Labyrinth', nextStep: 159, trait: 'determination' }
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
        content.className = 'labyrinth-content';
        
        // Create the main content area
        const mainContent = document.createElement('div');
        mainContent.className = 'labyrinth-main-content';
        
        // Create the title element
        const titleElement = document.createElement('h2');
        titleElement.className = 'labyrinth-title';
        
        // Create the text element
        const textElement = document.createElement('div');
        textElement.className = 'labyrinth-text';
        
        // Create the choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'labyrinth-choices';
        
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
        const step = this.labyrinthSteps[this.currentStep];
        if (!step) return;

        // Update title
        const titleElement = this.container.querySelector('.labyrinth-title');
        titleElement.textContent = step.title;

        // Update text with typing animation
        const textElement = this.container.querySelector('.labyrinth-text');
        textElement.innerHTML = '';
        this.typeText(textElement, step.text);

        // Update choices
        const choicesContainer = this.container.querySelector('.labyrinth-choices');
        choicesContainer.innerHTML = '';
        
        step.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'labyrinth-choice-button';
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

        if (choice.nextStep === 159) {
            // Transition to Ancient Temple
            this.transitionToTemple();
        } else {
            this.currentStep = choice.nextStep;
            this.showCurrentStep();
        }
    }

    transitionToTemple() {
        // Save game state
        const gameState = stateManager.getGameState();
        gameState.currentPage = 'ancient-temple';
        stateManager.updateGameState(gameState);

        // Transition to Ancient Temple
        transitionManager.transitionTo(new AncientTemplePage());
    }

    goBack() {
        // Play back sound
        soundManager.playSound('back');
        
        // Go back to Labyrinth Entrance
        transitionManager.transitionTo(new LabyrinthEntrancePage());
    }
}

// Export for use in other files
window.LabyrinthPage = LabyrinthPage; 