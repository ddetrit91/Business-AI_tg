import { isAdminAuthenticated } from "@/lib/auth";
import { deleteLead, listLeads, updateLeadStatus } from "@/lib/leads";
import { storageErrorResponse } from "@/lib/storage-error";
import type { LeadStatus } from "@/lib/types";
import { NextResponse } from "next/server";

async function unauthorized() {
  return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    return storageErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as LeadStatus;
  if (!id || !["new", "in_progress", "closed"].includes(status)) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  try {
    const lead = await updateLeadStatus(id, status);
    if (!lead) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch (error) {
    return storageErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "Нет идентификатора" }, { status: 400 });
  try {
    const removed = await deleteLead(id);
    if (!removed) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return storageErrorResponse(error);
  }
}
