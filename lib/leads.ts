import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Lead, LeadStatus } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "leads.json");

let writeChain: Promise<unknown> = Promise.resolve();

async function readLeadsUnsafe(): Promise<Lead[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLeadsUnsafe(leads: Lead[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(leads, null, 2), "utf8");
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeChain.then(task, task);
  writeChain = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

export async function listLeads(): Promise<Lead[]> {
  return enqueue(async () => {
    const leads = await readLeadsUnsafe();
    return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
}

export async function addLead(lead: Lead): Promise<Lead> {
  return enqueue(async () => {
    const leads = await readLeadsUnsafe();
    leads.push(lead);
    await writeLeadsUnsafe(leads);
    return lead;
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  return enqueue(async () => {
    const leads = await readLeadsUnsafe();
    const index = leads.findIndex((item) => item.id === id);
    if (index < 0) return null;
    leads[index] = { ...leads[index], status };
    await writeLeadsUnsafe(leads);
    return leads[index];
  });
}

export async function deleteLead(id: string): Promise<boolean> {
  return enqueue(async () => {
    const leads = await readLeadsUnsafe();
    const next = leads.filter((item) => item.id !== id);
    if (next.length === leads.length) return false;
    await writeLeadsUnsafe(next);
    return true;
  });
}
