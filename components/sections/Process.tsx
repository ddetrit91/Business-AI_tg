const steps = [
  {
    title: "Бриф за один созвон",
    text: "Разбираем оффер, аудиторию и куда должны падать заявки. Без многостраничных анкет.",
  },
  {
    title: "Прототип и ИИ-сценарий",
    text: "Собираем структуру лендинга, вопросы квиза и ответы помощника по вашей услуге.",
  },
  {
    title: "Запуск с админкой",
    text: "Публикуем сайт, подключаем Telegram и показываем, как работать с заявками в /admin.",
  },
];

export function Process() {
  return (
    <section id="process" className="bg-band px-5 py-24 text-on-band">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl md:text-5xl" data-reveal>
          Как запускаем
        </h2>
        <ol className="mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} data-reveal>
              <span className="font-display text-signal">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
              <p className="mt-3 text-on-band/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
