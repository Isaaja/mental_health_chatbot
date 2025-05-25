import express from "express";
import chatBotRouter from "./api/chat-bot/route.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
console.log(process.env.GEMINI_API_KEY);
app.use("/api/chat-bot", chatBotRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
