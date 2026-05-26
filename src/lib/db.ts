// Server-side Firestore helpers — uses Firebase Admin SDK
// Safe to use in: API routes, server components
// DO NOT import in 'use client' components

import { getAdminDb } from "@/lib/firebase-admin";
import type { AuditResult, LeadData } from "@/types";

const AUDITS = "audits";
const LEADS = "leads";

// ─── Save Audit ───────────────────────────────────────────────────────────
export async function saveAudit(audit: AuditResult): Promise<string> {
  const db = getAdminDb();
  const ref = await db.collection(AUDITS).add({
    ...audit,
    serverCreatedAt: new Date().toISOString(),
  });
  return ref.id;
}

// ─── Get Audit by ID ──────────────────────────────────────────────────────
export async function getAudit(id: string): Promise<AuditResult | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection(AUDITS).doc(id).get();
    if (!snap.exists) return null;
    return snap.data() as AuditResult;
  } catch {
    return null;
  }
}

// ─── Save Lead ────────────────────────────────────────────────────────────
export async function saveLead(lead: Omit<LeadData, "createdAt">): Promise<string> {
  const db = getAdminDb();
  const ref = await db.collection(LEADS).add({
    ...lead,
    createdAt: new Date().toISOString(),
    serverCreatedAt: new Date().toISOString(),
  });
  return ref.id;
}
