// Dynamic OG Image generator
// Route: GET /api/og?savings=680&spend=2340&team=12
// Returns a PNG image for Twitter/LinkedIn social preview cards

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const savings = Number(searchParams.get("savings") ?? 0);
  const spend = Number(searchParams.get("spend") ?? 0);
  const team = Number(searchParams.get("team") ?? 1);
  const pct = spend > 0 ? Math.round((savings / spend) * 100) : 0;

  const hasSignificantSavings = savings >= 100;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: -100, left: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
            borderRadius: 12, padding: "8px 16px",
            fontSize: 20, fontWeight: 800, color: "white",
          }}>⚡</div>
          <span style={{ fontSize: 24, fontWeight: 800, color: "white" }}>CostPilot</span>
        </div>

        {/* Main savings number */}
        {hasSignificantSavings ? (
          <>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>
              AI Spend Savings Found
            </div>
            <div style={{
              fontSize: 120, fontWeight: 900, color: "white",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              marginBottom: 8,
            }}>
              ${savings.toLocaleString()}<span style={{ fontSize: 40, fontWeight: 400, color: "rgba(255,255,255,0.4)", WebkitTextFillColor: "rgba(255,255,255,0.4)" }}>/mo</span>
            </div>
            <div style={{ fontSize: 32, color: "rgba(255,255,255,0.6)", marginBottom: 40 }}>
              ${(savings * 12).toLocaleString()}/year · {pct}% savings
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginBottom: 16, letterSpacing: 2, textTransform: "uppercase" }}>
              AI Spend Audit
            </div>
            <div style={{
              fontSize: 64, fontWeight: 900, color: "white", marginBottom: 16, textAlign: "center",
            }}>
              Already Optimized ✓
            </div>
            <div style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>
              ${spend.toLocaleString()}/mo · {team}-person team
            </div>
          </>
        )}

        {/* Team info pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 24,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 100, padding: "12px 28px",
        }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
            {team}-person team · Current spend: ${spend.toLocaleString()}/mo
          </span>
        </div>

        {/* CTA */}
        <div style={{
          position: "absolute", bottom: 32, right: 48,
          fontSize: 16, color: "rgba(255,255,255,0.3)",
        }}>
          Free 2-min audit → costpilot.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
