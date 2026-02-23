import Link from "next/link";
import StageSelector from "@/components/tool/StageSelector";

export const metadata = {
  title: "Choose Your Stage | FounderValue",
  description: "Select your funding stage to get an accurate startup valuation.",
};

export default function ToolPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-teal hover:text-teal-dark font-medium focus-visible:underline"
          >
            ← Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">
            Valuation Tool
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-navy">
            What stage is your startup?
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Select your current funding stage to access the right valuation
            methods for your company.
          </p>
        </div>

        <StageSelector />

        <p className="text-center text-xs text-slate-400 mt-8">
          Free to use · No account required · All calculations run in your
          browser
        </p>
      </main>
    </div>
  );
}
