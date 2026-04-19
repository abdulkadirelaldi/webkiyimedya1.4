const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to get instance
        // Actually the SDK doesn't have a direct listModels method on the client instance in some versions?
        // Wait, the error message says "Call ListModels to see the list..."
        // Let's try to find a way to list models.
        // The current node SDK might not expose listModels easily on the main class?

        // Let's try a different approach: a simple fetch to the API endpoint to list models.
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Models:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
