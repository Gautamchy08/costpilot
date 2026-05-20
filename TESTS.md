# CostPilot — Test Documentation

## Test Runner

- **Framework:** Vitest
- **Run all tests:** `npm run test`
- **Run with coverage:** `npm run test -- --coverage`

## Automated Tests

| # | Filename | What It Covers | Command |
|---|----------|----------------|---------|
| 1 | `src/__tests__/audit-engine.test.ts` | Plan right-sizing: detects when a Team plan is overkill for small teams (e.g., 2 users on Cursor Teams) | `npm run test -- audit-engine` |
| 2 | `src/__tests__/audit-engine.test.ts` | Same-vendor downgrade: recommends cheaper plan from same vendor when usage doesn't justify current tier | `npm run test -- audit-engine` |
| 3 | `src/__tests__/audit-engine.test.ts` | Cross-vendor alternatives: suggests cheaper alternative tools for the same use case | `npm run test -- audit-engine` |
| 4 | `src/__tests__/audit-engine.test.ts` | Savings calculation: correctly computes monthly and annual savings across all tools | `npm run test -- audit-engine` |
| 5 | `src/__tests__/audit-engine.test.ts` | Edge case: handles $0 spend (free plans) without errors or false recommendations | `npm run test -- audit-engine` |
| 6 | `src/__tests__/audit-engine.test.ts` | Honest audit: returns "already optimal" when user is on the best plan for their usage | `npm run test -- audit-engine` |
| 7 | `src/__tests__/pricing-data.test.ts` | Pricing data integrity: all tools have valid pricing entries with required fields | `npm run test -- pricing-data` |
| 8 | `src/__tests__/form-persistence.test.ts` | Form state: data persists in localStorage and restores correctly on reload | `npm run test -- form-persistence` |

> Tests 1–6 specifically cover the audit engine as required by the assignment (minimum 5).
> Additional tests cover pricing data integrity and form persistence.

## How to Run

```bash
# Run all tests
npm run test

# Run only audit engine tests
npm run test -- --grep "audit-engine"

# Run with verbose output
npm run test -- --reporter verbose

# Run in watch mode during development
npm run test -- --watch
```
