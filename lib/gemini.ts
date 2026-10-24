import { GoogleGenerativeAI } from "@google/generative-ai";
import { serviceCatalog } from "./quiz";
import type { ChatMessage } from "./types";

const SYSTEM_PROMPT = `Ты — консультант веб-студии СИГНАЛ. Говоришь по-русски, коротко, тепло и по делу. Не давишь.

${serviceCatalog}

Правила:
- Отвечай на вопросы по услугам, срокам, этапам и примерным ценам.
- Не выдумывай кейсы с конкретными брендами.
- Не проси паспорт, карты и лишние данные. Для заявки достаточно имени и телефона.
- После 2–3 полезных ответов мягко предложи подобрать решение в квизе из 3 вопросов.
- Если человек готов оставить заявку, пригласи пройти квиз.
- Когда уместно начать квиз, добавь в конец ответа отдельной строкой токен <<START_QUIZ>>.
- Не ставь токен в первом ответе, если человек только поздоровался.
- Если заявка уже принята, квиз не предлагай и токен <<START_QUIZ>> не ставь. Отвечай на уточняющие вопросы.
- Без markdown-заголовков, без длинных списков — максимум 4 коротких абзаца.`;

function fallbackReply(userCount: number, leadSent = false) {
  if (leadSent) {
    return "Заявка уже у менеджера. Могу ещё ответить по срокам, формату сайта или составу работ.";
  }
  if (userCount >= 2) {
    return "Могу коротко сориентировать по формату и срокам. Чтобы не гадать, пройдите мини-квиз — три вопроса, и мы поймём, какой запуск вам подходит.\n<<START_QUIZ>>";
  }
  return "Студия СИГНАЛ делает лендинги, сайты компаний и ИИ-помощников, которые собирают заявки сами. Напишите, что хотите запустить — лендинг, корпоративный сайт или чат на текущем проекте — и я подскажу формат и ориентир по срокам.";
}

export async function replyWithGemini(messages: ChatMessage[], leadSent = false) {
  const userCount = messages.filter((item) => item.role === "user").length;
  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return fallbackReply(userCount, leadSent);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackReply(userCount, leadSent);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    systemInstruction: leadSent
      ? `${SYSTEM_PROMPT}\n\nСейчас заявка этого человека уже принята. Не предлагай квиз и не ставь <<START_QUIZ>>.`
      : SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.6,
    },
  });

  const contents = messages.map((item) => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.content }],
  }));
  while (contents[0]?.role === "model") contents.shift();

  const result = await model.generateContent({ contents });
  let text = "";
  try {
    text = result.response.text()?.trim() ?? "";
  } catch (error) {
    console.error("Gemini empty response", error);
  }
  return text || fallbackReply(userCount, leadSent);
}
