/**
 * Forest Journey Page Module for Ember Throne
 * Handles the forest journey sequence and encounters
 */

(function() {
  // Create a namespace for the forest journey
  window.GameX = window.GameX || {};
  
  // Forest journey page
  GameX.ForestJourney = {
    // Page state
    state: {
      currentEncounter: 0,
      encounters: [
        {
          id: 'wolf',
          title: 'Wolf Encounter',
          description: 'A fierce wolf blocks your path.',
          choices: [
            { text: 'Fight', next: 'wolf-fight' },
            { text: 'Flee', next: 'wolf-flee' }
          ]
        },
        {
          id: 'mysterious_old_man',
          title: 'Mysterious Old Man',
          description: 'An old man offers you guidance.',
          choices: [
            { text: 'Accept Help', next: 'old-man-help' },
            { text: 'Decline', next: 'old-man-decline' }
          ]
        }
      ]
    },
    constructor() {
        super({
            id: 'forest-journey',
            title: 'The Enchanted Forest',
            backgroundImage: 'assets/images/backgrounds/forest.jpg',
            music: 'assets/music/forest.mp3',
            options: {
                back: true,
                menu: true,
                save: true
            }
        });

        this.currentStep = 0;
        this.journeySteps = [
            {
                title: 'Entering the Forest',
                text: 'The ancient forest looms before you, its dense canopy casting long shadows across the path. The air is thick with the scent of moss and earth.',
                choices: [
                    { text: 'Take the well-worn path', nextStep: 1, trait: 'cautious' },
                    { text: 'Explore the undergrowth', nextStep: 2, trait: 'curious' }
                ]
            },
            {
                title: 'The Well-Worn Path',
                text: 'The path is clear but narrow, winding through ancient trees. You notice fresh tracks in the mud.',
                choices: [
                    { text: 'Follow the tracks', nextStep: 3, trait: 'observant' },
                    { text: 'Stay alert and proceed carefully', nextStep: 4, trait: 'cautious' }
                ]
            },
            {
                title: 'The Undergrowth',
                text: 'The dense undergrowth is alive with small creatures. You spot a glint of metal among the roots.',
                choices: [
                    { text: 'Investigate the glint', nextStep: 5, trait: 'curious' },
                    { text: 'Continue through the brush', nextStep: 6, trait: 'determined' }
                ]
            },
            {
                title: 'Following the Tracks',
                text: 'The tracks lead to a small clearing where you find signs of a recent campfire.',
                choices: [
                    { text: 'Examine the campsite', nextStep: 7, trait: 'observant' },
                    { text: 'Look for more tracks', nextStep: 8, trait: 'determined' }
                ]
            },
            {
                title: 'Careful Progress',
                text: 'Your cautious approach reveals a hidden pit trap. You carefully mark it for others.',
                choices: [
                    { text: 'Find a way around', nextStep: 9, trait: 'cautious' },
                    { text: 'Set up a warning sign', nextStep: 10, trait: 'helpful' }
                ]
            },
            {
                title: 'The Hidden Treasure',
                text: 'Among the roots, you find an ancient dagger with strange markings.',
                choices: [
                    { text: 'Take the dagger', nextStep: 11, trait: 'greedy' },
                    { text: 'Leave it in place', nextStep: 12, trait: 'respectful' }
                ]
            },
            {
                title: 'Through the Brush',
                text: 'The thick brush gives way to a small stream. You hear movement in the water.',
                choices: [
                    { text: 'Investigate the stream', nextStep: 13, trait: 'curious' },
                    { text: 'Cross carefully', nextStep: 14, trait: 'cautious' }
                ]
            },
            {
                title: 'The Campsite',
                text: 'The campsite shows signs of recent use. You find a map fragment.',
                choices: [
                    { text: 'Take the map fragment', nextStep: 15, trait: 'greedy' },
                    { text: 'Leave it for others', nextStep: 16, trait: 'respectful' }
                ]
            },
            {
                title: 'More Tracks',
                text: 'The tracks lead to a small cave entrance. You hear faint sounds from within.',
                choices: [
                    { text: 'Enter the cave', nextStep: 17, trait: 'brave' },
                    { text: 'Observe from outside', nextStep: 18, trait: 'cautious' }
                ]
            },
            {
                title: 'Around the Trap',
                text: 'You find a safer path around the trap, marked with ancient symbols.',
                choices: [
                    { text: 'Follow the symbols', nextStep: 19, trait: 'curious' },
                    { text: 'Continue on your way', nextStep: 20, trait: 'determined' }
                ]
            },
            {
                title: 'The Warning Sign',
                text: 'You create a clear warning sign using nearby materials.',
                choices: [
                    { text: 'Add more details', nextStep: 21, trait: 'helpful' },
                    { text: 'Move on', nextStep: 22, trait: 'determined' }
                ]
            },
            {
                title: 'Taking the Dagger',
                text: 'The dagger feels warm in your hand, pulsing with ancient magic.',
                choices: [
                    { text: 'Examine the markings', nextStep: 23, trait: 'curious' },
                    { text: 'Store it carefully', nextStep: 24, trait: 'cautious' }
                ]
            },
            {
                title: 'Leaving the Dagger',
                text: 'You carefully cover the dagger with leaves, respecting its resting place.',
                choices: [
                    { text: 'Mark the location', nextStep: 25, trait: 'observant' },
                    { text: 'Continue your journey', nextStep: 26, trait: 'determined' }
                ]
            },
            {
                title: 'The Stream',
                text: 'In the stream, you spot a small fish with iridescent scales.',
                choices: [
                    { text: 'Try to catch it', nextStep: 27, trait: 'greedy' },
                    { text: 'Watch it swim away', nextStep: 28, trait: 'respectful' }
                ]
            },
            {
                title: 'Crossing the Stream',
                text: 'You find a series of stepping stones to cross safely.',
                choices: [
                    { text: 'Cross quickly', nextStep: 29, trait: 'brave' },
                    { text: 'Test each stone', nextStep: 30, trait: 'cautious' }
                ]
            },
            {
                title: 'The Map Fragment',
                text: 'The map fragment shows part of the forest and some mysterious symbols.',
                choices: [
                    { text: 'Study the symbols', nextStep: 31, trait: 'curious' },
                    { text: 'Keep it for later', nextStep: 32, trait: 'cautious' }
                ]
            },
            {
                title: 'Leaving the Map',
                text: 'You place the map fragment back where you found it.',
                choices: [
                    { text: 'Add a note', nextStep: 33, trait: 'helpful' },
                    { text: 'Continue exploring', nextStep: 34, trait: 'determined' }
                ]
            },
            {
                title: 'Entering the Cave',
                text: 'The cave is dark but dry, with ancient markings on the walls.',
                choices: [
                    { text: 'Examine the markings', nextStep: 35, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 36, trait: 'cautious' }
                ]
            },
            {
                title: 'Observing the Cave',
                text: 'From outside, you see a faint glow deep within the cave.',
                choices: [
                    { text: 'Wait and watch', nextStep: 37, trait: 'patient' },
                    { text: 'Look for another entrance', nextStep: 38, trait: 'determined' }
                ]
            },
            {
                title: 'Following the Symbols',
                text: 'The symbols lead to a small clearing with a stone altar.',
                choices: [
                    { text: 'Examine the altar', nextStep: 39, trait: 'curious' },
                    { text: 'Leave it undisturbed', nextStep: 40, trait: 'respectful' }
                ]
            },
            {
                title: 'Continuing On',
                text: 'You press forward, leaving the symbols behind.',
                choices: [
                    { text: 'Pick up the pace', nextStep: 41, trait: 'determined' },
                    { text: 'Stay alert', nextStep: 42, trait: 'cautious' }
                ]
            },
            {
                title: 'Detailed Warning',
                text: 'You add detailed instructions about the trap\'s location and nature.',
                choices: [
                    { text: 'Add distance markers', nextStep: 43, trait: 'helpful' },
                    { text: 'Move forward', nextStep: 44, trait: 'determined' }
                ]
            },
            {
                title: 'Moving On',
                text: 'You leave the warning sign behind and continue your journey.',
                choices: [
                    { text: 'Stay on the path', nextStep: 45, trait: 'determined' },
                    { text: 'Look for shortcuts', nextStep: 46, trait: 'curious' }
                ]
            },
            {
                title: 'Examining the Dagger',
                text: 'The markings seem to tell a story of an ancient battle.',
                choices: [
                    { text: 'Try to read them', nextStep: 47, trait: 'curious' },
                    { text: 'Store it safely', nextStep: 48, trait: 'cautious' }
                ]
            },
            {
                title: 'Safely Storing',
                text: 'You carefully secure the dagger in your pack.',
                choices: [
                    { text: 'Continue exploring', nextStep: 49, trait: 'determined' },
                    { text: 'Look for more clues', nextStep: 50, trait: 'curious' }
                ]
            },
            {
                title: 'Marking the Location',
                text: 'You create a subtle but clear marker near the dagger\'s location.',
                choices: [
                    { text: 'Add more details', nextStep: 51, trait: 'observant' },
                    { text: 'Move on', nextStep: 52, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Journey',
                text: 'You leave the dagger behind and continue through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 53, trait: 'cautious' },
                    { text: 'Look for more treasures', nextStep: 54, trait: 'greedy' }
                ]
            },
            {
                title: 'Catching the Fish',
                text: 'You manage to catch the iridescent fish.',
                choices: [
                    { text: 'Keep it as a pet', nextStep: 55, trait: 'greedy' },
                    { text: 'Release it', nextStep: 56, trait: 'respectful' }
                ]
            },
            {
                title: 'Watching the Fish',
                text: 'You watch as the fish swims away, leaving a trail of light.',
                choices: [
                    { text: 'Follow the light trail', nextStep: 57, trait: 'curious' },
                    { text: 'Continue your path', nextStep: 58, trait: 'determined' }
                ]
            },
            {
                title: 'Quick Crossing',
                text: 'You cross the stream quickly but carefully.',
                choices: [
                    { text: 'Check for pursuers', nextStep: 59, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 60, trait: 'determined' }
                ]
            },
            {
                title: 'Testing the Stones',
                text: 'You carefully test each stone before stepping.',
                choices: [
                    { text: 'Mark safe stones', nextStep: 61, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 62, trait: 'cautious' }
                ]
            },
            {
                title: 'Studying the Symbols',
                text: 'The symbols appear to be a warning about a great danger.',
                choices: [
                    { text: 'Take notes', nextStep: 63, trait: 'curious' },
                    { text: 'Proceed with caution', nextStep: 64, trait: 'cautious' }
                ]
            },
            {
                title: 'Keeping the Map',
                text: 'You carefully store the map fragment for later study.',
                choices: [
                    { text: 'Look for more fragments', nextStep: 65, trait: 'determined' },
                    { text: 'Continue your journey', nextStep: 66, trait: 'cautious' }
                ]
            },
            {
                title: 'Adding a Note',
                text: 'You leave a helpful note about the map\'s location.',
                choices: [
                    { text: 'Add more details', nextStep: 67, trait: 'helpful' },
                    { text: 'Move on', nextStep: 68, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Exploration',
                text: 'You leave the map behind and continue exploring.',
                choices: [
                    { text: 'Stay alert', nextStep: 69, trait: 'cautious' },
                    { text: 'Look for more clues', nextStep: 70, trait: 'curious' }
                ]
            },
            {
                title: 'Examining the Markings',
                text: 'The cave markings tell a story of an ancient civilization.',
                choices: [
                    { text: 'Study them further', nextStep: 71, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 72, trait: 'cautious' }
                ]
            },
            {
                title: 'Proceeding in Cave',
                text: 'You move forward carefully in the cave.',
                choices: [
                    { text: 'Look for light sources', nextStep: 73, trait: 'observant' },
                    { text: 'Feel your way', nextStep: 74, trait: 'brave' }
                ]
            },
            {
                title: 'Waiting and Watching',
                text: 'After some time, you see a figure emerge from the cave.',
                choices: [
                    { text: 'Follow the figure', nextStep: 75, trait: 'curious' },
                    { text: 'Stay hidden', nextStep: 76, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Another Entrance',
                text: 'You find a smaller entrance to the cave.',
                choices: [
                    { text: 'Enter through it', nextStep: 77, trait: 'brave' },
                    { text: 'Observe from here', nextStep: 78, trait: 'cautious' }
                ]
            },
            {
                title: 'Examining the Altar',
                text: 'The altar is covered in ancient runes and symbols.',
                choices: [
                    { text: 'Try to read them', nextStep: 79, trait: 'curious' },
                    { text: 'Leave it alone', nextStep: 80, trait: 'respectful' }
                ]
            },
            {
                title: 'Leaving the Altar',
                text: 'You respect the altar\'s sanctity and leave it undisturbed.',
                choices: [
                    { text: 'Mark its location', nextStep: 81, trait: 'observant' },
                    { text: 'Continue your journey', nextStep: 82, trait: 'determined' }
                ]
            },
            {
                title: 'Picking Up the Pace',
                text: 'You move faster through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 83, trait: 'cautious' },
                    { text: 'Look for shortcuts', nextStep: 84, trait: 'determined' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'Your alertness helps you spot a hidden path.',
                choices: [
                    { text: 'Take the hidden path', nextStep: 85, trait: 'curious' },
                    { text: 'Stay on main path', nextStep: 86, trait: 'cautious' }
                ]
            },
            {
                title: 'Adding Distance Markers',
                text: 'You add clear distance markers to the warning sign.',
                choices: [
                    { text: 'Add more details', nextStep: 87, trait: 'helpful' },
                    { text: 'Move forward', nextStep: 88, trait: 'determined' }
                ]
            },
            {
                title: 'Moving Forward',
                text: 'You leave the detailed warning behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 89, trait: 'cautious' },
                    { text: 'Look for more dangers', nextStep: 90, trait: 'observant' }
                ]
            },
            {
                title: 'Staying on the Path',
                text: 'You stick to the main path through the forest.',
                choices: [
                    { text: 'Continue forward', nextStep: 91, trait: 'determined' },
                    { text: 'Rest briefly', nextStep: 92, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Shortcuts',
                text: 'You search for faster routes through the forest.',
                choices: [
                    { text: 'Take a shortcut', nextStep: 93, trait: 'brave' },
                    { text: 'Stay on safe path', nextStep: 94, trait: 'cautious' }
                ]
            },
            {
                title: 'Reading the Markings',
                text: 'The dagger\'s markings tell of a powerful artifact.',
                choices: [
                    { text: 'Study them further', nextStep: 95, trait: 'curious' },
                    { text: 'Store it safely', nextStep: 96, trait: 'cautious' }
                ]
            },
            {
                title: 'Safely Storing',
                text: 'You carefully secure the dagger in your pack.',
                choices: [
                    { text: 'Continue exploring', nextStep: 97, trait: 'determined' },
                    { text: 'Look for more clues', nextStep: 98, trait: 'curious' }
                ]
            },
            {
                title: 'Adding Warnings',
                text: 'You add warning symbols to your marker.',
                choices: [
                    { text: 'Add more details', nextStep: 99, trait: 'helpful' },
                    { text: 'Move on', nextStep: 100, trait: 'determined' }
                ]
            },
            {
                title: 'Moving Forward',
                text: 'You leave your detailed marker behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 101, trait: 'cautious' },
                    { text: 'Look for more dangers', nextStep: 102, trait: 'observant' }
                ]
            },
            {
                title: 'Keeping the Fish',
                text: 'You find a way to keep the fish as a companion.',
                choices: [
                    { text: 'Study its properties', nextStep: 103, trait: 'curious' },
                    { text: 'Keep it safe', nextStep: 104, trait: 'cautious' }
                ]
            },
            {
                title: 'Releasing the Fish',
                text: 'You watch as the fish swims away, leaving a trail of light.',
                choices: [
                    { text: 'Follow the trail', nextStep: 105, trait: 'curious' },
                    { text: 'Continue your path', nextStep: 106, trait: 'determined' }
                ]
            },
            {
                title: 'Checking for Pursuers',
                text: 'You carefully check for any signs of pursuit.',
                choices: [
                    { text: 'Hide if needed', nextStep: 107, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 108, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 109, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 110, trait: 'observant' }
                ]
            },
            {
                title: 'Marking Safe Stones',
                text: 'You mark the safe stones with small symbols.',
                choices: [
                    { text: 'Add more details', nextStep: 111, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 112, trait: 'cautious' }
                ]
            },
            {
                title: 'Crossing When Ready',
                text: 'You carefully cross the stream using the marked stones.',
                choices: [
                    { text: 'Check the other side', nextStep: 113, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 114, trait: 'determined' }
                ]
            },
            {
                title: 'Taking Notes',
                text: 'You carefully record the warning symbols.',
                choices: [
                    { text: 'Study them further', nextStep: 115, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 116, trait: 'cautious' }
                ]
            },
            {
                title: 'Proceeding with Caution',
                text: 'You move forward carefully, mindful of the warning.',
                choices: [
                    { text: 'Stay alert', nextStep: 117, trait: 'cautious' },
                    { text: 'Look for more warnings', nextStep: 118, trait: 'observant' }
                ]
            },
            {
                title: 'Looking for More Fragments',
                text: 'You search for additional map fragments.',
                choices: [
                    { text: 'Search thoroughly', nextStep: 119, trait: 'determined' },
                    { text: 'Stay on path', nextStep: 120, trait: 'cautious' }
                ]
            },
            {
                title: 'Continuing Journey',
                text: 'You continue your journey with the map fragment.',
                choices: [
                    { text: 'Study the fragment', nextStep: 121, trait: 'curious' },
                    { text: 'Stay alert', nextStep: 122, trait: 'cautious' }
                ]
            },
            {
                title: 'Adding More Details',
                text: 'You add more helpful details to your note.',
                choices: [
                    { text: 'Add warnings', nextStep: 123, trait: 'helpful' },
                    { text: 'Move on', nextStep: 124, trait: 'determined' }
                ]
            },
            {
                title: 'Moving On',
                text: 'You leave your detailed note behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 125, trait: 'cautious' },
                    { text: 'Look for more clues', nextStep: 126, trait: 'curious' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'Your alertness helps you spot a hidden path.',
                choices: [
                    { text: 'Take the hidden path', nextStep: 127, trait: 'curious' },
                    { text: 'Stay on main path', nextStep: 128, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for More Clues',
                text: 'You search for additional clues in the area.',
                choices: [
                    { text: 'Search thoroughly', nextStep: 129, trait: 'determined' },
                    { text: 'Stay on path', nextStep: 130, trait: 'cautious' }
                ]
            },
            {
                title: 'Studying Further',
                text: 'You spend time studying the cave markings in detail.',
                choices: [
                    { text: 'Take notes', nextStep: 131, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 132, trait: 'cautious' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully in the cave.',
                choices: [
                    { text: 'Look for light sources', nextStep: 133, trait: 'observant' },
                    { text: 'Feel your way', nextStep: 134, trait: 'brave' }
                ]
            },
            {
                title: 'Following the Figure',
                text: 'You carefully follow the mysterious figure.',
                choices: [
                    { text: 'Stay hidden', nextStep: 135, trait: 'cautious' },
                    { text: 'Try to catch up', nextStep: 136, trait: 'brave' }
                ]
            },
            {
                title: 'Staying Hidden',
                text: 'You remain hidden and observe the figure\'s movements.',
                choices: [
                    { text: 'Continue following', nextStep: 137, trait: 'patient' },
                    { text: 'Return to cave', nextStep: 138, trait: 'cautious' }
                ]
            },
            {
                title: 'Entering Through Small Entrance',
                text: 'You carefully enter through the smaller cave entrance.',
                choices: [
                    { text: 'Proceed carefully', nextStep: 139, trait: 'cautious' },
                    { text: 'Look for light', nextStep: 140, trait: 'observant' }
                ]
            },
            {
                title: 'Observing from Small Entrance',
                text: 'You watch the cave from the smaller entrance.',
                choices: [
                    { text: 'Wait longer', nextStep: 141, trait: 'patient' },
                    { text: 'Look for another way', nextStep: 142, trait: 'determined' }
                ]
            },
            {
                title: 'Reading the Runes',
                text: 'The runes tell of an ancient power sealed within.',
                choices: [
                    { text: 'Study them further', nextStep: 143, trait: 'curious' },
                    { text: 'Leave quickly', nextStep: 144, trait: 'cautious' }
                ]
            },
            {
                title: 'Leaving Alone',
                text: 'You respect the altar\'s power and leave it undisturbed.',
                choices: [
                    { text: 'Mark location', nextStep: 145, trait: 'observant' },
                    { text: 'Continue journey', nextStep: 146, trait: 'determined' }
                ]
            },
            {
                title: 'Marking Location',
                text: 'You create a subtle marker near the altar.',
                choices: [
                    { text: 'Add details', nextStep: 147, trait: 'helpful' },
                    { text: 'Move on', nextStep: 148, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Journey',
                text: 'You leave the altar behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 149, trait: 'cautious' },
                    { text: 'Look for more signs', nextStep: 150, trait: 'observant' }
                ]
            },
            {
                title: 'Staying on Path',
                text: 'You maintain a steady pace on the main path.',
                choices: [
                    { text: 'Continue forward', nextStep: 151, trait: 'determined' },
                    { text: 'Rest briefly', nextStep: 152, trait: 'cautious' }
                ]
            },
            {
                title: 'Brief Rest',
                text: 'You take a short rest to recover your strength.',
                choices: [
                    { text: 'Stay alert', nextStep: 153, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 154, trait: 'determined' }
                ]
            },
            {
                title: 'Taking Shortcut',
                text: 'You find a promising shortcut through the forest.',
                choices: [
                    { text: 'Take the risk', nextStep: 155, trait: 'brave' },
                    { text: 'Stay on safe path', nextStep: 156, trait: 'cautious' }
                ]
            },
            {
                title: 'Staying on Safe Path',
                text: 'You decide to stay on the safer, longer path.',
                choices: [
                    { text: 'Continue forward', nextStep: 157, trait: 'determined' },
                    { text: 'Look for landmarks', nextStep: 158, trait: 'observant' }
                ]
            },
            {
                title: 'Studying Further',
                text: 'You spend more time studying the dagger\'s markings.',
                choices: [
                    { text: 'Take notes', nextStep: 159, trait: 'curious' },
                    { text: 'Store it safely', nextStep: 160, trait: 'cautious' }
                ]
            },
            {
                title: 'Safely Storing',
                text: 'You carefully secure the dagger in your pack.',
                choices: [
                    { text: 'Continue exploring', nextStep: 161, trait: 'determined' },
                    { text: 'Look for more clues', nextStep: 162, trait: 'curious' }
                ]
            },
            {
                title: 'Adding Warnings',
                text: 'You add warning symbols to your marker.',
                choices: [
                    { text: 'Add more details', nextStep: 163, trait: 'helpful' },
                    { text: 'Move on', nextStep: 164, trait: 'determined' }
                ]
            },
            {
                title: 'Moving Forward',
                text: 'You leave your detailed marker behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 165, trait: 'cautious' },
                    { text: 'Look for more dangers', nextStep: 166, trait: 'observant' }
                ]
            },
            {
                title: 'Studying Properties',
                text: 'You observe the fish\'s unique properties.',
                choices: [
                    { text: 'Take notes', nextStep: 167, trait: 'curious' },
                    { text: 'Keep it safe', nextStep: 168, trait: 'cautious' }
                ]
            },
            {
                title: 'Keeping Safe',
                text: 'You ensure the fish is kept safe and comfortable.',
                choices: [
                    { text: 'Continue journey', nextStep: 169, trait: 'determined' },
                    { text: 'Look for food', nextStep: 170, trait: 'helpful' }
                ]
            },
            {
                title: 'Following the Trail',
                text: 'You follow the fish\'s light trail through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 171, trait: 'cautious' },
                    { text: 'Move quickly', nextStep: 172, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Path',
                text: 'You stay on your original path through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 173, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 174, trait: 'observant' }
                ]
            },
            {
                title: 'Hiding if Needed',
                text: 'You find a good hiding spot and wait.',
                choices: [
                    { text: 'Stay hidden', nextStep: 175, trait: 'cautious' },
                    { text: 'Observe surroundings', nextStep: 176, trait: 'observant' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 177, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 178, trait: 'observant' }
                ]
            },
            {
                title: 'Looking for Landmarks',
                text: 'You search for recognizable features in the forest.',
                choices: [
                    { text: 'Mark your path', nextStep: 179, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 180, trait: 'determined' }
                ]
            },
            {
                title: 'Adding More Details',
                text: 'You add more helpful details to the stone markers.',
                choices: [
                    { text: 'Add warnings', nextStep: 181, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 182, trait: 'cautious' }
                ]
            },
            {
                title: 'Crossing When Ready',
                text: 'You carefully cross using the marked stones.',
                choices: [
                    { text: 'Check other side', nextStep: 183, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 184, trait: 'determined' }
                ]
            },
            {
                title: 'Checking Other Side',
                text: 'You carefully check the far side of the stream.',
                choices: [
                    { text: 'Look for tracks', nextStep: 185, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 186, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 187, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 188, trait: 'observant' }
                ]
            },
            {
                title: 'Studying Further',
                text: 'You spend more time studying the warning symbols.',
                choices: [
                    { text: 'Take notes', nextStep: 189, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 190, trait: 'cautious' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully, mindful of the warning.',
                choices: [
                    { text: 'Stay alert', nextStep: 191, trait: 'cautious' },
                    { text: 'Look for more warnings', nextStep: 192, trait: 'observant' }
                ]
            },
            {
                title: 'Searching Thoroughly',
                text: 'You conduct a thorough search of the area.',
                choices: [
                    { text: 'Mark findings', nextStep: 193, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 194, trait: 'determined' }
                ]
            },
            {
                title: 'Staying on Path',
                text: 'You stick to the main path through the forest.',
                choices: [
                    { text: 'Continue forward', nextStep: 195, trait: 'determined' },
                    { text: 'Rest briefly', nextStep: 196, trait: 'cautious' }
                ]
            },
            {
                title: 'Studying Fragment',
                text: 'You study the map fragment in detail.',
                choices: [
                    { text: 'Take notes', nextStep: 197, trait: 'curious' },
                    { text: 'Store it safely', nextStep: 198, trait: 'cautious' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'You remain alert as you continue your journey.',
                choices: [
                    { text: 'Look for dangers', nextStep: 199, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 200, trait: 'determined' }
                ]
            },
            {
                title: 'Adding Warnings',
                text: 'You add warning symbols to your note.',
                choices: [
                    { text: 'Add more details', nextStep: 201, trait: 'helpful' },
                    { text: 'Move on', nextStep: 202, trait: 'determined' }
                ]
            },
            {
                title: 'Moving On',
                text: 'You leave your detailed note behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 203, trait: 'cautious' },
                    { text: 'Look for more clues', nextStep: 204, trait: 'curious' }
                ]
            },
            {
                title: 'Taking Hidden Path',
                text: 'You decide to take the hidden path.',
                choices: [
                    { text: 'Proceed carefully', nextStep: 205, trait: 'cautious' },
                    { text: 'Look for signs', nextStep: 206, trait: 'observant' }
                ]
            },
            {
                title: 'Staying on Main Path',
                text: 'You stick to the main path through the forest.',
                choices: [
                    { text: 'Continue forward', nextStep: 207, trait: 'determined' },
                    { text: 'Rest briefly', nextStep: 208, trait: 'cautious' }
                ]
            },
            {
                title: 'Taking Notes',
                text: 'You carefully record the cave markings.',
                choices: [
                    { text: 'Study further', nextStep: 209, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 210, trait: 'cautious' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully in the cave.',
                choices: [
                    { text: 'Look for light', nextStep: 211, trait: 'observant' },
                    { text: 'Feel your way', nextStep: 212, trait: 'brave' }
                ]
            },
            {
                title: 'Looking for Light',
                text: 'You search for sources of light in the cave.',
                choices: [
                    { text: 'Follow the light', nextStep: 213, trait: 'curious' },
                    { text: 'Stay in darkness', nextStep: 214, trait: 'cautious' }
                ]
            },
            {
                title: 'Feeling Your Way',
                text: 'You carefully feel your way through the darkness.',
                choices: [
                    { text: 'Move slowly', nextStep: 215, trait: 'cautious' },
                    { text: 'Look for light', nextStep: 216, trait: 'observant' }
                ]
            },
            {
                title: 'Staying Hidden',
                text: 'You remain hidden while following the figure.',
                choices: [
                    { text: 'Continue following', nextStep: 217, trait: 'patient' },
                    { text: 'Return to cave', nextStep: 218, trait: 'cautious' }
                ]
            },
            {
                title: 'Trying to Catch Up',
                text: 'You attempt to catch up with the figure.',
                choices: [
                    { text: 'Call out', nextStep: 219, trait: 'brave' },
                    { text: 'Stay quiet', nextStep: 220, trait: 'cautious' }
                ]
            },
            {
                title: 'Continuing Following',
                text: 'You continue following the figure from a distance.',
                choices: [
                    { text: 'Stay hidden', nextStep: 221, trait: 'cautious' },
                    { text: 'Get closer', nextStep: 222, trait: 'brave' }
                ]
            },
            {
                title: 'Returning to Cave',
                text: 'You decide to return to the cave entrance.',
                choices: [
                    { text: 'Look for clues', nextStep: 223, trait: 'observant' },
                    { text: 'Wait here', nextStep: 224, trait: 'patient' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully in the small entrance.',
                choices: [
                    { text: 'Look for light', nextStep: 225, trait: 'observant' },
                    { text: 'Feel your way', nextStep: 226, trait: 'brave' }
                ]
            },
            {
                title: 'Waiting Longer',
                text: 'You wait longer at the small entrance.',
                choices: [
                    { text: 'Stay patient', nextStep: 227, trait: 'patient' },
                    { text: 'Look for another way', nextStep: 228, trait: 'determined' }
                ]
            },
            {
                title: 'Looking for Another Way',
                text: 'You search for another way into the cave.',
                choices: [
                    { text: 'Search thoroughly', nextStep: 229, trait: 'determined' },
                    { text: 'Return to main entrance', nextStep: 230, trait: 'cautious' }
                ]
            },
            {
                title: 'Studying Further',
                text: 'You spend more time studying the altar\'s runes.',
                choices: [
                    { text: 'Take notes', nextStep: 231, trait: 'curious' },
                    { text: 'Leave quickly', nextStep: 232, trait: 'cautious' }
                ]
            },
            {
                title: 'Leaving Quickly',
                text: 'You quickly leave the altar area.',
                choices: [
                    { text: 'Stay alert', nextStep: 233, trait: 'cautious' },
                    { text: 'Look for signs', nextStep: 234, trait: 'observant' }
                ]
            },
            {
                title: 'Adding Details',
                text: 'You add more details to your marker.',
                choices: [
                    { text: 'Add warnings', nextStep: 235, trait: 'helpful' },
                    { text: 'Move on', nextStep: 236, trait: 'determined' }
                ]
            },
            {
                title: 'Moving On',
                text: 'You leave your detailed marker behind and continue.',
                choices: [
                    { text: 'Stay alert', nextStep: 237, trait: 'cautious' },
                    { text: 'Look for more signs', nextStep: 238, trait: 'observant' }
                ]
            },
            {
                title: 'Staying Alert',
                text: 'You remain alert as you continue.',
                choices: [
                    { text: 'Look for dangers', nextStep: 239, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 240, trait: 'determined' }
                ]
            },
            {
                title: 'Looking for Signs',
                text: 'You search for more signs in the area.',
                choices: [
                    { text: 'Study them', nextStep: 241, trait: 'curious' },
                    { text: 'Continue forward', nextStep: 242, trait: 'determined' }
                ]
            },
            {
                title: 'Continuing Forward',
                text: 'You press on through the forest.',
                choices: [
                    { text: 'Stay alert', nextStep: 243, trait: 'cautious' },
                    { text: 'Look for landmarks', nextStep: 244, trait: 'observant' }
                ]
            },
            {
                title: 'Resting Briefly',
                text: 'You take a short rest to recover.',
                choices: [
                    { text: 'Stay alert', nextStep: 245, trait: 'cautious' },
                    { text: 'Continue forward', nextStep: 246, trait: 'determined' }
                ]
            },
            {
                title: 'Taking the Risk',
                text: 'You decide to take the shortcut.',
                choices: [
                    { text: 'Move quickly', nextStep: 247, trait: 'brave' },
                    { text: 'Proceed carefully', nextStep: 248, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Landmarks',
                text: 'You search for recognizable features.',
                choices: [
                    { text: 'Mark your path', nextStep: 249, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 250, trait: 'determined' }
                ]
            },
            {
                title: 'Taking Notes',
                text: 'You record the dagger\'s properties.',
                choices: [
                    { text: 'Study further', nextStep: 251, trait: 'curious' },
                    { text: 'Store it safely', nextStep: 252, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for More Clues',
                text: 'You search for additional clues.',
                choices: [
                    { text: 'Search thoroughly', nextStep: 253, trait: 'determined' },
                    { text: 'Stay on path', nextStep: 254, trait: 'cautious' }
                ]
            },
            {
                title: 'Adding More Details',
                text: 'You add more helpful details to your marker.',
                choices: [
                    { text: 'Add warnings', nextStep: 255, trait: 'helpful' },
                    { text: 'Move on', nextStep: 256, trait: 'determined' }
                ]
            },
            {
                title: 'Looking for More Dangers',
                text: 'You search for potential dangers.',
                choices: [
                    { text: 'Mark them', nextStep: 257, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 258, trait: 'determined' }
                ]
            },
            {
                title: 'Looking for Food',
                text: 'You search for food for the fish.',
                choices: [
                    { text: 'Search thoroughly', nextStep: 259, trait: 'helpful' },
                    { text: 'Continue journey', nextStep: 260, trait: 'determined' }
                ]
            },
            {
                title: 'Moving Quickly',
                text: 'You move quickly along the light trail.',
                choices: [
                    { text: 'Stay alert', nextStep: 261, trait: 'cautious' },
                    { text: 'Look for source', nextStep: 262, trait: 'curious' }
                ]
            },
            {
                title: 'Observing Surroundings',
                text: 'You carefully observe your surroundings.',
                choices: [
                    { text: 'Stay hidden', nextStep: 263, trait: 'cautious' },
                    { text: 'Look for escape routes', nextStep: 264, trait: 'observant' }
                ]
            },
            {
                title: 'Marking Your Path',
                text: 'You mark your path through the forest.',
                choices: [
                    { text: 'Add details', nextStep: 265, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 266, trait: 'determined' }
                ]
            },
            {
                title: 'Adding Warnings',
                text: 'You add warning symbols to the stone markers.',
                choices: [
                    { text: 'Add more details', nextStep: 267, trait: 'helpful' },
                    { text: 'Cross when ready', nextStep: 268, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Tracks',
                text: 'You search for tracks on the far side.',
                choices: [
                    { text: 'Study them', nextStep: 269, trait: 'observant' },
                    { text: 'Continue forward', nextStep: 270, trait: 'determined' }
                ]
            },
            {
                title: 'Taking Notes',
                text: 'You record the warning symbols.',
                choices: [
                    { text: 'Study further', nextStep: 271, trait: 'curious' },
                    { text: 'Proceed carefully', nextStep: 272, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for More Warnings',
                text: 'You search for additional warning signs.',
                choices: [
                    { text: 'Mark them', nextStep: 273, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 274, trait: 'determined' }
                ]
            },
            {
                title: 'Marking Findings',
                text: 'You mark your findings in the area.',
                choices: [
                    { text: 'Add details', nextStep: 275, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 276, trait: 'determined' }
                ]
            },
            {
                title: 'Storing Safely',
                text: 'You carefully store the map fragment.',
                choices: [
                    { text: 'Study it later', nextStep: 277, trait: 'cautious' },
                    { text: 'Look for more fragments', nextStep: 278, trait: 'determined' }
                ]
            },
            {
                title: 'Looking for Dangers',
                text: 'You search for potential dangers.',
                choices: [
                    { text: 'Mark them', nextStep: 279, trait: 'helpful' },
                    { text: 'Continue forward', nextStep: 280, trait: 'determined' }
                ]
            },
            {
                title: 'Proceeding Carefully',
                text: 'You move forward carefully on the hidden path.',
                choices: [
                    { text: 'Look for signs', nextStep: 281, trait: 'observant' },
                    { text: 'Stay alert', nextStep: 282, trait: 'cautious' }
                ]
            },
            {
                title: 'Looking for Signs',
                text: 'You search for signs along the hidden path.',
                choices: [
                    { text: 'Study them', nextStep: 283, trait: 'curious' },
                    { text: 'Continue forward', nextStep: 284, trait: 'determined' }
                ]
            },
            {
                title: 'Resting Briefly',
                text: 'You take a short rest on the main path.',
                choices: [
                    { text: 'Stay alert', nextStep: 285, trait: 'cautious' },
                    { text: 'Continue forward', nextText: 'Exit Forest', nextStep: 286, trait: 'determined' }
                ]
            }
        ];
    }

    initialize() {
        super.initialize();
        this.createContent();
        this.showCurrentStep();
    }

    createContent() {
        const content = document.createElement('div');
        content.className = 'forest-journey-content';
        
        // Create the main content area
        const mainContent = document.createElement('div');
        mainContent.className = 'journey-main-content';
        
        // Create the title element
        const titleElement = document.createElement('h2');
        titleElement.className = 'journey-title';
        
        // Create the text element
        const textElement = document.createElement('div');
        textElement.className = 'journey-text';
        
        // Create the choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'journey-choices';
        
        // Add elements to main content
        mainContent.appendChild(titleElement);
        mainContent.appendChild(textElement);
        mainContent.appendChild(choicesContainer);
        
        // Add main content to content container
        content.appendChild(mainContent);
        
        // Add content to page
        this.container.appendChild(content);
    }

    showCurrentStep() {
        const step = this.journeySteps[this.currentStep];
        if (!step) return;

        // Update title
        const titleElement = this.container.querySelector('.journey-title');
        titleElement.textContent = step.title;

        // Update text with typing animation
        const textElement = this.container.querySelector('.journey-text');
        textElement.innerHTML = '';
        this.typeText(textElement, step.text);

        // Update choices
        const choicesContainer = this.container.querySelector('.journey-choices');
        choicesContainer.innerHTML = '';
        
        step.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'journey-choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.handleChoice(choice));
            choicesContainer.appendChild(button);
        });
    }

    async typeText(element, text) {
        element.innerHTML = '';
        for (let char of text) {
            const span = document.createElement('span');
            span.textContent = char;
            element.appendChild(span);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }

    handleChoice(choice) {
        // Play click sound
        soundManager.playSound('click');

        // Update character traits if applicable
        if (choice.trait) {
            const gameState = stateManager.getGameState();
            if (!gameState.character.traits) {
                gameState.character.traits = {};
            }
            gameState.character.traits[choice.trait] = (gameState.character.traits[choice.trait] || 0) + 1;
            stateManager.updateGameState(gameState);
        }

        if (choice.nextStep === 286) {
            // Transition to Desolate Moors
            this.transitionToMoors();
        } else {
            this.currentStep = choice.nextStep;
            this.showCurrentStep();
        }
    }

    transitionToMoors() {
        // Save game state
        const gameState = stateManager.getGameState();
        gameState.currentPage = 'desolate-moors';
        stateManager.updateGameState(gameState);

        // Transition to Desolate Moors
        transitionManager.transitionTo(new DesolateMoorsPage());
    }

    goBack() {
        // Play back sound
        soundManager.playSound('back');
        
        // Go back to game introduction
        transitionManager.transitionTo(new GameIntroductionPage());
    }
  }
})(); 