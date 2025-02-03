import "dotenv/config";
import express from "express";
import axios from "axios";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const app = express();
app.use(express.json());

const llm = new HuggingFaceInference({
  model: "mistralai/Mistral-7B-Instruct", // Free model
  apiKey: process.env.HUGGINGFACE_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are an AI assistant."],
      ["user", userMessage]
    ]);

    const response = await llm.invoke(await prompt.format());
    res.json({ reply: response });
  } catch (error) {
    console.error("Error Details:", error.response?.data || error.message);
res.status(500).json({ error: error.message });

  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
