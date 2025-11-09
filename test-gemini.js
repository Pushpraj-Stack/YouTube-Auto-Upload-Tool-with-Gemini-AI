import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function generateYouTubeMeta() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // 🧠 Topic jo tum dena chahte ho (yahan test ke liye fix kiya hai)
  const topic = "How to make money from gaming tournaments";

  const prompt = `
Generate catchy YouTube metadata for this topic: "${topic}"

Return in this JSON format only:
{
  "title": "Best YouTube title",
  "description": "SEO friendly YouTube description",
  "tags": ["tag1","tag2","tag3"]
}
`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    console.log("✅ Gemini Response:\n", text);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

generateYouTubeMeta();
