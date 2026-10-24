const items = [
  {
    title: "ИИ не отпускает посетителя",
    text: "Помощник отвечает по услуге, снимает возражения и сам предлагает квиз, когда человек уже тёплый.",
  },
  {
    title: "Квиз вместо холодной формы",
    text: "Три вопроса вместо пустых полей. Заявка приходит с услугой, бюджетом и сроком — менеджер не гадает.",
  },
  {
    title: "Админка и Telegram сразу",
    text: "Все заявки на /admin. Параллельно сообщение улетает в бот, группу или канал — как удобнее команде.",
  },
  {
    title: "Сайт как отдел продаж",
    text: "Не витрина «посмотрите портфолио», а рабочий контур: вопрос → квалификация → контакт.",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="relative overflow-hidden bg-paper px-5 py-24">
      <p className="pointer-events-none absolute right-0 top-10 font-display text-[18vw] leading-none text-ink/5" data-parallax="60">
        01
      </p>
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-display text-3xl leading-tight md:text-5xl" data-reveal>
          Почему заявки не теряются
        </h2>
        <div className="mt-16 divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <article key={item.title} className="grid gap-4 py-10 md:grid-cols-[1.1fr_1.4fr]" data-reveal>
              <h3 className="font-display text-2xl md:text-3xl">{item.title}</h3>
              <p className="max-w-xl text-lg text-graphite">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
