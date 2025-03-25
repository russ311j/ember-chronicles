# Dice System Documentation

## Overview

The GameX RPG uses a comprehensive dice rolling system to handle randomized events in the game, including character stat generation, skill checks, combat rolls, and story action outcomes. The dice system includes both functional logic and visual animations to enhance the player experience.

## Dice Rolling API

The dice system is implemented in the `GameX.DiceRoller` module in `js/dice-roller.js`. It provides the following key functionality:

### Basic Dice Functions

- `rollDie(sides)`: Roll a single die with the specified number of sides
- `rollDice(count, sides)`: Roll multiple dice with the specified number of sides
- `rollNotation(notation)`: Roll dice with the specified notation (e.g., "2d6+3")
- `checkSuccess(roll, dc)`: Check if a roll succeeds against a difficulty class
- `abilityCheck(abilityMod, dc)`: Make an ability check using an ability modifier

### Animated Dice Functions

- `animateDiceRoll(sides, onComplete, options)`: Display an animated dice roll for any die type with visual feedback
- `animateD20Roll(modifier, difficulty, onComplete, options)`: Roll a d20 for ability checks with animation
- `animateStatRoll(statName, onComplete, options)`: Roll dice for stat generation with specialized animation

## Visual Dice Animations

### Character Creation Stat Rolls

During character creation, players can roll for individual stats. Each stat roll:

1. Shows an animated overlay with three 6-sided dice (3d6)
2. Displays random numbers on each die face during animation
3. Reveals the final values and sum
4. Updates the character stat with the result
5. Applies visual feedback to indicate the stat change

```javascript
// Example: Rolling for Strength stat
GameX.DiceRoller.animateStatRoll("strength", (result) => {
  // Handle the result
  character.stats.strength = result;
});
```

### Story Action Rolls

When a player makes choices that require skill checks:

1. A d20 animation appears in the center of the screen
2. The die "rolls" through several random values before landing on the result
3. The stat modifier is added to the roll
4. Success or failure is determined based on the difficulty class
5. The result affects the story progression

```javascript
// Example: Rolling for a Dexterity check with DC 15
GameX.DiceRoller.animateD20Roll(
  character.stats.dexterity,  // Modifier
  15,                         // DC
  (rollData) => {
    if (rollData.success) {
      // Handle success case
    } else {
      // Handle failure case
    }
  }
);
```

## CSS and Visual Elements

The dice rolling system includes dedicated CSS styles for animations, including:

- `.dice-roll-overlay`: The container for stat roll animations
- `#dice-roll-container`: The container for story action dice rolls
- `.die-face`: Styling for individual die faces
- `.roll-indicator`: Visual indicators for choices that require rolls
- Animation keyframes for dice rolling effects

## Integration with Game Systems

### Character Creation

In the character creation screen, players have a limited number of rolls they can use to optimize their character stats. Each stat can be individually rolled using a 3d6 system.

### Interactive Story Choices

Story choices that require skill checks display:
- The required attribute (STR, DEX, INT, etc.)
- The difficulty class (DC)
- Visual dice icon indicators
- Animated feedback when rolling

### Combat System

Combat actions use the dice system to determine outcomes, with appropriate animations for:
- Attack rolls
- Damage rolls
- Critical hits and failures
- Special ability checks

## Custom Configuration

The dice animation system can be customized with various options:

- `duration`: Length of the animation in milliseconds
- `keepVisible`: Whether to keep the dice visible after the roll
- `containerSelector`: Custom container for the dice animation
- `diceFaceSelector`: Custom selector for the dice face element
- Other styling and behavior options

## Adding New Dice Features

To add new dice functionality:

1. Extend the `GameX.DiceRoller` module with your new methods
2. Add any required CSS for visual elements
3. Update documentation to reflect the changes

For complex dice mechanics, consider creating specialized animation functions like `animateSpecialRoll()` with appropriate visual feedback. 