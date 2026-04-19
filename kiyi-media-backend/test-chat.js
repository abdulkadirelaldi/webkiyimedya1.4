const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGen() {
    try {
        console.log("Getting model...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("Model got. generating content...");
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        console.log("Success:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

testGen();
