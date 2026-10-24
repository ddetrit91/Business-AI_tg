"use client";

import { quizSteps } from "@/lib/quiz";
import { useMemo, useState } from "react";

type Answers = {
  service: string;
  budget: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
};

const empty: Answers = {
  service: "",
  budget: "",
  timeline: "",
  name: "",
  phone: "",
  email: "",
  comment: "",
};

export function LeadForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const current = quizSteps[step];
  const total = quizSteps.length + 1;

  const canSubmit = useMemo(
    () => answers.name.trim().length >= 2 && answers.phone.trim().length >= 7,
    [answers.name, answers.phone],
  );

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) {
      setError("Укажите имя и телефон");
      return;
    }
    setSending(true);
    setError("");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: answers.name,
        phone: answers.phone,
        email: answers.email,
        comment: answers.comment,
        source: "form",
        quiz: {
          service: answers.service,
          budget: answers.budget,
          timeline: answers.timeline,
        },
      }),
    });
    const payload = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) {
      setError(payload.error || "Не получилось отправить");
      return;
    }
    setDone(true);
  }

  return (
    <section id="lead" className="bg-band px-5 py-24 text-on-band">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.1fr]">
        <div data-reveal>
          <h2 className="font-display text-3xl md:text-5xl">Рассчитаем запуск</h2>
          <p className="mt-6 max-w-md text-on-band/70">
            Три вопроса и контакт. Перезвоним в рабочее время, пришлём ориентир по сроку и формату.
          </p>
          <p className="mt-8 text-sm text-on-band/50">
            Шаг {Math.min(step + 1, total)} из {total}
          </p>
        </div>
        <div className="rounded-[2rem] bg-paper p-6 text-ink md:p-10" data-reveal>
          {done ? (
            <p className="font-display text-3xl">Заявка ушла. Напишем или позвоним.</p>
          ) : current ? (
            <div>
              <h3 className="font-display text-2xl">{current.question}</h3>
              <div className="mt-8 grid gap-3">
                {current.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="rounded-2xl border border-ink/15 px-4 py-4 text-left hover:border-signal hover:bg-signal/10"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [current.id]: option }));
                      setStep((value) => value + 1);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <h3 className="font-display text-2xl">Куда прислать расчёт</h3>
              <label className="grid gap-2 text-sm">
                Имя
                <input
                  className="rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-base"
                  value={answers.name}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, name: event.target.value }))}
                  autoComplete="name"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm">
                Телефон
                <input
                  className="rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-base"
                  value={answers.phone}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, phone: event.target.value }))}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm">
                Email, если удобнее писать
                <input
                  className="rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-base"
                  value={answers.email}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, email: event.target.value }))}
                  autoComplete="email"
                  type="email"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Комментарий
                <textarea
                  className="min-h-24 rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-base"
                  value={answers.comment}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, comment: event.target.value }))}
                />
              </label>
              {error ? <p className="text-sm text-signal-deep">{error}</p> : null}
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-signal px-6 py-3 font-medium text-on-band disabled:opacity-60"
              >
                {sending ? "Отправляем…" : "Оставить заявку"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
