import Link from "next/link";

const STAGE_PILLS = [
  { label: "Pre-Seed", color: "bg-indigo-100 text-indigo-700" },
  { label: "Seed", color: "bg-teal-100 text-teal-700" },
  { label: "Series A–C", color: "bg-blue-100 text-blue-700" },
  { label: "Growth", color: "bg-amber-100 text-amber-700" },
  { label: "Acquisition / IPO", color: "bg-red-100 text-red-700" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 px-4 sm:px-6">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-navy/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-teal/10 text-teal-dark text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-teal/20">
          <span className="w-1.5 h-1.5 rounded-full bg-teal" aria-hidden="true" />
          Built for Founders
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy leading-tight tracking-tight">
          Know Your Worth.{" "}
          <span className="text-teal">Negotiate</span>{" "}
          with Confidence.
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Value your startup from Pre-Seed to Acquisition using proven financial
          methods — then instantly see whether any investor offer is fair, and
          exactly how much equity you&apos;d be giving up.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tool/"
            className="bg-navy text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy-light transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 text-base"
          >
            Calculate My Valuation →
          </Link>
          <Link
            href="#how-it-works"
            className="border border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:border-navy hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 text-base"
          >
            See How It Works
          </Link>
        </div>

        {/* Trust signals */}
        <p className="mt-5 text-xs text-slate-400">
          Free to use · No signup required · All calculations stay in your browser
        </p>

        {/* Stage pills */}
        <div className="mt-10 flex flex-wrap gap-2 justify-center" aria-label="Supported funding stages">
          {STAGE_PILLS.map((pill) => (
            <span
              key={pill.label}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${pill.color}`}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
