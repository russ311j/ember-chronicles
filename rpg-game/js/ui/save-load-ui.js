/**
 * Save/Load UI
 * Handles the user interface for saving and loading games
 */

import { saveLoadSystem } from '../systems/save-load-system.js';
import { soundManager } from '../systems/sound-manager.js';

class SaveLoadUI {
    constructor() {
        this.container = null;
        this.slots = [];
        this.currentMode = null; // 'save' or 'load'
    }

    /**
     * Initialize the save/load UI
     */
    async initialize() {
        this.container = document.createElement('div');
        this.container.className = 'save-load-container';
        this.container.style.display = 'none';
        document.body.appendChild(this.container);

        // Create slots
        for (let i = 0; i < 5; i++) {
            const slot = this.createSlotElement(i);
            this.slots.push(slot);
            this.container.appendChild(slot);
        }

        // Add mode buttons
        this.addModeButtons();
    }

    /**
     * Create a slot element
     */
    createSlotElement(index) {
        const slot = document.createElement('div');
        slot.className = 'save-slot';
        slot.dataset.index = index;

        // Create slot content
        const content = document.createElement('div');
        content.className = 'slot-content';

        // Add preview elements
        const preview = document.createElement('div');
        preview.className = 'slot-preview';
        content.appendChild(preview);

        // Add slot actions
        const actions = document.createElement('div');
        actions.className = 'slot-actions';
        content.appendChild(actions);

        slot.appendChild(content);

        // Add event listeners
        slot.addEventListener('click', () => this.handleSlotClick(index));
        return slot;
    }

    /**
     * Add mode selection buttons
     */
    addModeButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mode-buttons';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Game';
        saveButton.addEventListener('click', () => this.setMode('save'));

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Game';
        loadButton.addEventListener('click', () => this.setMode('load'));

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => this.hide());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(loadButton);
        buttonContainer.appendChild(closeButton);
        this.container.appendChild(buttonContainer);
    }

    /**
     * Set the current mode (save/load)
     */
    setMode(mode) {
        this.currentMode = mode;
        this.updateSlots();
        this.updateModeButtons();
    }

    /**
     * Update slot displays
     */
    async updateSlots() {
        const slots = saveLoadSystem.getSaveSlots();
        
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            const slotData = slots[i];
            const preview = slot.querySelector('.slot-preview');
            const actions = slot.querySelector('.slot-actions');

            // Clear previous content
            preview.innerHTML = '';
            actions.innerHTML = '';

            if (slotData && slotData.timestamp) {
                // Add save preview
                const character = slotData.preview.character;
                const level = slotData.preview.level;
                const location = slotData.preview.location;
                const date = new Date(slotData.timestamp).toLocaleString();

                preview.innerHTML = `
                    <div class="slot-character">${character}</div>
                    <div class="slot-level">Level ${level}</div>
                    <div class="slot-location">${location}</div>
                    <div class="slot-date">${date}</div>
                `;

                // Add action buttons based on mode
                if (this.currentMode === 'save') {
                    const overwriteButton = document.createElement('button');
                    overwriteButton.textContent = 'Overwrite';
                    overwriteButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleSave(i);
                    });
                    actions.appendChild(overwriteButton);
                } else {
                    const loadButton = document.createElement('button');
                    loadButton.textContent = 'Load';
                    loadButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleLoad(i);
                    });
                    actions.appendChild(loadButton);
                }

                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleDelete(i);
                });
                actions.appendChild(deleteButton);
            } else {
                // Empty slot
                preview.innerHTML = '<div class="empty-slot">Empty Slot</div>';
                if (this.currentMode === 'save') {
                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Save Here';
                    saveButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleSave(i);
                    });
                    actions.appendChild(saveButton);
                }
            }
        }
    }

    /**
     * Update mode buttons
     */
    updateModeButtons() {
        const buttons = this.container.querySelectorAll('.mode-buttons button');
        buttons.forEach(button => {
            if (button.textContent === 'Save Game' || button.textContent === 'Load Game') {
                button.disabled = button.textContent.toLowerCase().includes(this.currentMode);
            }
        });
    }

    /**
     * Handle slot click
     */
    handleSlotClick(index) {
        if (this.currentMode === 'save') {
            this.handleSave(index);
        } else if (this.currentMode === 'load') {
            this.handleLoad(index);
        }
    }

    /**
     * Handle save operation
     */
    async handleSave(index) {
        const success = await saveLoadSystem.saveGame(index);
        if (success) {
            this.updateSlots();
            soundManager.playSound('success');
        }
    }

    /**
     * Handle load operation
     */
    async handleLoad(index) {
        const success = await saveLoadSystem.loadGame(index);
        if (success) {
            this.hide();
            soundManager.playSound('success');
            // Trigger game reload
            window.location.reload();
        }
    }

    /**
     * Handle delete operation
     */
    async handleDelete(index) {
        if (confirm('Are you sure you want to delete this save?')) {
            const success = await saveLoadSystem.deleteSave(index);
            if (success) {
                this.updateSlots();
                soundManager.playSound('success');
            }
        }
    }

    /**
     * Show the save/load UI
     */
    show() {
        this.container.style.display = 'block';
        this.updateSlots();
    }

    /**
     * Hide the save/load UI
     */
    hide() {
        this.container.style.display = 'none';
        this.currentMode = null;
    }
}

// Export the save/load UI
export const saveLoadUI = new SaveLoadUI(); 