'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LAYERS = [
  { id: 'home', label: 'in' },
  { id: 'experience', label: 'exp' },
  { id: 'skills', label: 'feat' },
  { id: 'projects', label: 'proj' },
  { id: 'contact', label: 'out' },
];

interface Tick {
  id: string;
  label: string;
  /** 0..1 position along the scrollable range */
  pos: number;
}

/**
 * Fixed "residual stream" rail on the left edge: a gradient line that fills
 * with scroll progress, a glowing dot riding it, and one clickable tick per
 * layer/section. Desktop only.
 */
export default function ResidualStream() {
  const { scrollYProgress } = useScroll();
  const dotTop = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [active, setActive] = useState(0);
  // scroll direction: scrolling down = forward pass, scrolling up = backward
  // pass (gradients flowing back through the network)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd');
  const lastProgress = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = useCallback(() => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const next: Tick[] = [];
    for (const layer of LAYERS) {
      const el = document.getElementById(layer.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      next.push({
        ...layer,
        pos: Math.min(1, Math.max(0, (top - 64) / scrollable)),
      });
    }
    setTicks(next);
  }, []);

  useEffect(() => {
    measure();
    // content height shifts as images load / sections animate in
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // highlight the layer the scroll position has reached, and flip the whole
  // page between forward pass (scrolling down) and backward pass (scrolling
  // up): `backward-pass` on <html> reverses every dashed synapse-flow line
  useEffect(() => {
    const setDirection = (next: 'fwd' | 'bwd') => {
      setDir(next);
      document.documentElement.classList.toggle('backward-pass', next === 'bwd');
    };
    const unsubscribe = scrollYProgress.on('change', (p) => {
      let idx = 0;
      ticks.forEach((t, i) => {
        if (p >= t.pos - 0.02) idx = i;
      });
      setActive(idx);

      const delta = p - lastProgress.current;
      lastProgress.current = p;
      if (Math.abs(delta) > 0.0003) {
        setDirection(delta < 0 ? 'bwd' : 'fwd');
        if (idleTimer.current) clearTimeout(idleTimer.current);
        // settle back into the forward pass once scrolling stops
        idleTimer.current = setTimeout(() => setDirection('fwd'), 2500);
      }
    });
    return () => {
      unsubscribe();
      if (idleTimer.current) clearTimeout(idleTimer.current);
      document.documentElement.classList.remove('backward-pass');
    };
  }, [scrollYProgress, ticks]);

  const backward = dir === 'bwd';

  return (
    <div className="fixed left-5 top-24 bottom-12 z-40 hidden lg:block w-24">
      <div className="relative h-full">
        {/* pass-direction readout */}
        <span
          className={`absolute -top-6 left-0 font-mono text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
            backward ? 'text-rose-400' : 'text-cyan-400/70'
          }`}
        >
          {backward ? '∇ backward' : '▸ forward'}
        </span>

        {/* track */}
        <div className="absolute inset-y-0 left-1 w-px bg-white/10" />

        {/* progress fill: violet→teal on the forward pass, gradient-descent
            amber→rose while backpropagating */}
        <motion.div
          className={`absolute inset-y-0 left-1 w-px origin-top ${
            backward
              ? 'bg-gradient-to-b from-[#f59e0b] to-[#f43f5e] shadow-[0_0_8px_rgba(244,63,94,0.6)]'
              : 'bg-gradient-to-b from-[#7c3aed] to-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.6)]'
          }`}
          style={{ scaleY: scrollYProgress }}
        />

        {/* signal dot */}
        <motion.div
          className={`absolute left-1 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            backward
              ? 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.9),0_0_22px_rgba(245,158,11,0.6)]'
              : 'bg-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.9),0_0_22px_rgba(124,58,237,0.6)]'
          }`}
          style={{ top: dotTop }}
        />

        {/* layer ticks */}
        {ticks.map((tick, i) => (
          <button
            key={tick.id}
            type="button"
            aria-label={`Scroll to ${tick.id}`}
            onClick={() =>
              document
                .getElementById(tick.id)
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="absolute -translate-y-1/2 flex items-center gap-2 cursor-pointer group"
            style={{ top: `${tick.pos * 100}%`, left: 0 }}
          >
            <span
              className={`w-2 h-2 rounded-full border transition-all ${
                active === i
                  ? 'border-cyan-300 bg-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.9)]'
                  : 'border-slate-600 bg-[#05050f] group-hover:border-cyan-400/60'
              }`}
            />
            <span
              className={`font-mono text-[9px] tracking-[0.2em] uppercase transition-colors ${
                active === i
                  ? 'text-cyan-300'
                  : 'text-slate-600 group-hover:text-slate-400'
              }`}
            >
              {i === LAYERS.length - 1 ? tick.label : `L${i}·${tick.label}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
