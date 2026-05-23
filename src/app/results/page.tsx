"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuditResults from "@/components/AuditResults/AuditResults";
import { runAudit } from "@/lib/audit-engine";
import { loadFormState } from "@/lib/form-storage";
import type { AuditResult } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved form state and run audit
    const formState = loadFormState();

    if (!formState || formState.tools.length === 0) {
      // No audit data — redirect back to form
      router.replace("/audit");
      return;
    }

    // Run the deterministic audit engine
    const auditResult = runAudit(formState);
    setResult(auditResult);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-6">
        {/* Animated loading state */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-t-indigo-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-1">Running your audit…</p>
          <p className="text-white/40 text-sm">Analyzing your AI tool stack against current pricing data</p>
        </div>
        {/* Animated steps */}
        <div className="space-y-2 text-sm text-white/30">
          {[
            "Checking plan right-sizing…",
            "Scanning for same-vendor alternatives…",
            "Comparing cross-vendor options…",
            "Calculating total savings…",
          ].map((step, i) => (
            <p key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 300}ms` }}>
              ✓ {step}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  return <AuditResults result={result} />;
}
