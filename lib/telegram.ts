import type { Lead } from "./types";

function sourceLabel(source: Lead["source"]) {
  if (source === "ai-quiz") return "ИИ-квиз";
  if (source === "chat") return "чат с ИИ";
  return "форма на сайте";
}

export function formatLeadMessage(lead: Lead) {
  const quiz = lead.quiz
    ? [
        lead.quiz.service ? `Услуга: ${lead.quiz.service}` : "",
        lead.quiz.budget ? `Бюджет: ${lead.quiz.budget}` : "",
        lead.quiz.timeline ? `Срок: ${lead.quiz.timeline}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return [
    "Новая заявка — Студия СИГНАЛ",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : "",
    `Источник: ${sourceLabel(lead.source)}`,
    quiz,
    lead.comment ? `Комментарий: ${lead.comment}` : "",
    `Время: ${new Date(lead.createdAt).toLocaleString("ru-RU")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.");
    return { sent: false as const };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadMessage(lead),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Telegram send failed:", response.status, body);
    return { sent: false as const };
  }

  return { sent: true as const };
}
