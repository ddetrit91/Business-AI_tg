import { TursoNotConfiguredError } from "./db";
import { NextResponse } from "next/server";

export function storageErrorResponse(error: unknown) {
  if (error instanceof TursoNotConfiguredError) {
    return NextResponse.json(
      { error: "База заявок не настроена. Укажите TURSO_DATABASE_URL и TURSO_AUTH_TOKEN." },
      { status: 503 },
    );
  }
  console.error("Storage error", error);
  return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
}
