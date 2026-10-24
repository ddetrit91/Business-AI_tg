"use client";

import { useState } from "react";

const items = [
  {
    q: "Сколько стоит лендинг с ИИ?",
    a: "Ориентир — от 120 000 ₽ за лендинг с квизом, формой и админкой. Точная сумма зависит от объёма текстов, интеграций и сценария помощника.",
  },
  {
    q: "Нужен ли свой ключ Gemini?",
    a: "Да. Подключаем вашу модель gemini-3.5-flash-lite. Ключ хранится на сервере и не попадает в браузер.",
  },
  {
    q: "Куда приходят заявки?",
    a: "В веб-админку по адресу /admin и дублем в Telegram: личка с ботом, группа или канал, где бот админ.",
  },
  {
    q: "Можно поставить ИИ на уже существующий сайт?",
    a: "Да. Виджет и квиз встраиваются отдельно, обычно за 7–14 дней, если есть куда писать заявки.",
  },
  {
    q: "Сколько длится запуск?",
    a: "Лендинг — около двух-трёх недель. Сайт компании — четыре-шесть. Срочный контур обсуждаем на созвоне.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-paper px-5 pb-8 pt-8">
      <div className="mx-auto max-w-6xl border-t border-ink/10 pt-24">
        <h2 className="font-display text-3xl md:text-5xl" data-reveal>
          Частые вопросы
        </h2>
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.q} data-reveal>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : index)}
                >
                  <span className="font-display text-xl md:text-2xl">{item.q}</span>
                  <span className="text-signal">{expanded ? "–" : "+"}</span>
                </button>
                {expanded ? <p className="max-w-3xl pb-6 text-graphite">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
