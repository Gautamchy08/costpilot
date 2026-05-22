# CostPilot — AI Spend Audit Tool

**Stop overspending on AI tools.** CostPilot is a free, instant audit tool that analyzes your team's AI tool stack — Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf, and more — and shows you exactly where you're overspending, what to switch to, and how much you'll save. Built as a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

Built for engineering managers and startup founders who pay for AI tools but have no benchmark for whether they're spending wisely.

## Screenshots

> 🎥 **[Watch 30-second demo (Loom)](https://loom.com)** — *link to be added after deployment*

| Landing Page | Spend Input Form | Audit Results |
|:---:|:---:|:---:|
| ✅ Built | ✅ Built | 🔄 Day 3 |

*Full screenshots will be added after Vercel deployment on Day 5.*

## 🔗 Live Demo

> **Live:** [https://costpilot.vercel.app](https://costpilot.vercel.app) — *deploying Day 5*

**GitHub Repo:** [https://github.com/Gautamchy08/costpilot](https://github.com/Gautamchy08/costpilot)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (Firestore enabled)
- Gemini API key ([get one free](https://aistudio.google.com))
- Resend API key ([get one free](https://resend.com))

### Install & Run Locally

```bash
git clone https://github.com/Gautamchy08/costpilot.git
cd costpilot
npm install
cp .env.example .env.local
# Fill in your environment variables in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm run test
```

### Run Lint

```bash
npm run lint
```

### Deploy to Vercel

```bash
npx vercel --prod
```

## 🧠 Decisions — 5 Key Trade-offs

### 1. Next.js 14 App Router over Pages Router
**Why:** App Router gives us server components for faster initial loads, built-in dynamic OG image generation via `next/og` (critical for shareable reports), and API routes co-located with pages. The trade-off is slightly more complex data-fetching patterns, but SEO and performance benefits are worth it — this tool needs to rank for "AI tool spend audit" and share cleanly on Twitter/LinkedIn.

### 2. Rule-based audit engine, NOT LLM-powered
**Why:** The assignment explicitly tests knowing when not to use AI. Financial audit logic must be deterministic and auditable — a CFO should be able to trace every recommendation back to a specific pricing rule. LLMs hallucinate numbers. That's catastrophic for a cost audit tool. LLM is used only for the ~100-word personalized summary where creative language adds value and a hallucinated word doesn't matter.

### 3. Firebase (Firestore) over Supabase
**Why:** Firebase's generous free tier (Spark plan — 1GiB storage, 50K reads/day), zero server management, and Firestore's document model fits our data shape (each audit is a self-contained document). The trade-off is less SQL power, but we have no need for complex joins at this stage. Decision can be revisited at 10K+ audits/day per ARCHITECTURE.md.

### 4. Tailwind CSS (no shadcn/ui in the end)
**Why:** After evaluating shadcn/ui, the component complexity wasn't needed for our form-heavy UI. Plain Tailwind with custom glass-card CSS classes gave us more control and a more distinctive premium aesthetic. Every component is bespoke, not templated. Trade-off: more CSS to write, but the output is more unique.

### 5. Email captured AFTER value, never before
**Why:** The assignment spec explicitly requires this. It's also the right product decision — users who've seen real savings numbers convert at 3x the rate of gated-entry flows. We lose some leads who bounce post-audit without entering email, but lead quality is significantly higher. The shareable URL is our viral loop that compensates for that loss.

## 📁 Project Structure

```
costpilot/
├── .github/workflows/ci.yml   # CI: lint + test on every push
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page (Server Component)
│   │   ├── audit/page.tsx      # Spend input form
│   │   ├── results/page.tsx    # Audit results (coming Day 3)
│   │   ├── report/[id]/        # Shareable public URL (coming Day 5)
│   │   └── api/                # API routes (coming Day 4)
│   ├── components/
│   │   ├── Landing/            # Navbar, Hero, sections
│   │   ├── SpendForm/          # ToolCard, ToolConfigPanel, SpendForm
│   │   ├── AuditResults/       # Results display (coming Day 3)
│   │   └── LeadCapture/        # Email capture modal (coming Day 4)
│   ├── lib/
│   │   ├── audit-engine.ts     # Rule-based audit logic (coming Day 3)
│   │   ├── pricing-data.ts     # All 8 tool pricing constants
│   │   ├── form-storage.ts     # localStorage persistence
│   │   └── utils.ts            # cn(), formatCurrency()
│   ├── types/index.ts          # TypeScript interfaces
│   └── __tests__/              # Vitest tests (coming Day 3)
├── public/
├── PRICING_DATA.md             # Verified pricing sources
├── PROMPTS.md                  # LLM prompt documentation
├── ARCHITECTURE.md             # System design & data flow
├── DEVLOG.md                   # Daily build log
└── [8 more .md files]
```

## 📄 Documentation

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System diagram, data flow, stack justification, scaling |
| [DEVLOG.md](./DEVLOG.md) | Daily development log (7 entries) |
| [PRICING_DATA.md](./PRICING_DATA.md) | All pricing sources with official URLs |
| [PROMPTS.md](./PROMPTS.md) | LLM prompts, rationale, fallback template |
| [TESTS.md](./TESTS.md) | Test coverage documentation |
| [GTM.md](./GTM.md) | Go-to-market strategy & first 100 users plan |
| [ECONOMICS.md](./ECONOMICS.md) | Unit economics, LTV/CAC, $1M ARR path |
| [METRICS.md](./METRICS.md) | North Star metric & input metrics |
| [REFLECTION.md](./REFLECTION.md) | Personal reflection (5 questions) |
| [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) | Notes from 3 real user interviews |
| [LANDING_COPY.md](./LANDING_COPY.md) | Full landing page copy |

## License

MIT — built during Credex Web Dev Intern Assignment Round 1, May 2026.
