'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { experienceNodes, KIND_COLORS, hexToRgba, type NodeKind } from '@/lib/probeData';
import NeuronNode from './NeuronNode';
import ProbePanel from './ProbePanel';
import SectionHeading from './SectionHeading';
import SynapseWeb from './SynapseWeb';
import Publications from './Publications';

const LEGEND: NodeKind[] = ['research', 'education', 'engineering', 'teaching'];

const nodeIds = experienceNodes.map((n) => n.id);

export default function TimelineSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [ablated, setAblated] = useState<string[]>([]);
  /** index currently lit by the inference-run activation wave */
  const [waveIndex, setWaveIndex] = useState<number | null>(null);
  const waveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const webRef = useRef<HTMLDivElement>(null);

  const toggleAblate = (id: string) =>
    setAblated((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  // interpretability console commands targeting this layer
  useEffect(() => {
    const onProbe = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string;
      const i = experienceNodes.findIndex((n) => n.id === id);
      if (i >= 0) {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        setOpenIndex(i);
      }
    };
    const onAblate = (e: Event) => {
      const { id, action } = (e as CustomEvent).detail ?? {};
      if (!experienceNodes.some((n) => n.id === id)) return;
      setAblated((prev) =>
        action === 'restore' ? prev.filter((a) => a !== id) : [...new Set([...prev, id])]
      );
    };
    window.addEventListener('interp:probe', onProbe);
    window.addEventListener('interp:ablate', onAblate);
    return () => {
      window.removeEventListener('interp:probe', onProbe);
      window.removeEventListener('interp:ablate', onAblate);
    };
  }, []);

  // inference run: ping each unit in temporal order, t-8 → t-0
  useEffect(() => {
    const onWave = (e: Event) => {
      if ((e as CustomEvent).detail?.layer !== 'experience') return;
      if (waveTimer.current) clearInterval(waveTimer.current);
      let i = experienceNodes.length - 1;
      setWaveIndex(i);
      waveTimer.current = setInterval(() => {
        i -= 1;
        if (i < 0) {
          if (waveTimer.current) clearInterval(waveTimer.current);
          setWaveIndex(null);
        } else {
          setWaveIndex(i);
        }
      }, 200);
    };
    window.addEventListener('interp:wave', onWave);
    return () => {
      window.removeEventListener('interp:wave', onWave);
      if (waveTimer.current) clearInterval(waveTimer.current);
    };
  }, []);

  return (
    <section id="experience" className="relative py-14 px-6 sm:px-12 overflow-hidden">
      {/* faint vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.06),transparent_65%)]" />

      <div className="relative max-w-5xl mx-auto">
        <SectionHeading
          overline="// layer_01 · experience_units"
          title="Experience"
          sub="One unit per role, wired in chronological order — t-0 is the most recent. Hover to read a unit's activation, click to probe it."
        />

        {/* legend */}
        <div className="relative z-10 flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          {LEGEND.map((kind) => {
            const { c1, c2, tag } = KIND_COLORS[kind];
            return (
              <span key={kind} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${c2}, ${c1})`,
                    boxShadow: `0 0 8px ${hexToRgba(c2, 0.8)}`,
                  }}
                />
                {tag}
              </span>
            );
          })}
        </div>

        {/* temporal axis note */}
        <p className="relative z-10 text-center font-mono text-[11px] text-slate-400 tracking-[0.2em] mb-8">
          signal flows t-{experienceNodes.length - 1} (past) ⟶ t-0 (now)
        </p>

        {/* node web: synapse lines behind, loose node grid on top */}
        <div ref={webRef} className="relative">
          <SynapseWeb
            containerRef={webRef}
            orderedIds={nodeIds}
            highlightId={hoverId}
            ablatedIds={ablated}
          />
          <div className="relative flex flex-wrap justify-center gap-x-8 gap-y-14 sm:gap-x-12 pb-8">
            {experienceNodes.map((node, index) => (
              <NeuronNode
                key={node.id}
                data={node}
                index={index}
                timeLabel={`t-${index}`}
                pinged={waveIndex === index}
                ablated={ablated.includes(node.id)}
                onHoverChange={(h) => setHoverId(h ? node.id : null)}
                onClick={() => setOpenIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* papers as saved checkpoints, right below the units that wrote them */}
        <Publications />
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ProbePanel
            node={
              ablated.includes(experienceNodes[openIndex].id)
                ? { ...experienceNodes[openIndex], activation: 0 }
                : experienceNodes[openIndex]
            }
            unitIndex={openIndex}
            ablated={ablated.includes(experienceNodes[openIndex].id)}
            onToggleAblate={() => toggleAblate(experienceNodes[openIndex].id)}
            onClose={() => setOpenIndex(null)}
            onNext={() => setOpenIndex((i) => (i !== null ? i + 1 : i))}
            onPrevious={() => setOpenIndex((i) => (i !== null ? i - 1 : i))}
            hasNext={openIndex < experienceNodes.length - 1}
            hasPrevious={openIndex > 0}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
