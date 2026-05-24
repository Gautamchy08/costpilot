// CostPilot — Firestore DB helpers
// All database operations go through here for consistency

import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AuditResult, LeadData } from "@/types";

// ─── Collections ──────────────────────────────────────────────────────────
const AUDITS_COLLECTION = "audits";
const LEADS_COLLECTION = "leads";

// ─── Save Audit to Firestore ──────────────────────────────────────────────
export async function saveAudit(audit: AuditResult): Promise<string> {
  const docRef = await addDoc(collection(db, AUDITS_COLLECTION), {
    ...audit,
    serverCreatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Get Audit by ID ──────────────────────────────────────────────────────
export async function getAudit(id: string): Promise<AuditResult | null> {
  const docRef = doc(db, AUDITS_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as AuditResult;
}

// ─── Save Lead to Firestore ───────────────────────────────────────────────
export async function saveLead(lead: Omit<LeadData, "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
    ...lead,
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  });
  return docRef.id;
}
