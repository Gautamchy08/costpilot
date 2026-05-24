// POST /api/summary
// Calls Gemini to generate a personalized audit summary
// Falls back to template if API fails

import { NextRequest, NextResponse } from "next/server";
import { generateAISummary } from "@/lib/gemini";
import type { AuditResult } from "@/types";

// Simple in-memory rate limiter (per IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

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
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const audit = body.audit as AuditResult;

    if (!audit || !audit.id) {
      return NextResponse.json({ error: "Invalid audit data" }, { status: 400 });
    }

    const summary = await generateAISummary(audit);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("POST /api/summary error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
