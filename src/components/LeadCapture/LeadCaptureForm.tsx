"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadCaptureFormProps {
  auditId: string;
  savingsAmount: number;
  isHighSavings: boolean;
  isAlreadyOptimal: boolean;
}

export default function LeadCaptureForm({
  auditId,
  savingsAmount,
  isHighSavings,
  isAlreadyOptimal,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState(""); // anti-spam
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          auditId,
          savingsAmount,
          honeypot, // will be empty for real users
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="rounded-full bg-emerald-500/20 p-3">
            <CheckCircle className="h-7 w-7 text-emerald-400" />
          </div>
        </div>
        <p className="font-semibold text-white mb-1">Report sent to your inbox!</p>
        <p className="text-sm text-white/50">
          Check <span className="text-white/70">{email}</span> — your full audit report is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
      <h3 className="font-semibold text-white mb-1">
        {isAlreadyOptimal
          ? "Get notified when savings open up"
          : "Save & share your full report"}
      </h3>
      <p className="text-sm text-white/50 mb-5">
        {isHighSavings
          ? `You have $${savingsAmount}/mo in potential savings. Enter your email and we'll send the full breakdown — plus how Credex can capture even more.`
          : isAlreadyOptimal
          ? "We'll notify you when new pricing changes or alternatives create savings for your stack."
          : "One email. Your full audit report. No spam, no account required."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot — hidden from real users, bots fill it */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className={cn(
              "flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3",
              "text-white placeholder-white/30 outline-none text-sm",
              "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            )}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white",
              "bg-gradient-to-r from-indigo-500 to-purple-500",
              "hover:opacity-90 transition-opacity cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Get Report
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-400">{errorMsg}</p>
        )}

        <p className="text-xs text-white/30">
          {isHighSavings
            ? "High savings detected — a Credex advisor may reach out about credit availability for your stack."
            : "No spam. One email with your report. Unsubscribe anytime."}
        </p>
      </form>
    </div>
  );
}
