const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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"});

const chatWithOpenAI = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }
try {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });
  return res.json({ reply: completion.choices[0].message.content });
} catch (error) {
  console.error("OpenAI API error:", error);
  if (error.code === "insufficient_quota") {
    return res.status(429).json({ error: "API quota exceeded. Please check your OpenAI plan." });
  }
  return res.status(500).json({ error: "OpenAI API error" });
}

};

module.exports = {
  chatWithOpenAI,
};
