'use client';

export default function Footer() {
  const runBackprop = () => {
    // scrolling up is what actually flips the page into the backward pass
    // (ResidualStream watches direction); nothing to propagate from the top
    if (window.scrollY < 4) return;
    document.documentElement.classList.add('backward-pass');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 text-center border-t border-white/5">
      <div className="flex items-center justify-center gap-6 mb-3">
        <button
          type="button"
          onClick={runBackprop}
          title="Propagate gradients back to the input layer"
          className="font-mono text-xs text-rose-400/80 hover:text-rose-300 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] transition-all cursor-pointer"
        >
          {'∇ run_backprop()'}
        </button>
        <a
          href="/model-card"
          title="The static, printable readout of this network"
          className="font-mono text-xs text-cyan-400/80 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] transition-all"
        >
          {'model_card.md →'}
        </a>
      </div>
      <p className="text-sm text-slate-400">
        © {new Date().getFullYear()} Marcel Mateos Salles. All rights reserved.
      </p>
      <p className="font-mono text-[10px] text-slate-600 tracking-[0.3em] mt-2">
        {'// end of forward pass'}
      </p>
      <p className="hidden sm:block font-mono text-[11px] text-slate-500 mt-2">
        press ` to open the interpretability console
      </p>
    </footer>
  );
}
