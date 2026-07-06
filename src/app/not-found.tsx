import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* a dead unit: dashed ring, zero activation */}
      <div className="flex items-center justify-center w-28 h-28 rounded-full border border-dashed border-slate-500/50 bg-[#0b0b1c]/70 mb-8">
        <div className="font-mono text-xs text-slate-500 leading-relaxed">
          u??
          <br />
          0.00
        </div>
      </div>

      <p className="font-mono text-xs text-cyan-400/80 tracking-[0.35em] uppercase mb-3">
        {'// probe error'}
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-slate-100">
        404 · unit not found
      </h1>
      <p className="text-slate-400 mt-4 max-w-md">
        This feature never activated for any input. The page you probed doesn&apos;t
        exist in the network.
      </p>

      <Link
        href="/"
        className="mt-10 rounded-full px-6 py-3 font-medium text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] transition-shadow"
      >
        Return to the input layer
      </Link>
    </main>
  );
}
