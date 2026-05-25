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

## Day 3 — 2026-05-23

**Hours worked:** 4

**What I did:**
- Built the complete rule-based audit engine (`src/lib/audit-engine.ts`) with 4 recommendation types:
  - **Plan right-sizing**: detects team/enterprise plans used by ≤3 users and recommends individual plans
  - **Same-vendor downgrade**: finds cheaper plans from the same vendor that fit usage pattern
  - **Cross-vendor alternatives**: suggests competing tools (e.g., Windsurf Pro at $15/seat vs Cursor Pro at $20/seat)
  - **Credex credit savings**: surfaces 15–25% additional savings for well-optimized stacks
  - **Honest "already optimal"**: clearly tells users when no meaningful savings are available
- Installed Vitest and wrote 7 unit tests covering all audit engine paths — all 7 pass
  - Plan right-sizing test (Cursor Teams for 2 users)
  - Same-vendor downgrade test (ChatGPT Pro $200 → Plus $20)
  - Cross-vendor alternative test (Cursor → Windsurf)
  - Savings calculation accuracy test (math verification)
  - Edge case: free plans / $0 spend (no false recommendations)
  - Already-optimal honest detection test
  - High-savings flag test (>$500/mo)
- Built the audit results page (`src/app/results/page.tsx`) with:
  - Animated hero savings banner (total monthly + annual savings in large text)
  - Per-tool breakdown cards with expand/collapse for detailed reasoning
  - Conditional Credex CTA — only shown when savings > $500/mo
  - "You're Spending Well" state for already-optimal audits
  - Email capture section appearing after 3 seconds (post-value)
  - Share report + Run Another Audit actions
- Wired full flow: form submit → save state → navigate to `/results` → run audit → render results
- Fixed TypeScript error: Zod schema needed `z.enum()` for `toolId` (not `z.string()`) to match `ToolId` union type

**What I learned:**
- Zod infers types from schemas — `z.string()` gives you `string`, but `z.enum([...])` gives you the literal union type needed to satisfy `ToolId`. Always use `z.enum()` for discriminated unions.
- Rule-based financial logic needs careful layering: check most impactful fix first (right-sizing > same-vendor > cross-vendor > credits), then fall through to "already optimal" — not all checks simultaneously
- The "already optimal" path is as important as the savings path. Users who are spending well should be told that honestly — it builds trust more than padding fake savings

**Blockers / what I'm stuck on:**
- Firebase not yet set up (need project + credentials from console.firebase.google.com)
- Gemini API key needed for the AI summary feature
- Resend account needed for email confirmations

**Plan for tomorrow:**
- Set up Firebase project and Firestore collections (audits, leads)
- Build Gemini API integration for 100-word personalized audit summary
- Build lead capture form with email input and Resend confirmation
- Create API routes: POST /api/audit, POST /api/lead, POST /api/summary
- Add basic rate limiting to API routes

## Day 4 — 2026-05-24

**Hours worked:** 4

**What I did:**
- Installed Firebase SDK, `@google/generative-ai`, and `resend` packages
- Created Firebase singleton initialization (`src/lib/firebase.ts`) — prevents duplicate app creation during Next.js hot reload
- Created Firestore helper functions (`src/lib/db.ts`) — `saveAudit()`, `getAudit()`, `saveLead()` cleanly separated from Firebase init
- Built Gemini AI summary module (`src/lib/gemini.ts`) — calls Gemini 1.5 Flash API to generate a personalized 80–120 word audit summary, with a graceful fallback template for when the API is unavailable
- Created 3 API routes with IP-based rate limiting:
  - `POST /api/audit` — saves audit result to Firestore (20 req/hr per IP)
  - `POST /api/summary` — calls Gemini for personalized summary (10 req/hr per IP)
  - `POST /api/lead` — saves lead to Firestore + sends HTML confirmation email via Resend (5 req/hr per IP)
- Built `LeadCaptureForm` component with honeypot spam protection, loading/success/error states, and conditional messaging based on savings amount
- Upgraded `AuditResults` component to: auto-save audit to Firestore on load, fetch AI summary from Gemini, and render the real `LeadCaptureForm` (replaces the static email input from Day 3)
- Confirmation email is a full branded HTML email (dark theme matching the app) sent from `onboarding@resend.dev`

**What I learned:**
- Firebase needs singleton initialization in Next.js — without `getApps().length === 0` check, hot reload creates duplicate app instances and throws errors
- Gemini API uses `system_instruction` as a separate field (not part of `contents`) — passing it inside contents causes the model to ignore tone/style instructions
- Honeypot fields must be hidden with `style={{ display: "none" }}` not `type="hidden"` — bots specifically look for and fill hidden inputs, but skip visually hidden ones
- Resend's free tier only allows sending from `onboarding@resend.dev` without domain verification — perfectly fine for MVP

**Blockers / what I'm stuck on:**
- Need to deploy to Vercel (Day 5) to test Firebase and Resend in production environment
- Shareable report URL not yet built — currently share button just copies the `/results` URL which loses state on refresh

**Plan for tomorrow:**
- Deploy to Vercel with all environment variables
- Build shareable report URL (`/report/[id]`) — fetch audit from Firestore, render public view with PII stripped
- Add dynamic Open Graph tags for social sharing
- Final CI/CD pipeline verification

## Day 5 — 2026-05-25

**Hours worked:** 4

**What I did:**
- Added Firestore security rules (`firestore.rules`) — audits are publicly readable by ID (shareable links) but not listable; leads are write-only (PII protection)
- Built shareable report page (`/report/[id]`) as a Next.js server component:
  - Fetches audit from Firestore server-side using the Firestore doc ID
  - Renders `ShareableReport` client component — full read-only view with savings banner, per-tool breakdown, Credex CTA, Twitter share button
  - `notFound()` for invalid IDs
  - CTA button prompting visitors to audit their own stack (viral loop)
- Added dynamic Open Graph metadata per report (`generateMetadata`):
  - Title: `"I found $X/mo in AI tool savings — CostPilot"`
  - Description includes exact savings numbers
  - Twitter card `summary_large_image` format
  - Per-report OG URL
- Updated root layout with `metadataBase` — required for absolute OG URLs to work correctly on Vercel
- Updated `AuditResults` component:
  - Now captures the Firestore doc ID returned from `POST /api/audit`
  - Share button copies `/report/[id]` URL (permanent, not `/results` which loses state)
  - Added "Share on X (Twitter)" button with pre-filled tweet text
- Added `firebase.json` hosting config for SPA routing

**What I learned:**
- Next.js requires `metadataBase` in root layout for OG image URLs to work — without it, relative URLs in `openGraph.images` are silently broken
- Server components can read from Firebase directly (no SDK initialization issues) because they run on Node.js, not the browser
- For viral loops: the shareable report page must have a prominent CTA to audit the viewer's own stack — not just display results

**Blockers / what I'm stuck on:**
- Vercel deployment needs to be done manually (user needs to connect GitHub repo to Vercel and add env vars)
- OG image (actual image preview) not yet implemented — currently using text-only cards

**Plan for tomorrow (Day 6 — Final):**
- Final polish: fix any UI rough edges found during testing
- Complete `REFLECTION.md` in own words (must be personal, can't be generated)
- Update `USER_INTERVIEWS.md` with interview findings
- Final README update with live Vercel URL
- Record Loom demo walkthrough
- Final commit and submission prep

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
