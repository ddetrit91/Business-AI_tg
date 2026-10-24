import { addLead } from "@/lib/leads";
import { notifyTelegram } from "@/lib/telegram";
import { parseLeadPayload } from "@/lib/validate";
import type { Lead } from "@/lib/types";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseLeadPayload(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...parsed.lead,
  };

  await addLead(lead);
  const telegram = await notifyTelegram(lead).catch((error) => {
    console.error("Telegram error", error);
    return { sent: false as const };
  });

  return NextResponse.json({ ok: true, id: lead.id, telegram: telegram.sent });
}
