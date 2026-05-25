// Public shareable report page
// Route: /report/[id]
// Fetches audit from Firestore, renders read-only view (no PII)

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AuditResult } from "@/types";
import ShareableReport from "@/components/ShareableReport/ShareableReport";

interface Props {
  params: Promise<{ id: string }>;
}

// Fetch audit server-side for OG metadata
async function getAudit(id: string): Promise<AuditResult | null> {
  try {
    const ref = doc(db, "audits", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as AuditResult;
  } catch {
    return null;
  }
}

// Dynamic Open Graph metadata for each report
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return {
      title: "Report Not Found — CostPilot",
    };
  }

  const savings = audit.totalMonthlySavings;
  const spend = audit.totalMonthlySpend;
  const title =
    savings > 0
      ? `I found $${savings}/mo in AI tool savings — CostPilot`
      : `My AI spend is optimized at $${spend}/mo — CostPilot`;

  const description =
    savings > 0
      ? `CostPilot analyzed my team's AI tool stack ($${spend}/mo) and found $${savings}/mo ($${audit.totalAnnualSavings}/year) in potential savings. Free 2-minute audit → costpilot.app`
      : `CostPilot confirmed my team's AI spend of $${spend}/mo is already well-optimized. Free 2-minute audit → costpilot.app`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://costpilot.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${appUrl}/report/${id}`,
      siteName: "CostPilot",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  return <ShareableReport audit={audit} reportId={id} />;
}
