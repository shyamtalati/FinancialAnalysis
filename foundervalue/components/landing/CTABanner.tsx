import Link from "next/link";

export default function CTABanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20 px-4 sm:px-6 bg-navy"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Ready to know your startup&apos;s worth?
        </h2>
        <p className="text-white/70 mt-4 text-lg">
          Don&apos;t walk into your next investor meeting without knowing your
          number. It takes less than 5 minutes.
        </p>

        <Link
          href="/tool/"
          className="inline-block mt-8 bg-amber text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-amber-dark transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          Calculate My Valuation →
        </Link>

        <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm text-white/50">
          <span>✓ Free to use</span>
          <span>✓ No signup</span>
          <span>✓ Private — stays in your browser</span>
        </div>
      </div>
    </section>
  );
}
