// CostPilot — Rule-Based Audit Engine
// Every recommendation traces back to pricing data in PRICING_DATA.md
// A finance person should read this and agree with every number.

import { nanoid } from "nanoid";
import type {
  AuditInput,
  AuditResult,
  ToolEntry,
  ToolRecommendation,
  UseCase,
} from "@/types";
import { TOOLS, getToolById } from "@/lib/pricing-data";

// ─── Cross-Vendor Alternatives by Use Case ────────────────────────────────
// Defensible: these are cheaper tools with comparable capability for the use case.
// Source: PRICING_DATA.md
const ALTERNATIVES: Record<
  string,
  { toolId: string; planId: string; reason: string }[]
> = {
  // For coding use case
  "cursor-coding": [
    {
      toolId: "windsurf",
      planId: "windsurf-pro",
      reason:
        "Windsurf Pro ($15/seat) offers comparable AI coding assistance to Cursor Pro ($20/seat) — same unlimited tab autocomplete, similar model access, at 25% less cost.",
    },
    {
      toolId: "github-copilot",
      planId: "copilot-pro",
      reason:
        "GitHub Copilot Pro ($10/seat) is deeply integrated into VS Code/JetBrains and costs 50% less than Cursor Pro for teams primarily using existing IDEs.",
    },
  ],
  "windsurf-coding": [
    {
      toolId: "github-copilot",
      planId: "copilot-pro",
      reason:
        "GitHub Copilot Pro ($10/seat) costs 33% less than Windsurf Pro ($15/seat) and offers comparable code completion with tighter IDE integration.",
    },
  ],
  // For writing/research use case
  "chatgpt-writing": [
    {
      toolId: "claude",
      planId: "claude-pro",
      reason:
        "Claude Pro ($20/mo) matches ChatGPT Plus ($20/mo) in price but consistently outperforms on long-form writing tasks and document analysis.",
    },
  ],
  "claude-writing": [
    {
      toolId: "chatgpt",
      planId: "chatgpt-plus",
      reason:
        "ChatGPT Plus ($20/mo) matches Claude Pro in price and offers Deep Research, Sora, and broader tool integrations for mixed writing workflows.",
    },
  ],
};

// ─── Plan Right-Sizing Rules ──────────────────────────────────────────────
// If a user is on a Team/Enterprise plan with very few seats, they're overpaying.
function checkRightSizing(
  entry: ToolEntry,
  teamSize: number
): { shouldDowngrade: boolean; reason: string } {
  const tool = getToolById(entry.toolId);
  if (!tool) return { shouldDowngrade: false, reason: "" };

  const currentPlan = tool.plans.find((p) => p.id === entry.planId);
  if (!currentPlan) return { shouldDowngrade: false, reason: "" };

  // Rule: Team plan for ≤3 users is usually overkill
  if (currentPlan.category === "team" && entry.seats <= 3) {
    const individualPlan = tool.plans.find(
      (p) => p.category === "individual" && p.pricePerSeat > 0
    );
    if (individualPlan) {
      const currentCostPerSeat = currentPlan.pricePerSeat;
      const individualCostPerSeat = individualPlan.pricePerSeat;
      if (currentCostPerSeat > individualCostPerSeat) {
        return {
          shouldDowngrade: true,
          reason: `${currentPlan.name} is designed for larger teams. With only ${entry.seats} seat(s), ${individualPlan.name} ($${individualCostPerSeat}/seat) covers the same functionality at a lower cost.`,
        };
      }
    }
  }

  // Rule: Enterprise plan for <10 users is almost always overkill
  if (currentPlan.category === "enterprise" && entry.seats < 10) {
    const teamPlan = tool.plans.find((p) => p.category === "team");
    const individualPlan = tool.plans.find(
      (p) => p.category === "individual" && p.pricePerSeat > 0
    );
    const betterPlan = teamPlan || individualPlan;
    if (betterPlan) {
      return {
        shouldDowngrade: true,
        reason: `Enterprise plans require dedicated support contracts and are priced for 10+ seat organizations. With ${entry.seats} seat(s), ${betterPlan.name} delivers the same AI capability without the enterprise overhead.`,
      };
    }
  }

  return { shouldDowngrade: false, reason: "" };
}

