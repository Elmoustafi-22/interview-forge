import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateInterviewQuestion(jobTitle: string): Promise<string[]> {
  const prompt = `You are an experienced HR professional and hiring manager.
Generate exactly 3 thoughtful, role-specific interview questions for a ${jobTitle} position.
Focus on a mix of behavioral, situational, and competency-based questions.
Return ONLY a JSON array of 3 strings. No explanations, no markdown, no extra text.
Example format: ["Question 1?", "Question 2?", "Question 3?"]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 5000,
      },
    });

    const rawText = response.text ?? ""; // ensure a string for JSON.parse to accept

    // Try to parse the response as JSON. If the model returned extra text, extract the JSON array.
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) return parsed.slice(0, 3).map(String);
    } catch (e) {
      const start = rawText.indexOf("[");
      const end = rawText.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        const sub = rawText.slice(start, end + 1);
        const parsed = JSON.parse(sub);
        if (Array.isArray(parsed)) return parsed.slice(0, 3).map(String);
      }
      throw e;
    }

    throw new Error("Unexpected response format from Gemini");
  } catch (error) {
    console.error("Error generating interview question:", error);
    throw error;
  }
}
