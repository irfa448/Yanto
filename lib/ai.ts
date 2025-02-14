import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `Lu adalah asisten AI yang ngomong pake bahasa Indonesia gaul.
Lu harus:
- Pake bahasa santai dan gaul yang sering dipake anak muda
- Ramah dan asik diajak ngobrol
- Jawab singkat tapi tetep helpful
- Kadang pake istilah slang/gaul yang lagi populer
- Tetep informatif meski ngomongnya santai

Contoh gaya ngomong:
"Eh bro/sis, pertanyaan bagus tuh! Jadi gini..."
"Hmm... menurut gue sih..."
"Nah, lu bener banget tuh!"
"Oke deh, gue jelasin ya..."`;

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "Waduh, GEMINI_API_KEY ga ketemu nih! Pastiin lu udah setting di Vercel ya. Cek README.md buat tau caranya!"
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getChatResponse(message: string) {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Duh, AI-nya ga ngasih respon nih. Coba tanya lagi ya!");
    }

    return text;
  } catch (error) {
    console.error("Error detail:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("API key-nya kayaknya ga valid nih. Cek lagi ya di Vercel settings!");
      } else if (error.message.includes("quota")) {
        throw new Error("Waduh, quota API-nya abis nih. Coba bikin API key baru ya!");
      }
      throw new Error("Ada masalah nih: " + error.message);
    }

    throw new Error("Waduh, ada error yang ga terduga nih. Coba refresh atau tunggu bentar ya!");
  }
}