// ─── Same-Vendor Cheaper Plan ─────────────────────────────────────────────
// Find a cheaper plan from the same vendor that fits the team's usage
function findCheaperSameVendorPlan(
  entry: ToolEntry
): { planId: string; newSpend: number; reason: string } | null {
  const tool = getToolById(entry.toolId);
  if (!tool) return null;

  const currentPlan = tool.plans.find((p) => p.id === entry.planId);
  if (!currentPlan) return null;

  // Calculate current effective cost per seat
  const currentTotal = entry.monthlySpend;

  // Find cheaper paid plans (not free, not current)
  const cheaperPlans = tool.plans
    .filter((p) => {
      if (p.id === entry.planId) return false;
      if (p.category === "free") return false;
      if (p.category === "api") return false;
      // Check if minSeats constraint is satisfied
      if (p.minSeats && entry.seats < p.minSeats) return false;

      const planTotal = p.isPerSeat
        ? p.pricePerSeat * entry.seats
        : p.pricePerSeat;
      return planTotal < currentTotal;
    })
    .sort((a, b) => {
      const aTotal = a.isPerSeat ? a.pricePerSeat * entry.seats : a.pricePerSeat;
      const bTotal = b.isPerSeat ? b.pricePerSeat * entry.seats : b.pricePerSeat;
      return aTotal - bTotal; // cheapest first
    });

  if (cheaperPlans.length === 0) return null;

  const best = cheaperPlans[0];
  const newTotal = best.isPerSeat
    ? best.pricePerSeat * entry.seats
    : best.pricePerSeat;
  const savings = currentTotal - newTotal;

  if (savings < 5) return null; // Not worth recommending for tiny savings

  return {
    planId: best.id,
    newSpend: newTotal,
    reason: `${best.name} covers the same core functionality as ${currentPlan.name} for your usage pattern. The higher-tier plan is typically for heavy power users or large enterprises — savings of $${savings.toFixed(0)}/mo with no meaningful loss of capability.`,
  };
}

// ─── Cross-Vendor Alternative ─────────────────────────────────────────────
function findCrossVendorAlternative(
  entry: ToolEntry,
  useCase: UseCase,
  currentTotal: number
): { toolId: string; planId: string; newSpend: number; reason: string } | null {
  const altKey = `${entry.toolId}-${useCase}`;
  const fallbackKey = `${entry.toolId}-coding`; // fallback for coding tools
  const alternatives =
    ALTERNATIVES[altKey] || ALTERNATIVES[fallbackKey] || [];

  for (const alt of alternatives) {
    const altTool = getToolById(alt.toolId);
    if (!altTool) continue;

    const altPlan = altTool.plans.find((p) => p.id === alt.planId);
    if (!altPlan) continue;

    const altTotal = altPlan.isPerSeat
      ? altPlan.pricePerSeat * entry.seats
      : altPlan.pricePerSeat;

    if (altTotal < currentTotal && currentTotal - altTotal >= 10) {
      return {
        toolId: alt.toolId,
        planId: alt.planId,
        newSpend: altTotal,
        reason: alt.reason,
      };
    }
  }

  return null;
}

