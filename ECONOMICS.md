# CostPilot — Unit Economics

## What's a Converted Lead Worth to Credex?

Credex sells discounted AI infrastructure credits. A "converted lead" = a company that completes an audit → books a Credex consultation → purchases credits.

**Estimated Customer Lifetime Value (LTV):**

| Variable | Estimate | Reasoning |
|----------|----------|-----------|
| Average AI spend per company | $2,000–$5,000/mo | Series A–B startups with 5–30 devs using 2–4 AI tools |
| Credex discount offered | 15–30% off retail | Based on Credex's sourcing model (overforecast/pivot credits) |
| Credex margin on credits | ~10–15% of credit value | Spread between sourcing cost and selling price |
| Average monthly credit purchase | $1,500/mo | ~$3,500 spend × 40% converted to Credex credits |
| Credex revenue per customer/month | $150–$225/mo | 10–15% margin on $1,500 |
| Average customer retention | 12–18 months | Annual contracts with renewal |
| **Customer LTV** | **$1,800–$4,050** | $150–$225/mo × 12–18 months |

**Conservative estimate: $2,000 LTV per converted customer.**

## Customer Acquisition Cost (CAC) by Channel

| Channel | Estimated CAC | Math |
|---------|--------------|------|
| **Hacker News Show HN** | ~$0 | Free post → 500 visitors → 100 audits → 5 high-savings leads → 1 customer. CAC = $0 (time only) |
| **Reddit (r/ExperiencedDevs)** | ~$0 | Free post → 200 visitors → 40 audits → 2 leads → 0.5 customer. CAC = $0 |
| **X/Twitter organic** | ~$0 | Thread → 300 impressions → 50 visitors → 10 audits → 1 lead → 0.25 customer. CAC = $0 |
| **Cold DMs to eng managers** | ~$50 | Time cost: 2 hrs @ $25/hr → 20 DMs → 5 audits → 1 lead → 0.3 customer. CAC ≈ $50/0.3 = ~$167 effective |
| **Newsletter sponsorship** | ~$500–$1,000 | $500 for a Pragmatic Engineer mention → 2,000 clicks → 400 audits → 20 leads → 3 customers. CAC = $167–$333 |
| **Product Hunt launch** | ~$0 | Free → 1,000 visitors → 200 audits → 10 leads → 2 customers. CAC = $0 |
| **Shareable report virality** | ~$0 | Each shared report → 3–5 visitors → organic growth. CAC = $0 |

**Blended CAC estimate (first 6 months, mostly organic): ~$50–$100 per customer.**

**LTV:CAC ratio: 20:1 to 40:1** — extremely healthy for a B2B lead-gen tool.

## Conversion Funnel

```
Landing page visitors          100%
    ↓
Started audit form              40%    (compelling value prop, no signup required)
    ↓
Completed audit                 60%    (of starters — form is short, value is immediate)
    ↓ 
Audit completed (total)         24%    (of all visitors)
    ↓
Email captured                  35%    (of completers — email asked AFTER value shown)
    ↓
High-savings lead (>$500/mo)    20%    (of email captures — these get Credex CTA)
    ↓
Credex consultation booked      30%    (of high-savings leads — pain is real and quantified)
    ↓
Credit purchase                 40%    (of consultations — Credex discount is compelling)
    ↓
Total conversion rate           0.20%  (visitor → paying customer)
```

**Per 10,000 visitors: 20 paying customers × $2,000 LTV = $40,000 revenue.**

## What Makes This Profitable?

This tool is profitable from Day 1 because the primary cost is development (already sunk) and hosting (~$0–$20/mo on Vercel/Firebase free tiers). The only ongoing costs are:

| Cost | Monthly | Annual |
|------|---------|--------|
| Hosting (Vercel Pro) | $20 | $240 |
| Firebase (Blaze plan) | $10 | $120 |
| Gemini API (summaries) | $5 | $60 |
| Resend (emails) | $0 (free tier) | $0 |
| Domain | $1 | $12 |
| **Total** | **$36** | **$432** |

Even 1 customer conversion pays for 4+ years of operating costs.

## Path to $1M ARR in 18 Months

**$1M ARR = $83,333/month in recurring revenue.**

At $175/customer/month average revenue (midpoint of $150–$225):
- Need: **476 active customers**
- With 12-month average retention, need ~40 new customers/month to reach this by month 18

**Required monthly audit volume:**

```
40 customers/month ÷ 0.20% conversion = 20,000 visitors/month
20,000 visitors × 24% audit rate = 4,800 audits/month
4,800 × 35% email capture = 1,680 leads/month
1,680 × 20% high-savings = 336 qualified leads/month
336 × 30% consultation = 101 consultations/month
101 × 40% purchase = 40 new customers/month ✓
```

**What would have to be true:**

1. **Traffic:** 20K monthly visitors by month 12. Achievable with SEO content strategy (AI tool comparisons rank well), newsletter partnerships, and viral sharing loop.

2. **Product-channel fit:** The shareable audit URL must drive organic growth. If each user shares with 2 people, and 10% of those do an audit, we get a 1.2x viral coefficient — not viral, but meaningfully supplementing paid/organic acquisition.

3. **Credex sales team capacity:** 100+ consultations/month requires 2–3 sales reps. Credex needs to hire or have this capacity.

4. **Average deal size holds:** $1,500/mo in credits at 10–15% margin. If companies buy more credits over time (expanding AI usage), the LTV increases, making the math easier.

5. **Retention:** 12+ months. If Credex delivers real savings and the credits work as promised, renewal is likely. Churn risk: companies renegotiating directly with vendors.

**The most critical assumption:** The audit tool surfaces real, significant savings (>$500/mo) for >20% of users. If the savings are too small, the Credex CTA doesn't convert. This is why the audit engine logic must be genuinely good, not just marketing.
