/**
 * Sound Manager System
 * Handles all audio-related functionality including music, sound effects, and voice generation
 */

class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map();
        this.currentMusic = null;
        this.isMuted = false;
        this.volume = 1.0;
        this.elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    }

    /**
     * Initialize the sound manager
     */
    async initialize() {
        try {
            // Load default sound effects
            await this.loadSoundEffects();
            // Initialize ElevenLabs client
            await this.initializeElevenLabs();
        } catch (error) {
            console.error('Failed to initialize sound manager:', error);
        }
    }

    /**
     * Load default sound effects
     */
    async loadSoundEffects() {
        const defaultSounds = [
            { id: 'click', path: 'media/audio/sfx/click.mp3' },
            { id: 'hover', path: 'media/audio/sfx/hover.mp3' },
            { id: 'success', path: 'media/audio/sfx/success.mp3' },
            { id: 'failure', path: 'media/audio/sfx/failure.mp3' },
            { id: 'combat', path: 'media/audio/sfx/combat.mp3' },
            { id: 'level_up', path: 'media/audio/sfx/level_up.mp3' }
        ];

        for (const sound of defaultSounds) {
            await this.loadSound(sound.id, sound.path);
        }
    }

    /**
     * Load a sound file
     */
    async loadSound(id, path) {
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(id, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound ${id}:`, error);
        }
    }

    /**
     * Play a sound effect
     */
    playSound(id, options = {}) {
        if (this.isMuted) return;

        const sound = this.sounds.get(id);
        if (!sound) {
            console.warn(`Sound ${id} not found`);
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = sound;
        source.connect(this.audioContext.destination);
        source.volume = (options.volume || 1.0) * this.volume;
        source.start(0);
    }

    /**
     * Play background music
     */
    async playMusic(path, options = {}) {
        if (this.isMuted) return;

        try {
            // Stop current music if playing
            if (this.currentMusic) {
                this.currentMusic.stop();
            }

            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);
            source.volume = (options.volume || 0.5) * this.volume;
            source.loop = options.loop !== false;
            
            source.start(0);
            this.currentMusic = source;
        } catch (error) {
            console.error('Failed to play music:', error);
        }
    }

    /**
     * Stop current music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    /**
     * Generate voice using ElevenLabs
     */
    async generateVoice(text, options = {}) {
        if (!this.elevenLabsKey) {
            console.error('ElevenLabs API key not found');
            return null;
        }

        try {
            const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.elevenLabsKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: options.modelId || 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: options.stability || 0.5,
                        similarity_boost: options.similarityBoost || 0.75
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.statusText}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            return audioUrl;
        } catch (error) {
            console.error('Failed to generate voice:', error);
            return null;
        }
    }

    /**
     * Play generated voice
     */
    async playVoice(text, options = {}) {
        const audioUrl = await this.generateVoice(text, options);
        if (!audioUrl) return;

        const audio = new Audio(audioUrl);
        audio.volume = (options.volume || 1.0) * this.volume;
        await audio.play();
    }

    /**
     * Set volume level
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.volume;
        }
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        }
    }
}

// Export the sound manager
export const soundManager = new SoundManager(); 