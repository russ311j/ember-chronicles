# GameX Twine Project - Usage Guide

## Getting Started

Welcome to GameX, an interactive novel with turn-based combat and dice mechanics! This guide will help you understand how to use, modify, and extend the project.

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari)
- Basic understanding of HTML, CSS, and JavaScript (for modifications)
- Twine 2 (if you want to edit the story structure)

### Opening the Game

1. Download the Twine story file (`gamex-story.html`) from the project
2. Open it in your web browser by double-clicking the file
3. Alternatively, you can import it into Twine 2 for editing:
   - Visit [twinery.org](https://twinery.org) and select "Use it online"
   - Click "Library" and then "Import"
   - Select the `gamex-story.html` file

## Project Structure

The GameX project is organized into several components:

- **gamex-story.html**: The main Twine story file containing all passages and game content
- **js/**: JavaScript modules that extend Twine with game mechanics
  - **dice-roller.js**: Handles dice rolling mechanics
  - **inventory-system.js**: Manages item collection and usage
  - **combat-system.js**: Implements turn-based combat
  - **sound-manager.js**: Controls audio playback
  - **gamex-utils.js**: Utility functions used across the game
- **css/**: Styling for the game
  - **custom.css**: Custom styles for the dual-pane interface
- **media/**: Assets used in the game
  - **images/**: Illustrations and icons
  - **audio/**: Sound effects and music
  - **fonts/**: Custom typography

## Making Changes

### Editing Story Content

To modify the narrative and game flow:

1. Import the `gamex-story.html` file into Twine 2
2. The visual editor will display all passages as connected nodes
3. Double-click any passage to edit its content
4. Create links between passages using the following syntax:
   ```
   [[Text to display|Passage name]]
   ```
5. After making changes, publish to file and replace the existing `gamex-story.html`

### Adding New Scenes

To add new scenes to the story:

1. In Twine 2, click the "+ Passage" button
2. Give your new passage a name
3. Add your narrative text and choices
4. Link it to existing passages
5. To include an image in the left pane, use:
   ```
   <<setIllustration "path/to/image.jpg">>
   ```

### Using Variables

Twine variables can be set and used to track player progress, stats, and choices:

```
<<set $playerName to "Hero">>
<<set $strength to 10>>

Hello, $playerName! Your strength is $strength.

<<if $strength > 8>>
  You're quite strong!
<<else>>
  You should train more.
<</if>>
```

### Using Custom Macros

GameX includes several custom macros to utilize the game mechanics:

#### Dice Rolling

```
<<diceRoll sides modifier>>
Roll a D20: <<diceRoll 20>>
Roll with modifier: <<diceRoll 6 2>>
```

#### Inventory Management

```
<!-- Add an item -->
<<inventory add "health_potion" 2>>

<!-- Check if player has an item -->
<<if <<inventory has "health_potion">>>>
  You have a health potion!
<<else>>
  You need to find a health potion.
<</if>>

<!-- Use an item -->
<<inventory use "health_potion">>

<!-- Display inventory -->
<<inventory list>>
```

#### Combat

```
<!-- Start combat -->
<<combat start {"name": "Goblin", "health": 20, "defense": 10, "damage": {"sides": 6, "modifier": 1}}>>

<!-- Attack -->
<<combat attack "normal">>

<!-- Defend -->
<<combat defend>>

<!-- Use item in combat -->
<<combat use "health_potion">>

<!-- Show combat log -->
<<combat log>>
```

#### Sound Effects

```
<!-- Play a sound effect -->
<<playSound "sword_clash">>

<!-- Play background music -->
<<playMusic "dungeon_theme">>
```

### Customizing Appearance

To modify the game's appearance:

1. Edit the CSS files in the `css/` directory
2. The dual-pane layout is defined in `custom.css`
3. You can adjust colors, fonts, spacing, and responsive behavior

## Saving and Loading

GameX uses Twine's built-in saving mechanisms. If you want to implement custom save/load functionality:

```
<!-- Save game state -->
<<saveGame "save1">>

<!-- Load game state -->
<<loadGame "save1">>
```

## Adding Images

To add new images to your game:

1. Place image files in the `media/images/` directory
2. Reference them in your passages:
   ```
   <<setIllustration "media/images/dragon.jpg">>
   ```

## Testing Your Game

As you make changes, regularly test your game to ensure everything works as expected:

1. Save your changes in Twine 2
2. Click "Play" to test the game in a new browser tab
3. Test all paths, combat scenarios, and interactions

## Publishing Your Game

When you're ready to share your game:

1. Export from Twine 2 as an HTML file
2. Include all required JavaScript files and assets
3. Host the files on a web server or share the HTML file directly

## Advanced Features

### Adding Custom JavaScript

To add your own JavaScript functionality:

1. Create a new JS file in the `js/` directory
2. Add your custom code as a module
3. Reference it in your HTML file
4. Access your functions through the GameX namespace or custom macros

### Extending Combat System

The combat system can be extended with new mechanics:

```javascript
// Add a new attack type
GameX.Combat.specialAttack = function(type) {
  // Implementation here
}
```

### Creating New Macros

You can add custom macros to Twine:

```javascript
Macro.add('myMacro', {
  handler: function() {
    // Macro implementation
    jQuery(this.output).wiki("Macro output");
  }
});
```

## Troubleshooting

- **Images not showing**: Check file paths and make sure images are in the correct directory
- **JavaScript errors**: Check browser console for error messages
- **Save issues**: Twine's online editor saves to browser cache; export regularly to avoid data loss

## Getting Help

If you encounter issues or have questions:

- Check the Twine documentation at [twinery.org/wiki](https://twinery.org/wiki/)
- Reference the Harlowe documentation for macro syntax
- Explore the source code in the `js/` directory for implementation details

Happy storytelling! 