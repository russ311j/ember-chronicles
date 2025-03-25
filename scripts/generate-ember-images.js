/**
 * Simple placeholder generator for The Ember Throne Chronicles
 * This script creates placeholder image files for all 25 pages plus the title page.
 */

const fs = require('fs');
const path = require('path');

// Define the assets based on the gamebook narrative
const assets = [
  { id: 'page_1', name: 'Page 1 - A Mysterious Invitation' },
  { id: 'page_2', name: 'Page 2 - Bold Acceptance' },
  { id: 'page_3', name: 'Page 3 - Inquisitive Investigation' },
  { id: 'page_4', name: 'Page 4 - Seeking Counsel' },
  { id: 'page_5', name: 'Page 5 - Preparation for Journey' },
  { id: 'page_6', name: 'Page 6 - The Dark Forest Path' },
  { id: 'page_7', name: 'Page 7 - The Rocky Trail' },
  { id: 'page_8', name: 'Page 8 - A Moment of Rest' },
  { id: 'page_9', name: 'Page 9 - Arrival at the Dungeon Entrance' },
  { id: 'page_10', name: 'Page 10 - Forcing the Gate' },
  { id: 'page_11', name: 'Page 11 - Searching for a Hidden Passage' },
  { id: 'page_12', name: 'Page 12 - Disarming the Traps' },
  { id: 'page_13', name: 'Page 13 - Inside the Dungeon' },
  { id: 'page_14', name: 'Page 14 - The Left Corridor' },
  { id: 'page_15', name: 'Page 15 - The Right Corridor' },
  { id: 'page_16', name: 'Page 16 - Investigating Unusual Sounds' },
  { id: 'page_17', name: 'Page 17 - Encounter with the Guardian' },
  { id: 'page_18', name: 'Page 18 - The Attack' },
  { id: 'page_19', name: 'Page 19 - Attempting to Parley' },
  { id: 'page_20', name: 'Page 20 - Scouting for Weaknesses' },
  { id: 'page_21', name: 'Page 21 - Revelation of the Ember Throne' },
  { id: 'page_22', name: 'Page 22 - Healing the Realm' },
  { id: 'page_23', name: 'Page 23 - Dark Ambition' },
  { id: 'page_24', name: 'Page 24 - The Destruction' },
  { id: 'page_25', name: 'Page 25 - Epilogue & Consequences' },
  { id: 'title_page', name: 'Title Page - The Ember Throne Chronicles' }
];

// Create output directories
const outputMainDir = path.resolve(__dirname, '../media/images/generated');
const placeholderDir = path.join(outputMainDir, 'ember_pages');

// Make sure the directories exist
if (!fs.existsSync(outputMainDir)) {
  fs.mkdirSync(outputMainDir, { recursive: true });
}

if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
}

// Copy an existing placeholder image as a template for our page images
const existingPlaceholder = path.join(outputMainDir, 'placeholders', 'loading_page.png');
if (fs.existsSync(existingPlaceholder)) {
  // Create placeholder files for each asset by copying the existing placeholder
  assets.forEach(asset => {
    const placeholderFile = path.join(placeholderDir, `${asset.id}.png`);
    fs.copyFileSync(existingPlaceholder, placeholderFile);
  });
}

// Create a short README in the images directory
const readmePath = path.join(placeholderDir, 'README.md');
fs.writeFileSync(readmePath, `# The Ember Throne Chronicles - Game Page Assets

These placeholder images are for the interactive gamebook "The Ember Throne Chronicles".

## Generated Assets
${assets.map(asset => `- **${asset.name}** (${asset.id}.png)`).join('\n')}

## Instructions
To generate the actual images, update your Magic Hour API key in the .env file and run:
\`\`\`
node scripts/generate-magichour-images.js
\`\`\`
`); 