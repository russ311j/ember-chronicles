/**
 * Character Creation Page (P-02)
 * Allows players to create and customize their character
 */

import { PageTemplate } from '../systems/page-template.js';
import { transitionManager } from '../systems/transition-manager.js';
import { soundManager } from '../systems/sound-manager.js';
import { stateManager } from '../systems/state-manager.js';

class CharacterCreationPage extends PageTemplate {
    constructor() {
        super('character-creation', {
            title: 'Create Your Character',
            background: 'media/images/backgrounds/character_creation.jpg',
            music: 'media/audio/music/character_creation.mp3',
            allowBack: true,
            allowMenu: false,
            allowSave: false
        });

        this.character = {
            name: '',
            class: '',
            race: '',
            traits: [],
            stats: {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        };
    }

    /**
     * Initialize the character creation page
     */
    async initialize() {
        await super.initialize();
        await this.createContent();
    }

    /**
     * Create the page content
     */
    async createContent() {
        const content = this.elements.mainContent;
        
        // Create character creation form
        const form = document.createElement('form');
        form.className = 'character-form';
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Name section
        const nameSection = this.createNameSection();
        form.appendChild(nameSection);

        // Class section
        const classSection = this.createClassSection();
        form.appendChild(classSection);

        // Race section
        const raceSection = this.createRaceSection();
        form.appendChild(raceSection);

        // Stats section
        const statsSection = this.createStatsSection();
        form.appendChild(statsSection);

        // Traits section
        const traitsSection = this.createTraitsSection();
        form.appendChild(traitsSection);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'submit-button';
        submitButton.textContent = 'Begin Adventure';
        form.appendChild(submitButton);

        content.appendChild(form);
    }

    /**
     * Create the name section
     */
    createNameSection() {
        const section = document.createElement('div');
        section.className = 'form-section';

        const label = document.createElement('label');
        label.htmlFor = 'character-name';
        label.textContent = 'Character Name';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'character-name';
        input.required = true;
        input.maxLength = 20;
        input.addEventListener('input', (e) => {
            this.character.name = e.target.value;
        });

        section.appendChild(label);
        section.appendChild(input);
        return section;
    }

    /**
     * Create the class section
     */
    createClassSection() {
        const section = document.createElement('div');
        section.className = 'form-section';

        const label = document.createElement('label');
        label.htmlFor = 'character-class';
        label.textContent = 'Character Class';

        const select = document.createElement('select');
        select.id = 'character-class';
        select.required = true;
        select.addEventListener('change', (e) => {
            this.character.class = e.target.value;
        });

        const classes = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger'];
        classes.forEach(className => {
            const option = document.createElement('option');
            option.value = className.toLowerCase();
            option.textContent = className;
            select.appendChild(option);
        });

        section.appendChild(label);
        section.appendChild(select);
        return section;
    }

    /**
     * Create the race section
     */
    createRaceSection() {
        const section = document.createElement('div');
        section.className = 'form-section';

        const label = document.createElement('label');
        label.htmlFor = 'character-race';
        label.textContent = 'Character Race';

        const select = document.createElement('select');
        select.id = 'character-race';
        select.required = true;
        select.addEventListener('change', (e) => {
            this.character.race = e.target.value;
        });

        const races = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling'];
        races.forEach(raceName => {
            const option = document.createElement('option');
            option.value = raceName.toLowerCase();
            option.textContent = raceName;
            select.appendChild(option);
        });

        section.appendChild(label);
        section.appendChild(select);
        return section;
    }

    /**
     * Create the stats section
     */
    createStatsSection() {
        const section = document.createElement('div');
        section.className = 'form-section stats-section';

        const label = document.createElement('label');
        label.textContent = 'Character Stats';
        section.appendChild(label);

        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';

        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        stats.forEach(stat => {
            const statGroup = document.createElement('div');
            statGroup.className = 'stat-group';

            const statLabel = document.createElement('label');
            statLabel.htmlFor = `stat-${stat}`;
            statLabel.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);

            const statValue = document.createElement('span');
            statValue.className = 'stat-value';
            statValue.textContent = this.character.stats[stat];

            const decreaseButton = document.createElement('button');
            decreaseButton.type = 'button';
            decreaseButton.className = 'stat-button decrease';
            decreaseButton.textContent = '-';
            decreaseButton.addEventListener('click', () => this.adjustStat(stat, -1));

            const increaseButton = document.createElement('button');
            increaseButton.type = 'button';
            increaseButton.className = 'stat-button increase';
            increaseButton.textContent = '+';
            increaseButton.addEventListener('click', () => this.adjustStat(stat, 1));

            statGroup.appendChild(statLabel);
            statGroup.appendChild(decreaseButton);
            statGroup.appendChild(statValue);
            statGroup.appendChild(increaseButton);
            statsContainer.appendChild(statGroup);
        });

        section.appendChild(statsContainer);
        return section;
    }

    /**
     * Create the traits section
     */
    createTraitsSection() {
        const section = document.createElement('div');
        section.className = 'form-section traits-section';

        const label = document.createElement('label');
        label.textContent = 'Character Traits';
        section.appendChild(label);

        const traitsContainer = document.createElement('div');
        traitsContainer.className = 'traits-container';

        const traits = [
            { id: 'brave', name: 'Brave', description: 'Gain advantage on fear checks' },
            { id: 'clever', name: 'Clever', description: 'Gain advantage on intelligence checks' },
            { id: 'agile', name: 'Agile', description: 'Gain advantage on dexterity checks' },
            { id: 'strong', name: 'Strong', description: 'Gain advantage on strength checks' },
            { id: 'wise', name: 'Wise', description: 'Gain advantage on wisdom checks' },
            { id: 'charismatic', name: 'Charismatic', description: 'Gain advantage on charisma checks' }
        ];

        traits.forEach(trait => {
            const traitGroup = document.createElement('div');
            traitGroup.className = 'trait-group';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `trait-${trait.id}`;
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.character.traits.push(trait.id);
                } else {
                    this.character.traits = this.character.traits.filter(t => t !== trait.id);
                }
            });

            const traitLabel = document.createElement('label');
            traitLabel.htmlFor = `trait-${trait.id}`;
            traitLabel.innerHTML = `
                <span class="trait-name">${trait.name}</span>
                <span class="trait-description">${trait.description}</span>
            `;

            traitGroup.appendChild(checkbox);
            traitGroup.appendChild(traitLabel);
            traitsContainer.appendChild(traitGroup);
        });

        section.appendChild(traitsContainer);
        return section;
    }

    /**
     * Adjust a character stat
     */
    adjustStat(stat, amount) {
        const newValue = this.character.stats[stat] + amount;
        if (newValue >= 8 && newValue <= 20) {
            this.character.stats[stat] = newValue;
            const valueElement = document.querySelector(`#stat-${stat}`).nextElementSibling;
            valueElement.textContent = newValue;
            soundManager.playSound('click');
        }
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        soundManager.playSound('success');

        // Save character data
        await stateManager.updateGameState({
            character: this.character,
            startTime: Date.now()
        });

        // Transition to game introduction
        await transitionManager.transitionTo('game-introduction');
    }

    /**
     * Handle back button click
     */
    async goBack() {
        soundManager.playSound('click');
        await transitionManager.transitionTo('landing-page');
    }
}

// Export the character creation page
export const characterCreationPage = new CharacterCreationPage(); 