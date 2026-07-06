'use client';

import { useCallback, useEffect, useState } from 'react';

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

/* trunk x positions: exactly the LayerDivider "few" terminals (38/50/62% of
   the viewport) so the trunks visually plug into the divider ports above
   (contract divider output) and below (expand divider input) */
const TRUNKS = [0.38, 0.5, 0.62];

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

      {/* signal trunks: divider ports above → through the chips → ports below */}
      {TRUNKS.map((t, i) => {
        const x = w * t;
        const bow = (i - 1) * 90; // outer trunks bow outward, center stays
        return (
          <g key={`trunk-${i}`}>
            <path
              d={`M ${x} 0 C ${x + bow} ${h * 0.33}, ${x + bow} ${h * 0.66}, ${x} ${h}`}
              fill="none"
              stroke="url(#feature-grad)"
              strokeWidth="1.2"
              strokeDasharray="3 6"
              opacity="0.28"
              className="synapse-flow"
            />
            {/* ports matching the divider terminals: teal above, violet below */}
            <circle cx={x} cy={0} r="2.5" fill="#06b6d4" opacity="0.7" />
            <circle cx={x} cy={h} r="2.5" fill="#7c3aed" opacity="0.7" />
          </g>
        );
      })}

      {/* selected features merge into the trunks feeding the projects layer */}
      {chipPts.map((c, k) => {
        const fx = w * TRUNKS[k % TRUNKS.length];
        return (
          <g key={`feed-${k}`}>
            <path
              d={`M ${c.x} ${c.y} Q ${c.x} ${c.y + (h - c.y) * 0.6}, ${fx} ${h}`}
              fill="none"
              stroke="#67e8f9"
              strokeWidth="1.4"
              strokeDasharray="3 6"
              opacity="0.5"
              className="synapse-flow"
            />
            <circle cx={c.x} cy={c.y} r="2" fill="#67e8f9" opacity="0.85" />
            <circle cx={fx} cy={h} r="2.5" fill="#06b6d4" opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}
