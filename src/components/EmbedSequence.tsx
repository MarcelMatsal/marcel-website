'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface TokenChip {
  id: number;
  text: string;
  /** viewport coords of the source text (chips are fixed-position) */
  x: number;
  y: number;
  /** embedding cell colors, hashed from the token */
  cells: string[];
}

type Phase = 'tokens' | 'vectors' | 'fly';

/** deterministic token → embedding colors, violet↔cyan like the site palette */
function cellsFor(text: string): string[] {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: 6 }, (_, i) => {
    const r = (h >> (i * 4)) & 15;
    const hue = 188 + (r / 15) * (262 - 188);
    const light = 42 + ((r * 7) % 26);
    return `hsl(${hue} 90% ${light}%)`;
  });
}

/**
 * Opening beat of the guided forward pass: on `interp:embed`, every
 * `[data-embed]` element in the hero sprouts a token chip in place, each chip
 * flips from text into a small embedding vector, and the vectors then stream
 * down toward the bottom of the viewport — right as InferenceRun scrolls the
 * page into layer_01.
 */
export default function EmbedSequence() {
  const [chips, setChips] = useState<TokenChip[]>([]);
  const [phase, setPhase] = useState<Phase>('tokens');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const at = (ms: number, fn: () => void) =>
      timers.current.push(setTimeout(fn, ms));

    const start = () => {
      if (reducedMotion) return;
      const host = document.getElementById('home');
      if (!host) return;

      const next: TokenChip[] = [];
      let id = 0;
      host.querySelectorAll<HTMLElement>('[data-embed]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.bottom < 0 || rect.top > window.innerHeight)
          return;
        const tokens = (el.dataset.embed || '').split(/\s+/).filter(Boolean);
        tokens.forEach((text, i) => {
          next.push({
            id: id++,
            text,
            x: rect.left + (rect.width * (i + 0.5)) / tokens.length,
            y: rect.top + rect.height / 2,
            cells: cellsFor(text),
          });
        });
      });
      if (next.length === 0) return;

      clearTimers();
      setChips(next);
      setPhase('tokens');
      at(950, () => setPhase('vectors'));
      at(1750, () => setPhase('fly'));
      at(2700, () => setChips([]));
    };

    const abort = () => {
      clearTimers();
      setChips([]);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') abort();
    };

    window.addEventListener('interp:embed', start);
    window.addEventListener('wheel', abort, { passive: true });
    window.addEventListener('touchmove', abort, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('interp:embed', start);
      window.removeEventListener('wheel', abort);
      window.removeEventListener('touchmove', abort);
      window.removeEventListener('keydown', onKey);
      clearTimers();
    };
  }, [reducedMotion]);

  const flying = phase === 'fly';
  // vectors converge where the page is about to scroll: bottom center
  const targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const targetY = typeof window !== 'undefined' ? window.innerHeight - 32 : 0;

  return (
    <AnimatePresence>
      {chips.length > 0 && (
        <motion.div
          key="embed-overlay"
          className="fixed inset-0 z-[240] pointer-events-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {chips.map((chip, i) => (
            <motion.div
              key={chip.id}
              className="absolute left-0 top-0"
              initial={{ x: chip.x, y: chip.y, opacity: 0, scale: 0.5 }}
              animate={
                flying
                  ? {
                      x: targetX,
                      y: targetY,
                      opacity: 0,
                      scale: 0.35,
                      transition: {
                        duration: 0.6,
                        delay: i * 0.05,
                        ease: [0.4, 0, 0.7, 1],
                      },
                    }
                  : {
                      x: chip.x,
                      y: chip.y,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: i * 0.07,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      },
                    }
              }
            >
              <div className="-translate-x-1/2 -translate-y-1/2 rounded border border-cyan-400/50 bg-[#0b0b1c]/90 px-2 py-1 font-mono text-[11px] text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.35)] backdrop-blur-sm">
                <AnimatePresence mode="wait" initial={false}>
                  {phase === 'tokens' ? (
                    <motion.span
                      key="tok"
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {'⟨'}
                      {chip.text}
                      {'⟩'}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="vec"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-[3px] py-[3px]"
                    >
                      {chip.cells.map((color, j) => (
                        <motion.span
                          key={j}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: j * 0.04, duration: 0.15 }}
                          className="h-2 w-2 rounded-[2px]"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {/* the "port" the vectors drain into — layer_01 is just below */}
          {flying && (
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-300"
              style={{ left: targetX, top: targetY }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1.4, 1, 0.6],
                boxShadow: [
                  '0 0 0px rgba(6,182,212,0)',
                  '0 0 30px rgba(6,182,212,0.9)',
                  '0 0 18px rgba(124,58,237,0.7)',
                  '0 0 0px rgba(6,182,212,0)',
                ],
              }}
              transition={{ duration: 0.95, times: [0, 0.3, 0.7, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
