import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const genAi = new GoogleGenAI({
  apiKey: process.env.gemini_api_key,
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });

    res.json({ replay: response.text });
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error)
    res.status(500).json({ replay: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});