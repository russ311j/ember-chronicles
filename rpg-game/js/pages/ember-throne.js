/**
 * Ember Throne Chronicles - Main Game Module
 * Implements the interactive narrative based on ember-throne-narrative.md
 */

(function() {
  // Create GameX namespace if it doesn't exist
  window.GameX = window.GameX || {};
  
  // Define the Ember Throne pages namespace
  GameX.EmberThrone = {
    // Current state of the game
    state: {
      currentPage: 1,
      visitedPages: [],
      inventory: [],
      playerChoices: {}
    },
    
    // Initialize the Ember Throne module
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('Container not found:', containerId);
        return false;
      }
      
      // Load character data from session storage
      const characterData = sessionStorage.getItem('current-character');
      if (!characterData) {
        console.error('No character data found');
        window.location.href = 'index.html';
        return false;
      }
      
      try {
        this.character = JSON.parse(characterData);
        console.log('Loaded character:', this.character);
      } catch (error) {
        console.error('Error parsing character data:', error);
        window.location.href = 'index.html';
        return false;
      }
      
      // Initialize UI elements
      this.initializeUI();
      
      // Load any saved game
      this.loadGame();
      
      // Display the current page
      this.displayPage(this.state.currentPage);
      
      return true;
    },
    
    // Initialize UI elements and event listeners
    initializeUI: function() {
      // Initialize title screen buttons
      const startGameBtn = document.getElementById('start-game');
      const loadGameBtn = document.getElementById('load-game');
      const backToMenuBtn = document.getElementById('back-to-menu');
      
      if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
          document.getElementById('title-screen').classList.remove('active');
          document.getElementById('story-screen').classList.add('active');
          this.init('story');
        });
      }
      
      if (loadGameBtn) {
        loadGameBtn.addEventListener('click', () => {
          document.getElementById('title-screen').classList.remove('active');
          document.getElementById('story-screen').classList.add('active');
          this.loadGame();
          this.init('story');
        });
      }
      
      if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
          window.location.href = 'index.html';
        });
      }
      
      // Initialize game control buttons
      const menuButton = document.getElementById('menu-button');
      const saveButton = document.getElementById('save-button');
      const soundToggle = document.getElementById('sound-toggle');
      
      if (menuButton) {
        menuButton.addEventListener('click', () => {
          document.getElementById('game-menu').style.display = 'flex';
        });
      }
      
      if (saveButton) {
        saveButton.addEventListener('click', () => {
          this.saveGame();
          this.showSaveConfirmation();
        });
      }
      
      if (soundToggle) {
        soundToggle.addEventListener('click', () => {
          this.toggleSound(soundToggle);
        });
      }
      
      // Initialize game menu buttons
      this.initializeGameMenu();
    },
    
    // Initialize game menu buttons
    initializeGameMenu: function() {
      const gameMenu = document.getElementById('game-menu');
      const resumeBtn = document.getElementById('resume-game');
      const saveGameBtn = document.getElementById('save-game');
      const loadSavedGameBtn = document.getElementById('load-saved-game');
      const exitToTitleBtn = document.getElementById('exit-to-title');
      const exitToMainBtn = document.getElementById('exit-to-main');
      
      if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
          gameMenu.style.display = 'none';
        });
      }
      
      if (saveGameBtn) {
        saveGameBtn.addEventListener('click', () => {
          this.saveGame();
          this.showSaveConfirmation(saveGameBtn);
        });
      }
      
      if (loadSavedGameBtn) {
        loadSavedGameBtn.addEventListener('click', () => {
          this.loadGame();
          this.displayPage(this.state.currentPage);
          gameMenu.style.display = 'none';
        });
      }
      
      if (exitToTitleBtn) {
        exitToTitleBtn.addEventListener('click', () => {
          gameMenu.style.display = 'none';
          document.getElementById('story-screen').classList.remove('active');
          document.getElementById('title-screen').classList.add('active');
        });
      }
      
      if (exitToMainBtn) {
        exitToMainBtn.addEventListener('click', () => {
          window.location.href = 'index.html';
        });
      }
      
      // Close menu when clicking outside
      if (gameMenu) {
        gameMenu.addEventListener('click', (event) => {
          if (event.target === gameMenu) {
            gameMenu.style.display = 'none';
          }
        });
      }
    },
    
    // Show save confirmation
    showSaveConfirmation: function(button = null) {
      const confirmation = document.createElement('div');
      confirmation.className = 'save-confirmation';
      confirmation.textContent = 'Game Saved';
      document.body.appendChild(confirmation);
      
      setTimeout(() => {
        confirmation.style.opacity = '0';
        setTimeout(() => {
          confirmation.remove();
        }, 500);
      }, 1500);
      
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Game Saved!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      }
    },
    
    // Toggle sound
    toggleSound: function(soundToggle) {
      if (soundToggle.textContent === 'Sound: On') {
        soundToggle.textContent = 'Sound: Off';
        if (GameX.SoundManager) {
          GameX.SoundManager.setMasterVolume(0);
        }
      } else {
        soundToggle.textContent = 'Sound: On';
        if (GameX.SoundManager) {
          GameX.SoundManager.setMasterVolume(1);
        }
      }
    },
    
    // Load game state from localStorage
    loadGame: function() {
      const savedGame = localStorage.getItem('ember-throne-save');
      if (savedGame) {
        try {
          const saveData = JSON.parse(savedGame);
          this.state = saveData;
          console.log('Game loaded successfully');
        } catch (error) {
          console.error('Error loading saved game:', error);
        }
      }
    },
    
    // Save current game state to localStorage
    saveGame: function() {
      try {
        localStorage.setItem('ember-throne-save', JSON.stringify(this.state));
        console.log('Game saved successfully');
      } catch (error) {
        console.error('Error saving game:', error);
      }
    },
    
    // Display a specific page by its number
    displayPage: function(pageNumber) {
      const pageData = this.pages[pageNumber];
      if (!pageData) {
        console.error('Page not found:', pageNumber);
        return;
      }
      
      // Record this page as visited
      if (!this.state.visitedPages.includes(pageNumber)) {
        this.state.visitedPages.push(pageNumber);
      }
      
      // Update current page
      this.state.currentPage = pageNumber;
      
      // Create page elements
      const pageContainer = document.createElement('div');
      pageContainer.className = 'ember-throne-page';
      
      // Add illustration
      const illustration = document.createElement('div');
      illustration.className = 'illustration-container';
      const img = document.createElement('img');
      img.src = `media/images/generated/magichour/page_${pageNumber}.png`;
      img.alt = pageData.title;
      img.onerror = function() {
        this.src = 'media/images/placeholder.svg';
      };
      illustration.appendChild(img);
      
      // Add content
      const content = document.createElement('div');
      content.className = 'content-container';
      
      // Add title
      const title = document.createElement('h2');
      title.className = 'page-title';
      title.textContent = pageData.title;
      content.appendChild(title);
      
      // Add narrative text
      const narrative = document.createElement('div');
      narrative.className = 'narrative-text';
      narrative.innerHTML = pageData.content.replace(/\n\n/g, '<br><br>');
      content.appendChild(narrative);
      
      // Add choices if available
      if (pageData.choices && pageData.choices.length) {
        const choices = document.createElement('div');
        choices.className = 'choices-container';
        
        pageData.choices.forEach(choice => {
          const button = document.createElement('button');
          button.className = 'choice-button';
          button.textContent = choice.text;
          button.addEventListener('click', () => {
            this.displayPage(choice.nextPage);
          });
          choices.appendChild(button);
        });
        
        content.appendChild(choices);
      }
      
      // Clear and append to container
      this.container.innerHTML = '';
      pageContainer.appendChild(illustration);
      pageContainer.appendChild(content);
      this.container.appendChild(pageContainer);
      
      // Save game after page change
      this.saveGame();
    },
    
    // Page definitions based on ember-throne-narrative.md
    pages: {
      // Core Page 1 – A Mysterious Invitation
      "1": {
        title: "A Mysterious Invitation",
        content: "You sit in the warm, humble parlor of your modest home in Brindleford as twilight settles over the village. The steady rhythm of everyday life is suddenly interrupted by a sharp knock at your door. Opening it, you see a hooded figure standing in the dim light, whose presence seems to carry secrets from another world. Without a word, the stranger presses a heavy, weathered envelope into your hands and vanishes into the night. The envelope's wax seal bears the image of a burning phoenix entwined with a serpent, and as you run your fingers over it, you sense a quiet, magical energy pulsing through the aged parchment.\n\nIn that moment, a mix of trepidation and excitement fills you. The mysterious envelope, its surface alive with subtle, shifting symbols, hints at a destiny far beyond the confines of your familiar life. A promise of ancient power and hidden knowledge beckons from within, stirring something deep inside you—a call to adventure that cannot be ignored.\n\nWhat will you do with this enigmatic missive?",
        choices: [
          { text: "Accept the invitation", nextPage: "2" },
          { text: "Investigate the letter further", nextPage: "3" },
          { text: "Seek counsel from the village elder", nextPage: "4" }
        ]
      },
      
      // Branch Page 2 – Bold Acceptance
      "2": {
        title: "Bold Acceptance",
        content: "You choose to trust the pull of destiny. With firm resolve, you break the wax seal and carefully unfold the parchment. As you read the elegantly written words, a thrill courses through your veins—the letter speaks of an ancient relic known as the Ember Throne, a source of immense power and peril. The promise of secrets and the chance to alter fate ignite a fire in your heart. Without hesitation, you decide that you must set out at once.\n\nGathering a few provisions and bidding a silent farewell to the life you've known, you step out into the night. The road before you is shrouded in mystery, and every step feels like a step toward your true destiny.",
        choices: [
          { text: "Continue your journey", nextPage: "5" }
        ]
      },
      
      // Branch Page 3 – Inquisitive Investigation
      "3": {
        title: "Inquisitive Investigation",
        content: "Unsure if this is a simple trick of fate or a genuine call to adventure, you find a quiet corner of your home to examine the letter more closely. Carefully, you study the intricate script and the enigmatic symbols that adorn the parchment. The delicate, faded ink seems to whisper hints of forgotten lore and ancient magic, urging you to decipher its secret message.\n\nAs you pore over every line, you begin to unravel a cryptic warning—one that speaks of looming dangers and the necessity for bold actions. The letter hints that only those with courage and keen insight may harness the relic's true power. Though uncertainty tugs at you, the promise of discovery stokes your curiosity.",
        choices: [
          { text: "Continue your journey", nextPage: "5" }
        ]
      },
      
      // Branch Page 4 – Seeking Counsel
      "4": {
        title: "Seeking Counsel",
        content: "Believing that wisdom should guide such monumental choices, you set out to find the village elder—a man reputed for his deep knowledge of ancient legends and mystical omens. In his cozy cottage, scented with incense and the aroma of herbal remedies, the elder listens intently as you describe the mysterious letter and its otherworldly seal. His weathered face grew somber as he recounts tales of the Ember Throne, a relic that has both blessed and cursed those who dared seek it.\n\nHis measured words caution you about the perils ahead, yet they also kindle a flame of hope. He speaks of secret passages, hidden allies, and the necessity of a courageous heart. His advice, laced with both warning and encouragement, convinces you that you must embrace the call to adventure.",
        choices: [
          { text: "Continue your journey", nextPage: "5" }
        ]
      },
      
      // Core Page 5 – Preparation for Journey
      "5": {
        title: "Preparation for Journey",
        content: "Now resolved, you gather your meager belongings and step away from the familiar comforts of Brindleford. The night air is crisp as you embark on the path that leads toward destiny. The road ahead forks before you, offering different routes through a realm both enchanting and treacherous. You pause, contemplating your next move, aware that every step will shape your future.\n\nThe possibilities weigh before you: one path winds into a dark forest rumored to be alive with ancient magic, another skirts along a rocky trail with the open sky above, and a third suggests a brief respite—a moment to rest and gather strength before venturing further into the unknown.",
        choices: [
          { text: "Take the Dark Forest Path", nextPage: "6" },
          { text: "Choose the Rocky Trail", nextPage: "7" },
          { text: "Stop and camp for a while", nextPage: "8" }
        ]
      },
      
      // Branch Page 6 – The Dark Forest Path
      "6": {
        title: "The Dark Forest Path",
        content: "Opting for mystery over certainty, you set your course into the depths of the dark forest. The canopy above is so thick that only slivers of moonlight pierce through, casting eerie, shifting shadows upon the forest floor. Every sound—the rustling of leaves, the distant cry of nocturnal creatures—echoes like a secret, urging you onward while simultaneously warning of hidden perils.\n\nThe forest is alive with ancient whispers and magic, and as you press deeper, you sense that the very air vibrates with possibilities. The path seems to curve and twist on its own, as if the forest itself wishes to test your resolve. Despite the ominous atmosphere, an inexplicable thrill propels you forward, driven by the promise of discovering long-lost secrets.",
        choices: [
          { text: "Continue onward", nextPage: "9" }
        ]
      },
      
      // Branch Page 7 – The Rocky Trail
      "7": {
        title: "The Rocky Trail",
        content: "Deciding that the open clarity of a rocky trail offers a measure of security, you choose the path along the craggy outcrop. The trail is bathed in the soft glow of a full moon, and the rugged landscape stretches before you, revealing hints of ancient ruins and forgotten places. The steady sound of your footsteps on stone provides a reassuring rhythm amid the silence of the night.\n\nThough the rocky path is less cloaked in mystery than the dark forest, it is not without its challenges. Occasional gusts of wind and unexpected echoes from the valleys below remind you that even here, danger lurks in the shadows. You remain vigilant, every step a careful negotiation between caution and determination.",
        choices: [
          { text: "Continue onward", nextPage: "9" }
        ]
      },
      
      // Branch Page 8 – A Moment of Rest
      "8": {
        title: "A Moment of Rest",
        content: "Choosing prudence over haste, you decide to set up camp for the night. In a small clearing surrounded by ancient trees, you build a modest fire that casts dancing shadows over your resting place. The crackle of the flames and the whisper of the wind offer a brief respite from the uncertainties of the journey. As you rest, you reflect on the cryptic letter and the promise of the Ember Throne, your thoughts swirling like the embers in the fire.\n\nThe pause gives you time to regain your strength and to listen to the subtle sounds of nature—the distant calls of nocturnal creatures, the rustle of leaves, and the quiet murmur of the night. In this moment of tranquility, you feel your resolve solidifying. The time to move forward is near.",
        choices: [
          { text: "Continue onward", nextPage: "9" }
        ]
      },
      
      // Core Page 9 – Arrival at the Dungeon Entrance
      "9": {
        title: "Arrival at the Dungeon Entrance",
        content: "After a long and arduous journey, you finally stand before the colossal entrance of an ancient dungeon. The structure looms before you, its massive arched gateway carved with eldritch runes and flanked by imposing statues of long-forgotten deities. A palpable energy radiates from the stone—a mix of awe and dread that sends shivers down your spine.\n\nThe air around the entrance is thick with the weight of history, and the silence is broken only by the soft echo of distant memories. Here, the legends of the Ember Throne become real, and the promise of destiny hangs in the balance. Yet, as you approach, you know that your path forward is riddled with choices that will test your mettle.",
        choices: [
          { text: "Force the gate", nextPage: "10" },
          { text: "Search for a hidden passage", nextPage: "11" },
          { text: "Attempt to disarm the traps", nextPage: "12" }
        ]
      },
      
      // Branch Page 10 – Forcing the Gate
      "10": {
        title: "Forcing the Gate",
        content: "Determined to seize your destiny, you decide to force your way through the enchanted barrier. Summoning all your strength, you push against the massive stone, and the impact reverberates through the air. Sparks fly as ancient mechanisms awaken, and you feel the surge of raw magic reacting to your boldness. The strain of the effort is immense, yet your resolve does not waver.\n\nIn that fierce moment, as the stone trembles under your might, you realize that such audacity might trigger hidden defenses. But the taste of victory—and the promise of the Ember Throne—propels you forward, regardless of the peril.",
        choices: [
          { text: "Enter the dungeon", nextPage: "13" }
        ]
      },
      
      // Branch Page 11 – Searching for a Hidden Passage
      "11": {
        title: "Searching for a Hidden Passage",
        content: "With caution as your guide, you decide to inspect the perimeter of the dungeon entrance for a secret, less conspicuous entry. Your eyes scour the ancient stonework, and soon you notice a subtle seam in the wall—almost imperceptible among the intricate carvings. Following this faint hint, you uncover a narrow, concealed passage that promises a safer, albeit uncertain, path inside.\n\nThe discovery fills you with a quiet confidence; it seems that the dungeon itself has chosen to reveal a hidden route for those with patience and perseverance. The cool air of the secret corridor beckons you onward.",
        choices: [
          { text: "Enter the hidden passage", nextPage: "13" }
        ]
      },
      
      // Branch Page 12 – Disarming the Traps
      "12": {
        title: "Disarming the Traps",
        content: "Ever mindful of the dangers that lurk in ancient magic, you decide to study the runes and mechanisms guarding the dungeon entrance. With steady hands and a keen mind, you work to disarm the traps, carefully neutralizing the hidden enchantments that threaten the unwary. The process is delicate and fraught with risk, yet your determination carries you through each intricate step.\n\nThe successful deactivation of these arcane defenses grants you safe passage. Though the work leaves you with a lingering sense of the dungeon's ancient power, it also reaffirms your capability to overcome the challenges ahead.",
        choices: [
          { text: "Enter the dungeon", nextPage: "13" }
        ]
      },
      
      // Core Page 13 – Inside the Dungeon
      "13": {
        title: "Inside the Dungeon",
        content: "The darkness of the dungeon envelops you as you venture further from the light of the outside world. Corridors twist and wind with maddening complexity, their walls lined with cryptic inscriptions that seem to whisper forgotten secrets. The air is cool and damp, carrying the scent of ancient stone and the echoes of past adventurers. Every step forward feels like a journey into the unknown—a test of both courage and resolve.\n\nThe dungeon is alive with mystery, its every corner hinting at both hidden dangers and untold wonders. Though the path is fraught with uncertainty, the promise of discovering the Ember Throne drives you deeper into its labyrinthine heart.",
        choices: [
          { text: "Take the left corridor", nextPage: "14" },
          { text: "Choose the right corridor", nextPage: "15" },
          { text: "Investigate unusual sounds", nextPage: "16" }
        ]
      },
      
      // Branch Page 14 – The Left Corridor
      "14": {
        title: "The Left Corridor",
        content: "You turn left, drawn by the faint glow of enchanted torches that line the wall. The corridor is narrow, and the light casts shifting patterns across the ancient stone. With every step, you sense that this path holds secrets waiting to be revealed—an intimate glimpse into the heart of the dungeon. The atmosphere is one of quiet intensity, as if the very walls are watching your every move.\n\nThe gentle hum of magic in the air fills you with both wonder and caution. It is a subtle reminder that in this place, even the light can hide danger. Yet, you press on, determined to uncover what lies beyond the veil of shadow.",
        choices: [
          { text: "Continue forward", nextPage: "17" }
        ]
      },
      
      // Branch Page 15 – The Right Corridor
      "15": {
        title: "The Right Corridor",
        content: "You choose the right corridor, where the passage seems wider and the echoes of your footsteps resonate with a deeper, more ominous cadence. The corridor is shrouded in darkness, and the sporadic, distant sounds of dripping water and rustling shadows create an unsettling symphony. Here, the path is less defined, its twists and turns guarded by the uncertainty of what may lie hidden just out of sight.\n\nEvery step you take in this dim passage heightens your senses, and you remain ever-vigilant for any sign of danger. The thrill of the unknown mingles with a lingering sense of foreboding as you navigate this eerie route.",
        choices: [
          { text: "Continue forward", nextPage: "17" }
        ]
      },
      
      // Branch Page 16 – Investigating Unusual Sounds
      "16": {
        title: "Investigating Unusual Sounds",
        content: "Intrigued by a series of soft, almost musical notes emanating from a nearby passage, you divert from the well-trodden corridors to investigate. The sounds, gentle and ethereal, stir a deep curiosity within you. They seem to promise hidden wonders or perhaps untold secrets, woven into the very fabric of the dungeon.\n\nAs you follow the haunting melody, the air grows thick with the fragrance of ancient incense and the faint shimmer of magic. The passage opens into a small alcove where the echoes of the mysterious sounds reverberate against stone, leaving you with a sense of both awe and anticipation.",
        choices: [
          { text: "Continue forward", nextPage: "17" }
        ]
      },
      
      // Core Page 17 – Encounter with the Guardian
      "17": {
        title: "Encounter with the Guardian",
        content: "Deep within the dungeon, you enter a grand chamber where the air crackles with primordial energy. Dominating this vast space is an ancient guardian—a towering figure carved from living stone and animated by the magic of ages past. The guardian's eyes burn with a fierce light, and its presence fills you with both dread and reverence. Here, the fate of your quest is decided in the clash between raw power and unyielding will.\n\nThe chamber is a testament to forgotten grandeur: towering columns etched with cryptic inscriptions and the interplay of light and shadow that creates an almost mystical aura. The guardian stands as the final sentinel before the secret of the Ember Throne is revealed, and you know that a confrontation is inevitable.",
        choices: [
          { text: "Launch an immediate attack", nextPage: "18" },
          { text: "Attempt to parley with the guardian", nextPage: "19" },
          { text: "Scout for its weaknesses", nextPage: "20" }
        ]
      },
      
      // Branch Page 18 – The Attack
      "18": {
        title: "The Attack",
        content: "Without hesitation, you draw your weapon and charge at the mighty guardian. The clash is immediate and ferocious, each strike resonating with the fury of your determination. The guardian's stony form proves both formidable and awe-inspiring as you exchange blows, the force of your combat mingling with the ancient magic that pulses through the chamber.\n\nThe battle is a blur of intense moments—each parry, each counter, a testament to your valor and skill. Even as the guardian's power seems overwhelming, you press forward, fueled by the certainty that your destiny lies beyond this trial. Your heart races, and every fiber of your being is focused on the challenge at hand.",
        choices: [
          { text: "Continue forward", nextPage: "21" }
        ]
      },
      
      // Branch Page 19 – Attempting to Parley
      "19": {
        title: "Attempting to Parley",
        content: "Rather than meeting the guardian with the clash of steel, you choose the path of diplomacy. Stepping forward with both respect and determination, you speak to the ancient sentinel, seeking to understand its purpose and perhaps forge a temporary alliance. Your voice echoes through the chamber as you offer words of peace and a plea for understanding, appealing to the lingering spirit of wisdom within the guardian.\n\nThe guardian's stony features softened ever so slightly as if moved by your courage and honesty. In the charged silence that followed, the tension shifted from imminent violence to a careful, tentative dialogue—a delicate balance between honor and necessity.",
        choices: [
          { text: "Continue forward", nextPage: "21" }
        ]
      },
      
      // Branch Page 20 – Scouting for Weaknesses
      "20": {
        title: "Scouting for Weaknesses",
        content: "Cautious and calculating, you decide to study the guardian from a safe distance. Moving stealthily, you observe every aspect of its ancient form—the subtle movements of its stony limbs, the flicker of magic in its eyes, and the resonant hum of its presence. Your keen observation revealed hints of vulnerabilities—a slight tremor in its guarded stance, a fleeting gap in its defenses.\n\nArmed with this knowledge, you prepared to exploit these weaknesses. Although the confrontation looms, your measured approach offered hope for victory without needless bloodshed. You committed these observations to memory, ready to use them at the decisive moment.",
        choices: [
          { text: "Continue forward", nextPage: "21" }
        ]
      },
      
      // Core Page 21 – Revelation of the Ember Throne
      "21": {
        title: "Revelation of the Ember Throne",
        content: "Having overcome the guardian—whether by battle, diplomacy, or cunning—you finally stood before the Ember Throne. The relic is a vision of both beauty and dread: a magnificent seat of power carved from a material that shimmers with an otherworldly glow, etched with symbols that speak of ancient wisdom and untold peril. The very air vibrated with a raw, elemental energy as you approached this fabled object.\n\nBefore you, the throne seemed to pulse with a life of its own, inviting you to grasp its power—a power that can heal a broken realm or plunge it into darkness. The weight of your journey pressed upon you; every choice, every hardship, has led to this singular moment where destiny and free will collided.",
        choices: [
          { text: "Use the throne to heal the realm", nextPage: "22" },
          { text: "Harness its dark energy for your ambition", nextPage: "23" },
          { text: "Destroy the throne to end its corrupting influence", nextPage: "24" }
        ]
      },
      
      // Branch Page 22 – Healing the Realm
      "22": {
        title: "Healing the Realm",
        content: "You placed your hands upon the Ember Throne, letting its benevolent energy flow through you. A warmth spread from your fingertips, coursing through your body and filling you with a sense of renewal and hope. The relic's light intensified, washing over the chamber and beyond, promising to mend the fractures of a troubled realm. In that luminous moment, you envisioned a future where Eldoria thrived in peace and prosperity.\n\nThe power of healing is both humbling and empowering, a gift that came with a solemn responsibility. Your heart swelled with the promise of redemption and the chance to restore what has been broken.",
        choices: [
          { text: "See the consequences of your choice", nextPage: "25" }
        ]
      },
      
      // Branch Page 23 – Dark Ambition
      "23": {
        title: "Dark Ambition",
        content: "The allure of power was irresistible, and you decided to harness the throne's dark energy to forge a destiny of your own design. As you touched the relic, a surge of shadowy power coursed through you, infusing your being with a potent mixture of strength and malice. The Ember Throne's glow shifted to a deep, foreboding red, and you felt the seductive pull of ambition overwhelming all else.\n\nThis power promised dominion, but at a cost—an erosion of innocence and the risk of unleashing chaos upon Eldoria. The dark energy whispered of greatness, yet it left you to wonder if you would become the tyrant you once feared.",
        choices: [
          { text: "See the consequences of your choice", nextPage: "25" }
        ]
      },
      
      // Branch Page 24 – The Destruction
      "24": {
        title: "The Destruction",
        content: "In a moment of desperate clarity, you decided that such perilous power must be destroyed. With a resolute cry, you shattered the Ember Throne, sending fragments of the ancient relic scattering across the chamber. The act was both liberating and heartbreaking—by ending the relic's influence, you closed a chapter of dangerous potential, but also forego the chance to mend a fractured realm.\n\nThe destruction reverberated through the very fabric of Eldoria, and you stood amidst the ruins of power with a heavy heart, wondering if this sacrifice was the only path to true freedom.",
        choices: [
          { text: "See the consequences of your choice", nextPage: "25" }
        ]
      },
      
      // Core Page 25 – Epilogue & Consequences
      "25": {
        title: "Epilogue & Consequences",
        content: "The passage of time revealed the full weight of your choices. In the aftermath, Eldoria transformed according to the destiny you have carved. If you healed the realm, you saw villages revived, fields flourishing, and people united under a banner of hope. If you embraced dark ambition, whispers of tyranny and fear pervaded the land, and your legacy was etched in both power and sorrow. If you destroyed the throne, a bittersweet silence prevailed—a realm freed from the curse of unchecked power, yet haunted by what might have been.\n\nStanding on a high precipice overlooking a transformed Eldoria, you reflected on the journey—a tale of bravery, sacrifice, and the eternal interplay of light and darkness. Your actions had woven themselves into the very fabric of the realm's history, ensuring that your story, in all its complexity, would be remembered for generations to come.",
        choices: [
          { text: "Play Again", nextPage: "1" }
        ]
      }
    }
  };
  
  // Initialize when the DOM is loaded if the story container exists
  document.addEventListener('DOMContentLoaded', function() {
    const storyContainer = document.getElementById('story');
    if (storyContainer) {
      GameX.EmberThrone.init('story');
    }
  });
})(); 