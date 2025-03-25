/**
 * Page Template System
 * Base class for all game pages with common functionality
 */

import { soundManager } from './sound-manager.js';

class PageTemplate {
    constructor(pageId, options = {}) {
        this.pageId = pageId;
        this.options = {
            title: options.title || 'Game Page',
            background: options.background || 'media/images/default_background.png',
            music: options.music || null,
            allowBack: options.allowBack !== false,
            allowMenu: options.allowMenu !== false,
            allowSave: options.allowSave !== false,
            ...options
        };

        this.elements = {};
        this.state = {
            isInitialized: false,
            isVisible: false
        };
    }

    /**
     * Initialize the page
     */
    async initialize() {
        if (this.state.isInitialized) return;

        try {
            // Create page container
            this.createPageContainer();
            
            // Create header
            this.createHeader();
            
            // Create main content area
            this.createMainContent();
            
            // Create footer
            this.createFooter();
            
            // Set up background
            await this.setupBackground();
            
            // Set up music if specified
            if (this.options.music) {
                await this.setupMusic();
            }

            this.state.isInitialized = true;
        } catch (error) {
            console.error(`Failed to initialize page ${this.pageId}:`, error);
        }
    }

    /**
     * Create the page container
     */
    createPageContainer() {
        const container = document.createElement('div');
        container.className = 'page-container';
        container.id = this.pageId;
        container.style.display = 'none';
        document.body.appendChild(container);
        this.elements.container = container;
    }

    /**
     * Create the page header
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'page-header';

        // Title
        const title = document.createElement('h1');
        title.className = 'page-title';
        title.textContent = this.options.title;
        header.appendChild(title);

        // Menu button if allowed
        if (this.options.allowMenu) {
            const menuButton = document.createElement('button');
            menuButton.className = 'menu-button';
            menuButton.innerHTML = '☰';
            menuButton.onclick = () => this.showMenu();
            header.appendChild(menuButton);
        }

        this.elements.header = header;
        this.elements.container.appendChild(header);
    }

    /**
     * Create the main content area
     */
    createMainContent() {
        const content = document.createElement('div');
        content.className = 'page-content';
        this.elements.mainContent = content;
        this.elements.container.appendChild(content);
    }

    /**
     * Create the page footer
     */
    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'page-footer';

        // Back button if allowed
        if (this.options.allowBack) {
            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.textContent = 'Back';
            backButton.onclick = () => this.goBack();
            footer.appendChild(backButton);
        }

        // Save button if allowed
        if (this.options.allowSave) {
            const saveButton = document.createElement('button');
            saveButton.className = 'save-button';
            saveButton.textContent = 'Save';
            saveButton.onclick = () => this.saveGame();
            footer.appendChild(saveButton);
        }

        this.elements.footer = footer;
        this.elements.container.appendChild(footer);
    }

    /**
     * Set up the page background
     */
    async setupBackground() {
        try {
            const background = document.createElement('div');
            background.className = 'page-background';
            background.style.backgroundImage = `url(${this.options.background})`;
            this.elements.container.insertBefore(background, this.elements.container.firstChild);
        } catch (error) {
            console.error('Failed to set up background:', error);
        }
    }

    /**
     * Set up background music
     */
    async setupMusic() {
        try {
            await soundManager.playMusic(this.options.music, {
                volume: 0.5,
                loop: true
            });
        } catch (error) {
            console.error('Failed to set up music:', error);
        }
    }

    /**
     * Show the page
     */
    async show() {
        if (!this.state.isInitialized) {
            await this.initialize();
        }

        this.elements.container.style.display = 'block';
        this.state.isVisible = true;
        soundManager.playSound('page_transition');
    }

    /**
     * Hide the page
     */
    hide() {
        this.elements.container.style.display = 'none';
        this.state.isVisible = false;
        if (this.options.music) {
            soundManager.stopMusic();
        }
    }

    /**
     * Show the game menu
     */
    showMenu() {
        soundManager.playSound('click');
        // Implement menu display logic
    }

    /**
     * Go back to the previous page
     */
    goBack() {
        soundManager.playSound('click');
        // Implement back navigation logic
    }

    /**
     * Save the game
     */
    saveGame() {
        soundManager.playSound('click');
        // Implement save game logic
    }

    /**
     * Handle page cleanup
     */
    cleanup() {
        this.hide();
        if (this.options.music) {
            soundManager.stopMusic();
        }
    }
}

// Export the page template
export { PageTemplate }; 