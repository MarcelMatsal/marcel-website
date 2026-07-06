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
      <button
        type="button"
        onClick={runBackprop}
        title="Propagate gradients back to the input layer"
        className="font-mono text-xs text-rose-400/80 hover:text-rose-300 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] transition-all cursor-pointer mb-3"
      >
        {'∇ run_backprop()'}
      </button>
      <p className="text-sm text-slate-400">
        © {new Date().getFullYear()} Marcel Mateos Salles. All rights reserved.
      </p>
      <p className="font-mono text-[10px] text-slate-600 tracking-[0.3em] mt-2">
        {'// end of forward pass'}
      </p>
      <p className="hidden sm:block font-mono text-[10px] text-slate-700 mt-2">
        press ` to open the interpretability console
      </p>
    </footer>
  );
}
