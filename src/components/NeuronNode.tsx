'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { KIND_COLORS, hexToRgba, type ProbeNodeData } from '@/lib/probeData';

interface NeuronNodeProps {
  data: ProbeNodeData;
  index: number;
  /** dimmed when a skill filter is active and this unit doesn't match */
  dimmed?: boolean;
  /** chronology chip shown above the circle, e.g. "t-0" (most recent) */
  timeLabel?: string;
  /** briefly lit up while a connected skill is hovered in the dictionary */
  pinged?: boolean;
  /** ablated units read 0.00, lose their glow, and drop their edges */
  ablated?: boolean;
  /** notifies the section so incident synapse lines can light up */
  onHoverChange?: (hovering: boolean) => void;
  onClick: () => void;
}

const METER_SEGMENTS = 14;

export default function NeuronNode({
  data,
  index,
  dimmed = false,
  timeLabel,
  pinged = false,
  ablated = false,
  onHoverChange,
  onClick,
}: NeuronNodeProps) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHoveredState] = useState(false);
  const setHovered = (h: boolean) => {
    setHoveredState(h);
    onHoverChange?.(h);
  };
  const { c1, c2, tag } = KIND_COLORS[data.kind];
  const act = ablated ? 0 : data.activation;
  // a pinged unit glows at full strength regardless of its own activation
  const glowAct = ablated ? 0 : pinged ? 1 : data.activation;

  const glow = ablated
    ? 'none'
    : dimmed
      ? `0 0 10px ${hexToRgba(c1, 0.12)}`
      : `0 0 ${12 + glowAct * 30}px ${hexToRgba(c1, 0.25 + glowAct * 0.4)}, 0 0 ${
          28 + glowAct * 55
        }px ${hexToRgba(c2, 0.12 + glowAct * 0.28)}`;

  const litSegments = Math.round(act * METER_SEGMENTS);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      animate={{ opacity: dimmed ? 0.25 : ablated ? 0.55 : 1 }}
      whileHover={{ scale: dimmed ? 1 : 1.06 }}
      className={`group flex w-32 sm:w-36 flex-col items-center gap-2 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050f] ${
        // loose, organic grid: stagger alternate nodes vertically on wider screens
        index % 2 === 1 ? 'sm:translate-y-6' : ''
      }`}
      aria-label={`Open details for ${data.title}`}
    >
      {/* chronology chip: timestep + date */}
      {timeLabel && (
        <span className="flex flex-col items-center gap-1 font-mono text-[10px] tracking-wider mb-0.5">
          <span
            className="px-1.5 py-0.5 rounded border"
            style={{
              color: hexToRgba(c2, dimmed ? 0.4 : 0.95),
              borderColor: hexToRgba(c2, dimmed ? 0.15 : 0.4),
              background: hexToRgba(c1, 0.08),
            }}
          >
            {timeLabel}
          </span>
          {data.date && (
            <span className="text-slate-400 text-center leading-tight">
              {data.date}
            </span>
          )}
        </span>
      )}

      {/* glowing neuron circle */}
      <motion.div
        data-node-id={data.id}
        className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border"
        style={{
          borderStyle: ablated ? 'dashed' : 'solid',
          borderColor: ablated
            ? 'rgba(148,163,184,0.35)'
            : hexToRgba(c2, dimmed ? 0.15 : 0.45),
          background: ablated
            ? 'rgba(12,12,26,0.7)'
            : `radial-gradient(circle at 35% 35%, ${hexToRgba(
                c1,
                dimmed ? 0.15 : 0.28 + act * 0.35
              )}, ${hexToRgba(c2, dimmed ? 0.05 : 0.1)} 62%, rgba(5,5,15,0.6))`,
          boxShadow: glow,
        }}
        animate={
          dimmed || ablated || (reducedMotion && !pinged)
            ? { scale: 1 }
            : pinged
              ? { scale: 1.14 }
              : { scale: [1, 1.045, 1] }
        }
        transition={
          pinged
            ? { duration: 0.25, ease: 'easeOut' }
            : {
                duration: 2.6 + (index % 5) * 0.35,
                repeat: dimmed || ablated || reducedMotion ? 0 : Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <span className="font-mono text-[10px] text-slate-200/90 tracking-widest">
          u{String(index).padStart(2, '0')}
        </span>
        {/* small activation readout inside the circle */}
        <span
          className="absolute bottom-3 font-mono text-[10px]"
          style={{ color: hexToRgba(c2, 0.9) }}
        >
          {act.toFixed(2)}
        </span>
      </motion.div>

      {/* label + kind tag */}
      <span className="text-xs sm:text-sm text-slate-200 text-center leading-tight tracking-wide">
        {data.label}
      </span>
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
          ablated ? 'text-rose-400/70' : ''
        }`}
        style={ablated ? undefined : { color: hexToRgba(c2, dimmed ? 0.35 : 0.75) }}
      >
        {ablated ? '⊘ ablated' : tag}
      </span>

      {/* hover: segmented activation meter, like an interpretability dashboard */}
      <div className="h-7 flex flex-col items-center justify-start">
        <motion.div
          initial={false}
          animate={{ opacity: hovered && !dimmed ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex gap-[2px]">
            {Array.from({ length: METER_SEGMENTS }).map((_, i) => (
              <motion.span
                key={i}
                className="w-[5px] h-2 rounded-[1px]"
                style={{
                  background:
                    i < litSegments
                      ? `linear-gradient(to top, ${c1}, ${c2})`
                      : 'rgba(148,163,184,0.15)',
                }}
                initial={{ scaleY: 0.2 }}
                animate={{ scaleY: hovered && i < litSegments ? 1 : 0.35 }}
                transition={{ duration: 0.25, delay: hovered ? i * 0.02 : 0 }}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            act {act.toFixed(2)}
          </span>
        </motion.div>
      </div>
    </motion.button>
  );
}
