"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { getToolById } from "@/lib/pricing-data";
import type { ToolEntry, ToolPlan } from "@/types";
import { X, ChevronDown } from "lucide-react";

interface ToolConfigPanelProps {
  entry: ToolEntry;
  onChange: (updated: ToolEntry) => void;
  onRemove: (toolId: string) => void;
}

export default function ToolConfigPanel({
  entry,
  onChange,
  onRemove,
}: ToolConfigPanelProps) {
  const tool = getToolById(entry.toolId);
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [manualSpend, setManualSpend] = useState(false);

  // Slide-in animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  if (!tool) return null;

  const currentPlan: ToolPlan | undefined = tool.plans.find(
    (p) => p.id === entry.planId
  );

  const handlePlanChange = (planId: string) => {
    const plan = tool.plans.find((p) => p.id === planId);
    if (!plan) return;

    const seats = plan.minSeats
      ? Math.max(entry.seats, plan.minSeats)
      : entry.seats;
    const spend = plan.isPerSeat
      ? plan.pricePerSeat * seats
      : plan.pricePerSeat;

    setManualSpend(false);
    onChange({ ...entry, planId, seats, monthlySpend: spend });
  };

  const handleSeatsChange = (seats: number) => {
    const clamped = Math.max(currentPlan?.minSeats ?? 1, Math.min(seats, 9999));

    if (!manualSpend && currentPlan) {
      const spend = currentPlan.isPerSeat
        ? currentPlan.pricePerSeat * clamped
        : currentPlan.pricePerSeat;
      onChange({ ...entry, seats: clamped, monthlySpend: spend });
    } else {
      onChange({ ...entry, seats: clamped });
    }
  };

  const handleSpendChange = (spend: number) => {
    setManualSpend(true);
    onChange({ ...entry, monthlySpend: Math.max(0, spend) });
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        "overflow-hidden transition-all duration-500 ease-out",
        visible
          ? "max-h-[600px] opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-2"
      )}
    >
      <div
        className="relative rounded-2xl border backdrop-blur-xl p-5 bg-white/5 border-white/10"
        style={{
          borderLeftColor: tool.color,
          borderLeftWidth: "3px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tool.icon}</span>
            <h3 className="text-base font-semibold text-white">{tool.name}</h3>
          </div>
          <button
            type="button"
            onClick={() => onRemove(entry.toolId)}
            className="flex h-7 w-7 items-center justify-center rounded-lg
                       bg-white/5 text-white/40 transition-all
                       hover:bg-red-500/20 hover:text-red-400 cursor-pointer"
            aria-label={`Remove ${tool.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Config grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Plan selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Plan
            </label>
            <div className="relative">
              <select
                value={entry.planId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className={cn(
                  "w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5",
                  "text-sm text-white outline-none transition-colors",
                  "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
                  "cursor-pointer"
                )}
              >
                {tool.plans.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                    className="bg-[#1a1a2e] text-white"
                  >
                    {plan.name}
                    {plan.pricePerSeat > 0
                      ? ` — ${formatCurrency(plan.pricePerSeat)}/mo${plan.isPerSeat ? "/seat" : ""}`
                      : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            </div>
          </div>

          {/* Seats */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Seats
            </label>
            <input
              type="number"
              min={currentPlan?.minSeats ?? 1}
              max={9999}
              value={entry.seats}
              onChange={(e) =>
                handleSeatsChange(parseInt(e.target.value, 10) || 1)
              }
              className={cn(
                "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5",
                "text-sm text-white outline-none transition-colors",
                "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none",
                "[&::-webkit-outer-spin-button]:appearance-none"
              )}
            />
            {currentPlan?.minSeats && (
              <span className="text-[10px] text-white/30">
                Min {currentPlan.minSeats} seats
              </span>
            )}
          </div>

          {/* Monthly Spend */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Monthly Spend
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">
                $
              </span>
              <input
                type="number"
                min={0}
                step={1}
                value={entry.monthlySpend}
                onChange={(e) =>
                  handleSpendChange(parseFloat(e.target.value) || 0)
                }
                className={cn(
                  "w-full rounded-xl border border-white/10 bg-white/5 pl-7 pr-3 py-2.5",
                  "text-sm text-white outline-none transition-colors",
                  "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
                  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none",
                  "[&::-webkit-outer-spin-button]:appearance-none",
                  manualSpend && "border-amber-500/30"
                )}
              />
            </div>
            {manualSpend && (
              <button
                type="button"
                onClick={() => {
                  setManualSpend(false);
                  if (currentPlan) {
                    const spend = currentPlan.isPerSeat
                      ? currentPlan.pricePerSeat * entry.seats
                      : currentPlan.pricePerSeat;
                    onChange({ ...entry, monthlySpend: spend });
                  }
                }}
                className="text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Reset to auto-calculate
              </button>
            )}
          </div>
        </div>

        {/* Plan feature tags */}
        {currentPlan && currentPlan.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {currentPlan.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-white/50"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
