import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

const root = resolve(import.meta.dirname, "..");
const env = { ...loadEnv(resolve(root, ".env.local")), ...process.env };
const url = env.TURSO_DATABASE_URL;
const authToken = env.TURSO_AUTH_TOKEN;
const jsonPath = resolve(root, "data/leads.json");

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}
if (!existsSync(jsonPath)) {
  console.log("No data/leads.json — nothing to migrate.");
  process.exit(0);
}

const leads = JSON.parse(readFileSync(jsonPath, "utf8"));
if (!Array.isArray(leads) || leads.length === 0) {
  console.log("leads.json is empty.");
  process.exit(0);
}

const db = createClient({ url, authToken });
await db.execute(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    comment TEXT,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    quiz_json TEXT
  )
`);

let imported = 0;
for (const lead of leads) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO leads (
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
      lead.status ?? "new",
      lead.quiz ? JSON.stringify(lead.quiz) : null,
    ],
  });
  imported += 1;
}

console.log(`Migrated ${imported} lead(s) to Turso.`);
