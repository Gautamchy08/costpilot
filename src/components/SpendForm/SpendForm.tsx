"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { cn, formatCurrency } from "@/lib/utils";
import { TOOLS } from "@/lib/pricing-data";
import { saveFormState, loadFormState } from "@/lib/form-storage";
import type { AuditInput, ToolEntry, ToolId, UseCase } from "@/types";

import ToolCard from "./ToolCard";
import ToolConfigPanel from "./ToolConfigPanel";
import { Sparkles, Users, ArrowRight, RotateCcw } from "lucide-react";

// ─── Zod Validation ────────────────────────────────────────────────────
const toolEntrySchema = z.object({
  toolId: z.string().min(1),
  planId: z.string().min(1),
  monthlySpend: z.number().min(0),
  seats: z.number().int().min(1),
});

const auditInputSchema = z.object({
  tools: z
    .array(toolEntrySchema)
    .min(1, "Select at least one AI tool to audit"),
  teamSize: z.number().int().min(1, "Team size must be at least 1").max(1000),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
});

// ─── Constants ─────────────────────────────────────────────────────────
const USE_CASES: { value: UseCase; label: string; icon: string }[] = [
  { value: "coding", label: "Coding", icon: "💻" },
  { value: "writing", label: "Writing", icon: "✍️" },
  { value: "data", label: "Data Analysis", icon: "📊" },
  { value: "research", label: "Research", icon: "🔬" },
  { value: "mixed", label: "Mixed / All", icon: "🎯" },
];

const DEFAULT_STATE: AuditInput = {
  tools: [],
  teamSize: 1,
  useCase: "mixed",
};

