// CostPilot — Pricing Data Constants
// Every number traces back to PRICING_DATA.md with vendor URL sources
// Last verified: 2026-05-20

import type { ToolDefinition } from "@/types";

export const TOOLS: ToolDefinition[] = [
  // ─── Cursor ──────────────────────────────────────────────────────
  {
    id: "cursor",
    name: "Cursor",
    icon: "⚡",
    color: "#6366f1",
    website: "https://cursor.com",
    pricingUrl: "https://cursor.com/pricing",
    useCases: ["coding"],
    plans: [
      {
        id: "cursor-hobby",
        name: "Hobby (Free)",
        pricePerSeat: 0,
        isPerSeat: true,
        features: ["Limited Tab completions", "Limited Agent requests"],
        category: "free",
      },
      {
        id: "cursor-pro",
        name: "Pro",
        pricePerSeat: 20,
        isPerSeat: true,
        features: [
          "Unlimited Tab completions",
          "$20 credit pool",
          "Extended Agent limits",
        ],
        category: "individual",
      },
      {
        id: "cursor-pro-plus",
        name: "Pro+",
        pricePerSeat: 60,
        isPerSeat: true,
        features: [
          "Unlimited Tab completions",
          "$60 credit pool",
          "Heavy AI usage",
        ],
        category: "individual",
      },
      {
        id: "cursor-ultra",
        name: "Ultra",
        pricePerSeat: 200,
        isPerSeat: true,
        features: [
          "Unlimited Tab completions",
          "$200 credit pool",
          "Priority access",
        ],
        category: "individual",
      },
      {
        id: "cursor-teams",
        name: "Teams",
        pricePerSeat: 40,
        isPerSeat: true,
        minSeats: 2,
        features: [
          "Everything in Pro",
          "Centralized billing",
          "Usage analytics",
          "SAML/OIDC SSO",
        ],
        category: "team",
      },
      {
        id: "cursor-enterprise",
        name: "Enterprise",
        pricePerSeat: 60,
        isPerSeat: true,
        minSeats: 10,
        features: [
          "Dedicated support",
          "Invoice billing",
          "Pooled usage",
          "Custom terms",
        ],
        category: "enterprise",
      },
    ],
  },

  // ─── GitHub Copilot ──────────────────────────────────────────────
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    icon: "🐙",
    color: "#238636",
    website: "https://github.com/features/copilot",
    pricingUrl: "https://github.com/features/copilot",
    useCases: ["coding"],
    plans: [
      {
        id: "copilot-free",
        name: "Free",
        pricePerSeat: 0,
        isPerSeat: true,
        features: [
          "2,000 completions/month",
          "50 premium requests/month",
        ],
        category: "free",
      },
      {
        id: "copilot-pro",
        name: "Pro",
        pricePerSeat: 10,
        isPerSeat: true,
        features: [
          "Unlimited completions",
          "300 premium requests/month",
        ],
        category: "individual",
      },
      {
        id: "copilot-pro-plus",
        name: "Pro+",
        pricePerSeat: 39,
        isPerSeat: true,
        features: [
          "Unlimited completions",
          "1,500 premium requests/month",
          "Advanced models",
        ],
        category: "individual",
      },
      {
        id: "copilot-business",
        name: "Business",
        pricePerSeat: 19,
        isPerSeat: true,
        minSeats: 1,
        features: [
          "Organization features",
          "Security controls",
          "Policy management",
        ],
        category: "team",
      },
      {
        id: "copilot-enterprise",
        name: "Enterprise",
        pricePerSeat: 39,
        isPerSeat: true,
        minSeats: 5,
        features: [
          "Knowledge bases",
          "Custom models",
          "Enterprise security",
        ],
        category: "enterprise",
      },
    ],
  },

  // ─── Claude (Anthropic) ──────────────────────────────────────────
  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
    color: "#d4a574",
    website: "https://claude.ai",
    pricingUrl: "https://www.anthropic.com/pricing",
    useCases: ["coding", "writing", "data", "research", "mixed"],
    plans: [
      {
        id: "claude-free",
        name: "Free",
        pricePerSeat: 0,
        isPerSeat: false,
        features: ["Basic access to Sonnet/Haiku", "Daily usage limits"],
        category: "free",
      },
      {
        id: "claude-pro",
        name: "Pro",
        pricePerSeat: 20,
        isPerSeat: false,
        features: [
          "Higher usage limits",
          "Projects & Artifacts",
          "Claude Code access",
        ],
        category: "individual",
      },
      {
        id: "claude-max-5x",
        name: "Max 5x",
        pricePerSeat: 100,
        isPerSeat: false,
        features: [
          "5x Pro usage capacity",
          "All Pro features",
        ],
        category: "individual",
      },
      {
        id: "claude-max-20x",
        name: "Max 20x",
        pricePerSeat: 200,
        isPerSeat: false,
        features: [
          "20x Pro usage capacity",
          "All-day professional use",
        ],
        category: "individual",
      },
      {
        id: "claude-team",
        name: "Team",
        pricePerSeat: 28,
        isPerSeat: true,
        minSeats: 5,
        features: [
          "Admin controls",
          "Centralized billing",
          "Collaboration features",
        ],
        category: "team",
      },
      {
        id: "claude-enterprise",
        name: "Enterprise",
        pricePerSeat: 60,
        isPerSeat: true,
        minSeats: 20,
        features: [
          "Advanced security",
          "HIPAA readiness",
          "SSO/SCIM",
          "Large context windows",
        ],
        category: "enterprise",
      },
    ],
  },

  // ─── ChatGPT (OpenAI) ───────────────────────────────────────────
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "💬",
    color: "#10a37f",
    website: "https://chatgpt.com",
    pricingUrl: "https://openai.com/chatgpt/pricing",
    useCases: ["coding", "writing", "data", "research", "mixed"],
    plans: [
      {
        id: "chatgpt-free",
        name: "Free",
        pricePerSeat: 0,
        isPerSeat: false,
        features: ["GPT-5.3", "Limited usage", "Includes ads"],
        category: "free",
      },
      {
        id: "chatgpt-plus",
        name: "Plus",
        pricePerSeat: 20,
        isPerSeat: false,
        features: [
          "GPT-5.5",
          "Deep Research (10 runs/mo)",
          "Sora, Codex, Agent Mode",
          "Ad-free",
        ],
        category: "individual",
      },
      {
        id: "chatgpt-pro-100",
        name: "Pro $100",
        pricePerSeat: 100,
        isPerSeat: false,
        features: [
          "5x Plus limits",
          "GPT-5.5 Pro",
          "o1 Pro mode",
        ],
        category: "individual",
      },
      {
        id: "chatgpt-pro-200",
        name: "Pro $200",
        pricePerSeat: 200,
        isPerSeat: false,
        features: [
          "20x Plus limits",
          "GPT-5.5 Pro",
          "1M-token context",
          "250 Deep Research runs",
        ],
        category: "individual",
      },
      {
        id: "chatgpt-team",
        name: "Team",
        pricePerSeat: 25,
        isPerSeat: true,
        minSeats: 2,
        features: [
          "Shared workspace",
          "Admin controls",
          "SSO",
          "SOC 2",
        ],
        category: "team",
      },
      {
        id: "chatgpt-enterprise",
        name: "Enterprise",
        pricePerSeat: 50,
        isPerSeat: true,
        minSeats: 150,
        features: [
          "Highest security",
          "SOC 2 / ISO 27001",
          "Priority support",
          "Custom terms",
        ],
        category: "enterprise",
      },
    ],
  },

  // ─── Anthropic API ───────────────────────────────────────────────
  {
    id: "anthropic-api",
    name: "Anthropic API",
    icon: "🔌",
    color: "#d4a574",
    website: "https://console.anthropic.com",
    pricingUrl: "https://www.anthropic.com/pricing",
    useCases: ["coding", "writing", "data", "research", "mixed"],
    plans: [
      {
        id: "anthropic-api-usage",
        name: "Pay-as-you-go",
        pricePerSeat: 0,
        isPerSeat: false,
        features: [
          "Opus 4.7: $5/$25 per 1M tokens",
          "Sonnet 4.6: $3/$15 per 1M tokens",
          "Haiku 4.5: $1/$5 per 1M tokens",
          "Batch API: 50% off",
          "Prompt Caching: 90% off reads",
        ],
        category: "api",
      },
    ],
  },

  // ─── OpenAI API ──────────────────────────────────────────────────
  {
    id: "openai-api",
    name: "OpenAI API",
    icon: "🔑",
    color: "#10a37f",
    website: "https://platform.openai.com",
    pricingUrl: "https://openai.com/api/pricing",
    useCases: ["coding", "writing", "data", "research", "mixed"],
    plans: [
      {
        id: "openai-api-usage",
        name: "Pay-as-you-go",
        pricePerSeat: 0,
        isPerSeat: false,
        features: [
          "GPT-5.5: $5/$30 per 1M tokens",
          "GPT-5.4: $2.50/$15 per 1M tokens",
          "GPT-5.4 Mini: $0.75/$4.50 per 1M tokens",
          "Batch API: 50% off",
          "Prompt Caching: up to 90% off",
        ],
        category: "api",
      },
    ],
  },

  // ─── Google Gemini ───────────────────────────────────────────────
  {
    id: "gemini",
    name: "Gemini",
    icon: "✨",
    color: "#4285f4",
    website: "https://gemini.google.com",
    pricingUrl: "https://one.google.com/about/plans",
    useCases: ["coding", "writing", "data", "research", "mixed"],
    plans: [
      {
        id: "gemini-free",
        name: "Free",
        pricePerSeat: 0,
        isPerSeat: false,
        features: ["Basic Gemini access", "Rate limited"],
        category: "free",
      },
      {
        id: "gemini-ai-plus",
        name: "AI Plus",
        pricePerSeat: 8,
        isPerSeat: false,
        features: ["Essential AI features", "Basic Gemini access"],
        category: "individual",
      },
      {
        id: "gemini-ai-pro",
        name: "AI Pro",
        pricePerSeat: 20,
        isPerSeat: false,
        features: [
          "Gemini 3.1 Pro",
          "Higher limits",
          "5TB storage",
          "Veo 3.1",
        ],
        category: "individual",
      },
      {
        id: "gemini-ai-ultra",
        name: "AI Ultra",
        pricePerSeat: 100,
        isPerSeat: false,
        features: [
          "Advanced tier",
          "Gemini Spark",
          "Highest model access",
        ],
        category: "individual",
      },
      {
        id: "gemini-api-usage",
        name: "API (Pay-as-you-go)",
        pricePerSeat: 0,
        isPerSeat: false,
        features: [
          "3.1 Pro: $2/$12 per 1M tokens",
          "3 Flash: $0.50/$3 per 1M tokens",
          "Free tier for Flash/Flash-Lite",
          "Batch API: 50% off",
        ],
        category: "api",
      },
    ],
  },

  // ─── Windsurf ────────────────────────────────────────────────────
  {
    id: "windsurf",
    name: "Windsurf",
    icon: "🏄",
    color: "#0ea5e9",
    website: "https://windsurf.com",
    pricingUrl: "https://windsurf.com/pricing",
    useCases: ["coding"],
    plans: [
      {
        id: "windsurf-free",
        name: "Free",
        pricePerSeat: 0,
        isPerSeat: true,
        features: [
          "25 credits/month",
          "Unlimited Tab autocomplete",
          "Basic Cascade access",
        ],
        category: "free",
      },
      {
        id: "windsurf-pro",
        name: "Pro",
        pricePerSeat: 15,
        isPerSeat: true,
        features: [
          "500 credits/month",
          "All premium models",
          "Cascade multi-file editing",
        ],
        category: "individual",
      },
      {
        id: "windsurf-teams",
        name: "Teams",
        pricePerSeat: 30,
        isPerSeat: true,
        minSeats: 2,
        features: [
          "500 credits/user/month",
          "Centralized billing",
          "Admin dashboard",
          "Team management",
        ],
        category: "team",
      },
      {
        id: "windsurf-enterprise",
        name: "Enterprise",
        pricePerSeat: 60,
        isPerSeat: true,
        minSeats: 10,
        features: [
          "1,000+ credits/user/month",
          "SSO, RBAC",
          "Dedicated support",
          "SOC 2, FedRAMP",
        ],
        category: "enterprise",
      },
    ],
  },
];

// Helper to find a tool by ID
export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === id);
}

// Helper to find a plan within a tool
export function getPlan(
  toolId: string,
  planId: string
): { tool: ToolDefinition; plan: (typeof TOOLS)[0]["plans"][0] } | undefined {
  const tool = getToolById(toolId);
  if (!tool) return undefined;
  const plan = tool.plans.find((p) => p.id === planId);
  if (!plan) return undefined;
  return { tool, plan };
}

// Get all non-API tools (for cross-vendor comparison)
export function getSubscriptionTools(): ToolDefinition[] {
  return TOOLS.filter((t) => !t.id.includes("-api"));
}