// ─── Core Audit Function ──────────────────────────────────────────────────
export function runAudit(input: AuditInput): AuditResult {
  const recommendations: ToolRecommendation[] = [];

  for (const entry of input.tools) {
    const tool = getToolById(entry.toolId);
    if (!tool) continue;

    const currentPlan = tool.plans.find((p) => p.id === entry.planId);
    if (!currentPlan) continue;

    const currentSpend = entry.monthlySpend;
    let bestAction: ToolRecommendation | null = null;

    // ── Check 1: Right-sizing (team/enterprise overkill) ──────────────
    const rightSize = checkRightSizing(entry, input.teamSize);
    if (rightSize.shouldDowngrade) {
      const individualPlan = tool.plans.find(
        (p) =>
          p.category === "individual" &&
          p.pricePerSeat > 0 &&
          (!p.minSeats || entry.seats >= p.minSeats)
      );
      if (individualPlan) {
        const newSpend = individualPlan.isPerSeat
          ? individualPlan.pricePerSeat * entry.seats
          : individualPlan.pricePerSeat;
        const savings = currentSpend - newSpend;
        if (savings > 0) {
          bestAction = {
            toolId: entry.toolId,
            toolName: tool.name,
            currentPlan: currentPlan.name,
            currentSpend,
            recommendedAction: "right-size",
            recommendedPlan: individualPlan.name,
            newSpend,
            monthlySavings: savings,
            reason: rightSize.reason,
          };
        }
      }
    }

    // ── Check 2: Same-vendor cheaper plan ─────────────────────────────
    if (!bestAction) {
      const cheaper = findCheaperSameVendorPlan(entry);
      if (cheaper) {
        const savings = currentSpend - cheaper.newSpend;
        const betterPlan = tool.plans.find((p) => p.id === cheaper.planId);
        if (betterPlan && savings > 0) {
          bestAction = {
            toolId: entry.toolId,
            toolName: tool.name,
            currentPlan: currentPlan.name,
            currentSpend,
            recommendedAction: "downgrade",
            recommendedPlan: betterPlan.name,
            newSpend: cheaper.newSpend,
            monthlySavings: savings,
            reason: cheaper.reason,
          };
        }
      }
    }

    // ── Check 3: Cross-vendor alternative ─────────────────────────────
    if (!bestAction) {
      const alt = findCrossVendorAlternative(
        entry,
        input.useCase,
        currentSpend
      );
      if (alt) {
        const altTool = getToolById(alt.toolId);
        const altPlan = altTool?.plans.find((p) => p.id === alt.planId);
        const savings = currentSpend - alt.newSpend;
        if (altTool && altPlan && savings > 0) {
          bestAction = {
            toolId: entry.toolId,
            toolName: tool.name,
            currentPlan: currentPlan.name,
            currentSpend,
            recommendedAction: "switch",
            recommendedPlan: `${altTool.name} — ${altPlan.name}`,
            recommendedTool: altTool.name,
            newSpend: alt.newSpend,
            monthlySavings: savings,
            reason: alt.reason,
          };
        }
      }
    }

    // ── Check 4: Credex credits (for already-optimal or high spenders) ─
    if (!bestAction && currentSpend >= 50) {
      const credexSavings = Math.round(currentSpend * 0.2); // ~20% via credits
      if (credexSavings >= 10) {
        bestAction = {
          toolId: entry.toolId,
          toolName: tool.name,
          currentPlan: currentPlan.name,
          currentSpend,
          recommendedAction: "use-credits",
          recommendedPlan: currentPlan.name,
          newSpend: currentSpend - credexSavings,
          monthlySavings: credexSavings,
          reason: `Your plan is well-matched to your usage, but Credex can source ${tool.name} credits at 15–25% below retail from companies that over-forecasted AI infrastructure needs. Estimated savings: ~$${credexSavings}/mo.`,
        };
      }
    }

    // ── No savings found — already optimal ────────────────────────────
    if (!bestAction) {
      bestAction = {
        toolId: entry.toolId,
        toolName: tool.name,
        currentPlan: currentPlan.name,
        currentSpend,
        recommendedAction: "keep",
        recommendedPlan: currentPlan.name,
        newSpend: currentSpend,
        monthlySavings: 0,
        reason: `${tool.name} ${currentPlan.name} is well-matched to your team size and use case. No meaningful savings available without changing your workflow.`,
      };
    }

    recommendations.push(bestAction);
  }

  // ── Compute totals ─────────────────────────────────────────────────
  const totalMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.currentSpend,
    0
  );
  const totalOptimizedSpend = recommendations.reduce(
    (sum, r) => sum + r.newSpend,
    0
  );
  const totalMonthlySavings = totalMonthlySpend - totalOptimizedSpend;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const savingsPercentage =
    totalMonthlySpend > 0
      ? Math.round((totalMonthlySavings / totalMonthlySpend) * 100)
      : 0;

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    recommendations,
    totalMonthlySpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsPercentage,
    aiSummary: null,
    isHighSavings: totalMonthlySavings > 500,
    isAlreadyOptimal: totalMonthlySavings < 100,
  };
}