// ─── Animated Counter ──────────────────────────────────────────────────
function AnimatedTotal({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = displayed;
    const diff = value - start;
    if (diff === 0) return;

    const duration = 400; // ms
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + diff * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{formatCurrency(displayed)}</span>;
}

// ─── Main Form ─────────────────────────────────────────────────────────
export default function SpendForm() {
  const [formState, setFormState] = useState<AuditInput>(DEFAULT_STATE);
  const [errors, setErrors] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadFormState();
    if (saved) setFormState(saved);
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after initial hydration)
  useEffect(() => {
    if (hydrated) saveFormState(formState);
  }, [formState, hydrated]);

  // ─── Derived values ──────────────────────────────────────────────
  const totalMonthlySpend = useMemo(
    () => formState.tools.reduce((sum, t) => sum + t.monthlySpend, 0),
    [formState.tools]
  );

  const configuredCount = formState.tools.length;
  const totalTools = TOOLS.length;

  // ─── Handlers ────────────────────────────────────────────────────
  const handleToolToggle = useCallback(
    (toolId: string) => {
      setFormState((prev) => {
        const exists = prev.tools.find((t) => t.toolId === toolId);
        if (exists) {
          // Deselect
          return { ...prev, tools: prev.tools.filter((t) => t.toolId !== toolId) };
        }

        // Select — default to first plan
        const tool = TOOLS.find((t) => t.id === toolId);
        if (!tool) return prev;

        const firstPlan = tool.plans[0];
        const seats = firstPlan.minSeats ?? 1;
        const spend = firstPlan.isPerSeat
          ? firstPlan.pricePerSeat * seats
          : firstPlan.pricePerSeat;

        const newEntry: ToolEntry = {
          toolId: toolId as ToolId,
          planId: firstPlan.id,
          monthlySpend: spend,
          seats,
        };

        return { ...prev, tools: [...prev.tools, newEntry] };
      });
    },
    []
  );

  const handleToolEntryChange = useCallback((updated: ToolEntry) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.map((t) =>
        t.toolId === updated.toolId ? updated : t
      ),
    }));
  }, []);

  const handleRemoveTool = useCallback((toolId: string) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.toolId !== toolId),
    }));
  }, []);

  const handleSubmit = () => {
    setErrors([]);
    const result = auditInputSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.issues.map((i) => i.message));
      return;
    }
    // For now, log the validated data
    console.log("✅ CostPilot Audit Input:", result.data);
    alert(
      `Audit submitted! Total monthly spend: ${formatCurrency(totalMonthlySpend)}\n\nCheck the console for form data.`
    );
  };

  const handleReset = () => {
    setFormState(DEFAULT_STATE);
    setErrors([]);
  };

  // Don't render anything meaningful until hydrated to avoid mismatch
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      {/* ── Progress indicator ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          <span className="text-indigo-400 font-semibold">{configuredCount}</span>
          {" / "}
          {totalTools} tools selected
        </p>
        {configuredCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden -mt-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${(configuredCount / totalTools) * 100}%` }}
        />
      </div>

      {/* ── Tool Selector Grid ──────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-1">
          Select Your AI Tools
        </h2>
        <p className="text-sm text-white/40 mb-5">
          Click on the tools your team uses. Configure each one below.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              selected={formState.tools.some((t) => t.toolId === tool.id)}
              onToggle={handleToolToggle}
            />
          ))}
        </div>
      </section>

      {/* ── Selected Tool Config Panels ─────────────────────────── */}
      {formState.tools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Configure Your Tools
          </h2>
          {formState.tools.map((entry) => (
            <ToolConfigPanel
              key={entry.toolId}
              entry={entry}
              onChange={handleToolEntryChange}
              onRemove={handleRemoveTool}
            />
          ))}
        </section>
      )}

      {/* ── Team Size & Use Case ────────────────────────────────── */}
      <section className="grid gap-6 sm:grid-cols-2">
        {/* Team Size */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <Users className="h-4 w-4 text-indigo-400" />
            Team Size
          </label>
          <input
            type="number"
            min={1}
            max={1000}
            value={formState.teamSize}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                teamSize: Math.max(
                  1,
                  Math.min(1000, parseInt(e.target.value, 10) || 1)
                ),
              }))
            }
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3",
              "text-white text-lg font-semibold outline-none transition-colors",
              "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none",
              "[&::-webkit-outer-spin-button]:appearance-none"
            )}
            placeholder="e.g. 25"
          />
          <p className="mt-2 text-xs text-white/30">
            Total people on your team (1–1,000)
          </p>
        </div>

        {/* Primary Use Case */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Primary Use Case
          </label>
          <div className="flex flex-wrap gap-2">
            {USE_CASES.map((uc) => (
              <button
                type="button"
                key={uc.value}
                onClick={() =>
                  setFormState((prev) => ({ ...prev, useCase: uc.value }))
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
                  "border transition-all duration-200 cursor-pointer",
                  formState.useCase === uc.value
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                )}
              >
                <span>{uc.icon}</span>
                {uc.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Running Total ───────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 backdrop-blur-xl p-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm text-white/50">Estimated Monthly Spend</p>
            <p className="text-4xl font-bold text-white tracking-tight">
              <AnimatedTotal value={totalMonthlySpend} />
              <span className="text-lg font-normal text-white/40">/mo</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/50">Annual Projection</p>
            <p className="text-2xl font-semibold text-white/80">
              {formatCurrency(totalMonthlySpend * 12)}
              <span className="text-sm font-normal text-white/40">/yr</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Validation Errors ───────────────────────────────────── */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 space-y-1">
          {errors.map((msg, i) => (
            <p key={i} className="text-sm text-red-400">
              • {msg}
            </p>
          ))}
        </div>
      )}

      {/* ── Submit ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl p-[1px]",
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500",
          "transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]",
          "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center gap-3 rounded-2xl px-8 py-4",
            "bg-[#0d0d1f] text-lg font-semibold text-white",
            "transition-colors duration-200 group-hover:bg-[#0d0d1f]/80"
          )}
        >
          Run My Audit
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </button>
    </div>
  );
}
