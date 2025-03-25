// Script to list available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log("Attempting to list available Gemini models...");
    
    // Try to access a list of models if the API supports it
    // Note: This is an attempt, as the standard client might not have this method
    if (genAI.listModels) {
      const models = await genAI.listModels();
      console.log("Available models:", models);
    } else {
      console.log("The listModels method is not available in this API version.");
      
      // Try some common model names
      const modelNames = [
        "gemini-pro", 
        "gemini-pro-vision",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.0-pro",
        "gemini-1.0-pro-vision"
      ];
      
      console.log("Attempting to check common model names:");
      
      for (const modelName of modelNames) {
        try {
          console.log(`Checking if ${modelName} is available...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          
          // Try a simple generation to see if the model works
          const result = await model.generateContent("Hello, are you available?");
          console.log(`✓ Model ${modelName} is available. Response: "${result.response.text().substring(0, 50)}..."`);
        } catch (error) {
          console.log(`✗ Model ${modelName} is not available: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels(); 