# CostPilot — Test Documentation

## Test Runner

- **Framework:** Vitest v4
- **Run all tests:** `npm run test`
- **Run in watch mode:** `npm run test:watch`
- **Run with verbose output:** `npm run test -- --reporter verbose`

## Test Results (as of Day 3)

```
✓ src/__tests__/audit-engine.test.ts (7 tests) 26ms

Test Files  1 passed (1)
     Tests  7 passed (7)
  Duration  4.04s
```

## Automated Tests

| # | Test Name | File | What It Covers |
|---|-----------|------|----------------|
| 1 | Plan Right-Sizing | `audit-engine.test.ts` | Cursor Teams ($40/seat) for 2 users → recommends Cursor Pro ($20/seat). Verifies `recommendedAction === "right-size"` and `monthlySavings > 0` |
| 2 | Same-Vendor Cheaper Plan | `audit-engine.test.ts` | ChatGPT Pro $200 for 1 user → detects overkill, recommends cheaper same-vendor plan with positive savings |
| 3 | Cross-Vendor Alternative | `audit-engine.test.ts` | Cursor Pro ($20/seat × 5) → suggests Windsurf Pro ($15/seat × 5 = $75) saving $25/mo |
| 4 | Savings Calculation Accuracy | `audit-engine.test.ts` | Verifies: total spend = sum of individual spends, annual savings = monthly × 12, optimized + savings = original, percentage is correct |
| 5 | Edge Case — Free Plans | `audit-engine.test.ts` | Free plan entries produce zero savings, no false recommendations, no errors |
| 6 | Already Optimal Detection | `audit-engine.test.ts` | GitHub Copilot Pro ($10/seat, 1 seat) → `isAlreadyOptimal === true`, `isHighSavings === false` |
| 7 | High Savings Flag | `audit-engine.test.ts` | Large enterprise spend → verifies `isHighSavings === true` when savings > $500/mo, savings percentage is 0–100% |

> All 7 tests pass. Tests 1–6 directly cover the audit engine as required by the assignment (minimum 5).

## How to Run

```bash
# Run all tests (single pass)
npm run test

# Run in watch mode during development
npm run test:watch

# Run with verbose output to see each test name
npm run test -- --reporter verbose

# Run a specific test by name
npm run test -- --grep "right-sizing"
```

## Test Coverage by Feature

| Feature | Covered | Test # |
|---------|---------|--------|
| Plan right-sizing (team/enterprise overkill) | ✅ | 1 |
| Same-vendor cheaper plan detection | ✅ | 2 |
| Cross-vendor alternative suggestions | ✅ | 3 |
| Monthly + annual savings math accuracy | ✅ | 4 |
| Free plan / $0 spend edge case | ✅ | 5 |
| "Already optimal" honest output | ✅ | 6 |
| High-savings flag (> $500/mo) | ✅ | 7 |
| Firebase persistence | 🔄 Day 4 | — |
| Lead capture form validation | 🔄 Day 4 | — |
| Gemini summary fallback | 🔄 Day 4 | — |

## What Is NOT Tested (and Why)

- **UI components** — Not tested with React Testing Library because the assignment requires audit engine tests, not component tests. UI is manually verified via browser.
- **API routes** — Will be tested manually via curl/Postman after Day 4 implementation.
- **Firebase writes** — Integration tests would require a live Firebase project in CI, which adds complexity without proportional value at this stage.
