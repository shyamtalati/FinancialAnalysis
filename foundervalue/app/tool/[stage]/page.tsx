import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { StageSlug } from "@/lib/types";
import { STAGES, STAGE_SLUGS } from "@/lib/constants";
import StageCalculator from "@/components/tool/StageCalculator";

export function generateStaticParams() {
  return STAGE_SLUGS.map((stage) => ({ stage }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage } = await params;
  const stageMeta = STAGES.find((s) => s.slug === stage);
  if (!stageMeta) return { title: "Stage Not Found" };

  return {
    title: `${stageMeta.label} Valuation`,
    description: `Calculate your ${stageMeta.label} startup valuation using proven methods. ${stageMeta.description}.`,
  };
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;

  if (!STAGE_SLUGS.includes(stage as StageSlug)) {
    notFound();
  }

  return <StageCalculator stage={stage as StageSlug} />;
}
