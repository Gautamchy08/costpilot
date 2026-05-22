import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  ListChecks,
  Sparkles,
  Star,
  Shield,
  Users,
  Zap,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Landing/Navbar";

/* ─── AI Tools Data ─── */
const tools = [
  { name: "Cursor", color: "#00A8FF", initial: "C" },
  { name: "GitHub Copilot", color: "#6e40c9", initial: "GC" },
  { name: "Claude", color: "#D4A574", initial: "Cl" },
  { name: "ChatGPT", color: "#10a37f", initial: "GP" },
  { name: "Anthropic API", color: "#D4A574", initial: "An" },
  { name: "OpenAI API", color: "#412991", initial: "OA" },
  { name: "Gemini", color: "#4285f4", initial: "Ge" },
  { name: "Windsurf", color: "#00C9A7", initial: "Ws" },
];

/* ─── Testimonials (illustrative / mocked) ─── */
const testimonials = [
  {
    quote:
      "CostPilot showed us we were paying for 12 unused Copilot seats. Saved us $3,400/year instantly.",
    author: "Sarah Chen",
    role: "Engineering Lead",
    company: "TechFlow",
    avatar: "SC",
  },
  {
    quote:
      "We switched 60% of our API calls from GPT-4 to Claude Haiku based on the audit. Same quality, 70% cheaper.",
    author: "Marcus Rivera",
    role: "CTO",
    company: "DataStack",
    avatar: "MR",
  },
  {
    quote:
      "The ROI breakdown per developer was eye-opening. We restructured our entire AI stack in one afternoon.",
    author: "Priya Patel",
    role: "VP Engineering",
    company: "BuildFast",
    avatar: "PP",
  },
];

/* ─── How It Works Steps ─── */
const steps = [
  {
    icon: ListChecks,
    title: "Add Your Tools",
    description:
      "Tell us which AI tools your team uses and your current plans. Takes under 60 seconds.",
    step: "01",
  },
  {
    icon: BarChart3,
    title: "Get Your Audit",
    description:
      "Our engine analyzes your spend across tools, identifies waste, and finds cheaper alternatives.",
    step: "02",
  },
  {
    icon: DollarSign,
    title: "Save Money",
    description:
      "Get a clear action plan with specific recommendations to cut costs without losing productivity.",
    step: "03",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        {/* Background Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="orb orb-primary animate-orb"
            style={{
              width: "600px",
              height: "600px",
              top: "-10%",
              right: "-10%",
            }}
          />
          <div
            className="orb orb-accent animate-orb"
            style={{
              width: "500px",
              height: "500px",
              bottom: "-5%",
              left: "-10%",
              animationDelay: "2s",
            }}
          />
          <div
            className="orb orb-purple animate-orb"
            style={{
              width: "350px",
              height: "350px",
              top: "40%",
              left: "50%",
              animationDelay: "4s",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Free AI Spend Audit — No credit card required</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Stop Overpaying
            <br />
            <span className="gradient-text">for AI Tools.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up delay-200 mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Free 2-minute audit reveals exactly where your team is overspending
            on AI — and how to save up to{" "}
            <span className="font-semibold text-cyan-400">40%</span>.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up delay-300 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/audit"
              className="cta-button group inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-white shadow-2xl"
            >
              Audit My AI Spend — Free
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="text-sm text-slate-500">
              Takes less than 2 minutes
            </span>
          </div>

          {/* Trust Badges */}
          <div className="animate-fade-in-up delay-500 mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 sm:gap-10">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" />
              <span>
                <span className="font-semibold text-slate-300">120+</span> teams
                audited
              </span>
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>
                <span className="font-semibold text-slate-300">$47K+</span>{" "}
                saved
              </span>
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>
                <span className="font-semibold text-slate-300">8</span> AI tools
                covered
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600 italic">
            * Figures are illustrative and based on projected usage
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center sm:mb-20">
            <p className="animate-fade-in-up mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Simple Process
            </p>
            <h2 className="animate-fade-in-up delay-100 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="animate-fade-in-up delay-200 mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Three simple steps to optimize your AI spending
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="animate-fade-in-up glass-card group relative p-8"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                {/* Step Number */}
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-5xl font-black text-white/5 transition-colors duration-300 group-hover:text-white/10">
                    {step.step}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-white/10 transition-all duration-300 group-hover:from-indigo-500/30 group-hover:to-cyan-500/30 group-hover:ring-white/20">
                    <step.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-slate-400">
                  {step.description}
                </p>

                {/* Shimmer line */}
                <div className="animate-shimmer absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════
          TOOLS WE ANALYZE
          ═══════════════════════════════════════ */}
      <section
        id="tools"
        className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      >
        {/* Background orb */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="orb orb-accent animate-orb"
            style={{
              width: "400px",
              height: "400px",
              top: "20%",
              right: "10%",
              animationDelay: "1s",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center sm:mb-20">
            <p className="animate-fade-in-up mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Comprehensive Coverage
            </p>
            <h2 className="animate-fade-in-up delay-100 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Tools We <span className="gradient-text">Analyze</span>
            </h2>
            <p className="animate-fade-in-up delay-200 mx-auto mt-4 max-w-xl text-lg text-slate-400">
              We cover the most popular AI tools used by development teams
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className="tool-card glass-card group flex flex-col items-center gap-4 p-6 text-center sm:p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Logo Circle */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-16 sm:w-16"
                  style={{
                    background: `linear-gradient(135deg, ${tool.color}40, ${tool.color}20)`,
                    border: `1px solid ${tool.color}30`,
                    boxShadow: `0 4px 20px ${tool.color}15`,
                  }}
                >
                  {tool.initial}
                </div>
                <span className="text-sm font-medium text-slate-300 transition-colors duration-200 group-hover:text-white">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════
          SOCIAL PROOF / TESTIMONIALS
          ═══════════════════════════════════════ */}
      <section
        id="testimonials"
        className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center sm:mb-20">
            <p className="animate-fade-in-up mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Social Proof
            </p>
            <h2 className="animate-fade-in-up delay-100 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Teams <span className="gradient-text">Love</span> CostPilot
            </h2>
            <p className="animate-fade-in-up delay-200 mx-auto mt-3 max-w-md text-sm text-slate-500 italic">
              * Testimonials below are illustrative examples for demonstration
              purposes
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, index) => (
              <div
                key={t.author}
                className="animate-fade-in-up glass-card group relative flex flex-col justify-between p-8"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-8 flex-1 text-base leading-relaxed text-slate-300">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.author}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════ */}
      <section className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="orb orb-primary animate-orb"
            style={{
              width: "500px",
              height: "500px",
              top: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="animate-fade-in-up glass-card animate-pulse-glow p-10 sm:p-16">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to{" "}
              <span className="gradient-text">Stop Overpaying</span>?
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-lg text-slate-400">
              Join 120+ teams who have already optimized their AI spend. Your
              free audit takes less than 2 minutes.
            </p>
            <Link
              href="/audit"
              className="cta-button group inline-flex items-center gap-3 rounded-full px-10 py-5 text-lg font-bold text-white shadow-2xl"
            >
              Start Your Free Audit
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="mt-6 text-sm text-slate-500">
              No sign-up required · Results in seconds · 100% free
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-white/5 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Cost<span className="gradient-text">Pilot</span>
              </span>
            </div>

            {/* Built by */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Built by</span>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-slate-400 transition-colors hover:text-cyan-400"
              >
                Credex
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} CostPilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
