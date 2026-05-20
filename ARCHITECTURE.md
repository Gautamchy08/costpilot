# CostPilot — Architecture

## System Diagram

```mermaid
graph TB
    subgraph Client ["Browser (Next.js Frontend)"]
        LP[Landing Page]
        SF[Spend Input Form]
        AR[Audit Results Page]
        SR[Shareable Report]
        LC[Lead Capture Modal]
    end

    subgraph Server ["Next.js API Routes (Vercel Edge)"]
        API_AUDIT["/api/audit"]
        API_LEAD["/api/lead"]
        API_SUMMARY["/api/summary"]
        AE["Audit Engine (Rule-Based)"]
        RL["Rate Limiter + Honeypot"]
    end

    subgraph External ["External Services"]
        FB[(Firebase Firestore)]
        GEMINI["Gemini API (LLM Summary)"]
        RESEND["Resend (Transactional Email)"]
    end

    LP --> SF
    SF -->|"Form data (tools, plans, spend, seats)"| API_AUDIT
    API_AUDIT --> AE
    AE -->|"Audit results"| AR
    AR -->|"Request AI summary"| API_SUMMARY
    API_SUMMARY --> GEMINI
    API_SUMMARY -->|"Fallback: template summary"| AR
    AR --> LC
    LC -->|"Email + optional fields"| API_LEAD
    API_LEAD --> RL
    RL -->|"Pass"| FB
    API_LEAD --> RESEND
    API_AUDIT -->|"Save audit"| FB
    FB -->|"Fetch by ID"| SR

    style LP fill:#1a1a2e,color:#fff
    style SF fill:#16213e,color:#fff
    style AR fill:#0f3460,color:#fff
    style SR fill:#533483,color:#fff
    style AE fill:#e94560,color:#fff
    style FB fill:#f97316,color:#fff
    style GEMINI fill:#4285f4,color:#fff
    style RESEND fill:#10b981,color:#fff
```

## Data Flow: Input → Audit Result

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant LS as localStorage
    participant API as /api/audit
    participant AE as Audit Engine
    participant DB as Firebase
    participant LLM as Gemini API
    participant E as Resend

    U->>F: Enters tool data (plans, spend, seats)
    F->>LS: Persist form state on every change
    U->>F: Clicks "Run Audit"
    F->>API: POST /api/audit {tools, teamSize, useCase}
    API->>AE: Process audit rules
    AE->>AE: 1. Check plan right-sizing
    AE->>AE: 2. Find cheaper same-vendor plan
    AE->>AE: 3. Find cross-vendor alternatives
    AE->>AE: 4. Calculate Credex credit savings
    AE-->>API: Audit results + savings
    API->>DB: Store audit (generate unique ID)
    API-->>F: Return audit results + audit ID
    F->>LLM: POST /api/summary {audit results}
    LLM-->>F: ~100 word personalized summary
    F->>U: Display results page
    U->>F: Enters email (post-value)
    F->>API: POST /api/lead {email, company, role}
    API->>DB: Store lead linked to audit
    API->>E: Send confirmation email
    U->>F: Clicks "Share"
    F->>U: Shareable URL /report/[auditId]
```

## Why This Stack

### Next.js 14 (App Router) + TypeScript
- **Server Components** reduce client-side JavaScript for faster LCP
- **API Routes** eliminate need for a separate backend server
- **Dynamic OG images** via `next/og` for shareable URLs — no external service needed
- **File-based routing** maps naturally to our pages: `/`, `/audit`, `/results`, `/report/[id]`
- **TypeScript** catches pricing calculation bugs at compile time — critical for financial logic

### Firebase (Firestore)
- **Document model** fits our data shape naturally: each audit is a self-contained document
- **Free tier** (Spark): 1 GiB storage, 50K reads/day, 20K writes/day — plenty for this stage
- **No server to manage** — scales automatically
- **Security Rules** protect data without a custom auth layer

### Tailwind CSS + shadcn/ui
- **Rapid UI development** with consistent design tokens
- **shadcn/ui** gives us accessible, customizable primitives we own (not an npm dependency)
- **JIT compilation** means zero unused CSS in production
- **Built-in dark mode** support via class strategy

### Gemini API
- **Used only for the personalized summary** — NOT for audit logic
- **Generous free tier** for development and testing
- **Graceful fallback** to a template-based summary if API fails

### Resend
- **100 emails/day free** — sufficient for MVP
- **React Email** support for beautiful transactional emails
- **Simple API** — one POST request to send

### Vercel
- **Native Next.js support** — zero configuration deployment
- **Edge Functions** for API routes — low latency globally
- **Preview deployments** on every PR for testing
- **Free tier** covers our expected traffic

## Database Schema (Firestore)

```
audits/
  {auditId}/
    id: string (nanoid)
    createdAt: timestamp
    tools: [{
      name: string
      plan: string
      monthlySpend: number
      seats: number
    }]
    teamSize: number
    useCase: "coding" | "writing" | "data" | "research" | "mixed"
    results: {
      totalMonthlySavings: number
      totalAnnualSavings: number
      recommendations: [{
        tool: string
        currentPlan: string
        currentSpend: number
        recommendedAction: string
        newSpend: number
        savings: number
        reason: string
      }]
    }
    aiSummary: string | null
    isPublic: boolean (default: true)

leads/
  {leadId}/
    auditId: string (ref to audit)
    email: string
    companyName: string | null
    role: string | null
    teamSize: number | null
    savingsAmount: number
    createdAt: timestamp
    emailSent: boolean
```

## What I'd Change for 10,000 Audits/Day

| Concern | Current | At Scale |
|---------|---------|----------|
| **Database** | Firestore (document reads) | PostgreSQL (Supabase/Neon) with connection pooling — better for aggregate queries and analytics |
| **Caching** | None | Redis cache for pricing data + recent audit results. CDN caching for public report pages |
| **Rate Limiting** | In-memory + honeypot | Upstash Redis rate limiter with sliding window, per-IP and per-session |
| **LLM Calls** | Direct Gemini API per request | Queue-based processing with Bull/BullMQ. Batch summaries. Cache identical audit profiles |
| **Email** | Resend per-request | SES with SQS queue for async delivery. Batch digest emails |
| **OG Images** | Dynamic generation per request | Pre-generate and cache in Cloudflare R2/S3 |
| **Monitoring** | Console logs | Sentry for errors, PostHog for analytics, Datadog for infrastructure |
| **Search** | Firestore queries | Elasticsearch for audit lookup, full-text search on reports |
| **CDN** | Vercel Edge | Cloudflare in front for DDoS protection and global caching |
| **API** | Next.js API routes | Separate Node.js/Fastify microservice for audit engine, horizontally scaled |
