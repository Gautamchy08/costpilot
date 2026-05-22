"use client";

import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/types";
import { Check } from "lucide-react";

interface ToolCardProps {
  tool: ToolDefinition;
  selected: boolean;
  onToggle: (toolId: string) => void;
}

export default function ToolCard({ tool, selected, onToggle }: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(tool.id)}
      className={cn(
        // Base glass card
        "group relative flex flex-col items-center gap-3 rounded-2xl p-6",
        "border backdrop-blur-xl transition-all duration-300 ease-out",
        "cursor-pointer select-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-indigo-500/60",
        // Unselected
        !selected && [
          "bg-white/5 border-white/10",
          "hover:bg-white/[0.08] hover:border-white/20",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20",
        ],
        // Selected — glowing border with brand color
        selected && [
          "bg-white/10 border-2 scale-[1.03]",
          "shadow-lg",
        ]
      )}
      style={
        selected
          ? {
              borderColor: tool.color,
              boxShadow: `0 0 24px ${tool.color}33, 0 0 48px ${tool.color}1a`,
            }
          : undefined
      }
    >
      {/* Selection check badge */}
      {selected && (
        <span
          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs shadow-lg"
          style={{ backgroundColor: tool.color }}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
      )}

      {/* Icon */}
      <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
        {tool.icon}
      </span>

      {/* Name */}
      <span className="text-sm font-semibold text-white/90">{tool.name}</span>

      {/* Brand color accent bar */}
      <span
        className={cn(
          "h-0.5 w-8 rounded-full transition-all duration-300",
          selected ? "w-12 opacity-100" : "opacity-40 group-hover:opacity-70"
        )}
        style={{ backgroundColor: tool.color }}
      />
    </button>
  );
}
