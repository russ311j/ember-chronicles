/**
 * Page Template System
 * Provides a consistent layout and functionality for all game pages
 */

class PageTemplate {
    constructor(pageId, config = {}) {
        this.pageId = pageId;
        this.config = {
            title: config.title || '',
            background: config.background || '',
            music: config.music || '',
            allowBack: config.allowBack || false,
            allowMenu: config.allowMenu || true,
            allowSave: config.allowSave || true,
            ...config
        };
        this.elements = {};
        this.state = {};
        this.isInitialized = false;
    }

    /**
     * Initialize the page with required elements and event listeners
     */
    async initialize() {
        if (this.isInitialized) return;

        // Create base page structure
        this.createPageStructure();
        
        // Initialize required systems
        await this.initializeSystems();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial state
        await this.loadState();
        
        this.isInitialized = true;
    }

    /**
     * Create the basic HTML structure for the page
     */
    createPageStructure() {
        const pageContainer = document.createElement('div');
        pageContainer.id = `page-${this.pageId}`;
        pageContainer.className = 'game-page';
        
        // Create header
        const header = document.createElement('header');
        header.className = 'page-header';
        if (this.config.allowBack) {
            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.innerHTML = '←';
            backButton.onclick = () => this.handleBack();
            header.appendChild(backButton);
        }
        if (this.config.allowMenu) {
            const menuButton = document.createElement('button');
            menuButton.className = 'menu-button';
            menuButton.innerHTML = '☰';
            menuButton.onclick = () => this.handleMenu();
            header.appendChild(menuButton);
        }
        pageContainer.appendChild(header);

        // Create main content area
        const mainContent = document.createElement('main');
        mainContent.className = 'page-content';
        pageContainer.appendChild(mainContent);

        // Create footer
        const footer = document.createElement('footer');
        footer.className = 'page-footer';
        if (this.config.allowSave) {
            const saveButton = document.createElement('button');
            saveButton.className = 'save-button';
            saveButton.innerHTML = '💾';
            saveButton.onclick = () => this.handleSave();
            footer.appendChild(saveButton);
        }
        pageContainer.appendChild(footer);

        // Add page to document
        document.getElementById('game-container').appendChild(pageContainer);
        
        // Store references to elements
        this.elements = {
            container: pageContainer,
            header,
            mainContent,
            footer
        };
    }

    /**
     * Initialize required game systems
     */
    async initializeSystems() {
        // Initialize required systems based on page needs
        if (this.config.background) {
            await this.initializeBackground();
        }
        if (this.config.music) {
            await this.initializeMusic();
        }
    }

    /**
     * Set up event listeners for the page
     */
    setupEventListeners() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Add window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Load initial state for the page
     */
    async loadState() {
        // Load any saved state for this page
        const savedState = await this.getSavedState();
        if (savedState) {
            this.state = { ...this.state, ...savedState };
            this.updateUI();
        }
    }

    /**
     * Update the UI based on current state
     */
    updateUI() {
        // Override in child classes
    }

    /**
     * Handle back button click
     */
    handleBack() {
        // Override in child classes
    }

    /**
     * Handle menu button click
     */
    handleMenu() {
        // Show game menu
        gameEngine.showMenu();
    }

    /**
     * Handle save button click
     */
    async handleSave() {
        await gameEngine.saveGame();
    }

    /**
     * Handle keyboard events
     */
    handleKeyPress(event) {
        // Override in child classes
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update layout if needed
    }

    /**
     * Get saved state for this page
     */
    async getSavedState() {
        return await gameEngine.getPageState(this.pageId);
    }

    /**
     * Save current state
     */
    async saveState() {
        await gameEngine.savePageState(this.pageId, this.state);
    }

    /**
     * Show the page
     */
    async show() {
        if (!this.isInitialized) {
            await this.initialize();
        }
        this.elements.container.style.display = 'block';
        this.updateUI();
    }

    /**
     * Hide the page
     */
    hide() {
        this.elements.container.style.display = 'none';
    }

    /**
     * Clean up resources
     */
    cleanup() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        window.removeEventListener('resize', this.handleResize);
        
        // Remove page from DOM
        this.elements.container.remove();
        
        this.isInitialized = false;
    }
}

// Export for use in other files
window.PageTemplate = PageTemplate; 