"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingDown,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Share2,
  RefreshCw,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { AuditResult, ToolRecommendation, RecommendedAction } from "@/types";

// ─── Action config ────────────────────────────────────────────────────────
const ACTION_CONFIG: Record<
  RecommendedAction,
  { label: string; color: string; icon: React.ReactNode }
> = {
  keep: {
    label: "Already Optimal",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  downgrade: {
    label: "Downgrade Plan",
    color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    icon: <TrendingDown className="h-3.5 w-3.5" />,
  },
  "right-size": {
    label: "Right-Size",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  switch: {
    label: "Switch Tool",
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
  },
  "use-credits": {
    label: "Use Credits",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
};

// ─── Tool Recommendation Card ─────────────────────────────────────────────
function RecommendationCard({ rec }: { rec: ToolRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTION_CONFIG[rec.recommendedAction];
  const hasSavings = rec.monthlySavings > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20">
      {/* Header row */}
      <div className="flex items-center gap-4 p-5">
        {/* Tool name */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/50 mb-0.5">Tool</p>
          <p className="font-semibold text-white text-base">{rec.toolName}</p>
          <p className="text-xs text-white/40 mt-0.5">{rec.currentPlan}</p>
        </div>

        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-white/20 flex-shrink-0" />

        {/* Recommendation */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/50 mb-0.5">Recommendation</p>
          <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", cfg.color)}>
            {cfg.icon}
            {cfg.label}
          </div>
          <p className="text-xs text-white/60 mt-1.5 truncate">{rec.recommendedPlan}</p>
        </div>

        {/* Savings */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm text-white/50 mb-0.5">Monthly Savings</p>
          <p className={cn("text-xl font-bold", hasSavings ? "text-emerald-400" : "text-white/30")}>
            {hasSavings ? `+${formatCurrency(rec.monthlySavings)}` : "—"}
          </p>
          {hasSavings && (
            <p className="text-xs text-white/40">{formatCurrency(rec.monthlySavings * 12)}/yr</p>
          )}
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded reason */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4">
          <p className="text-xs text-white/40 mb-1.5 uppercase tracking-wider font-medium">Why we recommend this</p>
          <p className="text-sm text-white/70 leading-relaxed">{rec.reason}</p>
          {rec.recommendedAction !== "keep" && (
            <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
              <span>Current: <span className="text-white/60">{formatCurrency(rec.currentSpend)}/mo</span></span>
              <ArrowRight className="h-3 w-3" />
              <span>Optimized: <span className="text-emerald-400">{formatCurrency(rec.newSpend)}/mo</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Results Component ───────────────────────────────────────────────
export default function AuditResults({ result }: { result: AuditResult }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  // Show email capture after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowEmailCapture(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sortedRecs = [...result.recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-primary animate-orb w-96 h-96 -top-32 -left-32 opacity-30" />
        <div className="orb orb-accent animate-orb w-80 h-80 top-1/2 -right-20 opacity-20" style={{ animationDelay: "3s" }} />
        <div className="orb orb-purple animate-orb w-64 h-64 bottom-20 left-1/3 opacity-20" style={{ animationDelay: "6s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:px-6">

        {/* ── Hero Savings Banner ───────────────────────────────────── */}
        <div className="animate-fade-in-up mb-10">
          {result.isAlreadyOptimal ? (
            /* Already Optimal */
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-emerald-500/20 p-4">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">You&apos;re Spending Well</h1>
              <p className="text-white/60 text-lg mb-4">
                Your AI tool stack is well-optimized. Total spend:{" "}
                <span className="text-white font-semibold">{formatCurrency(result.totalMonthlySpend)}/mo</span>
              </p>
              <p className="text-sm text-white/40 max-w-md mx-auto">
                We found less than {formatCurrency(100)}/mo in potential savings. Sign up below
                and we&apos;ll notify you when new optimizations apply to your stack.
              </p>
            </div>
          ) : (
            /* Savings Found */
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 backdrop-blur-xl p-8 text-center animate-pulse-glow">
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2">
                Your audit is complete
              </p>
              <h1 className="text-5xl sm:text-7xl font-black text-white mb-1">
                {formatCurrency(result.totalMonthlySavings)}
                <span className="text-2xl sm:text-3xl font-normal text-white/50">/mo</span>
              </h1>
              <p className="text-xl text-white/70 mb-1">in potential savings found</p>
              <p className="text-3xl font-bold gradient-text">
                {formatCurrency(result.totalAnnualSavings)}/year
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/50">
                <span>Current spend: <span className="text-white">{formatCurrency(result.totalMonthlySpend)}/mo</span></span>
                <span>·</span>
                <span>Savings: <span className="text-emerald-400">{result.savingsPercentage}%</span></span>
              </div>
            </div>
          )}
        </div>

        {/* ── Credex CTA (high savings only) ────────────────────────── */}
        {result.isHighSavings && (
          <div className="animate-fade-in-up delay-100 mb-8 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="rounded-xl bg-purple-500/20 p-3">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Capture Even More Savings with Credex</p>
                <p className="text-sm text-white/60 mt-0.5">
                  You have significant AI spend ({formatCurrency(result.totalMonthlySpend)}/mo). Credex sources
                  discounted AI infrastructure credits at 15–30% below retail. That&apos;s an additional{" "}
                  <span className="text-purple-400 font-semibold">
                    {formatCurrency(Math.round(result.totalMonthlySpend * 0.2))}/mo
                  </span>{" "}
                  on top of your plan optimizations.
                </p>
              </div>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-400 transition-colors px-5 py-2.5 text-sm font-semibold text-white cursor-pointer"
              >
                Book a Credex Call
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* ── Per-Tool Breakdown ────────────────────────────────────── */}
        <div className="animate-fade-in-up delay-200 mb-10">
          <h2 className="text-xl font-bold text-white mb-1">Per-Tool Breakdown</h2>
          <p className="text-sm text-white/40 mb-5">
            Click any row to see the full reasoning behind each recommendation.
          </p>
          <div className="space-y-3">
            {sortedRecs.map((rec) => (
              <RecommendationCard key={rec.toolId} rec={rec} />
            ))}
          </div>
        </div>

        {/* ── Email Capture ─────────────────────────────────────────── */}
        {showEmailCapture && (
          <div className="animate-fade-in-up mb-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-semibold text-white mb-1">
              {result.isAlreadyOptimal
                ? "Get notified when savings open up"
                : "Save & share your full report"}
            </h3>
            <p className="text-sm text-white/50 mb-4">
              Enter your email to get a copy of this audit. No spam — one email, your report, done.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
              />
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity px-5 py-3 text-sm font-semibold text-white cursor-pointer">
                Get Report
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-white/30 mt-2">
              {result.isHighSavings
                ? "High-savings report — Credex may reach out about credit availability for your stack."
                : "We'll notify you when new pricing changes create savings opportunities for your stack."}
            </p>
          </div>
        )}

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 flex-1 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-6 py-4 text-sm font-semibold text-white cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Link Copied!" : "Share Report"}
          </button>
          <button
            onClick={() => router.push("/audit")}
            className="flex items-center justify-center gap-2 flex-1 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-6 py-4 text-sm font-semibold text-white cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Run Another Audit
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/20 mt-8">
          Pricing data sourced from official vendor pages · Last verified 2026-05-20 ·{" "}
          <a href="https://credex.rocks" className="hover:text-white/40 transition-colors">
            Built by Credex
          </a>
        </p>
      </div>
    </div>
  );
}
