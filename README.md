# CostPilot — AI Spend Audit Tool

**Stop overspending on AI tools.** CostPilot is a free, instant audit tool that analyzes your team's AI tool stack — Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf, and more — and shows you exactly where you're overspending, what to switch to, and how much you'll save. Built as a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

Built for engineering managers and startup founders who pay for AI tools but have no benchmark for whether they're spending wisely.

## Screenshots

<!-- TODO: Add 3+ screenshots or a 30-second Loom recording after UI is complete -->

| Landing Page | Spend Input Form | Audit Results |
|:---:|:---:|:---:|
| *Coming Day 2* | *Coming Day 3* | *Coming Day 4* |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (Firestore + Auth)
- Gemini API key
- Resend API key

### Install & Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/costpilot.git
cd costpilot
npm install
cp .env.example .env.local
# Fill in your environment variables in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy

```bash
# Deploy to Vercel
npx vercel --prod
```

### Run Tests

```bash
npm run test
```

### Lint

```bash
npm run lint
```

## 🔗 Deployed URL

<!-- TODO: Add Vercel deployment URL -->
> **Live:** [https://costpilot.vercel.app](https://costpilot.vercel.app) *(coming soon)*

## 🧠 Decisions — 5 Key Trade-offs

### 1. Next.js App Router over Pages Router
**Why:** App Router gives us server components for faster initial loads, streaming for the audit results page, built-in OG image generation via `next/og`, and API routes co-located with pages. The trade-off is slightly more complex data fetching patterns, but the SEO and performance benefits are worth it for a tool that needs to rank and share well.

### 2. Rule-based audit engine over LLM-powered analysis
**Why:** The assignment explicitly tests knowing when NOT to use AI. Financial audit logic must be deterministic, reproducible, and auditable. A finance person should be able to trace every recommendation back to a specific pricing rule. LLMs hallucinate numbers — that's unacceptable for a cost audit. We use the LLM only for the personalized summary paragraph, where creative language adds value and hallucinated numbers don't matter.

### 3. Firebase over Supabase for backend
**Why:** Firebase offers a generous free tier (Spark plan), real-time Firestore for storing audits, easy authentication if needed later, and excellent integration with Vercel. The trade-off vs Supabase is less SQL power, but for this use case (simple document storage of audits and leads), Firestore's document model is a natural fit.

### 4. Tailwind CSS + shadcn/ui over custom CSS
**Why:** Speed of development. With a 7-day deadline, writing custom CSS for every component would eat into feature time. shadcn/ui gives us accessible, well-tested primitives (forms, modals, cards) that we own and can customize. The trade-off is a slightly larger initial bundle, but tree-shaking and component-level imports keep it lean.

### 5. Email capture AFTER value, not before
**Why:** The assignment spec is clear — no login required, email captured after value is shown. This is also the right UX choice: users who see real savings numbers are more likely to convert. The trade-off is we lose some leads who bounce before the email step, but the quality of captured leads is much higher.

## 📁 Project Structure

```
costpilot/
├── src/app/           # Next.js App Router pages & API routes
├── src/components/    # React components (form, results, landing)
├── src/lib/           # Core logic (audit engine, pricing data, utils)
├── src/types/         # TypeScript interfaces
├── src/__tests__/     # Vitest test files
├── public/            # Static assets
├── .github/workflows/ # CI pipeline
└── *.md               # Documentation files
```

## 📄 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design & data flow
- [DEVLOG.md](./DEVLOG.md) — Daily development log
- [PRICING_DATA.md](./PRICING_DATA.md) — All pricing sources with URLs
- [PROMPTS.md](./PROMPTS.md) — LLM prompts used in the tool
- [TESTS.md](./TESTS.md) — Test coverage documentation
- [GTM.md](./GTM.md) — Go-to-market strategy
- [ECONOMICS.md](./ECONOMICS.md) — Unit economics analysis
- [METRICS.md](./METRICS.md) — North Star & input metrics
- [REFLECTION.md](./REFLECTION.md) — Personal reflection
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) — User research notes

## License

MIT
