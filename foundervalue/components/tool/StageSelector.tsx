"use client";

import { useRouter } from "next/navigation";
import { STAGES } from "@/lib/constants";
import { formatCurrency, getStageColor } from "@/lib/utils";

const METHOD_LABELS: Record<string, string> = {
  berkus: "Berkus",
  scorecard: "Scorecard",
  "vc-method": "VC Method",
  "arr-multiples": "ARR Multiples",
  dcf: "DCF",
  "comparable-company": "Comp Analysis",
};

export default function StageSelector({ currentStage }: { currentStage?: string }) {
  const router = useRouter();

  return (
    <div
      role="list"
      aria-label="Select your funding stage"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {STAGES.map((stage) => {
        const isActive = stage.slug === currentStage;
        const color = getStageColor(stage.slug);

        return (
          <button
            key={stage.slug}
            role="listitem"
            type="button"
            onClick={() => router.push(`/tool/${stage.slug}/`)}
            aria-pressed={isActive}
            className={`text-left border-2 rounded-xl p-5 transition-all focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${
              isActive
                ? "border-navy bg-navy text-white shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md"
            }`}
            style={isActive ? {} : { borderTopColor: color }}
          >
            <div
              className="w-3 h-3 rounded-full mb-3"
              style={{ background: color }}
              aria-hidden="true"
            />
            <h3
              className={`font-bold text-base ${
                isActive ? "text-white" : "text-navy"
              }`}
            >
              {stage.label}
            </h3>
            <p
              className={`text-xs mt-1 ${
                isActive ? "text-white/70" : "text-slate-500"
              }`}
            >
              {stage.description}
            </p>
            <p
              className={`text-xs mt-2 font-medium ${
                isActive ? "text-teal-light" : "text-teal"
              }`}
            >
              Raise: {stage.raiseRange}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {stage.methods.map((m) => (
                <span
                  key={m}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {METHOD_LABELS[m] ?? m}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
