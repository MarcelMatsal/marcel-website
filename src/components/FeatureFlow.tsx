'use client';

import { useCallback, useEffect, useState } from 'react';
import { DIVIDER_FEW, DIVIDER_HALF } from './LayerDivider';

interface Pt {
  x: number;
  y: number;
}

interface FeatureFlowProps {
  /** the skills <section>, which the lines span top to bottom */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** currently selected skill names; each drops a feed line toward layer_02 */
  selected: string[];
}

/* trunk x positions: exactly the LayerDivider "few" terminals so the trunks
   plug into the divider ports above (contract divider output) and below
   (expand divider input); the ports sit DIVIDER_HALF px inside the section */
const TRUNKS = DIVIDER_FEW.map((p) => p / 100);

/**
 * Synapse layer for the feature dictionary: three signal trunks that pick up
 * the converged outputs of the divider above, flow behind the skill chips,
 * and hand off to the diverging divider below — so the signal visibly
 * travels through the section. Every selected chip additionally drops its
 * own bright feed line that merges into a trunk toward the projects layer.
 */
export default function FeatureFlow({ sectionRef, selected }: FeatureFlowProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [chipPts, setChipPts] = useState<Pt[]>([]);

  const measure = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });
    const pts: Pt[] = [];
    for (const name of selected) {
      const chip = el.querySelector(`[data-skill-chip="${name}"]`);
      if (!chip) continue;
      const r = chip.getBoundingClientRect();
      pts.push({
        x: r.left + r.width / 2 - rect.left,
        y: r.bottom - rect.top,
      });
    }
    setChipPts(pts);
  }, [sectionRef, selected]);

  useEffect(() => {
    measure();
    const el = sectionRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, sectionRef]);

  if (size.w === 0) return null;
  const { w, h } = size;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      width={w}
      height={h}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="feature-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={h}>
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* signal trunks: divider ports above → through the chips → ports below;
          the ports live DIVIDER_HALF px inside the section, where the divider
          bands' terminal rows actually sit */}
      {TRUNKS.map((t, i) => {
        const x = w * t;
        const y0 = DIVIDER_HALF;
        const y1 = h - DIVIDER_HALF;
        const bow = (i - 1) * 90; // outer trunks bow outward, center stays
        return (
          <g key={`trunk-${i}`}>
            <path
              d={`M ${x} ${y0} C ${x + bow} ${y0 + (y1 - y0) * 0.33}, ${x + bow} ${y0 + (y1 - y0) * 0.66}, ${x} ${y1}`}
              fill="none"
              stroke="url(#feature-grad)"
              strokeWidth="1.2"
              strokeDasharray="3 6"
              opacity="0.22"
              className="synapse-flow"
            />
            {/* ports matching the divider terminals: teal above, violet below */}
            <circle cx={x} cy={y0} r="2" fill="#06b6d4" opacity="0.55" />
            <circle cx={x} cy={y1} r="2" fill="#7c3aed" opacity="0.55" />
          </g>
        );
      })}

      {/* selected features merge into the trunks feeding the projects layer */}
      {chipPts.map((c, k) => {
        const fx = w * TRUNKS[k % TRUNKS.length];
        const fy = h - DIVIDER_HALF;
        return (
          <g key={`feed-${k}`}>
            <path
              d={`M ${c.x} ${c.y} Q ${c.x} ${c.y + (fy - c.y) * 0.6}, ${fx} ${fy}`}
              fill="none"
              stroke="#67e8f9"
              strokeWidth="1.4"
              strokeDasharray="3 6"
              opacity="0.5"
              className="synapse-flow"
            />
            <circle cx={c.x} cy={c.y} r="2" fill="#67e8f9" opacity="0.85" />
            <circle cx={fx} cy={fy} r="2.5" fill="#06b6d4" opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}
