'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  experienceNodes,
  projectNodes,
  dictionaryFeatures,
} from '@/lib/probeData';

const strongestExp = experienceNodes.reduce((a, b) =>
  b.activation > a.activation ? b : a
);
const strongestProj = projectNodes.reduce((a, b) =>
  b.activation > a.activation ? b : a
);

interface Step {
  /** section id to scroll to */
  target: string;
  lines: string[];
  /** fire a sequential activation wave through this layer's nodes */
  wave?: 'experience' | 'projects';
  /** play the tokenize→embed overlay on the hero content */
  embed?: boolean;
}

const STEPS: Step[] = [
  {
    target: 'home',
    lines: [
      'tokenizing input · marcel_mateos_salles',
      'embeddings ready — starting forward pass',
    ],
    embed: true,
  },
  {
    target: 'experience',
    lines: [
      `layer_01 · experience — ${experienceNodes.length} units firing`,
      `strongest unit: ${strongestExp.label} @ ${strongestExp.activation.toFixed(2)}`,
    ],
    wave: 'experience',
  },
  {
    target: 'skills',
    lines: [
      `feature_dictionary — ${dictionaryFeatures.length} features loaded`,
      'select features to steer layer_02',
    ],
  },
  {
    target: 'projects',
    lines: [
      `layer_02 · projects — ${projectNodes.length} units firing`,
      `strongest unit: ${strongestProj.label} @ ${strongestProj.activation.toFixed(2)}`,
    ],
    wave: 'projects',
  },
  {
    target: 'contact',
    lines: [
      'output_layer · descending the loss curve',
      'loss converged ≈ 0.003',
      'argmax(output) → "Email Me!"',
    ],
  },
];

/**
 * Guided forward pass: listens for `interp:run` (hero button, console) and
 * executes the site as if it were a model — auto-scrolling layer by layer
 * while a HUD narrates what each layer is doing. Any scroll gesture or
 * Escape hands control back to the visitor.
 */
export default function InferenceRun() {
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runningRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const stop = (aborted: boolean) => {
    if (!runningRef.current) return;
    clearTimers();
    if (aborted) {
      runningRef.current = false;
      setRunning(false);
      setDone(false);
    } else {
      setDone(true);
      // linger on the converged state, then hand the page back
      timers.current.push(
        setTimeout(() => {
          runningRef.current = false;
          setRunning(false);
          setDone(false);
        }, 2800)
      );
    }
  };

  useEffect(() => {
    const at = (ms: number, fn: () => void) =>
      timers.current.push(setTimeout(fn, ms));

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      setRunning(true);
      setDone(false);
      setLines([]);
      // make sure a lingering backward pass doesn't reverse the run
      document.documentElement.classList.remove('backward-pass');

      const scrollDelay = reducedMotion ? 250 : 900;
      const lineDelay = reducedMotion ? 350 : 700;
      const hold = reducedMotion ? 700 : 1400;

      let t = 0;
      for (const step of STEPS) {
        const stepStart = t;
        at(stepStart, () => {
          document.getElementById(step.target)?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        });
        if (step.wave && !reducedMotion) {
          at(stepStart + scrollDelay, () =>
            window.dispatchEvent(
              new CustomEvent('interp:wave', { detail: { layer: step.wave } })
            )
          );
        }
        const embedding = Boolean(step.embed) && !reducedMotion;
        if (embedding) {
          at(stepStart + scrollDelay, () =>
            window.dispatchEvent(new Event('interp:embed'))
          );
        }
        step.lines.forEach((line, i) => {
          at(stepStart + scrollDelay + i * lineDelay, () =>
            setLines((prev) => [...prev.slice(-3), line])
          );
        });
        t =
          stepStart +
          scrollDelay +
          step.lines.length * lineDelay +
          hold +
          // the embed overlay runs ~2.7s from the scroll settling; give it
          // room so the vectors are mid-flight when the page moves on
          (embedding ? 600 : 0);
      }
      at(t, () => {
        setLines((prev) => [...prev.slice(-3), 'forward pass complete ✓']);
        stop(false);
      });
    };

    window.addEventListener('interp:run', start);
    return () => {
      window.removeEventListener('interp:run', start);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // the visitor taking the wheel aborts the run
  useEffect(() => {
    if (!running || done) return;
    const abort = () => stop(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop(true);
    };
    window.addEventListener('wheel', abort, { passive: true });
    window.addEventListener('touchmove', abort, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', abort);
      window.removeEventListener('touchmove', abort);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, done]);

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-6 z-[250] w-[min(320px,calc(100vw-3rem))] rounded-lg border border-cyan-500/25 bg-[#0b0b1c]/95 backdrop-blur shadow-[0_0_40px_rgba(6,182,212,0.15)] font-mono text-xs"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <span className="flex items-center gap-2 text-slate-400 tracking-widest">
              <span
                className={`w-2 h-2 rounded-full ${
                  done
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                    : 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse'
                }`}
              />
              INFERENCE RUN
            </span>
            <button
              type="button"
              onClick={() => stop(true)}
              className="text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
            >
              abort
            </button>
          </div>
          <div className="px-4 py-3 space-y-1 min-h-[72px]">
            {lines.map((line, i) => (
              <p
                key={`${i}-${line}`}
                className={
                  i === lines.length - 1 ? 'text-cyan-200' : 'text-slate-400'
                }
              >
                {line}
                {i === lines.length - 1 && !done && (
                  <span className="animate-pulse"> ▮</span>
                )}
              </p>
            ))}
          </div>
          {!done && (
            <p className="px-4 pb-2 text-[10px] text-slate-600">
              scroll or esc to take control
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
