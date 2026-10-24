const reviews = [
  {
    quote: "Раньше заявки жили в почте и терялись. Теперь квиз сам квалифицирует, а Telegram пикает в ту же минуту.",
    name: "Марина Волкова",
    role: "основательница школы английского",
  },
  {
    quote: "ИИ не болтает «чем могу помочь». Спрашивает формат сайта, бюджет и сразу предлагает оставить телефон.",
    name: "Артём Белов",
    role: "директор клиники",
  },
  {
    quote: "Собрали лендинг за три недели. Админка простая: открыл /admin — все контакты на месте.",
    name: "Никита Орлов",
    role: "девелопер малоэтажки",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="bg-paper px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl md:text-5xl" data-reveal>
          Что говорят после запуска
        </h2>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.name} className="border-t border-ink pt-8" data-reveal>
              <p className="text-lg leading-relaxed">{review.quote}</p>
              <footer className="mt-8 text-sm text-graphite">
                <div className="text-ink">{review.name}</div>
                {review.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
