export function Hero({ onAskAi }: { onAskAi: () => void }) {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-band text-on-band">
      <div className="grid-mesh absolute inset-0" data-parallax="-80" />
      <p
        className="pointer-events-none absolute -left-8 top-24 font-display text-[22vw] leading-none text-on-band/5"
        data-parallax="120"
      >
        СИГНАЛ
      </p>
      <div
        className="absolute right-[-8%] top-[18%] h-[42vw] w-[42vw] rounded-full bg-signal/20 blur-3xl"
        data-parallax="70"
      />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-5 pb-16 pt-32 md:pb-24">
        <p className="max-w-md text-sm text-on-band/70">Веб-студия. Сайты, которые не ждут заявку — они её собирают.</p>
        <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight md:text-7xl">
          Сайт, который сам приводит заявки
        </h1>
        <p className="mt-6 max-w-xl text-lg text-on-band/75">
          Лендинг или сайт компании с ИИ-квизом, админкой и дублем в Telegram. Человек задаёт вопрос — через минуту у вас контакт.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#lead" className="rounded-full bg-signal px-6 py-3 font-medium text-on-band">
            Рассчитать проект
          </a>
          <button
            type="button"
            onClick={onAskAi}
            className="rounded-full border border-on-band/30 px-6 py-3 text-on-band"
          >
            Спросить ИИ
          </button>
        </div>
        <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-on-band/15 pt-8 text-sm">
          <div>
            <dt className="text-on-band/50">Заявки</dt>
            <dd className="mt-1 font-display text-2xl">24/7</dd>
          </div>
          <div>
            <dt className="text-on-band/50">Запуск</dt>
            <dd className="mt-1 font-display text-2xl">от 14 дней</dd>
          </div>
          <div>
            <dt className="text-on-band/50">Дубль</dt>
            <dd className="mt-1 font-display text-2xl">Telegram</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
