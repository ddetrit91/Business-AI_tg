import type { LeadSource, QuizAnswers } from "./types";

const phonePattern = /^[+0-9()\s-]{7,20}$/;

export function normalizePhone(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function parseLeadPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Некорректные данные" as const };
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? normalizePhone(data.phone) : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const comment = typeof data.comment === "string" ? data.comment.trim() : "";
  const source = data.source as LeadSource;
  const quiz = (data.quiz ?? {}) as QuizAnswers;

  if (name.length < 2) return { error: "Укажите имя" as const };
  if (!phonePattern.test(phone)) return { error: "Укажите телефон" as const };
  if (!["form", "ai-quiz", "chat"].includes(source)) {
    return { error: "Неизвестный источник" as const };
  }

  return {
    lead: {
      name,
      phone,
      email: email || undefined,
      comment: comment || undefined,
      source,
      quiz: {
        service: typeof quiz.service === "string" ? quiz.service : undefined,
        budget: typeof quiz.budget === "string" ? quiz.budget : undefined,
        timeline: typeof quiz.timeline === "string" ? quiz.timeline : undefined,
      },
    },
  };
}
