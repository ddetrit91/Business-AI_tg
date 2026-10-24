import { ensureLeadsSchema, getTurso } from "./db";
import type { Lead, LeadStatus, QuizAnswers } from "./types";

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  comment: string | null;
  source: string;
  status: string;
  quiz_json: string | null;
};

function rowToLead(row: LeadRow): Lead {
  let quiz: QuizAnswers | undefined;
  if (row.quiz_json) {
    try {
      quiz = JSON.parse(row.quiz_json) as QuizAnswers;
    } catch {
      quiz = undefined;
    }
  }

  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    comment: row.comment ?? undefined,
    source: row.source as Lead["source"],
    status: row.status as LeadStatus,
    quiz,
  };
}

export async function listLeads(): Promise<Lead[]> {
  await ensureLeadsSchema();
  const db = getTurso();
  const result = await db.execute({
    sql: `SELECT id, created_at, name, phone, email, comment, source, status, quiz_json
          FROM leads
          ORDER BY created_at DESC`,
    args: [],
  });

  return result.rows.map((row) =>
    rowToLead({
      id: String(row.id),
      created_at: String(row.created_at),
      name: String(row.name),
      phone: String(row.phone),
      email: row.email == null ? null : String(row.email),
      comment: row.comment == null ? null : String(row.comment),
      source: String(row.source),
      status: String(row.status),
      quiz_json: row.quiz_json == null ? null : String(row.quiz_json),
    }),
  );
}

export async function addLead(lead: Lead): Promise<Lead> {
  await ensureLeadsSchema();
  const db = getTurso();
  const quizJson = lead.quiz ? JSON.stringify(lead.quiz) : null;

  await db.execute({
    sql: `INSERT INTO leads (
            id, created_at, name, phone, email, comment, source, status, quiz_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      lead.id,
      lead.createdAt,
      lead.name,
      lead.phone,
      lead.email ?? null,
      lead.comment ?? null,
      lead.source,
      lead.status,
      quizJson,
    ],
  });

  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  await ensureLeadsSchema();
  const db = getTurso();
  const existing = await db.execute({
    sql: `SELECT id FROM leads WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (existing.rows.length === 0) return null;

  await db.execute({
    sql: `UPDATE leads SET status = ? WHERE id = ?`,
    args: [status, id],
  });

  const result = await db.execute({
    sql: `SELECT id, created_at, name, phone, email, comment, source, status, quiz_json
          FROM leads WHERE id = ? LIMIT 1`,
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return null;

  return rowToLead({
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    phone: String(row.phone),
    email: row.email == null ? null : String(row.email),
    comment: row.comment == null ? null : String(row.comment),
    source: String(row.source),
    status: String(row.status),
    quiz_json: row.quiz_json == null ? null : String(row.quiz_json),
  });
}

export async function deleteLead(id: string): Promise<boolean> {
  await ensureLeadsSchema();
  const db = getTurso();
  const result = await db.execute({
    sql: `DELETE FROM leads WHERE id = ?`,
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
