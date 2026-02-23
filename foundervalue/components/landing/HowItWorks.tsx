const STEPS = [
  {
    number: "01",
    icon: "📍",
    title: "Choose your funding stage",
    desc: "Select from Pre-Seed through Acquisition/IPO. The tool automatically loads the right valuation methods for your stage.",
  },
  {
    number: "02",
    icon: "📝",
    title: "Enter your key metrics",
    desc: "Input your ARR, growth rate, cash flows, or risk factors — depending on your stage. Guided inputs with live previews as you type.",
  },
  {
    number: "03",
    icon: "📊",
    title: "Get your fair value range",
    desc: "See your valuation range across multiple methods, then evaluate any investor offer to check if the terms are fair.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-heading"
      className="py-20 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="hiw-heading" className="text-3xl font-bold text-navy">
            Three steps to know your number
          </h2>
          <p className="text-slate-500 mt-3">
            From blank form to a defensible valuation in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-slate-200 z-0"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <div key={i} className="relative text-center z-10">
              {/* Number circle */}
              <div className="w-20 h-20 rounded-full bg-navy text-white flex flex-col items-center justify-center mx-auto mb-5 shadow-md">
                <span className="text-xs text-teal/70 font-mono">{step.number}</span>
                <span className="text-2xl" role="img" aria-label={step.title}>
                  {step.icon}
                </span>
              </div>

              <h3 className="font-bold text-navy text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
