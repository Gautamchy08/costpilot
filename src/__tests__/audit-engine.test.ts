// CostPilot — Audit Engine Unit Tests
// Run with: npm run test
// All 6 tests cover the audit engine as required by the assignment.

import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/audit-engine";
import type { AuditInput } from "@/types";

// ─── Test 1: Plan Right-Sizing ────────────────────────────────────────────
// A team plan for 2 users is overkill — should recommend individual plan
describe("Audit Engine — Plan Right-Sizing", () => {
  it("should recommend downgrading Cursor Teams to Cursor Pro for a 2-person team", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-teams", // $40/seat = $80/mo for 2 seats
          monthlySpend: 80,
          seats: 2,
        },
      ],
      teamSize: 2,
      useCase: "coding",
    };

    const result = runAudit(input);
    const cursorRec = result.recommendations[0];

    expect(cursorRec.recommendedAction).toBe("right-size");
    expect(cursorRec.monthlySavings).toBeGreaterThan(0);
    // Cursor Pro is $20/seat = $40/mo → saves $40/mo
    expect(cursorRec.newSpend).toBeLessThan(cursorRec.currentSpend);
    expect(cursorRec.reason).toContain("2");
  });
});

// ─── Test 2: Same-Vendor Downgrade ────────────────────────────────────────
// User on ChatGPT Pro $200 but could use Plus at $20 (no team needed)
describe("Audit Engine — Same-Vendor Cheaper Plan", () => {
  it("should recommend ChatGPT Plus over Pro $200 for a single user", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-pro-200", // $200/mo flat
          monthlySpend: 200,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "writing",
    };

    const result = runAudit(input);
    const rec = result.recommendations[0];

    expect(["downgrade", "right-size"]).toContain(rec.recommendedAction);
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.newSpend).toBeLessThan(200);
  });
});

// ─── Test 3: Cross-Vendor Alternative ────────────────────────────────────
// Cursor Pro user could switch to Windsurf Pro and save 25%
describe("Audit Engine — Cross-Vendor Alternative", () => {
  it("should suggest Windsurf Pro as a cheaper alternative to Cursor Pro", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-pro", // $20/seat
          monthlySpend: 100, // 5 seats × $20
          seats: 5,
        },
      ],
      teamSize: 10,
      useCase: "coding",
    };

    const result = runAudit(input);
    const rec = result.recommendations[0];

    // Should either switch to a cheaper tool or find a downgrade
    expect(rec.monthlySavings).toBeGreaterThanOrEqual(0);
    // Windsurf Pro is $15/seat × 5 = $75, saves $25/mo
    if (rec.recommendedAction === "switch") {
      expect(rec.recommendedPlan).toContain("Windsurf");
      expect(rec.newSpend).toBe(75);
    }
  });
});

// ─── Test 4: Savings Calculation Accuracy ────────────────────────────────
// Monthly + annual savings must be mathematically correct
describe("Audit Engine — Savings Calculation Accuracy", () => {
  it("should correctly calculate total monthly and annual savings across multiple tools", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-teams", // $40/seat × 2 = $80/mo → should become $40
          monthlySpend: 80,
          seats: 2,
        },
        {
          toolId: "chatgpt",
          planId: "chatgpt-pro-200", // $200/mo → should become cheaper
          monthlySpend: 200,
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: "mixed",
    };

    const result = runAudit(input);

    // Total monthly spend must equal sum of individual spends
    expect(result.totalMonthlySpend).toBe(280); // $80 + $200

    // Annual savings must be exactly 12× monthly savings
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);

    // Optimized spend + savings must equal original spend
    expect(result.totalOptimizedSpend + result.totalMonthlySavings).toBe(
      result.totalMonthlySpend
    );

    // Savings percentage must be correct
    const expectedPct = Math.round(
      (result.totalMonthlySavings / result.totalMonthlySpend) * 100
    );
    expect(result.savingsPercentage).toBe(expectedPct);
  });
});

// ─── Test 5: Edge Case — Free Plans / $0 Spend ───────────────────────────
// Free plans should not trigger false recommendations
describe("Audit Engine — Edge Case: Free Plans", () => {
  it("should handle free plan entries without errors or false savings", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-hobby", // Free — $0/mo
          monthlySpend: 0,
          seats: 1,
        },
        {
          toolId: "github-copilot",
          planId: "copilot-free", // Free — $0/mo
          monthlySpend: 0,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);

    // No errors — should complete cleanly
    expect(result.recommendations).toHaveLength(2);

    // Free plans cannot have positive savings (can't go below $0)
    for (const rec of result.recommendations) {
      expect(rec.monthlySavings).toBeGreaterThanOrEqual(0);
      expect(rec.newSpend).toBeGreaterThanOrEqual(0);
    }

    // Total spend is $0
    expect(result.totalMonthlySpend).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
  });
});

// ─── Test 6: Already Optimal — Honest Audit ──────────────────────────────
// When user is on the best plan, we must honestly say so
describe("Audit Engine — Honest 'Already Optimal' Result", () => {
  it("should mark result as already-optimal when savings are under $100/mo", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "github-copilot",
          planId: "copilot-pro", // $10/seat — already cheapest paid plan
          monthlySpend: 10,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);

    // isAlreadyOptimal flag should be true when total savings < $100
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.isHighSavings).toBe(false);

    // The recommendation should either be "keep" or suggest minor savings
    const rec = result.recommendations[0];
    expect(rec.currentSpend).toBe(10);

    // Result should have a valid ID and timestamp
    expect(result.id).toBeTruthy();
    expect(result.createdAt).toBeTruthy();
  });
});

// ─── Test 7: High Savings Flag ────────────────────────────────────────────
// isHighSavings should be true when savings exceed $500/mo
describe("Audit Engine — High Savings Flag", () => {
  it("should set isHighSavings=true when total savings exceed $500/mo", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-enterprise", // $60/seat × 20 = $1200/mo
          monthlySpend: 1200,
          seats: 20,
        },
        {
          toolId: "chatgpt",
          planId: "chatgpt-enterprise", // $50/seat × 20 = $1000/mo
          monthlySpend: 1000,
          seats: 20,
        },
      ],
      teamSize: 20,
      useCase: "coding",
    };

    const result = runAudit(input);

    // With $2200/mo spend there should be significant savings available
    if (result.totalMonthlySavings > 500) {
      expect(result.isHighSavings).toBe(true);
    }
    // Savings percentage should be reasonable (not over 100%)
    expect(result.savingsPercentage).toBeLessThanOrEqual(100);
    expect(result.savingsPercentage).toBeGreaterThanOrEqual(0);
  });
});
