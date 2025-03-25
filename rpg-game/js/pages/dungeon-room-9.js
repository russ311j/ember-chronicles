/**
 * Dungeon Room 9 Page (P-18)
 * Boss chamber with multi-phase combat mechanics
 */

class DungeonRoom9Page extends PageTemplate {
    constructor() {
        super('dungeon-room-9', {
            title: 'The Boss Chamber',
            background: 'media/images/generated/dungeon_room_9.png',
            music: 'media/audio/boss_theme.mp3',
            allowBack: true,
            allowMenu: true,
            allowSave: true
        });

        this.roomElements = [
            {
                id: 'boss_guardian',
                title: 'Ancient Guardian',
                description: 'A massive stone guardian stands before you...',
                examineText: 'The guardian seems to be powered by ancient magic...',
                requires: { brave: 3 },
                traits: { knowledgeable: 1 },
                items: ['guardian_heart'],
                boss: {
                    name: 'Ancient Guardian',
                    health: 50,
                    maxHealth: 50,
                    damage: 8,
                    defense: 4,
                    phases: [
                        {
                            name: 'Stone Form',
                            healthThreshold: 50,
                            special: 'stone_shield',
                            description: 'The guardian raises a stone shield...'
                        },
                        {
                            name: 'Magical Form',
                            healthThreshold: 25,
                            special: 'magic_blast',
                            description: 'The guardian channels magical energy...'
                        },
                        {
                            name: 'Final Form',
                            healthThreshold: 0,
                            special: 'ultimate_attack',
                            description: 'The guardian unleashes its full power...'
                        }
                    ]
                }
            },
            {
                id: 'healing_crystal',
                title: 'Healing Crystal',
                description: 'A glowing crystal floats in the air...',
                examineText: 'The crystal seems to radiate healing energy...',
                requires: { knowledgeable: 2 },
                traits: { observant: 1 },
                items: ['crystal_shard'],
                healing: {
                    amount: 10,
                    uses: 3
                }
            },
            {
                id: 'power_altar',
                title: 'Power Altar',
                description: 'An ancient altar stands in the corner...',
                examineText: 'The altar seems to enhance magical abilities...',
                requires: { knowledgeable: 2 },
                traits: { brave: 1 },
                items: ['power_gem'],
                power: {
                    boost: 5,
                    duration: 3
                }
            }
        ];

        this.exits = [
            {
                id: 'treasure_room',
                text: 'Treasure Room',
                description: 'A room filled with valuable treasures',
                requires: { brave: 3 },
                nextPage: 'dungeon-room-19'
            },
            {
                id: 'escape_route',
                text: 'Escape Route',
                description: 'A safe path out of the dungeon',
                requires: {},
                nextPage: 'dungeon-exit'
            }
        ];

        this.roomDescription = "The ninth chamber is the domain of the Ancient Guardian, a powerful being that protects the dungeon's treasures. The air crackles with magical energy, and the ground trembles with the guardian's power...";
    }

    /**
     * Initialize the dungeon room page
     */
    async initialize() {
        await super.initialize();
        this.createContent();
        this.showRoomDescription();
    }

