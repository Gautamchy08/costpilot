// CostPilot — Core TypeScript Types

// ─── AI Tool Definitions ───────────────────────────────────────────────

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export interface ToolPlan {
  id: string;
  name: string;
  pricePerSeat: number; // Monthly price per seat/user
  isPerSeat: boolean; // true = per-seat pricing, false = flat monthly
  minSeats?: number; // Minimum seats required (e.g., Team plans)
  features: string[];
  category: "free" | "individual" | "team" | "enterprise" | "api";
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  icon: string; // Emoji or icon identifier
  color: string; // Brand color hex
  plans: ToolPlan[];
  useCases: UseCase[]; // Which use cases this tool is good for
  website: string;
  pricingUrl: string;
}

// ─── User Input ────────────────────────────────────────────────────────

export interface ToolEntry {
  toolId: ToolId;
  planId: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

// ─── Audit Results ─────────────────────────────────────────────────────

export type RecommendedAction =
  | "keep" // Already optimal
  | "downgrade" // Switch to a cheaper plan from the same vendor
  | "switch" // Switch to a different tool entirely
  | "right-size" // Reduce seats or adjust plan to team size
  | "use-credits"; // Save more through Credex credits

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: RecommendedAction;
  recommendedPlan: string;
  recommendedTool?: string; // If switching to a different tool
  newSpend: number;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  aiSummary: string | null;
  isHighSavings: boolean; // > $500/mo
  isAlreadyOptimal: boolean; // < $100/mo savings
}

// ─── Lead Capture ──────────────────────────────────────────────────────

export interface LeadData {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  savingsAmount: number;
  createdAt: string;
}

// ─── Shareable Report ──────────────────────────────────────────────────

export interface PublicReport {
  id: string;
  createdAt: string;
  tools: {
    name: string;
    currentPlan: string;
    currentSpend: number;
    recommendedAction: RecommendedAction;
    recommendedPlan: string;
    monthlySavings: number;
    reason: string;
  }[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  useCase: UseCase;
  teamSize: number;
  aiSummary: string | null;
  // Note: No email, company name, or other PII
}
