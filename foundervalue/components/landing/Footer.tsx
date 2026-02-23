import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-navy flex items-center justify-center" aria-hidden="true">
            <span className="text-teal font-bold text-xs">FV</span>
          </div>
          <span className="font-semibold text-white text-sm">FounderValue</span>
        </div>

        <nav aria-label="Footer navigation" className="flex gap-5 text-xs">
          <Link href="/tool/" className="hover:text-white transition-colors focus-visible:text-white focus-visible:underline">
            Valuation Tool
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors focus-visible:text-white focus-visible:underline">
            How It Works
          </Link>
          <Link href="/#stages" className="hover:text-white transition-colors focus-visible:text-white focus-visible:underline">
            Stages
          </Link>
        </nav>

        <p className="text-xs">
          © {new Date().getFullYear()} FounderValue. For informational purposes only — not financial advice.
        </p>
      </div>
    </footer>
  );
}
