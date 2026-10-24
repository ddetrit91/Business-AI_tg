"use client";

import { ThemeToggle } from "./theme/ThemeToggle";
import { useState } from "react";

const links = [
  { href: "#advantages", label: "Почему мы" },
  { href: "#process", label: "Как работаем" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "Вопросы" },
];

export function Header({ onAskAi }: { onAskAi: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-band/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6">
        <a href="#top" className="font-display text-lg tracking-tight text-on-band">
          СИГНАЛ
        </a>
        <nav className="hidden items-center gap-8 text-sm text-on-band/80 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-on-band">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <button
            type="button"
            onClick={onAskAi}
            className="rounded-full border border-on-band/25 px-4 py-2 text-sm text-on-band"
          >
            Спросить ИИ
          </button>
          <a
            href="#lead"
            className="rounded-full bg-signal px-4 py-2 text-sm font-medium text-on-band"
          >
            Рассчитать проект
          </a>
        </div>
        <button
          type="button"
          className="text-on-band md:hidden"
          aria-label="Меню"
          onClick={() => setOpen((value) => !value)}
        >
          Меню
        </button>
      </div>
      {open ? (
        <div className="mx-5 rounded-2xl bg-paper p-5 text-ink md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <button type="button" className="text-left" onClick={() => { setOpen(false); onAskAi(); }}>
              Спросить ИИ
            </button>
            <a href="#lead" onClick={() => setOpen(false)}>
              Рассчитать проект
            </a>
            <ThemeToggle variant="on-page" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
