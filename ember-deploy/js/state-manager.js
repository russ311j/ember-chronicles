/**
 * State Manager
 * Handles game state management across pages
 */

class StateManager {
    constructor() {
        this.state = {
            character: null,
            inventory: [],
            storyProgress: {},
            flags: {},
            settings: {
                music: true,
                sound: true,
                textSpeed: 'normal',
                autoSave: true
            }
        };
        this.listeners = new Map();
        this.isLoading = false;
    }

    /**
     * Initialize the state manager
     */
    async initialize() {
        // Load saved state if exists
        const savedState = await this.loadSavedState();
        if (savedState) {
            this.state = { ...this.state, ...savedState };
        }
    }

    /**
     * Get current state
     * @param {string} path - Optional path to specific state property
     */
    getState(path = null) {
        if (!path) return this.state;
        return path.split('.').reduce((obj, key) => obj?.[key], this.state);
    }

    /**
     * Update state
     * @param {Object} updates - State updates
     * @param {boolean} save - Whether to save to storage
     */
    async updateState(updates, save = true) {
        this.state = { ...this.state, ...updates };
        
        // Notify listeners
        this.notifyListeners(updates);
        
        // Save if requested
        if (save) {
            await this.saveState();
        }
    }

    /**
     * Add state change listener
     * @param {string} path - Path to listen to
     * @param {Function} callback - Callback function
     */
    addListener(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path).add(callback);
    }

    /**
     * Remove state change listener
     * @param {string} path - Path to remove listener from
     * @param {Function} callback - Callback function to remove
     */
    removeListener(path, callback) {
        const listeners = this.listeners.get(path);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    /**
     * Notify listeners of state changes
     * @param {Object} updates - State updates
     */
    notifyListeners(updates) {
        Object.keys(updates).forEach(path => {
            const listeners = this.listeners.get(path);
            if (listeners) {
                listeners.forEach(callback => callback(updates[path]));
            }
        });
    }

    /**
     * Save state to storage
     */
    async saveState() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            const stateToSave = { ...this.state };
            // Remove any non-serializable data
            delete stateToSave.character?.image;
            localStorage.setItem('gameState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Load state from storage
     */
    async loadSavedState() {
        try {
            const savedState = localStorage.getItem('gameState');
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.error('Error loading state:', error);
            return null;
        }
    }

    /**
     * Reset state to initial values
     */
    async resetState() {
        this.state = {
            character: null,
            inventory: [],
            storyProgress: {},
            flags: {},
            settings: {
                music: true,
                sound: true,
                textSpeed: 'normal',
                autoSave: true
            }
        };
        await this.saveState();
    }

    /**
     * Get story progress
     * @param {string} pageId - Page ID
     */
    getStoryProgress(pageId) {
        return this.state.storyProgress[pageId] || 0;
    }

    /**
     * Update story progress
     * @param {string} pageId - Page ID
     * @param {number} progress - Progress value
     */
    async updateStoryProgress(pageId, progress) {
        await this.updateState({
            storyProgress: {
                ...this.state.storyProgress,
                [pageId]: progress
            }
        });
    }

    /**
     * Set story flag
     * @param {string} flag - Flag name
     * @param {boolean} value - Flag value
     */
    async setFlag(flag, value) {
        await this.updateState({
            flags: {
                ...this.state.flags,
                [flag]: value
            }
        });
    }

    /**
     * Get story flag
     * @param {string} flag - Flag name
     */
    getFlag(flag) {
        return this.state.flags[flag] || false;
    }

    /**
     * Update settings
     * @param {Object} settings - Settings updates
     */
    async updateSettings(settings) {
        await this.updateState({
            settings: {
                ...this.state.settings,
                ...settings
            }
        });
    }

    /**
     * Get setting value
     * @param {string} key - Setting key
     */
    getSetting(key) {
        return this.state.settings[key];
    }
}

// Export for use in other files
window.StateManager = StateManager; 