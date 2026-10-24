"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { Lead, LeadStatus } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

const labels: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  closed: "Закрыта",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  const loadLeads = useCallback(async () => {
    const response = await fetch("/api/admin/leads");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    const payload = await response.json();
    setLeads(payload.leads ?? []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    loadLeads().finally(() => setChecking(false));
  }, [loadLeads]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Неверный пароль");
      return;
    }
    setPassword("");
    await loadLeads();
  }

  async function setStatus(id: string, status: LeadStatus) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await loadLeads();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  }

  if (checking) {
    return <main className="min-h-screen bg-paper p-8 text-graphite">Загружаем…</main>;
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-band px-5 text-on-band">
        <form onSubmit={login} className="w-full max-w-sm rounded-[2rem] bg-paper p-8 text-ink">
          <div className="mb-6">
            <ThemeToggle variant="on-page" />
          </div>
          <h1 className="font-display text-3xl">Админка СИГНАЛ</h1>
          <p className="mt-2 text-sm text-graphite">Вход только для команды. Страница не индексируется.</p>
          <label className="mt-8 grid gap-2 text-sm">
            Пароль
            <input
              type="password"
              className="rounded-xl border border-ink/15 px-4 py-3"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="mt-3 text-sm text-signal-deep">{error}</p> : null}
          <button type="submit" className="mt-6 w-full rounded-full bg-signal py-3 text-on-band">
            Войти
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 text-ink">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">Заявки</h1>
            <p className="mt-2 text-graphite">{leads.length} в журнале</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle variant="on-page" />
            <button type="button" onClick={logout} className="text-sm text-graphite">
              Выйти
            </button>
          </div>
        </div>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/15 text-graphite">
              <tr>
                <th className="py-3 pr-4">Дата</th>
                <th className="py-3 pr-4">Контакт</th>
                <th className="py-3 pr-4">Источник</th>
                <th className="py-3 pr-4">Квиз</th>
                <th className="py-3 pr-4">Статус</th>
                <th className="py-3"> </th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-graphite">
                    Заявок пока нет. Отправьте тестовую с лендинга.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-ink/10 align-top">
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="font-medium">{lead.name}</div>
                      <div>{lead.phone}</div>
                      {lead.email ? <div className="text-graphite">{lead.email}</div> : null}
                      {lead.comment ? <div className="mt-2 max-w-xs text-graphite">{lead.comment}</div> : null}
                    </td>
                    <td className="py-4 pr-4">{lead.source}</td>
                    <td className="py-4 pr-4">
                      {[lead.quiz?.service, lead.quiz?.budget, lead.quiz?.timeline]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <select
                        value={lead.status}
                        className="rounded-lg border border-ink/15 bg-transparent px-2 py-1"
                        onChange={(event) => setStatus(lead.id, event.target.value as LeadStatus)}
                      >
                        {Object.entries(labels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4">
                      <button type="button" className="text-signal-deep" onClick={() => remove(lead.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
