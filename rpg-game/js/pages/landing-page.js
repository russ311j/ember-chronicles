/**
 * Landing Page (P-01)
 * The first page players see when starting the game
 */

import { PageTemplate } from '../systems/page-template.js';
import { transitionManager } from '../systems/transition-manager.js';
import { soundManager } from '../systems/sound-manager.js';

class LandingPage extends PageTemplate {
    constructor() {
        super('landing-page', {
            title: 'The Ember Throne Chronicles',
            background: 'media/images/backgrounds/landing.jpg',
            music: 'media/audio/music/landing_theme.mp3',
            allowBack: false,
            allowMenu: false,
            allowSave: false
        });
    }

    /**
     * Initialize the landing page
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
        
        // Create title section
        const titleSection = document.createElement('div');
        titleSection.className = 'landing-title-section';
        titleSection.innerHTML = `
            <h1 class="game-title">The Ember Throne Chronicles</h1>
            <p class="game-subtitle">A Tale of Power, Mystery, and Destiny</p>
        `;
        content.appendChild(titleSection);

        // Create menu section
        const menuSection = document.createElement('div');
        menuSection.className = 'landing-menu-section';

        // New Game button
        const newGameButton = document.createElement('button');
        newGameButton.className = 'landing-button new-game';
        newGameButton.textContent = 'New Game';
        newGameButton.addEventListener('click', () => this.handleNewGame());

        // Load Game button
        const loadGameButton = document.createElement('button');
        loadGameButton.className = 'landing-button load-game';
        loadGameButton.textContent = 'Load Game';
        loadGameButton.addEventListener('click', () => this.handleLoadGame());

        // Settings button
        const settingsButton = document.createElement('button');
        settingsButton.className = 'landing-button settings';
        settingsButton.textContent = 'Settings';
        settingsButton.addEventListener('click', () => this.handleSettings());

        // Credits button
        const creditsButton = document.createElement('button');
        creditsButton.className = 'landing-button credits';
        creditsButton.textContent = 'Credits';
        creditsButton.addEventListener('click', () => this.handleCredits());

        menuSection.appendChild(newGameButton);
        menuSection.appendChild(loadGameButton);
        menuSection.appendChild(settingsButton);
        menuSection.appendChild(creditsButton);
        content.appendChild(menuSection);

        // Create version info
        const versionInfo = document.createElement('div');
        versionInfo.className = 'version-info';
        versionInfo.textContent = 'Version 1.0.0';
        content.appendChild(versionInfo);
    }

    /**
     * Handle New Game button click
     */
    async handleNewGame() {
        soundManager.playSound('click');
        await transitionManager.transitionTo('character-creation');
    }

    /**
     * Handle Load Game button click
     */
    async handleLoadGame() {
        soundManager.playSound('click');
        // Show save/load UI
        saveLoadUI.show();
    }

    /**
     * Handle Settings button click
     */
    async handleSettings() {
        soundManager.playSound('click');
        // Show settings UI
        settingsUI.show();
    }

    /**
     * Handle Credits button click
     */
    async handleCredits() {
        soundManager.playSound('click');
        await transitionManager.transitionTo('credits');
    }
}

// Export the landing page
export const landingPage = new LandingPage(); 