    /**
     * Create the dungeon room content
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

        // Create interactive elements container
        const elementsContainer = document.createElement('div');
        elementsContainer.className = 'interactive-elements';
        narrativeContainer.appendChild(elementsContainer);

        // Create exits container
        const exitsContainer = document.createElement('div');
        exitsContainer.className = 'exits-container';
        narrativeContainer.appendChild(exitsContainer);

        // Store elements
        this.elements = {
            ...this.elements,
            descriptionDisplay,
            elementsContainer,
            exitsContainer
        };
    }

    /**
     * Show room description
     */
    async showRoomDescription() {
        await this.typeText(this.roomDescription);
        this.showInteractiveElements();
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
     * Show interactive elements
     */
    showInteractiveElements() {
        const elementsContainer = this.elements.elementsContainer;
        elementsContainer.innerHTML = '';

        // Add room elements
        this.roomElements.forEach(element => {
            const elementButton = this.createElementButton(element);
            elementsContainer.appendChild(elementButton);
        });

        // Add exits
        this.showExits();
    }

    /**
     * Create an interactive element button
     */
    createElementButton(element) {
        const button = document.createElement('button');
        button.className = 'element-button';
        
        // Create element content
        const title = document.createElement('div');
        title.className = 'element-title';
        title.textContent = element.title;
        
        const description = document.createElement('div');
        description.className = 'element-description';
        description.textContent = element.description;
        
        button.appendChild(title);
        button.appendChild(description);
        
        // Check requirements
        if (element.requires) {
            const meetsRequirements = this.checkRequirements(element.requires);
            button.disabled = !meetsRequirements;
        }
        
        // Add click handler
        button.onclick = () => this.handleElementInteraction(element);
        
        return button;
    }

    /**
     * Show exit options
     */
    showExits() {
        const exitsContainer = this.elements.exitsContainer;
        exitsContainer.innerHTML = '';

        this.exits.forEach(exit => {
            const exitButton = this.createExitButton(exit);
            exitsContainer.appendChild(exitButton);
        });
    }

    /**
     * Create an exit button
     */
    createExitButton(exit) {
        const button = document.createElement('button');
        button.className = 'exit-button';
        
        // Create exit content
        const title = document.createElement('div');
        title.className = 'exit-title';
        title.textContent = exit.text;
        
        const description = document.createElement('div');
        description.className = 'exit-description';
        description.textContent = exit.description;
        
        button.appendChild(title);
        button.appendChild(description);
        
        // Check requirements
        if (exit.requires) {
            const meetsRequirements = this.checkRequirements(exit.requires);
            button.disabled = !meetsRequirements;
        }
        
        // Add click handler
        button.onclick = () => this.handleExit(exit);
        
        return button;
    }

    /**
     * Handle element interaction
     */
    async handleElementInteraction(element) {
        // Show examine text
        await this.typeText(element.examineText);

        if (element.boss) {
            await this.handleBossCombat(element);
        } else if (element.healing) {
            await this.handleHealing(element);
        } else if (element.power) {
            await this.handlePowerBoost(element);
        } else {
            // Handle regular interaction
            this.handleRegularInteraction(element);
        }
    }

    /**
     * Handle boss combat
     */
    async handleBossCombat(element) {
        const boss = element.boss;
        const character = stateManager.getState('character');
        let currentPhase = 0;
        let combatActive = true;

        while (combatActive && boss.health > 0) {
            // Check for phase change
            const newPhase = boss.phases.findIndex(phase => boss.health > phase.healthThreshold);
            if (newPhase !== currentPhase) {
                currentPhase = newPhase;
                await this.handlePhaseChange(boss.phases[currentPhase]);
            }

            // Player's turn
            const playerDamage = this.calculatePlayerDamage(character);
            boss.health = Math.max(0, boss.health - playerDamage);
            await this.typeText(`You deal ${playerDamage} damage to the ${boss.name}!`);

            // Boss's turn
            if (boss.health > 0) {
                const bossDamage = this.calculateBossDamage(boss, currentPhase);
                character.health = Math.max(0, character.health - bossDamage);
                stateManager.setState('character', character);
                await this.typeText(`The ${boss.name} deals ${bossDamage} damage to you!`);

                // Check for special attack
                if (Math.random() < 0.3) {
                    await this.handleBossSpecial(boss.phases[currentPhase]);
                }
            }

            // Check for combat end
            if (boss.health <= 0 || character.health <= 0) {
                combatActive = false;
            }
        }

        if (boss.health <= 0) {
            await this.handleBossDefeat(element);
        } else {
            await this.handlePlayerDefeat();
        }
    }

    /**
     * Calculate player damage
     */
    calculatePlayerDamage(character) {
        let damage = 5; // Base damage

        // Add trait bonuses
        if (character.traits.brave) {
            damage += character.traits.brave;
        }
        if (character.traits.knowledgeable) {
            damage += character.traits.knowledgeable * 0.5;
        }

        return Math.floor(damage);
    }

    /**
     * Calculate boss damage
     */
    calculateBossDamage(boss, phase) {
        let damage = boss.damage;

        // Phase-specific damage adjustments
        switch (phase) {
            case 1: // Magical Form
                damage *= 1.2;
                break;
            case 2: // Final Form
                damage *= 1.5;
                break;
        }

        return Math.floor(damage);
    }

    /**
     * Handle phase change
     */
    async handlePhaseChange(phase) {
        await this.typeText(phase.description);
        await this.typeText(`The ${phase.name} phase begins!`);
    }

    /**
     * Handle boss special attack
     */
    async handleBossSpecial(phase) {
        await this.typeText(`The boss uses ${phase.special}!`);
        
        switch (phase.special) {
            case 'stone_shield':
                await this.typeText('The boss gains increased defense!');
                break;
            case 'magic_blast':
                const character = stateManager.getState('character');
                character.health = Math.max(0, character.health - 10);
                stateManager.setState('character', character);
                await this.typeText('You take 10 damage from the magic blast!');
                break;
            case 'ultimate_attack':
                const char = stateManager.getState('character');
                char.health = Math.max(0, char.health - 15);
                stateManager.setState('character', char);
                await this.typeText('You take 15 damage from the ultimate attack!');
                break;
        }
    }

    /**
     * Handle boss defeat
     */
    async handleBossDefeat(element) {
        await this.typeText('The Ancient Guardian has been defeated!');
        this.handleRegularInteraction(element);
    }

    /**
     * Handle player defeat
     */
    async handlePlayerDefeat() {
        await this.typeText('You have been defeated by the Ancient Guardian...');
        // Handle game over or respawn logic
    }

    /**
     * Handle healing interaction
     */
    async handleHealing(element) {
        const character = stateManager.getState('character');
        const healing = element.healing;

        if (healing.uses > 0) {
            character.health = Math.min(character.maxHealth, character.health + healing.amount);
            stateManager.setState('character', character);
            healing.uses--;
            await this.typeText(`You heal for ${healing.amount} health!`);
        } else {
            await this.typeText('The crystal has no more healing energy...');
        }
    }

    /**
     * Handle power boost interaction
     */
    async handlePowerBoost(element) {
        const character = stateManager.getState('character');
        const power = element.power;

        character.powerBoost = power.boost;
        character.powerDuration = power.duration;
        stateManager.setState('character', character);
        await this.typeText(`You gain ${power.boost} power for ${power.duration} turns!`);
    }

    /**
     * Handle regular interaction
     */
    handleRegularInteraction(element) {
        // Update character traits
        if (element.traits) {
            const character = stateManager.getState('character');
            Object.entries(element.traits).forEach(([trait, value]) => {
                character.traits[trait] = (character.traits[trait] || 0) + value;
            });
            stateManager.setState('character', character);
        }

        // Add items to inventory
        if (element.items) {
            const inventory = stateManager.getState('inventory') || [];
            element.items.forEach(item => {
                if (!inventory.includes(item)) {
                    inventory.push(item);
                }
            });
            stateManager.setState('inventory', inventory);
        }

        // Remove the element from the room
        this.roomElements = this.roomElements.filter(e => e.id !== element.id);
        this.showInteractiveElements();
    }

    /**
     * Handle exit selection
     */
    async handleExit(exit) {
        // Transition to next room
        await transitionManager.queueTransition('dungeon-room-9', exit.nextPage, {
            type: 'fade',
            duration: 1000
        });
    }

    /**
     * Check if requirements are met
     */
    checkRequirements(requirements) {
        if (requirements.traits) {
            const character = stateManager.getState('character');
            return Object.entries(requirements.traits).every(([trait, value]) => {
                return (character.traits[trait] || 0) >= value;
            });
        }
        return true;
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        // Handle element interactions (1-3)
        if (event.key >= '1' && event.key <= this.roomElements.length.toString()) {
            const index = parseInt(event.key) - 1;
            const element = this.roomElements[index];
            if (!element.requires || this.checkRequirements(element.requires)) {
                this.handleElementInteraction(element);
            }
        }
        // Handle exits (4-5)
        else if (event.key >= '4' && event.key <= (3 + this.exits.length).toString()) {
            const index = parseInt(event.key) - 4;
            const exit = this.exits[index];
            if (!exit.requires || this.checkRequirements(exit.requires)) {
                this.handleExit(exit);
            }
        }
    }

    /**
     * Update UI based on state
     */
    updateUI() {
        // Update element buttons based on requirements
        this.elements.elementsContainer.querySelectorAll('.element-button').forEach((button, index) => {
            const element = this.roomElements[index];
            if (element.requires) {
                button.disabled = !this.checkRequirements(element.requires);
            }
        });

        // Update exit buttons based on requirements
        this.elements.exitsContainer.querySelectorAll('.exit-button').forEach((button, index) => {
            const exit = this.exits[index];
            if (exit.requires) {
                button.disabled = !this.checkRequirements(exit.requires);
            }
        });
    }
}

// Export for use in other files
window.DungeonRoom9Page = DungeonRoom9Page; 