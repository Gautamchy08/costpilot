# CostPilot — Metrics

## North Star Metric

**Qualified Leads Generated per Week**

A "qualified lead" = a user who completes the audit, has >$500/mo in identified savings, and provides their email address.

**Why this metric:** CostPilot is a B2B lead-generation tool for Credex. The ultimate value is not page views or even completed audits — it's qualified leads that Credex's sales team can convert into credit purchases. This metric directly measures the tool's business impact and ties to revenue.

DAU or MAU would be misleading metrics for a tool people use once a quarter. "Total audits" doesn't capture quality. "Qualified leads" filters for both engagement AND commercial intent.

## 3 Input Metrics That Drive the North Star

### 1. Audit Completion Rate
**Definition:** % of users who start the spend input form and complete it through to seeing results.
**Current target:** 60%+
**Why it matters:** If users abandon the form, we never generate leads. A low completion rate signals the form is too long, confusing, or not delivering enough perceived value. This is the top-of-funnel health metric.

### 2. Savings-to-Spend Ratio
**Definition:** Average (identified monthly savings / reported monthly spend) across all completed audits.
**Current target:** 15–25%
**Why it matters:** If our audit engine consistently finds meaningful savings, users trust the results and are more likely to share, provide email, and book consultations. If savings are too low (<5%), the tool feels useless. If too high (>50%), it feels unbelievable. This metric directly impacts lead quality.

### 3. Share Rate
**Definition:** % of completed audits that are shared via the unique public URL.
**Current target:** 10%+
**Why it matters:** Sharing is the viral loop. Each shared audit is a free acquisition channel. High share rate = organic growth without ad spend. It also signals that users find the results credible and valuable enough to show their colleagues.

## What I'd Instrument First

1. **Funnel tracking** (PostHog or Mixpanel):
   - `page_view` → `form_started` → `tool_added` (per tool) → `audit_submitted` → `results_viewed` → `email_captured` → `report_shared`
   - Drop-off at each stage, with tool-level granularity

2. **Time-to-complete**: How long from form start to results view. If >5 minutes, the form is too complex.

3. **Tool-level engagement**: Which tools are most commonly added? Which have the highest savings? This informs which tool comparisons to feature in marketing.

4. **Referral source tracking**: UTM parameters on the landing page. Which channels (HN, Reddit, X, direct, newsletter) drive the highest-quality leads?

5. **LLM summary engagement**: Do users who see the AI-generated summary have higher email capture rates than those who see the fallback template? A/B test this.

## What Number Triggers a Pivot Decision

**If after 30 days of active distribution (HN launch, Reddit posts, X threads, cold DMs):**

- **< 50 completed audits total** → The problem isn't real enough or our distribution is broken. Pivot: interview 10 more users to validate pain, or try a different acquisition channel (paid LinkedIn ads to eng managers).

- **< 5% of audits show >$500/mo savings** → Our audit logic is too conservative, or the target user's spend is too low. Pivot: expand to cover more tools (AWS, GCP AI services), target larger companies (Series C+), or redefine "savings" to include time savings.

- **< 10% email capture rate (of completed audits)** → Users don't trust the tool enough to provide email, or the value shown isn't compelling. Pivot: show partial results, gate the full report. Or improve the results page design to be more shareable/valuable.

- **< 2% consultation booking rate (of high-savings leads)** → The bridge from "audit" to "Credex sales conversation" is broken. Pivot: add a live chat widget, offer a "savings implementation guide" as a lead magnet, or make the Credex value prop clearer on the results page.

The decision framework: **Is the problem real (people complete audits)? Is our solution good (savings are meaningful)? Is the conversion working (leads flow to Credex)?** If any of these three fail after 30 days of effort, we pivot that specific layer, not the whole product.
