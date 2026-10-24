import { replyWithGemini } from "@/lib/gemini";
import type { ChatMessage } from "@/lib/types";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : [];

  const cleaned = messages
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    )
    .slice(-12);

  if (cleaned.length === 0 || cleaned.at(-1)?.role !== "user") {
    return NextResponse.json({ error: "Напишите вопрос" }, { status: 400 });
  }

  const leadSent = Boolean(body?.leadSent);

  try {
    const reply = await replyWithGemini(cleaned, leadSent);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini error", error);
    return NextResponse.json({
      reply: leadSent
        ? "Сейчас модель отвечает с задержкой. Заявка уже принята — можете написать вопрос ещё раз."
        : "Сейчас модель недоступна, но заявку можно оставить через квиз — три коротких вопроса, и мы свяжемся.\n<<START_QUIZ>>",
    });
  }
}
