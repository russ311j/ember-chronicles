class AncientTemplePage extends PageTemplate {
    constructor() {
        super({
            title: 'The Ancient Temple',
            backgroundImage: 'media/images/generated/guardian_chamber.png',
            music: 'media/audio/ambient_dungeon.mp3',
            navigation: ['back', 'menu', 'save']
        });

        this.currentStep = 0;
        this.templeSteps = [
            {
                title: 'The Grand Entrance',
                text: 'You emerge from the labyrinth into a vast temple chamber. Ancient columns rise to support a domed ceiling, and magical torches cast an ethereal light. The air is thick with mystical energy.',
                choices: [
                    {
                        text: 'Examine the Temple',
                        nextStep: 1,
                        requires: { traits: ['curious'] }
                    },
                    {
                        text: 'Proceed Cautiously',
                        nextStep: 2,
                        requires: { traits: ['cautious'] }
                    }
                ]
            },
            {
                title: 'Temple Examination',
                text: 'Your careful study reveals ancient inscriptions on the walls. They tell of a powerful artifact and its guardian. The temple seems to be a place of both worship and protection.',
                choices: [
                    {
                        text: 'Read the Inscriptions',
                        nextStep: 3,
                        requires: { traits: ['scholarly'] }
                    },
                    {
                        text: 'Look for Hidden Passages',
                        nextStep: 4,
                        requires: { traits: ['perceptive'] }
                    }
                ]
            },
            {
                title: 'Cautious Approach',
                text: 'Moving carefully through the temple, you notice subtle magical wards and traps. Your caution proves valuable as you avoid several dangerous mechanisms.',
                choices: [
                    {
                        text: 'Disable the Traps',
                        nextStep: 5,
                        requires: { traits: ['skilled'] }
                    },
                    {
                        text: 'Find Another Path',
                        nextStep: 6,
                        requires: { traits: ['resourceful'] }
                    }
                ]
            },
            {
                title: 'Ancient Knowledge',
                text: 'The inscriptions reveal the temple\'s purpose: it guards the Ember Throne, a powerful artifact that can either heal or corrupt the kingdom. The guardian must be convinced of your worth.',
                choices: [
                    {
                        text: 'Prepare for Guardian',
                        nextStep: 7,
                        requires: { traits: ['brave'] }
                    },
                    {
                        text: 'Seek More Knowledge',
                        nextStep: 8,
                        requires: { traits: ['wise'] }
                    }
                ]
            },
            {
                title: 'Hidden Path',
                text: 'Your keen eyes spot a concealed passage leading to a chamber filled with ancient artifacts and magical items. These could prove valuable in your quest.',
                choices: [
                    {
                        text: 'Collect Artifacts',
                        nextStep: 9,
                        requires: { traits: ['greedy'] }
                    },
                    {
                        text: 'Leave Them Be',
                        nextStep: 10,
                        requires: { traits: ['honorable'] }
                    }
                ]
            },
            {
                title: 'Trap Disabling',
                text: 'Your expertise allows you to safely disarm several magical traps. This reveals a direct path to the guardian\'s chamber, though it may be more dangerous.',
                choices: [
                    {
                        text: 'Take the Direct Path',
                        nextStep: 11,
                        requires: { traits: ['brave'] }
                    },
                    {
                        text: 'Find a Safer Route',
                        nextStep: 12,
                        requires: { traits: ['cautious'] }
                    }
                ]
            },
            {
                title: 'Guardian Preparation',
                text: 'You steel yourself for the encounter with the guardian. The inscriptions suggest that only those worthy may approach the Ember Throne.',
                choices: [
                    {
                        text: 'Face the Guardian',
                        nextStep: 13,
                        requires: { traits: ['brave', 'wise'] }
                    },
                    {
                        text: 'Seek an Alternative',
                        nextStep: 14,
                        requires: { traits: ['cunning'] }
                    }
                ]
            },
            {
                title: 'Additional Knowledge',
                text: 'Further study reveals that the guardian tests not just strength, but wisdom and character. The temple itself seems to respond to your presence.',
                choices: [
                    {
                        text: 'Accept the Test',
                        nextStep: 15,
                        requires: { traits: ['wise'] }
                    },
                    {
                        text: 'Challenge the Guardian',
                        nextStep: 16,
                        requires: { traits: ['brave'] }
                    }
                ]
            },
            {
                title: 'Artifact Collection',
                text: 'You gather several powerful artifacts that could aid you in your quest. However, the temple seems to react negatively to your actions.',
                choices: [
                    {
                        text: 'Use the Artifacts',
                        nextStep: 17,
                        requires: { traits: ['greedy'] }
                    },
                    {
                        text: 'Return Them',
                        nextStep: 18,
                        requires: { traits: ['honorable'] }
                    }
                ]
            },
            {
                title: 'Honorable Choice',
                text: 'Choosing to leave the artifacts untouched earns the temple\'s respect. The guardian appears, impressed by your restraint.',
                choices: [
                    {
                        text: 'Accept the Guardian\'s Test',
                        nextStep: 19,
                        requires: { traits: ['honorable'] }
                    },
                    {
                        text: 'Request Guidance',
                        nextStep: 20,
                        requires: { traits: ['wise'] }
                    }
                ]
            },
            {
                title: 'Direct Path',
                text: 'Taking the direct path leads you quickly to the guardian\'s chamber, but the guardian is ready for your approach.',
                choices: [
                    {
                        text: 'Face the Challenge',
                        nextStep: 21,
                        requires: { traits: ['brave'] }
                    },
                    {
                        text: 'Seek an Advantage',
                        nextStep: 22,
                        requires: { traits: ['cunning'] }
                    }
                ]
            },
            {
                title: 'Safer Route',
                text: 'Finding a safer route takes longer but gives you time to prepare for the encounter with the guardian.',
                choices: [
                    {
                        text: 'Prepare Carefully',
                        nextStep: 23,
                        requires: { traits: ['cautious'] }
                    },
                    {
                        text: 'Proceed with Caution',
                        nextStep: 24,
                        requires: { traits: ['wise'] }
                    }
                ]
            },
            {
                title: 'Guardian Encounter',
                text: 'The guardian appears, a powerful being of light and shadow. It speaks of the Ember Throne\'s power and the responsibility of wielding it.',
                choices: [
                    {
                        text: 'Prove Your Worth',
                        nextStep: 25,
                        requires: { traits: ['brave', 'wise'] }
                    },
                    {
                        text: 'Seek Understanding',
                        nextStep: 26,
                        requires: { traits: ['wise'] }
                    }
                ]
            },
            {
                title: 'Guardian Challenge',
                text: 'The guardian challenges your right to approach the Ember Throne, testing both your strength and character.',
                choices: [
                    {
                        text: 'Accept the Challenge',
                        nextStep: 27,
                        requires: { traits: ['brave'] }
                    },
                    {
                        text: 'Negotiate',
                        nextStep: 28,
                        requires: { traits: ['diplomatic'] }
                    }
                ]
            },
            {
                title: 'Artifact Usage',
                text: 'Using the collected artifacts gives you an advantage, but the guardian sees this as a sign of weakness.',
                choices: [
                    {
                        text: 'Fight with Artifacts',
                        nextStep: 29,
                        requires: { traits: ['greedy'] }
                    },
                    {
                        text: 'Abandon Artifacts',
                        nextStep: 30,
                        requires: { traits: ['honorable'] }
                    }
                ]
            },
            {
                title: 'Artifact Return',
                text: 'Returning the artifacts shows your respect for the temple\'s purpose. The guardian appears pleased with your choice.',
                choices: [
                    {
                        text: 'Request the Throne',
                        nextStep: 31,
                        requires: { traits: ['honorable'] }
                    },
                    {
                        text: 'Seek Guidance',
                        nextStep: 32,
                        requires: { traits: ['wise'] }
                    }
                ]
            },
            {
                title: 'Guardian\'s Test',
                text: 'The guardian presents you with a series of challenges to prove your worthiness to approach the Ember Throne.',
                choices: [
                    {
                        text: 'Face the Challenges',
                        nextStep: 33,
                        requires: { traits: ['brave', 'wise'] }
                    },
                    {
                        text: 'Seek Alternative Path',
                        nextStep: 34,
                        requires: { traits: ['cunning'] }
                    }
                ]
            },
            {
                title: 'Guardian\'s Guidance',
                text: 'The guardian offers you wisdom about the Ember Throne\'s power and the responsibility of wielding it.',
                choices: [
                    {
                        text: 'Accept Guidance',
                        nextStep: 35,
                        requires: { traits: ['wise'] }
                    },
                    {
                        text: 'Proceed Anyway',
                        nextStep: 36,
                        requires: { traits: ['brave'] }
                    }
                ]
            },
            {
                title: 'Final Challenge',
                text: 'The guardian presents you with one final challenge: to prove your worthiness to approach the Ember Throne.',
                choices: [
                    {
                        text: 'Face the Final Challenge',
                        nextStep: 37,
                        requires: { traits: ['brave', 'wise'] }
                    },
                    {
                        text: 'Seek Another Way',
                        nextStep: 38,
                        requires: { traits: ['cunning'] }
                    }
                ]
            },
            {
                title: 'Guardian\'s Decision',
                text: 'The guardian, impressed by your choices and character, grants you permission to approach the Ember Throne.',
                choices: [
                    {
                        text: 'Approach the Throne',
                        nextStep: 39,
                        requires: { traits: ['brave', 'wise'] }
                    },
                    {
                        text: 'Ask for Guidance',
                        nextStep: 40,
                        requires: { traits: ['wise'] }
                    }
                ]
            },
            {
                title: 'Ember Throne',
                text: 'You stand before the Ember Throne, its power pulsing with ancient magic. The moment of truth has arrived.',
                choices: [
                    {
                        text: 'Take the Throne',
                        nextStep: 41,
                        requires: { traits: ['brave'] }
                    },
                    {
                        text: 'Examine the Throne',
                        nextStep: 42,
                        requires: { traits: ['wise'] }
                    }
                ]
            }
        ];
    }

    initialize() {
        super.initialize();
        this.createContent();
        this.displayCurrentStep();
    }

    createContent() {
        const mainContent = document.createElement('div');
        mainContent.className = 'temple-content';

        const title = document.createElement('h1');
        title.className = 'temple-title';
        title.textContent = this.title;

        const textContainer = document.createElement('div');
        textContainer.className = 'temple-text';

        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'temple-choices';

        mainContent.appendChild(title);
        mainContent.appendChild(textContainer);
        mainContent.appendChild(choicesContainer);

        this.elements = {
            mainContent,
            textContainer,
            choicesContainer
        };

        this.container.appendChild(mainContent);
    }

    async displayCurrentStep() {
        const step = this.templeSteps[this.currentStep];
        if (!step) return;

        // Clear previous content
        this.elements.textContainer.innerHTML = '';
        this.elements.choicesContainer.innerHTML = '';

        // Display title with typing animation
        await this.typeText(step.title, this.elements.textContainer, 'h2');

        // Display description with typing animation
        await this.typeText(step.text, this.elements.textContainer, 'p');

        // Create and display choices
        step.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'temple-choice-button';
            button.textContent = choice.text;

            // Check if requirements are met
            const requirements = choice.requires;
            if (requirements) {
                const character = stateManager.getState('character');
                const meetsRequirements = this.checkRequirements(requirements, character);
                button.disabled = !meetsRequirements;
            }

            button.addEventListener('click', () => this.handleChoice(choice));
            this.elements.choicesContainer.appendChild(button);
        });
    }

    checkRequirements(requirements, character) {
        if (requirements.traits) {
            return requirements.traits.every(trait => character.traits.includes(trait));
        }
        return true;
    }

    handleChoice(choice) {
        // Play sound effect
        audioManager.playSound('button_click');

        // Update character traits based on choice
        const character = stateManager.getState('character');
        if (choice.text.includes('Examine') || choice.text.includes('Read')) {
            character.traits.push('curious');
        }
        if (choice.text.includes('Cautiously') || choice.text.includes('Carefully')) {
            character.traits.push('cautious');
        }
        if (choice.text.includes('Brave') || choice.text.includes('Face')) {
            character.traits.push('brave');
        }
        if (choice.text.includes('Wise') || choice.text.includes('Understand')) {
            character.traits.push('wise');
        }

        // Update state
        stateManager.setState('character', character);

        // Handle next step
        if (choice.nextStep === 41 || choice.nextStep === 42) {
            // Transition to Final Chamber
            this.transitionToPage('FinalChamberPage');
        } else {
            this.currentStep = choice.nextStep;
            this.displayCurrentStep();
        }
    }

    goBack() {
        audioManager.playSound('button_click');
        this.transitionToPage('LabyrinthPage');
    }
}

export default AncientTemplePage; 