/**
 * State Manager System
 * Handles game state management and persistence
 */

class StateManager {
    constructor() {
        this.state = {
            game: {
                currentPage: null,
                character: null,
                inventory: [],
                stats: {},
                flags: {},
                timestamp: null
            },
            settings: {
                volume: 1.0,
                music: true,
                sound: true,
                voice: true,
                subtitles: true
            }
        };

        this.observers = new Map();
    }

    /**
     * Initialize the state manager
     */
    async initialize() {
        try {
            // Load saved state if exists
            await this.loadState();
            // Set up auto-save
            this.setupAutoSave();
        } catch (error) {
            console.error('Failed to initialize state manager:', error);
        }
    }

    /**
     * Get current game state
     */
    getGameState() {
        return this.state.game;
    }

    /**
     * Get current settings
     */
    getSettings() {
        return this.state.settings;
    }

    /**
     * Update game state
     */
    updateGameState(updates) {
        this.state.game = {
            ...this.state.game,
            ...updates,
            timestamp: Date.now()
        };
        this.notifyObservers('game', this.state.game);
    }

    /**
     * Update settings
     */
    updateSettings(updates) {
        this.state.settings = {
            ...this.state.settings,
            ...updates
        };
        this.notifyObservers('settings', this.state.settings);
    }

    /**
     * Save current state
     */
    async saveState() {
        try {
            const stateString = JSON.stringify(this.state);
            localStorage.setItem('gameState', stateString);
            return true;
        } catch (error) {
            console.error('Failed to save state:', error);
            return false;
        }
    }

    /**
     * Load saved state
     */
    async loadState() {
        try {
            const savedState = localStorage.getItem('gameState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.state = {
                    ...this.state,
                    ...parsedState
                };
                this.notifyObservers('game', this.state.game);
                this.notifyObservers('settings', this.state.settings);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load state:', error);
            return false;
        }
    }

    /**
     * Set up auto-save
     */
    setupAutoSave() {
        // Auto-save every 5 minutes
        setInterval(() => {
            this.saveState();
        }, 5 * 60 * 1000);
    }

    /**
     * Add state observer
     */
    addObserver(type, callback) {
        if (!this.observers.has(type)) {
            this.observers.set(type, new Set());
        }
        this.observers.get(type).add(callback);
    }

    /**
     * Remove state observer
     */
    removeObserver(type, callback) {
        if (this.observers.has(type)) {
            this.observers.get(type).delete(callback);
        }
    }

    /**
     * Notify observers of state changes
     */
    notifyObservers(type, data) {
        if (this.observers.has(type)) {
            this.observers.get(type).forEach(callback => {
                callback(data);
            });
        }
    }

    /**
     * Reset game state
     */
    resetGameState() {
        this.state.game = {
            currentPage: null,
            character: null,
            inventory: [],
            stats: {},
            flags: {},
            timestamp: null
        };
        this.notifyObservers('game', this.state.game);
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.state.settings = {
            volume: 1.0,
            music: true,
            sound: true,
            voice: true,
            subtitles: true
        };
        this.notifyObservers('settings', this.state.settings);
    }

    /**
     * Export game state
     */
    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Import game state
     */
    importState(stateString) {
        try {
            const importedState = JSON.parse(stateString);
            this.state = {
                ...this.state,
                ...importedState
            };
            this.notifyObservers('game', this.state.game);
            this.notifyObservers('settings', this.state.settings);
            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }
}

// Export the state manager
export const stateManager = new StateManager(); 