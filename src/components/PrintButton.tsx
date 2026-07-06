'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hidden font-mono text-xs px-3 py-1.5 rounded border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/60 transition-all cursor-pointer"
    >
      ⎙ print / save as pdf
    </button>
  );
}
