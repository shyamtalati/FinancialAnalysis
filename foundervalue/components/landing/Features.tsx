const FEATURES = [
  {
    icon: "🎯",
    title: "Stage-Aware Methods",
    desc: "The right valuation model for your stage — Berkus and Scorecard for pre-revenue, ARR multiples for SaaS, DCF for growth, and comparable analysis for exit.",
    size: "large",
  },
  {
    icon: "⚖️",
    title: "Offer Fairness Check",
    desc: "Enter an investor's term sheet and instantly see if their proposed valuation is fair, below, or above your calculated worth.",
    size: "normal",
  },
  {
    icon: "🥧",
    title: "Dilution Visualizer",
    desc: "See exactly what percentage of your company you'd give up with each deal — before you sign.",
    size: "normal",
  },
  {
    icon: "🧮",
    title: "6 Valuation Methods",
    desc: "Berkus · Scorecard · VC Method · ARR Multiples · DCF · Comparable Company Analysis",
    size: "normal",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "All calculations run in your browser — no waiting for a consultant's report.",
    size: "normal",
  },
  {
    icon: "🔒",
    title: "Completely Private",
    desc: "No account needed. Your numbers never leave your device.",
    size: "normal",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 px-4 sm:px-6 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="features-heading"
            className="text-3xl font-bold text-navy"
          >
            Everything founders need to negotiate better
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Purpose-built for the moment when an investor puts a term sheet on
            the table and you need to know your number.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className={`bg-white border border-slate-200 rounded-2xl p-6 ${
                feature.size === "large"
                  ? "sm:col-span-2 lg:col-span-1 lg:row-span-1"
                  : ""
              }`}
            >
              <span
                className="text-3xl mb-4 block"
                role="img"
                aria-label={feature.title}
              >
                {feature.icon}
              </span>
              <h3 className="font-bold text-navy text-base">{feature.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
