// CostPilot — Gemini AI Summary Generator
// Generates a ~100-word personalized audit summary
// Falls back to a template if the API fails

import type { AuditResult } from "@/types";

// ─── Fallback template (no API needed) ───────────────────────────────────
export function generateFallbackSummary(audit: AuditResult): string {
  const { input, recommendations, totalMonthlySpend, totalMonthlySavings, totalAnnualSavings } = audit;

  const topSaving = [...recommendations]
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  if (totalMonthlySavings < 100) {
    return `Your ${input.teamSize}-person team is spending $${totalMonthlySpend}/mo on AI tools — and you're spending well. We analyzed your full stack and found your current plans are well-matched to your team size and ${input.useCase} use case. No significant savings are available right now. We'll keep an eye on pricing changes and alternative tools that could unlock savings in the future.`;
  }

  const credexNote =
    audit.isHighSavings
      ? ` For savings this large, Credex can source discounted AI credits to save an additional 15–25% on top.`
      : "";

  return `Your ${input.teamSize}-person team is spending $${totalMonthlySpend}/mo on AI tools, but our analysis found $${totalMonthlySavings}/mo ($${totalAnnualSavings}/year) in potential savings.${topSaving ? ` The biggest opportunity: ${topSaving.toolName} — ${topSaving.reason.split(".")[0].toLowerCase()}, saving $${topSaving.monthlySavings}/mo alone.` : ""} Review the detailed breakdown below and start with the highest-impact change first.${credexNote}`;
}

// ─── Gemini-powered summary ───────────────────────────────────────────────
export async function generateAISummary(audit: AuditResult): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return generateFallbackSummary(audit);

  const toolsText = audit.recommendations
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo → ${r.recommendedAction === "keep" ? "keep" : `${r.recommendedPlan}, saves $${r.monthlySavings}/mo`}`
    )
    .join("\n");

  const userPrompt = `Generate a personalized audit summary for this AI spend analysis:

Team size: ${audit.input.teamSize} people
Primary use case: ${audit.input.useCase}
Total monthly AI spend: $${audit.totalMonthlySpend}

Tools analyzed:
${toolsText}

Total potential monthly savings: $${audit.totalMonthlySavings}
Total potential annual savings: $${audit.totalAnnualSavings}

Write a concise 80-120 word summary paragraph highlighting the key findings and recommended actions. Be specific with dollar amounts and tool names. End with one actionable next step.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are a friendly AI infrastructure cost advisor. Write clear, data-driven summaries for engineering leaders. Rules: 80-120 words exactly, lead with the most impactful finding, mention specific dollar amounts, never manufacture savings, end with a specific actionable next step. If savings > $500/mo, mention Credex can help capture additional savings through discounted credits.`
            }]
          },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return generateFallbackSummary(audit);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return generateFallbackSummary(audit);
    return text.trim();
  } catch (err) {
    console.error("Gemini summary failed, using fallback:", err);
    return generateFallbackSummary(audit);
  }
}
