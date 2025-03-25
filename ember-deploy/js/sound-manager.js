/**
 * Sound Manager for Game X
 * 
 * Handles all game audio including sound effects, music and ambient sounds.
 * Provides methods for loading, playing, stopping and controlling volume of sounds.
 */

(function (GameX) {
  'use strict';

  // Check if the Audio Context is supported
  var isAudioContextSupported = window.AudioContext || window.webkitAudioContext;

  /**
   * The Sound Manager handles loading and playing of all audio in the game.
   */
  GameX.SoundManager = {
    // The audio context used for all audio operations
    audioContext: null,
    
    // Collections of loaded sounds
    loadedSounds: {},
    loadedMusic: {},
    loadingPromises: {},
    
    // Currently playing sounds and music
    currentSounds: {},
    currentMusic: null,
    
    // Global volume settings
    masterVolume: 1.0,
    musicVolume: 0.7,
    soundVolume: 1.0,
    voiceVolume: 1.0,
    ambientVolume: 0.5,
    
    // Flag to track if audio is enabled
    isEnabled: true,
    
    // Flag to indicate if the manager has been initialized
    isInitialized: false,
    
    // Sound asset mapping for Ember Throne Chronicles
    soundAssetMap: {
      // Background music tracks
      music: {
        title_theme: '/media/audio/music/title_theme.mp3',
        village_theme: '/media/audio/music/village_theme.mp3',
        forest_theme: '/media/audio/music/forest_theme.mp3',
        mountain_theme: '/media/audio/music/mountain_theme.mp3',
        temple_theme: '/media/audio/music/temple_theme.mp3',
        battle_theme: '/media/audio/music/battle_theme.mp3',
        victory_theme: '/media/audio/music/victory_theme.mp3',
        game_over: '/media/audio/music/game_over.mp3'
      },
      
      // Sound effects
      sfx: {
        button_click: '/media/audio/sfx/button_click.mp3',
        page_turn: '/media/audio/sfx/page_turn.mp3',
        item_pickup: '/media/audio/sfx/item_pickup.mp3',
        door_open: '/media/audio/sfx/door_open.mp3',
        footsteps: '/media/audio/sfx/footsteps.mp3',
        magic_spell: '/media/audio/sfx/magic_spell.mp3',
        sword_slash: '/media/audio/sfx/sword_slash.mp3',
        treasure_found: '/media/audio/sfx/treasure_found.mp3'
      },
      
      // Ambient sounds
      ambient: {
        forest_ambience: '/media/audio/ambient/forest_ambience.mp3',
        village_ambience: '/media/audio/ambient/village_ambience.mp3',
        cave_ambience: '/media/audio/ambient/cave_ambience.mp3',
        temple_ambience: '/media/audio/ambient/temple_ambience.mp3',
        mountain_wind: '/media/audio/ambient/mountain_wind.mp3'
      },
      
      // Voice narration
      voice: {
        intro_narration: '/media/audio/voice/intro_narration.mp3',
        village_elder_greeting: '/media/audio/voice/village_elder_greeting.mp3',
        mysterious_messenger: '/media/audio/voice/mysterious_messenger.mp3'
      }
    },
    
    /**
     * Initialize the sound manager. Creates the audio context and sets up initial state.
     */
    initialize: function () {
      if (this.isInitialized) return;
      
      if (!isAudioContextSupported) {
        console.warn('AudioContext is not supported in this browser. Sound will be disabled.');
        this.isEnabled = false;
        return;
      }
      
      try {
        // Create the audio context
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        
        // Mobile browsers require user interaction to start the audio context
        if (this.audioContext.state === 'suspended') {
          var resumeAudio = function () {
            this.audioContext.resume();
            
            // Remove the event listeners once audio is enabled
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
            
            console.log('Audio context resumed successfully.');
          }.bind(this);
          
          document.addEventListener('click', resumeAudio);
          document.addEventListener('touchstart', resumeAudio);
          document.addEventListener('keydown', resumeAudio);
          
          console.log('Audio context is suspended. User interaction needed to enable audio.');
        }
        
        this.isInitialized = true;
        console.log('Sound Manager initialized successfully.');
        
        // Set up volume from saved preferences if available
        this.loadVolumeSettings();
        
      } catch (e) {
        console.error('Failed to initialize the Sound Manager:', e);
        this.isEnabled = false;
      }
    },
    
    /**
     * Load volume settings from local storage if available
     */
    loadVolumeSettings: function () {
      try {
        var settings = localStorage.getItem('gamex_audio_settings');
        if (settings) {
          settings = JSON.parse(settings);
          this.masterVolume = settings.masterVolume !== undefined ? settings.masterVolume : this.masterVolume;
          this.musicVolume = settings.musicVolume !== undefined ? settings.musicVolume : this.musicVolume;
          this.soundVolume = settings.soundVolume !== undefined ? settings.soundVolume : this.soundVolume;
          this.voiceVolume = settings.voiceVolume !== undefined ? settings.voiceVolume : this.voiceVolume;
          this.ambientVolume = settings.ambientVolume !== undefined ? settings.ambientVolume : this.ambientVolume;
          
          console.log('Loaded audio settings from storage');
        }
      } catch (e) {
        console.warn('Failed to load audio settings:', e);
      }
    },
    
    /**
     * Save current volume settings to local storage
     */
    saveVolumeSettings: function () {
      try {
        var settings = {
          masterVolume: this.masterVolume,
          musicVolume: this.musicVolume,
          soundVolume: this.soundVolume,
          voiceVolume: this.voiceVolume,
          ambientVolume: this.ambientVolume
        };
        
        localStorage.setItem('gamex_audio_settings', JSON.stringify(settings));
      } catch (e) {
        console.warn('Failed to save audio settings:', e);
      }
    },
    
    /**
     * Preload a sound file from the given URL
     * @param {string} id - Unique identifier for the sound
     * @param {string} url - URL to the sound file
     * @param {object} options - Additional options for loading the sound
     * @returns {Promise} - A promise that resolves when the sound is loaded
     */
    preloadSound: function (id, url, options) {
      options = options || {};
      
      // If not enabled or already loading, return early
      if (!this.isEnabled) {
        return Promise.resolve();
      }
      
      if (this.loadingPromises[id]) {
        return this.loadingPromises[id];
      }
      
      // If already loaded, return immediately
      if (this.loadedSounds[id]) {
        return Promise.resolve(this.loadedSounds[id]);
      }
      
      console.log('Preloading sound:', id, url);
      
      var promise = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        
        request.onload = function () {
          if (request.status === 200) {
            this.audioContext.decodeAudioData(
              request.response,
              function (buffer) {
                this.loadedSounds[id] = {
                  id: id,
                  buffer: buffer,
                  isMusic: options.isMusic || false,
                  isAmbient: options.isAmbient || false,
                  isVoice: options.isVoice || false,
                  loop: options.loop || false
                };
                
                console.log('Successfully loaded sound:', id);
                delete this.loadingPromises[id];
                resolve(this.loadedSounds[id]);
              }.bind(this),
              function (error) {
                console.error('Error decoding audio data for', id, ':', error);
                delete this.loadingPromises[id];
                reject(error);
              }.bind(this)
            );
          } else {
            var error = new Error('Failed to load sound: ' + url + ' (Status: ' + request.status + ')');
            console.error(error);
            delete this.loadingPromises[id];
            reject(error);
          }
        }.bind(this);
        
        request.onerror = function () {
          var error = new Error('Network error while loading sound: ' + url);
          console.error(error);
          delete this.loadingPromises[id];
          reject(error);
        }.bind(this);
        
        request.send();
      }.bind(this));
      
      this.loadingPromises[id] = promise;
      return promise;
    },
    
    /**
     * Play a sound with the given ID
     * @param {string} id - ID of the sound to play
     * @param {object} options - Options for playing the sound
     * @returns {object} - Sound object with controls for the sound
     */
    playSound: function (id, options) {
      options = options || {};
      
      if (!this.isEnabled || !this.isInitialized || !this.loadedSounds[id]) {
        // If the sound is not loaded yet, try to load it automatically if we have a mapping
        if (this.soundAssetMap.sfx[id]) {
          this.preloadSound(id, this.soundAssetMap.sfx[id]);
          console.log('Sound not loaded, attempting to load:', id);
        }
        return null;
      }
      
      var sound = this.loadedSounds[id];
      var source = this.audioContext.createBufferSource();
      source.buffer = sound.buffer;
      source.loop = options.loop || sound.loop || false;
      
      // Create a gain node for volume control
      var gainNode = this.audioContext.createGain();
      
      // Determine the base volume based on sound type
      var baseVolume = sound.isMusic ? this.musicVolume :
                      sound.isVoice ? this.voiceVolume :
                      sound.isAmbient ? this.ambientVolume : 
                      this.soundVolume;
      
      // Apply the master volume and any option-specific volume
      var volume = this.masterVolume * baseVolume * (options.volume || 1.0);
      gainNode.gain.value = volume;
      
      // Connect the nodes
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Store the sound in currentSounds
      var soundInstance = {
        id: id,
        source: source,
        gainNode: gainNode,
        isMusic: sound.isMusic,
        isAmbient: sound.isAmbient,
        isVoice: sound.isVoice,
        startTime: this.audioContext.currentTime,
        loop: source.loop
      };
      
      // For music tracks, store as current music
      if (sound.isMusic) {
        // Stop any currently playing music
        if (options.stopExisting !== false) {
          this.stopMusic();
        }
        this.currentMusic = soundInstance;
      }
      
      // Add to current sounds map
      var instanceId = id + '_' + Date.now();
      this.currentSounds[instanceId] = soundInstance;
      
      // Set up fade in if specified
      if (options.fadeIn) {
        var fadeTime = options.fadeIn;
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume, 
          this.audioContext.currentTime + fadeTime
        );
      }
      
      // Start the sound
      var startTime = options.delay ? this.audioContext.currentTime + options.delay : 0;
      var offset = options.offset || 0;
      var duration = options.duration || 0;
      
      if (duration) {
        source.start(startTime, offset, duration);
      } else {
        source.start(startTime, offset);
      }
      
      // Set up cleanup when the sound ends
      source.onended = function () {
        delete this.currentSounds[instanceId];
        
        if (sound.isMusic && this.currentMusic === soundInstance) {
          this.currentMusic = null;
        }
        
        if (options.onEnded) {
          options.onEnded();
        }
      }.bind(this);
      
      return {
        instanceId: instanceId,
        stop: function () {
          this.stopSound(instanceId);
        }.bind(this),
        setVolume: function (volume) {
          this.setSoundVolume(instanceId, volume);
        }.bind(this),
        fadeOut: function (duration) {
          this.fadeSoundOut(instanceId, duration);
        }.bind(this)
      };
    },
    
    /**
     * Convenience method to play music
     * @param {string} id - ID of the music to play
     * @param {object} options - Options for playing the music
     */
    playMusic: function (id, options) {
      options = options || {};
      options.loop = options.loop !== false; // Default to looping
      
      // Try to load music from asset map if not loaded
      if (!this.loadedSounds[id] && this.soundAssetMap.music[id]) {
        console.log('Music not loaded, attempting to load:', id);
        this.preloadSound(id, this.soundAssetMap.music[id], { isMusic: true, loop: options.loop });
      }
      
      return this.playSound(id, Object.assign({}, options, { isMusic: true }));
    },
    
    /**
     * Convenience method to play ambient sounds
     * @param {string} id - ID of the ambient sound to play
     * @param {object} options - Options for playing the ambient sound
     */
    playAmbient: function (id, options) {
      options = options || {};
      options.loop = options.loop !== false; // Default to looping
      
      // Try to load ambient sound from asset map if not loaded
      if (!this.loadedSounds[id] && this.soundAssetMap.ambient[id]) {
        console.log('Ambient sound not loaded, attempting to load:', id);
        this.preloadSound(id, this.soundAssetMap.ambient[id], { isAmbient: true, loop: options.loop });
      }
      
      return this.playSound(id, Object.assign({}, options, { isAmbient: true }));
    },
    
    /**
     * Convenience method to play voice narration
     * @param {string} id - ID of the voice to play
     * @param {object} options - Options for playing the voice
     */
    playVoice: function (id, options) {
      options = options || {};
      
      // Try to load voice from asset map if not loaded
      if (!this.loadedSounds[id] && this.soundAssetMap.voice[id]) {
        console.log('Voice not loaded, attempting to load:', id);
        this.preloadSound(id, this.soundAssetMap.voice[id], { isVoice: true });
      }
      
      return this.playSound(id, Object.assign({}, options, { isVoice: true }));
    },
    
    /**
     * Play UI sound based on the interaction type
     * @param {string} type - Type of UI interaction (click, hover, pageChange, etc.)
     */
    playUISound: function (type) {
      switch (type) {
        case 'click':
          this.playSound('button_click');
          break;
        case 'hover':
          // Optional hover sound could be added here
          break;
        case 'pageChange':
        case 'pageTurn':
          this.playSound('page_turn');
          break;
        default:
          // Default UI sound
          this.playSound('button_click');
      }
    },
    
    /**
     * Preload all Ember Throne Chronicles sounds needed for the game
     */
    preloadEmberThroneSounds: function () {
      console.log('Preloading essential sounds for Ember Throne Chronicles...');
      
      // Load critical UI sounds first
      this.preloadSound('button_click', this.soundAssetMap.sfx.button_click);
      this.preloadSound('page_turn', this.soundAssetMap.sfx.page_turn);
      
      // Load main themes
      this.preloadSound('title_theme', this.soundAssetMap.music.title_theme, { isMusic: true, loop: true });
      this.preloadSound('village_theme', this.soundAssetMap.music.village_theme, { isMusic: true, loop: true });
      
      // Load intro narration
      this.preloadSound('intro_narration', this.soundAssetMap.voice.intro_narration, { isVoice: true });
      
      console.log('Essential sounds preloaded.');
    },
    
    /**
     * Stop a playing sound by its instance ID
     * @param {string} instanceId - Instance ID of the sound to stop
     * @param {object} options - Options for stopping the sound
     */
    stopSound: function (instanceId, options) {
      options = options || {};
      
      var sound = this.currentSounds[instanceId];
      if (!sound) return;
      
      try {
        // If fadeOut is specified, fade out the sound
        if (options.fadeOut) {
          this.fadeSoundOut(instanceId, options.fadeOut);
          return;
        }
        
        // Otherwise stop immediately
        sound.source.stop();
        delete this.currentSounds[instanceId];
        
        if (sound.isMusic && this.currentMusic && this.currentMusic.source === sound.source) {
          this.currentMusic = null;
        }
      } catch (e) {
        console.warn('Error stopping sound:', e);
        delete this.currentSounds[instanceId];
      }
    },
    
    /**
     * Stop the currently playing music
     * @param {object} options - Options for stopping the music
     */
    stopMusic: function (options) {
      if (!this.currentMusic) return;
      
      try {
        // Find the instance ID
        var instanceId = null;
        for (var id in this.currentSounds) {
          if (this.currentSounds[id] === this.currentMusic) {
            instanceId = id;
            break;
          }
        }
        
        if (instanceId) {
          this.stopSound(instanceId, options);
        } else {
          this.currentMusic.source.stop();
          this.currentMusic = null;
        }
      } catch (e) {
        console.warn('Error stopping music:', e);
        this.currentMusic = null;
      }
    },
    
    /**
     * Set the volume of a specific sound
     * @param {string} instanceId - Instance ID of the sound
     * @param {number} volume - New volume level (0.0 to 1.0)
     */
    setSoundVolume: function (instanceId, volume) {
      var sound = this.currentSounds[instanceId];
      if (!sound) return;
      
      // Determine the base type volume
      var baseVolume = sound.isMusic ? this.musicVolume :
                      sound.isVoice ? this.voiceVolume :
                      sound.isAmbient ? this.ambientVolume : 
                      this.soundVolume;
      
      // Apply the master volume
      volume = Math.max(0, Math.min(1, volume)) * this.masterVolume * baseVolume;
      sound.gainNode.gain.value = volume;
    },
    
    /**
     * Fade out a sound over the specified duration
     * @param {string} instanceId - Instance ID of the sound
     * @param {number} duration - Duration of the fade in seconds
     */
    fadeSoundOut: function (instanceId, duration) {
      var sound = this.currentSounds[instanceId];
      if (!sound) return;
      
      try {
        var fadeEndTime = this.audioContext.currentTime + duration;
        sound.gainNode.gain.linearRampToValueAtTime(0, fadeEndTime);
        
        // Schedule stopping the sound at the end of the fade
        setTimeout(function () {
          if (this.currentSounds[instanceId]) {
            sound.source.stop();
            delete this.currentSounds[instanceId];
            
            if (sound.isMusic && this.currentMusic && this.currentMusic.source === sound.source) {
              this.currentMusic = null;
            }
          }
        }.bind(this), duration * 1000);
      } catch (e) {
        console.warn('Error fading out sound:', e);
        this.stopSound(instanceId);
      }
    },
    
    /**
     * Set the master volume for all sounds
     * @param {number} volume - New master volume (0.0 to 1.0)
     */
    setMasterVolume: function (volume) {
      this.masterVolume = Math.max(0, Math.min(1, volume));
      
      // Update all currently playing sounds
      for (var id in this.currentSounds) {
        var sound = this.currentSounds[id];
        var baseVolume = sound.isMusic ? this.musicVolume :
                        sound.isVoice ? this.voiceVolume :
                        sound.isAmbient ? this.ambientVolume : 
                        this.soundVolume;
        
        sound.gainNode.gain.value = this.masterVolume * baseVolume;
      }
      
      this.saveVolumeSettings();
    },
    
    /**
     * Set the music volume
     * @param {number} volume - New music volume (0.0 to 1.0)
     */
    setMusicVolume: function (volume) {
      this.musicVolume = Math.max(0, Math.min(1, volume));
      
      // Update all currently playing music
      for (var id in this.currentSounds) {
        var sound = this.currentSounds[id];
        if (sound.isMusic) {
          sound.gainNode.gain.value = this.masterVolume * this.musicVolume;
        }
      }
      
      this.saveVolumeSettings();
    },
    
    /**
     * Set the sound effects volume
     * @param {number} volume - New sound effects volume (0.0 to 1.0)
     */
    setSoundEffectsVolume: function (volume) {
      this.soundVolume = Math.max(0, Math.min(1, volume));
      
      // Update all currently playing sound effects
      for (var id in this.currentSounds) {
        var sound = this.currentSounds[id];
        if (!sound.isMusic && !sound.isVoice && !sound.isAmbient) {
          sound.gainNode.gain.value = this.masterVolume * this.soundVolume;
        }
      }
      
      this.saveVolumeSettings();
    },
    
    /**
     * Set the voice narration volume
     * @param {number} volume - New voice volume (0.0 to 1.0)
     */
    setVoiceVolume: function (volume) {
      this.voiceVolume = Math.max(0, Math.min(1, volume));
      
      // Update all currently playing voice narration
      for (var id in this.currentSounds) {
        var sound = this.currentSounds[id];
        if (sound.isVoice) {
          sound.gainNode.gain.value = this.masterVolume * this.voiceVolume;
        }
      }
      
      this.saveVolumeSettings();
    },
    
    /**
     * Set the ambient sound volume
     * @param {number} volume - New ambient volume (0.0 to 1.0)
     */
    setAmbientVolume: function (volume) {
      this.ambientVolume = Math.max(0, Math.min(1, volume));
      
      // Update all currently playing ambient sounds
      for (var id in this.currentSounds) {
        var sound = this.currentSounds[id];
        if (sound.isAmbient) {
          sound.gainNode.gain.value = this.masterVolume * this.ambientVolume;
        }
      }
      
      this.saveVolumeSettings();
    },
    
    /**
     * Mute or unmute all sound
     * @param {boolean} mute - Whether to mute (true) or unmute (false)
     */
    setMute: function (mute) {
      if (mute) {
        this._savedMasterVolume = this.masterVolume;
        this.setMasterVolume(0);
      } else if (this._savedMasterVolume !== undefined) {
        this.setMasterVolume(this._savedMasterVolume);
      }
    },
    
    /**
     * Preload multiple sounds at once
     * @param {Array} sounds - Array of sound objects with id and url properties
     * @param {Function} onProgress - Callback for progress updates
     * @param {Function} onComplete - Callback when all sounds are loaded
     */
    preloadSounds: function (sounds, onProgress, onComplete) {
      var total = sounds.length;
      var loaded = 0;
      var errors = 0;
      
      if (total === 0) {
        if (onComplete) onComplete([], []);
        return;
      }
      
      var loadedSounds = [];
      var failedSounds = [];
      
      var checkComplete = function () {
        if (loaded + errors === total && onComplete) {
          onComplete(loadedSounds, failedSounds);
        }
      };
      
      sounds.forEach(function (sound) {
        this.preloadSound(sound.id, sound.url, sound.options)
          .then(function (loadedSound) {
            loaded++;
            loadedSounds.push(sound.id);
            
            if (onProgress) {
              onProgress(loaded / total, sound.id, null);
            }
            
            checkComplete();
          })
          .catch(function (error) {
            errors++;
            failedSounds.push({ id: sound.id, error: error });
            
            if (onProgress) {
              onProgress(loaded / total, sound.id, error);
            }
            
            checkComplete();
          });
      }.bind(this));
    },
    
    /**
     * Remove a sound from the loaded sounds
     * @param {string} id - ID of the sound to remove
     */
    removeSound: function (id) {
      delete this.loadedSounds[id];
      console.log('Removed sound:', id);
    },
    
    /**
     * Check if a sound is loaded
     * @param {string} id - ID of the sound to check
     * @returns {boolean} - True if the sound is loaded
     */
    isSoundLoaded: function (id) {
      return !!this.loadedSounds[id];
    },
    
    /**
     * Get the duration of a loaded sound
     * @param {string} id - ID of the sound
     * @returns {number} - Duration in seconds or 0 if not loaded
     */
    getSoundDuration: function (id) {
      if (!this.loadedSounds[id]) return 0;
      return this.loadedSounds[id].buffer.duration;
    }
  };
  
  // Initialize the sound manager
  GameX.SoundManager.initialize();
  
  // If Twine/Harlowe is available, register with it
  if (window.setup && window.setup.register) {
    window.setup.register('soundManager', GameX.SoundManager);
  }
  
})(window.GameX = window.GameX || {}); 