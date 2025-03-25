// Script to test Gemini 1.5 models for image generation
require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ensure output directory exists
const outputDir = path.join(__dirname, '../rpg-game/media/images/generated');
fs.ensureDirSync(outputDir);

async function testImageGeneration() {
  try {
    console.log("Testing Gemini 1.5 Pro for image generation capabilities...");
    
    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
    });
    
    // Image generation prompt
    const prompt = "Generate an image of a magical staff with a glowing crystal on top.";
    
    console.log(`Sending prompt: "${prompt}"`);
    
    // Generate content
    const result = await model.generateContent([prompt]);
    
    console.log("Response received");
    
    // Get the response
    const response = result.response;
    
    // Check for any parts that might contain image data
    if (response.candidates && 
        response.candidates[0] && 
        response.candidates[0].content && 
        response.candidates[0].content.parts) {
      
      const parts = response.candidates[0].content.parts;
      console.log("Response parts:", parts.length);
      
      let hasImageData = false;
      
      for (const [index, part] of parts.entries()) {
        console.log(`Part ${index} type:`, typeof part);
        
        if (part.inlineData) {
          console.log(`Found inline data in part ${index}:`, part.inlineData);
          hasImageData = true;
          
          // If there's image data, save it
          if (part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
            const imageData = part.inlineData.data;
            const finalPath = path.join(outputDir, `gemini_test_${Date.now()}.png`);
            
            console.log(`Saving image to: ${finalPath}`);
            const imageBuffer = Buffer.from(imageData, 'base64');
            
            await fs.writeFile(finalPath, imageBuffer);
            console.log(`Image saved successfully`);
          }
        } else if (part.text) {
          console.log(`Text in part ${index}:`, part.text.substring(0, 100) + "...");
        } else {
          console.log(`Part ${index} content:`, part);
        }
      }
      
      if (!hasImageData) {
        console.log("No image data found in the response");
        console.log("Text response:", response.text());
      }
    } else {
      console.log("No candidates or parts found in response");
      console.log("Text response:", response.text());
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test function
testImageGeneration(); 