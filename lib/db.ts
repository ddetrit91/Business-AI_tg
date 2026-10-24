import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

export class TursoNotConfiguredError extends Error {
  constructor() {
    super("Turso is not configured: set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.");
    this.name = "TursoNotConfiguredError";
  }
}

export function getTurso(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new TursoNotConfiguredError();
  }

  client = createClient({ url, authToken });
  return client;
}

export async function ensureLeadsSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getTurso();
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
      await db.execute(`
        CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC)
      `);
    })();
  }

  await schemaReady;
}
