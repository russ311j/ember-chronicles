/**
 * Story System Module for Ember Throne
 * Handles narrative content, story progression, and player choices
 */

(function() {
  // Create a namespace for the story system
  window.GameX = window.GameX || {};
  
  // Story system
  GameX.StorySystem = {
    // Current story state
    state: {
      currentAct: 1,
      currentPage: 1,
      playerChoices: {},
      visitedPages: [],
      flags: {}
    },
    
    // Initialize the story system
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('Story container not found');
        return;
      }
      
      // Load story data
      this.loadStoryData();
      
      // Check URL parameter for page number
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      
      // Display the requested page or default to first page
      if (pageParam) {
        this.displayPage(pageParam);
      } else {
        this.displayPage('1');
      }
      
      return this;
    },
    
    // Load story data from a source
    loadStoryData: function() {
      // This would typically load from an external JSON file
      // Hard-coded here for simplicity
      this.storyData = {
        // Act 1
        '1': {
          title: 'A Mysterious Invitation',
          narrative: "You sit in the warm, humble parlor of your modest home in Brindleford as twilight settles over the village. The steady rhythm of everyday life is suddenly interrupted by a sharp knock at your door. Opening it, you see a hooded figure standing in the dim light, whose presence seems to carry secrets from another world. Without a word, the stranger presses a heavy, weathered envelope into your hands and vanishes into the night. The envelope's wax seal bears the image of a burning phoenix entwined with a serpent, and as you run your fingers over it, you sense a quiet, magical energy pulsing through the aged parchment.\n\nIn that moment, a mix of trepidation and excitement fills you. The mysterious envelope, its surface alive with subtle, shifting symbols, hints at a destiny far beyond the confines of your familiar life. A promise of ancient power and hidden knowledge beckons from within, stirring something deep inside you—a call to adventure that cannot be ignored.",
          image: 'media/images/generated/page_1.png',
          choices: [
            { id: 'accept', text: 'Accept the invitation', target: '2' },
            { id: 'investigate', text: 'Investigate the letter further', target: '3' },
            { id: 'seek_counsel', text: 'Seek counsel from the village elder', target: '4' }
          ]
        },
        '2': {
          title: 'Bold Acceptance',
          narrative: "You choose to trust the pull of destiny. With firm resolve, you break the wax seal and carefully unfold the parchment. As you read the elegantly written words, a thrill courses through your veins—the letter speaks of an ancient relic known as the Ember Throne, a source of immense power and peril. The promise of secrets and the chance to alter fate ignite a fire in your heart. Without hesitation, you decide that you must set out at once.\n\nGathering a few provisions and bidding a silent farewell to the life you've known, you step out into the night. The road before you is shrouded in mystery, and every step feels like a step toward your true destiny.",
          image: 'media/images/generated/page_2.png',
          choices: [
            { id: 'continue', text: 'Continue your journey', target: '5' }
          ]
        },
        '3': {
          title: 'Inquisitive Investigation',
          narrative: "Unsure if this is a simple trick of fate or a genuine call to adventure, you find a quiet corner of your home to examine the letter more closely. Carefully, you study the intricate script and the enigmatic symbols that adorn the parchment. The delicate, faded ink seems to whisper hints of forgotten lore and ancient magic, urging you to decipher its secret message.\n\nAs you pore over every line, you begin to unravel a cryptic warning—one that speaks of looming dangers and the necessity for bold actions. The letter hints that only those with courage and keen insight may harness the relic's true power. Though uncertainty tugs at you, the promise of discovery stokes your curiosity.",
          image: 'media/images/generated/page_3.png',
          choices: [
            { id: 'continue', text: 'Continue your journey', target: '5' }
          ]
        },
        '4': {
          title: 'Seeking Counsel',
          narrative: "Believing that wisdom should guide such monumental choices, you set out to find the village elder—a man reputed for his deep knowledge of ancient legends and mystical omens. In his cozy cottage, scented with incense and the aroma of herbal remedies, the elder listens intently as you describe the mysterious letter and its otherworldly seal. His weathered face grew somber as he recounts tales of the Ember Throne, a relic that has both blessed and cursed those who dared seek it.\n\nHis measured words caution you about the perils ahead, yet they also kindle a flame of hope. He speaks of secret passages, hidden allies, and the necessity of a courageous heart. His advice, laced with both warning and encouragement, convinces you that you must embrace the call to adventure.",
          image: 'media/images/generated/page_4.png',
          choices: [
            { id: 'continue', text: 'Continue your journey', target: '5' }
          ]
        },
        '5': {
          title: 'Preparation for Journey',
          narrative: "Now resolved, you gather your meager belongings and step away from the familiar comforts of Brindleford. The night air is crisp as you embark on the path that leads toward destiny. The road ahead forks before you, offering different routes through a realm both enchanting and treacherous. You pause, contemplating your next move, aware that every step will shape your future.\n\nThe possibilities weigh before you: one path winds into a dark forest rumored to be alive with ancient magic, another skirts along a rocky trail with the open sky above, and a third suggests a brief respite—a moment to rest and gather strength before venturing further into the unknown.",
          image: 'media/images/generated/page_5.png',
          choices: [
            { id: 'forest', text: 'Choose the Dark Forest Path', target: '6' },
            { id: 'trail', text: 'Choose the Rocky Trail', target: '7' },
            { id: 'camp', text: 'Stop and camp for a while', target: '8' }
          ]
        },
        '6': {
          title: 'The Dark Forest Path',
          narrative: "Opting for mystery over certainty, you set your course into the depths of the dark forest. The canopy above is so thick that only slivers of moonlight pierce through, casting eerie, shifting shadows upon the forest floor. Every sound—the rustling of leaves, the distant cry of nocturnal creatures—echoes like a secret, urging you onward while simultaneously warning of hidden perils.\n\nThe forest is alive with ancient whispers and magic, and as you press deeper, you sense that the very air vibrates with possibilities. The path seems to curve and twist on its own, as if the forest itself wishes to test your resolve. Despite the ominous atmosphere, an inexplicable thrill propels you forward, driven by the promise of discovering long-lost secrets.",
          image: 'media/images/generated/dark_forest.png',
          choices: [
            { id: 'continue', text: 'Continue deeper into the forest', target: '9' }
          ]
        },
        '7': {
          title: 'The Rocky Trail',
          narrative: "Deciding that the open clarity of a rocky trail offers a measure of security, you choose the path along the craggy outcrop. The trail is bathed in the soft glow of a full moon, and the rugged landscape stretches before you, revealing hints of ancient ruins and forgotten places. The steady sound of your footsteps on stone provides a reassuring rhythm amid the silence of the night.\n\nThough the rocky path is less cloaked in mystery than the dark forest, it is not without its challenges. Occasional gusts of wind and unexpected echoes from the valleys below remind you that even here, danger lurks in the shadows. You remain vigilant, every step a careful negotiation between caution and determination.",
          image: 'media/images/generated/mountain_trail.png',
          choices: [
            { id: 'continue', text: 'Continue along the rocky path', target: '9' }
          ]
        },
        '8': {
          title: 'A Moment of Rest',
          narrative: "Choosing prudence over haste, you decide to set up camp for the night. In a small clearing surrounded by ancient trees, you build a modest fire that casts dancing shadows over your resting place. The crackle of the flames and the whisper of the wind offer a brief respite from the uncertainties of the journey. As you rest, you reflect on the cryptic letter and the promise of the Ember Throne, your thoughts swirling like the embers in the fire.\n\nThe pause gives you time to regain your strength and to listen to the subtle sounds of nature—the distant calls of nocturnal creatures, the rustle of leaves, and the quiet murmur of the night. In this moment of tranquility, you feel your resolve solidifying. The time to move forward is near.",
          image: 'media/images/generated/camp_night.png',
          choices: [
            { id: 'continue', text: 'Continue your journey at dawn', target: '9' }
          ]
        },
        '9': {
          title: 'The Encounter',
          narrative: "As you continue your journey, the landscape gradually changes. The sense of being watched grows stronger, raising the hairs on the back of your neck. Then, at a narrow pass between two ancient standing stones, a figure steps out onto the path before you. Clad in a cloak that seems to shimmer with the colors of autumn leaves, the stranger's face is partially hidden beneath a hood.\n\n\"Seeker of the Ember Throne,\" the figure addresses you in a voice that seems to come from everywhere and nowhere at once. \"Few are called, and fewer still are worthy to answer. I am the Keeper of the First Trial.\"\n\nThe figure extends a hand, revealing a small, glowing crystal. \"To proceed further, you must demonstrate wisdom. Tell me, traveler, do you seek the Throne for power, for knowledge, or for something else entirely?\"",
          image: 'media/images/generated/mysterious_figure.png',
          choices: [
            { id: 'power', text: 'For power - to change the world for the better', target: '10' },
            { id: 'knowledge', text: 'For knowledge - to understand the mysteries of existence', target: '11' },
            { id: 'destiny', text: 'For destiny - I follow the path set before me', target: '12' }
          ]
        }
      };
    },
    
    // Display a story page
    displayPage: function(pageId) {
      // Get the page data
      const page = this.storyData[pageId];
      if (!page) {
        console.error(`Page not found: ${pageId}`);
        return;
      }
      
      // Update state
      this.state.visitedPages.push(pageId);
      this.state.currentPage = pageId;
      
      // Update the scene image
      const sceneImage = document.getElementById('scene-image');
      if (sceneImage && page.image) {
        sceneImage.src = page.image;
        sceneImage.alt = page.title || 'Scene image';
      }
      
      // Create the page content with proper novel styling
      let html = `
        <div class="story-page">
          <h1 class="story-title">${page.title}</h1>
          <div class="story-content">
            <div class="story-narrative">${page.narrative.replace(/\n\n/g, '</div><div class="story-narrative">')}</div>
          </div>
          <div class="story-choices">
            <h3>What will you do?</h3>
            <div class="choice-buttons">
      `;
      
      // Add choices
      page.choices.forEach(choice => {
        html += `
          <button class="choice-button" data-choice-id="${choice.id}" data-target="${choice.target}">
            ${choice.text}
          </button>
        `;
      });
      
      html += `
            </div>
          </div>
        </div>
      `;
      
      // Update the container
      this.container.innerHTML = html;
      
      // Add event listeners to choices
      document.querySelectorAll('.choice-button').forEach(button => {
        button.addEventListener('click', (e) => {
          const choiceId = e.target.getAttribute('data-choice-id');
          const target = e.target.getAttribute('data-target');
          
          // Record the player's choice
          this.state.playerChoices[pageId] = choiceId;
          
          // Go to the target page
          this.displayPage(target);
          
          // Update the URL without reloading the page
          const url = new URL(window.location);
          url.searchParams.set('page', target);
          window.history.pushState({}, '', url);
        });
      });
      
      console.log(`Displayed page ${pageId}`);
    },
    
    // Save game state to localStorage
    saveState: function() {
      const saveData = {
        currentPage: this.state.currentPage,
        playerChoices: this.state.playerChoices,
        visitedPages: this.state.visitedPages,
        flags: this.state.flags
      };
      
      try {
        localStorage.setItem('ember-throne-save', JSON.stringify(saveData));
        return true;
      } catch (error) {
        console.error('Error saving game state:', error);
        return false;
      }
    },
    
    // Load game state from localStorage
    loadState: function() {
      const saveData = localStorage.getItem('ember-throne-save');
      if (!saveData) return false;
      
      try {
        const data = JSON.parse(saveData);
        
        this.state.currentPage = data.currentPage || '1';
        this.state.playerChoices = data.playerChoices || {};
        this.state.visitedPages = data.visitedPages || [];
        this.state.flags = data.flags || {};
        
        // Display the current page
        this.displayPage(this.state.currentPage);
        
        return true;
      } catch (error) {
        console.error('Error loading game state:', error);
        return false;
      }
    }
  };
})(); 