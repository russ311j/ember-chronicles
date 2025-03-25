// Simple test script for Gemini image generation
require('dotenv').config();
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage() {
  try {
    console.log("Starting Gemini image generation test...");
    
    // Get the model - use gemini-pro since the other model isn't found
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Simple prompt
    const prompt = "A magical wizard's staff with glowing crystal top";
    
    console.log(`Sending prompt: "${prompt}"`);
    
    // Generate content
    const result = await model.generateContent([prompt]);
    
    console.log("Response received");
    console.log("Response structure:", JSON.stringify(result, null, 2));
    
    // Output the text response
    const response = result.response;
    console.log("Text response:", response.text());
    
  } catch (error) {
    console.error("Error:", error);
  }
}

generateImage(); 