/**
 * Transition Manager
 * Handles smooth transitions between game pages
 */

class TransitionManager {
    constructor() {
        this.currentTransition = null;
        this.transitionQueue = [];
        this.isTransitioning = false;
        this.transitionDuration = 500; // Default duration in ms
    }

    /**
     * Queue a transition between pages
     * @param {string} fromPageId - ID of the current page
     * @param {string} toPageId - ID of the target page
     * @param {Object} options - Transition options
     */
    async queueTransition(fromPageId, toPageId, options = {}) {
        const transition = {
            fromPageId,
            toPageId,
            options: {
                type: options.type || 'fade',
                duration: options.duration || this.transitionDuration,
                ...options
            }
        };

        this.transitionQueue.push(transition);
        await this.processTransitionQueue();
    }

    /**
     * Process the transition queue
     */
    async processTransitionQueue() {
        if (this.isTransitioning || this.transitionQueue.length === 0) return;

        this.isTransitioning = true;
        const transition = this.transitionQueue.shift();
        await this.executeTransition(transition);
        this.isTransitioning = false;

        // Process next transition if any
        if (this.transitionQueue.length > 0) {
            await this.processTransitionQueue();
        }
    }

    /**
     * Execute a transition between pages
     * @param {Object} transition - Transition object
     */
    async executeTransition(transition) {
        const { fromPageId, toPageId, options } = transition;
        const fromPage = document.getElementById(`page-${fromPageId}`);
        const toPage = document.getElementById(`page-${toPageId}`);

        if (!fromPage || !toPage) {
            console.error('Transition failed: One or both pages not found');
            return;
        }

        // Prepare transition
        this.prepareTransition(fromPage, toPage, options);

        // Execute transition
        await this.performTransition(fromPage, toPage, options);

        // Clean up
        this.cleanupTransition(fromPage, toPage);
    }

    /**
     * Prepare elements for transition
     */
    prepareTransition(fromPage, toPage, options) {
        // Set initial states
        fromPage.style.position = 'absolute';
        toPage.style.position = 'absolute';
        toPage.style.display = 'block';
        toPage.style.opacity = '0';

        // Set transition properties
        const transitionProps = `all ${options.duration}ms ease-in-out`;
        fromPage.style.transition = transitionProps;
        toPage.style.transition = transitionProps;
    }

    /**
     * Perform the actual transition
     */
    async performTransition(fromPage, toPage, options) {
        return new Promise(resolve => {
            switch (options.type) {
                case 'fade':
                    this.performFadeTransition(fromPage, toPage, resolve);
                    break;
                case 'slide':
                    this.performSlideTransition(fromPage, toPage, options.direction || 'right', resolve);
                    break;
                case 'zoom':
                    this.performZoomTransition(fromPage, toPage, resolve);
                    break;
                default:
                    console.warn(`Unknown transition type: ${options.type}, falling back to fade`);
                    this.performFadeTransition(fromPage, toPage, resolve);
            }
        });
    }

    /**
     * Perform a fade transition
     */
    performFadeTransition(fromPage, toPage, resolve) {
        fromPage.style.opacity = '0';
        toPage.style.opacity = '1';

        setTimeout(() => {
            fromPage.style.display = 'none';
            resolve();
        }, this.transitionDuration);
    }

    /**
     * Perform a slide transition
     */
    performSlideTransition(fromPage, toPage, direction, resolve) {
        const directions = {
            right: { from: '0%', to: '-100%' },
            left: { from: '0%', to: '100%' },
            up: { from: '0%', to: '100%' },
            down: { from: '0%', to: '-100%' }
        };

        const dir = directions[direction] || directions.right;
        fromPage.style.transform = `translateX(${dir.to})`;
        toPage.style.transform = 'translateX(0)';

        setTimeout(() => {
            fromPage.style.display = 'none';
            resolve();
        }, this.transitionDuration);
    }

    /**
     * Perform a zoom transition
     */
    performZoomTransition(fromPage, toPage, resolve) {
        fromPage.style.transform = 'scale(0.8)';
        fromPage.style.opacity = '0';
        toPage.style.transform = 'scale(1)';
        toPage.style.opacity = '1';

        setTimeout(() => {
            fromPage.style.display = 'none';
            resolve();
        }, this.transitionDuration);
    }

    /**
     * Clean up after transition
     */
    cleanupTransition(fromPage, toPage) {
        // Reset styles
        [fromPage, toPage].forEach(page => {
            page.style.transition = '';
            page.style.transform = '';
            page.style.position = '';
        });

        // Reset from page
        fromPage.style.display = 'none';
        fromPage.style.opacity = '1';
    }

    /**
     * Cancel current transition
     */
    cancelTransition() {
        this.transitionQueue = [];
        this.isTransitioning = false;
    }
}

// Export for use in other files
window.TransitionManager = TransitionManager; 