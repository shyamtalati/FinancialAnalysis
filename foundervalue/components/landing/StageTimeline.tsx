import Link from "next/link";
import { STAGES } from "@/lib/constants";
import { getStageColor } from "@/lib/utils";

const METHOD_NAMES: Record<string, string> = {
  berkus: "Berkus",
  scorecard: "Scorecard",
  "vc-method": "VC Method",
  "arr-multiples": "ARR Multiples",
  dcf: "DCF",
  "comparable-company": "Comp Analysis",
};

export default function StageTimeline() {
  return (
    <section
      id="stages"
      aria-labelledby="stages-heading"
      className="py-20 px-4 sm:px-6 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="stages-heading" className="text-3xl font-bold text-navy">
            Coverage from Day 1 to Exit
          </h2>
          <p className="text-slate-500 mt-3">
            Every funding stage uses different valuation methods. We cover them all.
          </p>
        </div>

        {/* Horizontally scrollable on mobile, grid on desktop */}
        <div
          className="overflow-x-auto pb-4 -mx-4 px-4"
          role="list"
          aria-label="Funding stages"
        >
          <div className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-3 lg:grid-cols-6">
            {STAGES.map((stage, i) => {
              const color = getStageColor(stage.slug);
              return (
                <Link
                  key={stage.slug}
                  href={`/tool/${stage.slug}/`}
                  role="listitem"
                  className="group block w-48 md:w-auto border border-slate-200 bg-white rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                  aria-label={`${stage.label}: ${stage.description}`}
                >
                  {/* Stage number + color dot */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-mono text-slate-400">
                      0{i + 1}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-navy text-sm group-hover:text-teal transition-colors"
                    style={{ color: "inherit" }}
                  >
                    {stage.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {stage.description}
                  </p>
                  <p className="text-xs font-semibold mt-2" style={{ color }}>
                    {stage.raiseRange}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {stage.methods.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                      >
                        {METHOD_NAMES[m] ?? m}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
