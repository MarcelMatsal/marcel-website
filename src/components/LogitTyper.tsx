'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CANDIDATES = [
  { text: 'Software Engineer.', short: 'engineer', p: 0.41 },
  { text: 'Deep Learning/ML Researcher.', short: 'researcher', p: 0.38 },
  { text: 'Ex D1 Athlete.', short: 'athlete', p: 0.21 },
];

type Phase = 'sampling' | 'typing' | 'holding' | 'deleting';

/**
 * The hero tagline as a sampling visualization: a logit readout shows the
 * candidate distribution, the highlight flickers across candidates while
 * "sampling", then the chosen phrase types out.
 */
export default function LogitTyper() {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('sampling');
  const [text, setText] = useState('');
  const [flicker, setFlicker] = useState(0);

  useEffect(() => {
    if (reduced) {
      // no typing/flicker: rotate the full phrase on a timer
      setText(CANDIDATES[idx].text);
      const t = setTimeout(() => setIdx((i) => (i + 1) % CANDIDATES.length), 3600);
      return () => clearTimeout(t);
    }

    const target = CANDIDATES[idx].text;
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case 'sampling': {
        let ticks = 0;
        const iv = setInterval(() => {
          ticks++;
          setFlicker((f) => (f + 1) % CANDIDATES.length);
          if (ticks >= 7) {
            clearInterval(iv);
            setFlicker(idx);
            setPhase('typing');
          }
        }, 130);
        return () => clearInterval(iv);
      }
      case 'typing':
        t =
          text.length < target.length
            ? setTimeout(() => setText(target.slice(0, text.length + 1)), 45)
            : setTimeout(() => setPhase('holding'), 100);
        return () => clearTimeout(t);
      case 'holding':
        t = setTimeout(() => setPhase('deleting'), 3000);
        return () => clearTimeout(t);
      case 'deleting':
        if (text.length > 0) {
          t = setTimeout(() => setText(text.slice(0, -1)), 22);
          return () => clearTimeout(t);
        }
        setIdx((idx + 1) % CANDIDATES.length);
        setPhase('sampling');
        return;
    }
  }, [phase, text, idx, reduced]);

  const activeIdx = phase === 'sampling' && !reduced ? flicker : idx;

  return (
    <div className="mt-4">
      <div className="text-xl sm:text-2xl text-slate-300 h-[2em]">
        I am a{' '}
        <span className="text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(6,182,212,0.55)]">
          {text}
          {!reduced && (
            <span className={phase === 'sampling' ? 'opacity-40' : 'animate-pulse'}>▍</span>
          )}
        </span>
      </div>

      {/* logit readout: the distribution the tagline is sampled from */}
      <div className="h-5 flex flex-wrap items-center gap-x-3 justify-center sm:justify-start font-mono text-[11px] tracking-wider">
        <span className="text-slate-500">p(next) →</span>
        {CANDIDATES.map((c, i) => (
          <span
            key={c.short}
            className={`transition-colors duration-150 ${
              i === activeIdx ? 'text-cyan-300' : 'text-slate-500'
            }`}
          >
            {c.short} {c.p.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}
