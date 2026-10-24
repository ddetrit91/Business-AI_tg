"use client";

import { quizSteps } from "@/lib/quiz";
import type { ChatMessage, QuizAnswers } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "chat" | "quiz" | "contacts";

export function Assistant({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Я помощник студии СИГНАЛ. Спросите про лендинг, сроки или ИИ на сайте — или сразу подберём формат в квизе.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quiz, setQuiz] = useState<QuizAnswers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mode, open, busy]);

  const quizStep = quizSteps[quizIndex];
  const canSend = useMemo(() => input.trim().length > 0 && !busy, [input, busy]);

  function startQuiz() {
    setMode("quiz");
    setQuizIndex(0);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Три коротких вопроса — и станет ясно, какой запуск вам подходит." },
    ]);
  }

  async function sendChat(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend) return;
    const content = input.trim();
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, leadSent }),
        signal: AbortSignal.timeout(25000),
      });
      const payload = await response.json().catch(() => ({}));
      const raw =
        typeof payload.reply === "string"
          ? payload.reply
          : "Не получилось ответить. Можно повторить вопрос или пройти квиз.";
      const startQuizToken = raw.includes("<<START_QUIZ>>");
      const reply = raw.replace(/<<START_QUIZ>>/g, "").trim();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "Могу подсказать по услуге. Напишите, что хотите запустить, или откройте квиз.",
        },
      ]);
      if (startQuizToken && !leadSent) setMode("quiz");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ответ задерживается. Напишите ещё раз или подберите решение в квизе.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function submitLead(source: "ai-quiz" | "chat") {
    if (name.trim().length < 2 || phone.trim().length < 7) {
      setError("Укажите имя и телефон");
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        source,
        quiz,
        comment: messages
          .filter((item) => item.role === "user")
          .map((item) => item.content)
          .join(" | "),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(payload.error || "Не получилось отправить");
      return;
    }
    setLeadSent(true);
    setMode("chat");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Заявку приняли. Менеджер свяжется в рабочее время. Если есть ещё вопрос по срокам, формату или цене — напишите сюда.",
      },
    ]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-signal px-5 py-3 font-medium text-on-band shadow-lg"
      >
        {open ? "Закрыть" : "ИИ-помощник"}
      </button>
      {open ? (
        <div className="fixed bottom-24 right-5 z-40 flex h-[min(640px,78vh)] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.75rem] bg-paper text-ink shadow-2xl">
          <div className="border-b border-ink/10 px-5 py-4">
            <p className="font-display text-lg">Помощник СИГНАЛ</p>
            <p className="text-sm text-graphite">Отвечает по услуге и помогает оставить заявку</p>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={
                  message.role === "assistant"
                    ? "max-w-[92%] rounded-2xl bg-ink/5 px-4 py-3 text-sm"
                    : "ml-auto max-w-[92%] rounded-2xl bg-signal px-4 py-3 text-sm text-on-band"
                }
              >
                {message.content}
              </p>
            ))}
            {busy && mode === "chat" ? (
              <p className="max-w-[92%] rounded-2xl bg-ink/5 px-4 py-3 text-sm text-graphite">Печатает…</p>
            ) : null}
            {mode === "quiz" && quizStep ? (
              <div className="rounded-2xl border border-ink/10 p-4">
                <p className="font-medium">{quizStep.question}</p>
                <div className="mt-3 grid gap-2">
                  {quizStep.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="rounded-xl border border-ink/15 px-3 py-2 text-left text-sm hover:border-signal"
                      onClick={() => {
                        setQuiz((prev) => ({ ...prev, [quizStep.id]: option }));
                        if (quizIndex + 1 >= quizSteps.length) {
                          setMode("contacts");
                        } else {
                          setQuizIndex((value) => value + 1);
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {mode === "contacts" ? (
              <div className="grid gap-3 rounded-2xl border border-ink/10 p-4">
                <p className="font-medium">Оставьте контакт — пришлём ориентир</p>
                <input
                  className="rounded-xl border border-ink/15 px-3 py-2 text-sm"
                  placeholder="Имя"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <input
                  className="rounded-xl border border-ink/15 px-3 py-2 text-sm"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
                {error ? <p className="text-sm text-signal-deep">{error}</p> : null}
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-full bg-signal px-4 py-2 text-sm text-on-band"
                  onClick={() => submitLead("ai-quiz")}
                >
                  Отправить заявку
                </button>
              </div>
            ) : null}
          </div>
          {mode === "chat" ? (
            <form onSubmit={sendChat} className="grid gap-2 border-t border-ink/10 p-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-full border border-ink/15 px-4 py-2 text-sm"
                  placeholder="Спросите про услугу"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="rounded-full bg-band px-4 py-2 text-sm text-on-band disabled:opacity-50"
                >
                  {busy ? "Ждём…" : "Отправить"}
                </button>
              </div>
              {leadSent ? (
                <p className="text-sm text-graphite">Заявка уже у нас. Можно задать ещё вопрос.</p>
              ) : (
                <button type="button" className="text-left text-sm text-signal-deep" onClick={startQuiz}>
                  Подобрать решение в квизе
                </button>
              )}
            </form>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
