import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

async function testAPIKey() {
  console.log("🔑 Testing Google AI API Key...");

  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      console.error("❌ GOOGLE_AI_API_KEY not found in environment variables");
      return;
    }

    console.log("✅ API Key found in environment");
    console.log("🔍 API Key preview:", apiKey.substring(0, 10) + "...");

    // Test the API key with a simple request
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log("📡 Testing API connection with simple prompt...");

    const result = await model.generateContent(
      "Hello, just say 'API key is working' if you can read this."
    );
    const response = await result.response;
    const text = response.text();

    console.log("✅ API Key is valid!");
    console.log("🤖 AI Response:", text);
  } catch (error) {
    console.error("❌ API Key test failed:", error.message);

    if (error.status === 400) {
      console.log("");
      console.log("🔧 To fix this issue:");
      console.log("1. Go to https://aistudio.google.com/app/apikey");
      console.log("2. Create a new API key");
      console.log("3. Update your .env file with the new key");
      console.log("4. Restart the server");
    }
  }
}

testAPIKey();
