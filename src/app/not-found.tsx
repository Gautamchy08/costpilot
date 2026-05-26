// Custom 404 Not Found page

import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -top-32 -left-32" />
        <div className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl bottom-20 right-20" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
            <SearchX className="h-12 w-12 text-white/30" />
          </div>
        </div>

        {/* Error text */}
        <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">404</p>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/50 text-base leading-relaxed mb-8">
          This report link may have expired or the page doesn&apos;t exist.
          Run a fresh audit to get your personalized savings report.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/audit"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity px-6 py-3 text-sm font-semibold text-white"
          >
            Audit My AI Spend
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-white/20 text-xs mt-8">
          Built by{" "}
          <a href="https://credex.rocks" className="hover:text-white/40 transition-colors">
            Credex
          </a>
        </p>
      </div>
    </div>
  );
}
