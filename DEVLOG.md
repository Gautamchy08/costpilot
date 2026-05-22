# CostPilot — Development Log

## Day 1 — 2026-05-20

**Hours worked:** 3

**What I did:**
- Read the full assignment spec carefully, identified all 6 MVP features and 13 required deliverables
- Chose tech stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Firebase + Gemini API + Resend
- Justified each choice in ARCHITECTURE.md stub
- Initialized the Next.js project with TypeScript, Tailwind CSS, ESLint, App Router, and src directory
- Created all 13 required markdown file stubs with proper structure
- Researched and documented current pricing for all 8 AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf) in PRICING_DATA.md
- Verified all pricing against official vendor pages
- Planned the 6-day roadmap with daily deliverables
- Named the product "CostPilot"

**What I learned:**
- Several AI tools have shifted to credit-based pricing models (Cursor since June 2025, GitHub Copilot transitioning June 2026)
- Pricing research is more nuanced than expected — many tools have hidden tiers, volume discounts, and upcoming pricing changes
- The audit engine logic needs to account for credit-based vs seat-based vs usage-based models differently

**Blockers / what I'm stuck on:**
- Need to set up Firebase project and get credentials
- Need to set up Resend account and verify domain for transactional emails
- Need Gemini API key for the AI summary feature

**Plan for tomorrow:**
- Build the complete spend input form with all 8 tools
- Implement localStorage persistence for form state
- Start building the UI components (landing page hero, form layout)
- Set up Firebase project and database schema

## Day 2 — 2026-05-22

**Hours worked:** 5

**What I did:**
- Built the complete landing page with premium dark theme: hero section with gradient headline and animated floating orbs, How It Works (3-step glass cards), Tools We Analyze (8-tool grid with brand colors), mocked testimonials section (clearly labeled), final CTA, and footer
- Created a sticky glassmorphism navbar with mobile hamburger menu and smooth scroll anchors
- Built the complete spend input form supporting all 8 AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf)
- Each tool has: plan selector dropdown (populated from pricing data), seats input, auto-calculated monthly spend (with manual override option)
- Added team size input (1-1000) and primary use case selector (coding/writing/data/research/mixed) as pill buttons
- Implemented animated running total counter with ease-out cubic animation (requestAnimationFrame)
- Built localStorage persistence — form state survives page reloads (key: costpilot-form-state)
- Added Zod validation schema for form submission
- Created TypeScript types module (ToolId, ToolEntry, AuditInput, AuditResult, etc.)
- Created pricing data module with all 8 tools and their plans as TypeScript constants
- Created utility functions (cn for class merging, formatCurrency)
- Set up the full CSS design system: custom animations (fadeInUp, slideIn, pulse-glow, float, orb-drift, shimmer), glass card styles, gradient text, CTA button effects, custom scrollbar
- Fixed CSS @import ordering for Tailwind v4 and React 19 useRef compatibility

**What I learned:**
- Tailwind v4 uses `@import "tailwindcss"` instead of `@tailwind` directives — and all CSS @import rules must come before any other rules per CSS spec
- React 19 requires explicit initial value for useRef (can't just do `useRef<number>()` anymore, need `useRef<number | undefined>(undefined)`)
- Auto-calculating spend from plan × seats while allowing manual override requires careful state management — need to track whether user has manually edited the spend field

**Blockers / what I'm stuck on:**
- Need to build the audit engine (rule-based logic for plan right-sizing, cross-vendor alternatives)
- Need to wire up the form submission to navigate to results page with audit data

**Plan for tomorrow:**
- Build the complete audit engine with rule-based logic
- Write ≥5 unit tests for the audit engine
- Build the audit results page with per-tool breakdown and hero savings banner
- Wire up the form → audit → results flow

## Day 3 — 2026-05-22

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

## Day 4 — 2026-05-23

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

## Day 5 — 2026-05-24

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

## Day 6 — 2026-05-25

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

## Day 7 — 2026-05-26

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**
