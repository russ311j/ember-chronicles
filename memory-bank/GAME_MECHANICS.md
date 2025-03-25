# Game Mechanics

## Interactive Narrative System
- **Branching Paths**: Using Twine's built-in passage linking system
- **Text Rendering**: Dynamic text display with click-to-continue functionality
- **Choice Management**: Player choices update game state and influence future narrative branches

## Turn-Based Combat System
- **Combat Flow**:
  1. Initiative determination (dice roll)
  2. Player turn: choose action (attack, defend, use item, special move)
  3. Execute action with dice roll for outcome
  4. Enemy turn with AI-driven decision making
  5. Repeat until combat resolution

- **Stats and Attributes**:
  - Player character: health, strength, dexterity, intelligence, luck
  - Enemies: health, attack power, defense, special abilities

- **Dice Roll Mechanics**:
  - Standard dice types: d4, d6, d8, d10, d12, d20
  - Modifiers based on character stats
  - Critical success/failure on natural 20/1 (for d20 rolls)

## Inventory System
- **Item Categories**:
  - Weapons: melee, ranged
  - Armor: head, body, legs
  - Consumables: potions, food, scrolls
  - Quest items: story-specific objects

- **Item Management**:
  - Add/remove items
  - Use items in/out of combat
  - Item stacking for consumables
  - Weight/space limitations

## Character Development
- **Starting Character Creation**:
  - Choose character class (warrior, mage, rogue)
  - Allocate initial stat points
  - Select starting equipment

- **Progression**:
  - Experience points from combat and story achievements
  - Level up system with stat improvements
  - New abilities unlocked at specific levels

## Saving/Loading System
- **Save Points**: At specific story junctures
- **Auto-save**: After major decisions or combat
- **Multiple Save Slots**: For different playthroughs 