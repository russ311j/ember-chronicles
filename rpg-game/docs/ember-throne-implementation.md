# The Ember Throne Chronicles - Implementation Documentation

## Overview

The Ember Throne Chronicles is an interactive narrative experience implemented within the GameX framework. This gamebook-style adventure allows players to make choices that affect the story's outcome, with branching paths and multiple endings.

## Implementation Details

### File Structure

- `ember-throne.html` - Main HTML file for the standalone game
- `js/pages/ember-throne.js` - Core JavaScript module implementing the game logic
- `css/ember-throne.css` - Styling for the game

### Narrative Structure

The narrative follows a branching path structure where:
- **Core Pages**: Main story points (pages 1, 5, 9, 13, 17, 21, 25)
- **Branch Pages**: Individual narrative paths based on player choices
- Each page is written in second-person, present-tense style

### Asset Implementation

The game uses the following assets:
- **Background Images**: Located in `media/images/generated/magichour/page_*.png`
- **Title Page**: Located in `media/images/generated/magichour/title_page.png`

### Game State Management

The game state is managed through:
- `localStorage` for saving/loading game progress
- Tracking visited pages in the game state object
- Recording player choices

### Player Choices

Player choices affect:
- The path through the narrative
- The ultimate ending (page 25 varies based on previous choices)
- Which parts of the story the player sees

## How to Access the Game

There are two ways to access The Ember Throne Chronicles:

1. **From the main menu**: Click on "The Ember Throne Chronicles" button in the main menu
2. **Direct access**: Open `ember-throne.html` directly in a browser

## Features

- **Save/Load**: Save game progress and continue later
- **Responsive Design**: Works on both desktop and mobile browsers
- **Game Controls**: Menu, save, and sound toggle buttons
- **Visual Novel Style**: Beautiful presentation with images and narrative text

## Page Implementation Details

The game consists of 25 pages:

- **Page 1**: Starting point - A Mysterious Invitation
- **Pages 2-4**: Initial choice branches
- **Page 5**: First core junction - Preparation for Journey
- **Pages 6-8**: Path choice branches
- **Page 9**: Second core junction - Arrival at the Dungeon Entrance
- **Pages 10-12**: Entrance approach branches
- **Page 13**: Third core junction - Inside the Dungeon
- **Pages 14-16**: Dungeon exploration branches
- **Page 17**: Fourth core junction - Encounter with the Guardian
- **Pages 18-20**: Guardian confrontation branches
- **Page 21**: Fifth core junction - Revelation of the Ember Throne
- **Pages 22-24**: Throne decision branches
- **Page 25**: Final page - Epilogue & Consequences

## Future Enhancements

Potential enhancements for future versions:
- Audio narration for each page
- Ambient sound effects based on scene
- Character attributes that affect available choices
- Item collection and inventory system
- Dice-based challenges for key encounters 