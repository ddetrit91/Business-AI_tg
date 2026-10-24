export function Footer() {
  return (
    <footer className="bg-paper px-5 py-16 text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-ink/10 pt-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">СИГНАЛ</p>
          <p className="mt-3 max-w-xs text-graphite">Веб-студия. Сайты с ИИ-сбором заявок.</p>
        </div>
        <div className="grid gap-2 text-sm">
          <a href="tel:+74951204418">+7 (495) 120-44-18</a>
          <a href="mailto:hello@signal.studio">hello@signal.studio</a>
          <a href="https://t.me/signal_studio" target="_blank" rel="noreferrer">
            Telegram @signal_studio
          </a>
        </div>
        <div className="text-sm text-graphite">
          <p>Москва, Большая Никитская, 21</p>
          <p className="mt-2">ООО «СИГНАЛ СТУДИО»</p>
          <p>ИНН 7703401122 · ОГРН 1237700000000</p>
          <p className="mt-4">Пн–пт, 10:00–19:00</p>
        </div>
      </div>
    </footer>
  );
}
