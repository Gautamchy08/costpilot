// POST /api/lead
// Saves lead data to Firestore + sends confirmation email via Resend

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveLead } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, auditId, savingsAmount, companyName, role, teamSize, honeypot } = body;

    // Honeypot anti-spam check
    if (honeypot) {
      // Bot filled hidden field — silently accept but don't process
      return NextResponse.json({ success: true });
    }

    // Validate email
    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!auditId) {
      return NextResponse.json({ error: "Missing audit ID" }, { status: 400 });
    }

    // Save lead to Firestore
    await saveLead({
      auditId,
      email,
      companyName: companyName || undefined,
      role: role || undefined,
      teamSize: teamSize ? Number(teamSize) : undefined,
      savingsAmount: Number(savingsAmount) || 0,
    });

    // Send confirmation email via Resend
    const savingsText =
      savingsAmount > 0
        ? `$${savingsAmount}/mo ($${savingsAmount * 12}/year)`
        : "optimized spending";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your CostPilot AI Spend Audit Report",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your CostPilot Audit Report</title>
</head>
<body style="margin:0;padding:0;background:#0a0a1a;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background:linear-gradient(135deg,#0a0a1a 0%,#1a1a2e 50%,#16213e 100%);">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:28px;font-weight:800;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#6366f1;">⚡ CostPilot</p>
              <p style="margin:0;color:rgba(255,255,255,0.6);font-size:14px;">AI Spend Audit Report</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-top:0;padding:32px;">

              <p style="margin:0 0 16px;color:rgba(255,255,255,0.9);font-size:16px;line-height:1.6;">
                Hey ${email.split("@")[0]},
              </p>
              <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;">
                Your CostPilot audit is complete. Here's what we found:
              </p>

              <!-- Savings highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">Potential Savings Found</p>
                    <p style="margin:0;font-size:36px;font-weight:800;color:#ffffff;">${savingsText}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;">
                Your full audit breakdown — with per-tool recommendations and reasoning — is available at the link below. Share it with your CFO, CTO, or team lead.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/results"
                       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:15px;">
                      View Your Full Audit Report →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">
                Built by <a href="https://credex.rocks" style="color:#6366f1;text-decoration:none;">Credex</a> — we help startups and engineering teams save on AI infrastructure costs through discounted credits and spend optimization.
              </p>
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">
                You received this because you requested your CostPilot audit report. No spam, ever.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-top:0;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;">
                © 2026 Credex · <a href="https://credex.rocks" style="color:rgba(255,255,255,0.3);text-decoration:none;">credex.rocks</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/lead error:", err);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}
