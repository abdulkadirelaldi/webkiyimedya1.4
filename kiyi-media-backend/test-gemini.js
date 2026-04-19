const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    console.log("API KEY:", process.env.GEMINI_API_KEY ? "Found" : "Missing");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // For listing models, we don't need a model instance, but the SDK structure 
        // for listing might be different or not exposed easily in the helper.
        // Actually getGenerativeModel doesn't validate until used.

        // Let's try to generate content with gemini-pro directly to see the error in isolation
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error details:", error);
    }
}

listModels();
