import Link from "next/link";

export default function StageNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
        <h1 className="text-2xl font-bold text-navy mb-2">Stage not found</h1>
        <p className="text-slate-500 mb-6">
          That funding stage doesn&apos;t exist. Please select a valid stage to
          calculate your valuation.
        </p>
        <Link
          href="/tool/"
          className="inline-block bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors"
        >
          Choose a Stage
        </Link>
      </div>
    </div>
  );
}
