/**
 * Save/Load System
 * Handles game save and load functionality
 */

import { stateManager } from './state-manager.js';
import { soundManager } from './sound-manager.js';

class SaveLoadSystem {
    constructor() {
        this.maxSlots = 5;
        this.currentSlot = null;
    }

    /**
     * Initialize the save/load system
     */
    async initialize() {
        // Create save slots if they don't exist
        await this.createSaveSlots();
    }

    /**
     * Create save slots
     */
    async createSaveSlots() {
        for (let i = 0; i < this.maxSlots; i++) {
            const slot = localStorage.getItem(`saveSlot${i}`);
            if (!slot) {
                await this.createEmptySlot(i);
            }
        }
    }

    /**
     * Create an empty save slot
     */
    async createEmptySlot(index) {
        const emptySlot = {
            index,
            timestamp: null,
            preview: {
                character: null,
                level: 1,
                location: 'New Game'
            }
        };
        localStorage.setItem(`saveSlot${index}`, JSON.stringify(emptySlot));
    }

    /**
     * Save game to a slot
     */
    async saveGame(slotIndex) {
        try {
            const gameState = stateManager.getGameState();
            const saveData = {
                index: slotIndex,
                timestamp: Date.now(),
                preview: {
                    character: gameState.character,
                    level: gameState.stats.level || 1,
                    location: gameState.currentPage || 'Unknown Location'
                },
                state: gameState
            };

            localStorage.setItem(`saveSlot${slotIndex}`, JSON.stringify(saveData));
            soundManager.playSound('success');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            soundManager.playSound('failure');
            return false;
        }
    }

    /**
     * Load game from a slot
     */
    async loadGame(slotIndex) {
        try {
            const saveData = localStorage.getItem(`saveSlot${slotIndex}`);
            if (!saveData) {
                throw new Error('Save slot is empty');
            }

            const parsedData = JSON.parse(saveData);
            await stateManager.importState(JSON.stringify(parsedData.state));
            this.currentSlot = slotIndex;
            soundManager.playSound('success');
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            soundManager.playSound('failure');
            return false;
        }
    }

    /**
     * Get all save slots
     */
    getSaveSlots() {
        const slots = [];
        for (let i = 0; i < this.maxSlots; i++) {
            const slot = localStorage.getItem(`saveSlot${i}`);
            if (slot) {
                slots.push(JSON.parse(slot));
            }
        }
        return slots;
    }

    /**
     * Delete a save slot
     */
    async deleteSave(slotIndex) {
        try {
            localStorage.removeItem(`saveSlot${slotIndex}`);
            await this.createEmptySlot(slotIndex);
            soundManager.playSound('success');
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            soundManager.playSound('failure');
            return false;
        }
    }

    /**
     * Get current save slot
     */
    getCurrentSlot() {
        return this.currentSlot;
    }

    /**
     * Auto-save game
     */
    async autoSave() {
        if (this.currentSlot !== null) {
            await this.saveGame(this.currentSlot);
        }
    }

    /**
     * Quick save game
     */
    async quickSave() {
        // Use the first available slot or the current slot
        const slotIndex = this.currentSlot || 0;
        await this.saveGame(slotIndex);
    }

    /**
     * Quick load game
     */
    async quickLoad() {
        // Load from the current slot or the first available slot
        const slotIndex = this.currentSlot || 0;
        await this.loadGame(slotIndex);
    }

    /**
     * Export save data
     */
    exportSave(slotIndex) {
        const saveData = localStorage.getItem(`saveSlot${slotIndex}`);
        if (!saveData) {
            return null;
        }
        return saveData;
    }

    /**
     * Import save data
     */
    async importSave(saveData) {
        try {
            const parsedData = JSON.parse(saveData);
            const slotIndex = parsedData.index;
            localStorage.setItem(`saveSlot${slotIndex}`, saveData);
            soundManager.playSound('success');
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            soundManager.playSound('failure');
            return false;
        }
    }

    /**
     * Check if a slot is empty
     */
    isSlotEmpty(slotIndex) {
        const slot = localStorage.getItem(`saveSlot${slotIndex}`);
        if (!slot) return true;
        const parsedSlot = JSON.parse(slot);
        return parsedSlot.timestamp === null;
    }

    /**
     * Get save preview
     */
    getSavePreview(slotIndex) {
        const slot = localStorage.getItem(`saveSlot${slotIndex}`);
        if (!slot) return null;
        const parsedSlot = JSON.parse(slot);
        return parsedSlot.preview;
    }
}

// Export the save/load system
export const saveLoadSystem = new SaveLoadSystem(); 