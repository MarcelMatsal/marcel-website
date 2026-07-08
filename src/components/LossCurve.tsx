'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

const W = 560;
const H = 190;

/* the loss landscape: high on the left, a small local dip, then the global
   minimum — screen-down = lower loss */
const CURVE: [number, number][] = [
  [20, 30],
  [80, 58],
  [140, 100],
  [190, 88],
  [250, 126],
  [330, 150],
  [400, 158],
  [470, 142],
  [540, 118],
];
const MIN_INDEX = 6; // global minimum

/** Catmull-Rom control points for segment i → i+1 */
function controls(pts: [number, number][], i: number) {
  const p0 = pts[i - 1] ?? pts[i];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[i + 2] ?? p2;
  return {
    c1: [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
    c2: [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
  };
}

function curvePath(pts: [number, number][], upto = pts.length - 1): string {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < upto; i++) {
    const { c1, c2 } = controls(pts, i);
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
  }
  return d;
}

/* dense samples along the descent (start → global minimum) so the ball can
   be animated with plain keyframes */
function descentSamples(): { xs: number[]; ys: number[] } {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < MIN_INDEX; i++) {
    const { c1, c2 } = controls(CURVE, i);
    const [p1, p2] = [CURVE[i], CURVE[i + 1]];
    for (let s = 0; s < 8; s++) {
      const t = s / 8;
      const u = 1 - t;
      xs.push(u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0]);
      ys.push(u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]);
    }
  }
  xs.push(CURVE[MIN_INDEX][0]);
  ys.push(CURVE[MIN_INDEX][1]);
  return { xs, ys };
}

const { xs, ys } = descentSamples();
const fullPath = curvePath(CURVE);
const descentPath = curvePath(CURVE, MIN_INDEX);
const [minX, minY] = CURVE[MIN_INDEX];
const DURATION = 3.2;

/**
 * Gradient descent finale for the output layer: a ball rolls down the loss
 * landscape into the global minimum while an epoch/loss readout ticks down.
 * Replays each time it scrolls into view.
 */
export default function LossCurve() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.5 });
  const [readout, setReadout] = useState({ epoch: 0, loss: 2.413 });

  useEffect(() => {
    if (reducedMotion) {
      // skip the descent animation: show the converged state directly
      setReadout({ epoch: 48, loss: 2.41 * Math.exp(-5.5) + 0.003 });
      return;
    }
    if (!inView) {
      setReadout({ epoch: 0, loss: 2.413 });
      return;
    }
    const controls = animate(0, 1, {
      duration: DURATION,
      ease: 'easeInOut',
      onUpdate: (v) =>
        setReadout({
          epoch: Math.round(v * 48),
          loss: 2.41 * Math.exp(-5.5 * v) + 0.003,
        }),
    });
    return () => controls.stop();
  }, [inView, reducedMotion]);

  const converged = readout.epoch >= 48;

  return (
    <div ref={ref} className="mb-10">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" aria-hidden="true">
        <defs>
          <linearGradient id="descent-grad" gradientUnits="userSpaceOnUse" x1={CURVE[0][0]} y1="0" x2={minX} y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* axis labels */}
        <text x="20" y="16" className="fill-slate-500" fontSize="10" fontFamily="var(--font-geist-mono)">
          loss
        </text>
        <text x="540" y="184" textAnchor="end" className="fill-slate-500" fontSize="10" fontFamily="var(--font-geist-mono)">
          epochs →
        </text>

        {/* the loss landscape */}
        <path d={fullPath} fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="1.5" />

        {/* marker at the global minimum */}
        <line x1={minX} y1={minY + 6} x2={minX} y2={H - 18} stroke="rgba(6,182,212,0.35)" strokeWidth="1" strokeDasharray="2 4" />
        <text x={minX} y={H - 6} textAnchor="middle" className="fill-cyan-400/80" fontSize="10" fontFamily="var(--font-geist-mono)">
          global minimum
        </text>

        {/* gradient trail drawn behind the descending ball */}
        <motion.path
          d={descentPath}
          fill="none"
          stroke="url(#descent-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reducedMotion ? 1 : 0 }}
          animate={{ pathLength: reducedMotion || inView ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : DURATION, ease: 'easeInOut' }}
        />

        {/* convergence ping once the ball settles */}
        {inView && !reducedMotion && (
          <motion.circle
            cx={minX}
            cy={minY}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            initial={{ r: 6, opacity: 0 }}
            animate={{ r: [6, 18], opacity: [0.8, 0] }}
            transition={{ delay: DURATION + 0.2, duration: 1.6, repeat: Infinity, repeatDelay: 0.4 }}
          />
        )}

        {/* the descending ball */}
        <motion.circle
          r="5.5"
          fill="#fb7185"
          style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.9))' }}
          initial={
            reducedMotion ? { cx: minX, cy: minY } : { cx: xs[0], cy: ys[0] }
          }
          animate={
            reducedMotion
              ? { cx: minX, cy: minY }
              : inView
                ? { cx: xs, cy: ys }
                : { cx: xs[0], cy: ys[0] }
          }
          transition={{ duration: reducedMotion ? 0 : DURATION, ease: 'easeInOut' }}
        />
      </svg>

      {/* training readout */}
      <p className="text-center font-mono text-[11px] tracking-wider mt-3">
        <span className="text-slate-400">
          epoch {String(readout.epoch).padStart(3, '0')} · loss {readout.loss.toFixed(3)} · optimizer: AdamW ·{' '}
        </span>
        <span className={converged ? 'text-cyan-300' : 'text-rose-400'}>
          {converged ? 'converged ✓' : 'descending…'}
        </span>
      </p>
    </div>
  );
}
