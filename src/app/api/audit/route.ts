// POST /api/audit
// Saves a completed audit to Firestore
// Returns the Firestore document ID (used for shareable URL)

import { NextRequest, NextResponse } from "next/server";
import { saveAudit } from "@/lib/db";
import type { AuditResult } from "@/types";

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const audit = body.audit as AuditResult;

    if (!audit || !audit.id || !audit.recommendations) {
      return NextResponse.json({ error: "Invalid audit data" }, { status: 400 });
    }

    const firestoreId = await saveAudit(audit);
    return NextResponse.json({ id: firestoreId, auditId: audit.id });
  } catch (err) {
    console.error("POST /api/audit error:", err);
    return NextResponse.json(
      { error: "Failed to save audit" },
      { status: 500 }
    );
  }
}
