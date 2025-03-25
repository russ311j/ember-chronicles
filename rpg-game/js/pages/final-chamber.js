class FinalChamberPage {
    constructor() {
        this.finalSteps = [
            {
                title: "The Chamber of Destiny",
                text: "The air crackles with ancient power as you enter the Final Chamber. The walls are lined with ancient runes that pulse with a golden light, and at the center of the chamber stands the Ember Throne, radiating an aura of immense power.",
                choices: [
                    {
                        text: "Approach the throne with reverence",
                        requires: ['wise', 'humble'],
                        nextStep: "The Throne's Power"
                    },
                    {
                        text: "Examine the chamber's defenses",
                        requires: ['cautious', 'curious'],
                        nextStep: "The Chamber's Secrets"
                    }
                ]
            },
            {
                title: "The Throne's Power",
                text: "As you approach the throne, you feel its power resonating with your own. The runes on the walls begin to glow brighter, and you sense that the throne is testing your worthiness.",
                choices: [
                    {
                        text: "Accept the throne's power",
                        requires: ['brave', 'wise'],
                        nextStep: "The Final Test"
                    },
                    {
                        text: "Prove your worth through action",
                        requires: ['brave', 'determined'],
                        nextStep: "The Trial of Worth"
                    }
                ]
            },
            {
                title: "The Chamber's Secrets",
                text: "Your careful examination reveals hidden mechanisms and ancient wards protecting the throne. The chamber itself seems to be a complex puzzle waiting to be solved.",
                choices: [
                    {
                        text: "Solve the chamber's puzzle",
                        requires: ['curious', 'wise'],
                        nextStep: "The Chamber's Challenge"
                    },
                    {
                        text: "Disable the protective wards",
                        requires: ['cautious', 'skilled'],
                        nextStep: "The Wards' Secrets"
                    }
                ]
            },
            {
                title: "The Final Test",
                text: "The throne's power surges through you, testing your resolve and character. You must prove yourself worthy of ruling the realm.",
                choices: [
                    {
                        text: "Show wisdom and compassion",
                        requires: ['wise', 'compassionate'],
                        nextStep: "The Throne's Acceptance"
                    },
                    {
                        text: "Demonstrate strength and leadership",
                        requires: ['brave', 'determined'],
                        nextStep: "The Throne's Recognition"
                    }
                ]
            },
            {
                title: "The Trial of Worth",
                text: "The chamber transforms into a battlefield of challenges. You must prove your worth through deeds, not just words.",
                choices: [
                    {
                        text: "Face the physical challenges",
                        requires: ['brave', 'strong'],
                        nextStep: "The Trial's End"
                    },
                    {
                        text: "Solve the mental challenges",
                        requires: ['wise', 'skilled'],
                        nextStep: "The Trial's End"
                    }
                ]
            },
            {
                title: "The Chamber's Challenge",
                text: "The chamber's puzzle reveals itself to be a test of both mind and spirit. Each piece you solve brings you closer to the throne.",
                choices: [
                    {
                        text: "Use your knowledge to solve it",
                        requires: ['wise', 'curious'],
                        nextStep: "The Puzzle's Solution"
                    },
                    {
                        text: "Trust your instincts",
                        requires: ['intuitive', 'skilled'],
                        nextStep: "The Puzzle's Solution"
                    }
                ]
            },
            {
                title: "The Wards' Secrets",
                text: "The protective wards are ancient and powerful, but you can sense their patterns. They seem to respond to certain qualities in those who approach.",
                choices: [
                    {
                        text: "Appeal to the wards' wisdom",
                        requires: ['wise', 'humble'],
                        nextStep: "The Wards' Acceptance"
                    },
                    {
                        text: "Show your worth to the wards",
                        requires: ['brave', 'determined'],
                        nextStep: "The Wards' Acceptance"
                    }
                ]
            },
            {
                title: "The Throne's Acceptance",
                text: "The throne recognizes your wisdom and compassion. Its power flows into you, accepting you as its rightful ruler.",
                choices: [
                    {
                        text: "Accept your destiny",
                        requires: ['wise', 'brave'],
                        nextStep: "The Throne's Ascension"
                    }
                ]
            },
            {
                title: "The Throne's Recognition",
                text: "Your strength and leadership qualities impress the throne. It acknowledges you as a worthy ruler.",
                choices: [
                    {
                        text: "Take your place as ruler",
                        requires: ['brave', 'determined'],
                        nextStep: "The Throne's Ascension"
                    }
                ]
            },
            {
                title: "The Trial's End",
                text: "You've proven yourself worthy through your actions. The chamber acknowledges your worthiness.",
                choices: [
                    {
                        text: "Claim your reward",
                        requires: ['brave', 'determined'],
                        nextStep: "The Throne's Ascension"
                    }
                ]
            },
            {
                title: "The Puzzle's Solution",
                text: "The chamber's puzzle yields to your efforts. The path to the throne is now clear.",
                choices: [
                    {
                        text: "Approach the throne",
                        requires: ['wise', 'brave'],
                        nextStep: "The Throne's Ascension"
                    }
                ]
            },
            {
                title: "The Wards' Acceptance",
                text: "The protective wards recognize your worth and part before you. The throne awaits.",
                choices: [
                    {
                        text: "Take your place",
                        requires: ['brave', 'wise'],
                        nextStep: "The Throne's Ascension"
                    }
                ]
            },
            {
                title: "The Throne's Ascension",
                text: "As you take your place upon the Ember Throne, its power flows through you. The realm recognizes you as its rightful ruler, and a new era begins.",
                choices: [
                    {
                        text: "Begin your reign",
                        requires: ['brave', 'wise'],
                        nextStep: "The End"
                    }
                ]
            },
            {
                title: "The End",
                text: "You have successfully ascended to the Ember Throne. Your journey has come to an end, but your reign as ruler of the realm has just begun.",
                choices: []
            }
        ];
    }

    getStep(stepId) {
        return this.finalSteps.find(step => step.title === stepId);
    }

    getInitialStep() {
        return this.finalSteps[0];
    }
}

// Export the class
export default FinalChamberPage; 