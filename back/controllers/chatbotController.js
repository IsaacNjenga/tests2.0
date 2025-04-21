import { CohereClient } from "cohere-ai"; // Correct import statement
import dotenv from "dotenv";

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // Use 'token' instead of 'apiKey'
});

export const chatWithCohere = async (req, res) => {
  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    const response = await cohere.generate({
      model: "command",
      prompt: userMessage,
      max_tokens: 300,
      temperature: 0.7,
    });

    res
      .status(200)
      .json({ success: true, reply: response.generations[0].text.trim() });
  } catch (error) {
    console.error("Cohere chatbot error:", error);
    res.status(500).json({ error: "Failed to get response from Cohere." });
  }
};
