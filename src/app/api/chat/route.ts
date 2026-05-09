export const maxDuration = 60;
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Ключ GOOGLE_GENERATIVE_AI_API_KEY відсутній у файлі .env.local" }, { status: 500 });
    }

    const systemPrompt = "Ти — професійний кінокритик та AI-асистент преміальної платформи CineGuide. Твоя мета — допомагати користувачам обирати фільми. Відповідай коротко, ввічливо, українською мовою. Радь 2-3 конкретні фільми на основі запиту користувача, додаючи буквально по одному реченню, чому саме вони підходять.";

    const contents = messages.map((m: any, index: number) => {
      let text = m.content;
      if (index === 0 && m.role === "user") {
        text = `[ІНСТРУКЦІЯ: ${systemPrompt}]\n\nКористувач запитує: ${m.content}`;
      }
      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: text }],
      };
    });

    // Список моделей для автопідбору
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash"
    ];

    let lastError = "Не вдалося знайти доступну модель Gemini";
    let aiText = "";
    let success = false;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: contents,
              generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Пуста відповідь.";
          success = true;
          console.log(`[CineGuide AI] Успішно підключено модель: ${model}`);
          break; // Якщо модель відповіла успішно зупиняємо цикл
        } else {
          lastError = data.error?.message || `Помилка моделі ${model}`;
          
        
          if (lastError.includes("not found") || response.status === 404) {
            console.warn(`[CineGuide AI] Модель ${model} недоступна, пробуємо наступну...`);
            continue;
          } else {
            // Якщо помилка інша повертаємо
            return NextResponse.json({ error: lastError }, { status: response.status });
          }
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!success) {
      return NextResponse.json({ error: `Сервер Google відхилив запит: ${lastError}` }, { status: 400 });
    }

    return NextResponse.json({ text: aiText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутрішня помилка сервера" }, { status: 500 });
  }
}