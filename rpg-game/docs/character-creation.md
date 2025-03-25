# Character Creation System Documentation
Version: 1.0.0 (First Stable Release)
Last Updated: March 2024

## Overview
The character creation system in The Ember Throne Chronicles allows players to create their character by selecting a class and rolling stats. This document outlines the implementation details and requirements for maintaining the system.

## Version History
- v1.0.0 (March 2024): First stable release
  - Implemented 3x3 grid layout for stats
  - Added dice rolling system with 10 rolls per character
  - Integrated class selection with preview
  - Added character name input
  - Fixed modal display and styling issues
  - Added proper event handling and animations
  - Implemented session storage for character data

## Key Components

### 1. HTML Structure
```html
<div id="character-creation" class="screen">
  <div class="character-creation-container">
    <h2>Create Your Character</h2>
    <div id="character-creation-form">
      <!-- Dynamically populated by character-system.js -->
    </div>
    <button id="back-to-main-from-character" class="back-button">Back to Main Menu</button>
  </div>
</div>
```

### 2. Required JavaScript Files
- `character-system.js`: Core character creation logic
- `dice-roller.js`: Handles stat rolling mechanics
- `gamex-utils.js`: Utility functions
- `scene-manager.js`: Manages screen transitions

### 3. Required CSS Files
- `main.css`: Contains all character creation styling
- Required fonts: 'Roboto' and 'MedievalSharp' from Google Fonts

## Implementation Details

### Character Creation Flow
1. User clicks "Begin Your Journey" button
2. `showCharacterCreation()` function is called
3. Character creation modal is displayed
4. `GameX.CharacterSystem.renderCharacterCreation()` populates the form
5. User selects class and rolls stats
6. On form submission, character data is saved to session storage
7. User is redirected to game page

### Stats System
- Each character has 6 core stats:
  - Strength
  - Dexterity
  - Intelligence
  - Constitution
  - Wisdom
  - Charisma
- Stats are arranged in a 3x3 grid
- Each stat has a roll button
- Players get 10 individual rolls
- Roll values range from 8 to 20

### Character Classes
Each class must include:
- Name
- Description
- Base stats
- Special abilities
- Starting equipment
- Sprite image

## Critical Requirements

### 1. Modal Display
- Modal must be positioned absolutely with z-index: 20
- Background should be semi-transparent black (rgba(0, 0, 0, 0.85))
- Content must be scrollable for smaller screens

### 2. Stats Layout
- Stats must be displayed in a 3x3 grid
- Each stat box must include:
  - Stat name
  - Current value
  - Roll button
- Roll buttons must be contained within stat boxes
- Roll animation must be smooth and visible

### 3. Event Handling
- All click events must be properly bound
- Roll buttons must be disabled during animation
- Roll count must be accurately tracked
- Class selection must update preview immediately

### 4. Data Storage
- Character data must be stored in session storage
- Format: `current-character` key with stringified character object
- Must include all stats, class details, and character name

## Troubleshooting

### Common Issues
1. Modal not displaying:
   - Check if screen classes are properly toggled
   - Verify z-index values
   - Ensure proper event binding

2. Stats not rolling:
   - Check roll button event listeners
   - Verify dice-roller.js is loaded
   - Check roll count tracking

3. Class selection not working:
   - Verify class data in CHARACTER_CLASSES object
   - Check event listener bindings
   - Ensure preview updates are triggered

## Testing Checklist

Before deploying changes:
- [ ] Modal displays correctly on all screen sizes
- [ ] All class options are selectable
- [ ] Stat rolling works with proper animations
- [ ] Roll count decrements correctly
- [ ] Character preview updates properly
- [ ] Form validation works
- [ ] Character data saves correctly
- [ ] Back button returns to main menu
- [ ] All styles are applied correctly
- [ ] No console errors present

## Style Requirements

### Colors
- Primary: #ffc107 (Gold)
- Secondary: #6d4c41 (Brown)
- Background: rgba(0, 0, 0, 0.85)
- Text: #ffffff (White)
- Disabled: #555555 (Gray)

### Fonts
- Headers: 'MedievalSharp', cursive
- Body: 'Roboto', sans-serif

### Animations
- Roll button pulse
- Stat value update
- Class selection hover
- Modal transitions

## Maintenance Notes

1. Always test on multiple screen sizes
2. Verify all assets are loading correctly
3. Check session storage handling
4. Maintain consistent styling
5. Keep roll mechanics balanced
6. Update documentation when making changes 

## Future Enhancements
Potential improvements for future versions:
1. Add character appearance customization
2. Implement class-specific stat bonuses
3. Add character background selection
4. Include starting equipment selection
5. Add character preview animation
6. Implement stat point allocation system as alternative to rolling

## Contributors
- Initial implementation and documentation
- UI/UX improvements
- Bug fixes and stability improvements

## License
The Ember Throne Chronicles - Character Creation System
Copyright (c) 2024 GameX
All rights reserved. 