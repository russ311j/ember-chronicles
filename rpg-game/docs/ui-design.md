# GameX RPG - UI Design Specification

## 1. Overall Aesthetic

- **Visual Theme:**  
  - Emulate pixel-art or hand-drawn textures reminiscent of 16-bit RPGs.  
  - Use a dark, parchment-like background with subtle textures (e.g., leather, aged paper) to evoke nostalgia.
- **Color Palette:**  
  - Primary colors: Deep browns, muted greens, and faded golds.  
  - Accent colors: Crimson for important buttons or notifications, and soft blues for highlighting selections.
- **Typography:**  
  - Use retro-inspired pixel fonts or monospace fonts that mimic the look of classic RPG dialogue boxes.  
  - Headers may use a decorative, serif-style font to enhance the medieval feel.

## 2. Layout and Structure

### Header Section
- **Title:**  
  - "Character Creation" rendered in a decorative, old-school banner style.  
  - Consider a drop shadow or embossed effect to give depth.
- **Navigation Bar:**  
  - Buttons for "Back," "Next," and "Help" styled as old game menu buttons (with rounded edges and slight bevels).

### Main Content Area
- **Two-Column Layout:**
  - **Left Panel (Preview & Illustration):**  
    - A portrait area where a character sprite or silhouette is displayed.  
    - Option to change outfits or facial features with arrow buttons.
  - **Right Panel (Attribute & Selection Panels):**  
    - Organized into several sections for various character attributes and choices.

## 3. Character Attributes & Input Elements

### Character Basics Section
- **Name Input:**  
  - A text box styled like an old terminal or parchment scroll.  
  - Placeholder text "Enter Your Name…" with a blinking cursor effect.
- **Race & Class Selection:**  
  - Dropdown or button grid with icons (e.g., human, elf, dwarf) and classes (e.g., warrior, mage, rogue).  
  - Each option should include a small, pixel-art style icon and brief description (accessible via hover or click).

### Attribute Allocation Section
- **Primary Attributes:**  
  - List key stats such as Strength, Agility, Intelligence, and Endurance.  
  - Each stat should have a label, a numeric value display, and increment/decrement buttons styled like old-school RPG dials.
- **Point Distribution Mechanic:**  
  - A visible pool of points (e.g., "You have 10 points to allocate") that updates dynamically as the player adjusts the values.
  - Use animated counters or classic "beep" sound effects when points are allocated or removed.

### Appearance Customization Section
- **Portrait Customization:**  
  - Options to choose hairstyles, facial features, and armor/clothing styles.  
  - Use carousel sliders or grid selection panels with small preview images.
- **Color Customization:**  
  - A color palette selector for hair, eyes, and skin tone.  
  - Display a set of swatches with pixel art textures.

### Background & Backstory Section
- **Predefined Backstories:**  
  - List a few options for backstories (e.g., "Exiled Noble," "Street Urchin," "Mystic Wanderer") each with a short, lore-rich description.
  - Radio buttons or clickable cards, each styled with parchment borders and illuminated letters.
- **Custom Backstory Option:**  
  - A text area for players who want to write their own background, again styled as if on a scroll.

## 4. UI Controls & Interactive Elements

- **Buttons:**  
  - Retro-styled buttons with beveled edges, pixel art icons, and hover effects that change the button's brightness.
- **Dice Roll or Randomize Option:**  
  - A "Roll for Luck" button that, when pressed, shows a quick animation of dice rolling, updating one or more attributes (optional for random generation of stats).
- **Sound Effects:**  
  - Integrate subtle sound cues (clicks, typewriter effects, dice rolls) using the Web Audio API to enhance the interactive feel.
- **Tooltips/Help Pop-ups:**  
  - When hovering over an element (e.g., an attribute), a small tooltip appears with a brief description in a scroll-like tooltip box.

## 5. Additional Authentic Touches

- **Frame & Borders:**  
  - Use ornate, medieval-inspired borders around panels and sections to simulate an old RPG game interface.
- **Animated Transitions:**  
  - Implement fade-in transitions for panels, reminiscent of vintage game menus.
- **Cursor & Pointer:**  
  - Customize the cursor to a pixel-art sword or arrow icon when hovering over interactive elements.

## 6. Implementation Considerations

- **Component-Based Structure:**  
  - Break down the design into reusable components (e.g., Button, Dropdown, AttributePanel, PortraitPreview) for modular development.
- **State Management:**  
  - Use a state management system to track character attributes, available points, and UI state transitions.
- **Responsive Design:**  
  - Ensure that while the design emulates a fixed-ratio classic RPG layout, it remains adaptable to various screen sizes.
- **Integration with Assets:**  
  - All icons and images should be sourced from free-to-use retro asset libraries or generated for the project.
- **Accessibility:**  
  - Include keyboard navigation and screen-reader support for each interactive element.

## 7. Current Implementation Status

- Basic character creation system implemented with:
  - Character name input
  - Class selection (Warrior, Mage, Rogue, Cleric)
  - Stat rolling (2d6-based system)
  - Character preview
  - Save functionality
  
- Future enhancements to align with this design spec:
  - Improved visual styling with retro RPG aesthetic
  - More detailed character customization options
  - Background story selection
  - Additional sound effects and animations 