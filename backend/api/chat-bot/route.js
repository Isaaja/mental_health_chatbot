import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Konfigurasi dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

const router = express.Router();
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Quick replies data
const quickRepliesData = {
  1: [
    "I'm feeling anxious",
    "I'm feeling depressed",
    "I need someone to talk to",
  ],
  2: [
    "Tell me more",
    "How long have you felt this way?",
    "What triggers these feelings?",
  ],
  3: [
    "I want to try meditation",
    "I need professional help",
    "I want to learn coping strategies",
  ],
};

router.get("/quick-replies", (req, res) => {
  const queue = parseInt(req.query.queue) || 1;
  const replies = quickRepliesData[queue] || quickRepliesData[1];
  res.json({ quick_replies: replies });
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      summary: text,
      message: "Success generate content",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
