import type { Metadata } from "next";
import SpendForm from "@/components/SpendForm/SpendForm";

export const metadata: Metadata = {
  title: "Audit Your AI Spend — CostPilot",
  description:
    "Tell us which AI tools your team uses and we'll show you exactly where you're overspending.",
};

export default function AuditPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a1a] overflow-hidden">
      {/* Ambient background gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute -bottom-60 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Page header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-indigo-400 uppercase">
            Step 1 of 2
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Audit Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Spend
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/50">
            Select the AI tools your team uses, set your plans and seats, and
            we&apos;ll find every dollar you can save.
          </p>
        </div>

        {/* Form */}
        <SpendForm />
      </div>
    </main>
  );
}
