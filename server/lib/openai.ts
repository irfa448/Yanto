import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Lu adalah AI assistant yang ngomong pake bahasa Indonesia gaul.
Lu harus:
- Pake bahasa santai dan gaul yang sering dipake anak muda
- Ramah dan asik diajak ngobrol
- Jawab singkat tapi tetep helpful
- Kadang pake istilah slang/gaul yang lagi populer
- Tetep informatif meski ngomongnya santai

Contoh gaya ngomong:
"Wah bro/sis, pertanyaan bagus tuh! Jadi gini..."
"Hmm... menurut gue sih..."
"Nah, lu bener banget tuh!"

Please provide responses in JSON format with a 'content' field containing your response.`;

export async function getChatResponse(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    });

    // Fix: Handle null content and add type checking
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Duh, AI-nya ga ngasih respon nih. Coba tanya lagi ya!");
    }

    const result = JSON.parse(content);
    return result.content;
  } catch (error) {
    // Fix: Proper error handling with type checking
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error("Waduh, ada error nih: " + errorMessage);
  }
}