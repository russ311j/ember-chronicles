/**
 * Transition Manager System
 * Handles smooth transitions between game pages
 */

import { soundManager } from './sound-manager.js';

class TransitionManager {
    constructor() {
        this.currentPage = null;
        this.transitionQueue = [];
        this.isTransitioning = false;
        this.transitionDuration = 500; // milliseconds
    }

    /**
     * Initialize the transition manager
     */
    async initialize() {
        // Create transition overlay
        this.createTransitionOverlay();
    }

    /**
     * Create the transition overlay element
     */
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        this.elements = { overlay };
    }

    /**
     * Transition to a new page
     */
    async transitionTo(newPage) {
        if (this.isTransitioning) {
            this.transitionQueue.push(newPage);
            return;
        }

        this.isTransitioning = true;
        const oldPage = this.currentPage;

        try {
            // Start transition out
            await this.transitionOut(oldPage);

            // Update current page
            this.currentPage = newPage;

            // Start transition in
            await this.transitionIn(newPage);

            // Process any queued transitions
            if (this.transitionQueue.length > 0) {
                const nextPage = this.transitionQueue.shift();
                await this.transitionTo(nextPage);
            }
        } catch (error) {
            console.error('Transition failed:', error);
        } finally {
            this.isTransitioning = false;
        }
    }

    /**
     * Transition out from current page
     */
    async transitionOut(page) {
        if (!page) return;

        const overlay = this.elements.overlay;
        overlay.style.display = 'block';
        overlay.style.opacity = '0';

        // Play transition sound
        soundManager.playSound('page_transition');

        // Fade out current page
        await new Promise(resolve => {
            setTimeout(() => {
                page.hide();
                resolve();
            }, this.transitionDuration);
        });

        // Fade in overlay
        await new Promise(resolve => {
            setTimeout(() => {
                overlay.style.opacity = '1';
                resolve();
            }, 50);
        });
    }

    /**
     * Transition in to new page
     */
    async transitionIn(page) {
        if (!page) return;

        const overlay = this.elements.overlay;

        // Show new page
        await page.show();

        // Fade out overlay
        overlay.style.opacity = '0';

        // Hide overlay after transition
        await new Promise(resolve => {
            setTimeout(() => {
                overlay.style.display = 'none';
                resolve();
            }, this.transitionDuration);
        });
    }

    /**
     * Set transition duration
     */
    setTransitionDuration(duration) {
        this.transitionDuration = duration;
    }

    /**
     * Get current page
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Check if currently transitioning
     */
    isInTransition() {
        return this.isTransitioning;
    }
}

// Export the transition manager
export const transitionManager = new TransitionManager(); 