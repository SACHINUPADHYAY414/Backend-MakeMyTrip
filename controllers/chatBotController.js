const OpenAI = require("openai");
require("dotenv").config();
const axios = require("axios");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const chatWithOpenAI = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });
    return res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    if (error.code === "insufficient_quota") {
      return res
        .status(429)
        .json({ error: "API quota exceeded. Please check your OpenAI plan." });
    }
    return res.status(500).json({ error: "OpenAI API error" });
  }
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const chatWithGroq = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: messages,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res
      .status(200)
      .json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Groq API call failed" });
  }
};

module.exports = {
  chatWithOpenAI,
  chatWithGroq
};
