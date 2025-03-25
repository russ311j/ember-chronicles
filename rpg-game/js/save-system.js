/**
 * Save System
 * Handles game save and load functionality
 */

class SaveSystem {
    constructor() {
        this.maxSlots = 5;
        this.currentSlot = null;
        this.autoSaveInterval = 5 * 60 * 1000; // 5 minutes
        this.autoSaveTimer = null;
    }

    /**
     * Initialize the save system
     */
    async initialize() {
        // Start auto-save timer if enabled
        if (stateManager.getSetting('autoSave')) {
            this.startAutoSave();
        }
    }

    /**
     * Save game to a slot
     * @param {number} slot - Save slot number (1-5)
     */
    async saveGame(slot) {
        if (slot < 1 || slot > this.maxSlots) {
            console.error('Invalid save slot:', slot);
            return false;
        }

        try {
            const saveData = {
                timestamp: Date.now(),
                state: stateManager.getState(),
                metadata: {
                    character: stateManager.state.character?.name || 'No Character',
                    location: this.getCurrentLocation(),
                    playtime: this.getPlaytime()
                }
            };

            localStorage.setItem(`save_${slot}`, JSON.stringify(saveData));
            this.currentSlot = slot;
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    /**
     * Load game from a slot
     * @param {number} slot - Save slot number (1-5)
     */
    async loadGame(slot) {
        if (slot < 1 || slot > this.maxSlots) {
            console.error('Invalid save slot:', slot);
            return false;
        }

        try {
            const saveData = localStorage.getItem(`save_${slot}`);
            if (!saveData) {
                console.error('No save data found in slot:', slot);
                return false;
            }

            const parsedData = JSON.parse(saveData);
            await stateManager.updateState(parsedData.state, false);
            this.currentSlot = slot;
            return true;
        } catch (error) {
            console.error('Error loading game:', error);
            return false;
        }
    }

    /**
     * Get save data for a slot
     * @param {number} slot - Save slot number (1-5)
     */
    getSaveData(slot) {
        try {
            const saveData = localStorage.getItem(`save_${slot}`);
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('Error getting save data:', error);
            return null;
        }
    }

    /**
     * Delete save from a slot
     * @param {number} slot - Save slot number (1-5)
     */
    deleteSave(slot) {
        if (slot < 1 || slot > this.maxSlots) {
            console.error('Invalid save slot:', slot);
            return false;
        }

        try {
            localStorage.removeItem(`save_${slot}`);
            if (this.currentSlot === slot) {
                this.currentSlot = null;
            }
            return true;
        } catch (error) {
            console.error('Error deleting save:', error);
            return false;
        }
    }

    /**
     * Get all save slots
     */
    getAllSaves() {
        const saves = [];
        for (let i = 1; i <= this.maxSlots; i++) {
            const saveData = this.getSaveData(i);
            if (saveData) {
                saves.push({
                    slot: i,
                    ...saveData
                });
            }
        }
        return saves;
    }

    /**
     * Start auto-save timer
     */
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        this.autoSaveTimer = setInterval(async () => {
            if (this.currentSlot) {
                await this.saveGame(this.currentSlot);
            }
        }, this.autoSaveInterval);
    }

    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Get current location from state
     */
    getCurrentLocation() {
        const currentPage = stateManager.getState('currentPage');
        return currentPage ? `Page ${currentPage}` : 'Unknown Location';
    }

    /**
     * Get total playtime
     */
    getPlaytime() {
        const startTime = stateManager.getState('startTime');
        if (!startTime) return 0;
        return Date.now() - startTime;
    }

    /**
     * Format playtime for display
     */
    formatPlaytime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }

    /**
     * Format save timestamp
     */
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }
}

// Export for use in other files
window.SaveSystem = SaveSystem; 