'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { projectNodes } from '@/lib/probeData';
import { trackEvent } from '@/lib/analytics';
import NeuronNode from './NeuronNode';
import ProbePanel from './ProbePanel';
import SectionHeading from './SectionHeading';
import SynapseWeb, { type WeightedLink } from './SynapseWeb';

interface ProjectsProps {
  selectedSkills: string[];
  /** skill currently hovered in the dictionary; connected units light up */
  hoveredSkill?: string | null;
  /** steering coefficient α — scales how hard selected skills drive units */
  steering?: number;
}

const nodeIds = projectNodes.map((n) => n.id);

/* connect projects that share technologies; weight grows with overlap */
const techLinks: WeightedLink[] = [];
/* and projects that share collaborators — the other kind of wiring */
const peopleLinks: WeightedLink[] = [];
for (let i = 0; i < projectNodes.length; i++) {
  for (let j = i + 1; j < projectNodes.length; j++) {
    const sharedTech = (projectNodes[i].technologies ?? []).filter((tech) =>
      projectNodes[j].technologies?.includes(tech)
    ).length;
    if (sharedTech > 0) {
      techLinks.push({
        a: projectNodes[i].id,
        b: projectNodes[j].id,
        w: Math.min(1, sharedTech / 4),
      });
    }
    const names = (projectNodes[i].collaborators ?? []).map((c) => c.name);
    const sharedPeople = (projectNodes[j].collaborators ?? []).filter((c) =>
      names.includes(c.name)
    ).length;
    if (sharedPeople > 0) {
      peopleLinks.push({
        a: projectNodes[i].id,
        b: projectNodes[j].id,
        w: Math.min(1, sharedPeople / 3),
      });
    }
  }
}

export default function Projects({
  selectedSkills,
  hoveredSkill,
  steering = 1,
}: ProjectsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [ablated, setAblated] = useState<string[]>([]);
  const [edgeType, setEdgeType] = useState<'tech' | 'people'>('tech');
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
      const i = projectNodes.findIndex((n) => n.id === id);
      if (i >= 0) {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setOpenIndex(i);
      }
    };
    const onAblate = (e: Event) => {
      const { id, action } = (e as CustomEvent).detail ?? {};
      if (!projectNodes.some((n) => n.id === id)) return;
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

  // inference run: ping each unit left to right
  useEffect(() => {
    const onWave = (e: Event) => {
      if ((e as CustomEvent).detail?.layer !== 'projects') return;
      if (waveTimer.current) clearInterval(waveTimer.current);
      let i = 0;
      setWaveIndex(i);
      waveTimer.current = setInterval(() => {
        i += 1;
        if (i >= projectNodes.length) {
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

  const matchCount = (index: number) =>
    selectedSkills.filter((skill) =>
      projectNodes[index].technologies?.includes(skill)
    ).length;

  const matches = (index: number) =>
    selectedSkills.length === 0 || matchCount(index) > 0;

  // selecting skills drives extra current into the matching units; the
  // steering coefficient α scales how hard they're driven
  const effectiveNodes = projectNodes.map((node, index) => {
    if (ablated.includes(node.id)) return { ...node, activation: 0 };
    const count = matchCount(index);
    if (count === 0) return node;
    return {
      ...node,
      activation: Math.min(
        0.99,
        node.activation + (0.06 + 0.05 * count) * steering
      ),
    };
  });

  // indices of units that match the active skill filter, used for probe navigation
  const activeIndices = projectNodes
    .map((_, i) => i)
    .filter((i) => matches(i));
  const activePos = openIndex !== null ? activeIndices.indexOf(openIndex) : -1;

  const dimmedIds =
    selectedSkills.length > 0
      ? projectNodes.filter((_, i) => !matches(i)).map((n) => n.id)
      : [];

  const goTo = (pos: number) => {
    if (pos >= 0 && pos < activeIndices.length) setOpenIndex(activeIndices[pos]);
  };

  return (
    <section id="projects" className="relative py-14 px-6 sm:px-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_65%)]" />

      <div className="relative max-w-5xl mx-auto">
        <SectionHeading
          overline="// layer_02 · project_units"
          title="Recent Projects"
          sub="Connected units share technologies or collaborators — stronger overlap, stronger connection. Click a unit to open its neuron probe."
        />

        {/* filter readout */}
        <p className="relative z-10 text-center font-mono text-xs text-slate-400 mb-4 tracking-wider">
          {selectedSkills.length > 0 ? (
            <>
              probe filter:{' '}
              <span className="text-cyan-300">{selectedSkills.join(', ')}</span>
              {' — '}
              <span className="text-violet-300">
                {activeIndices.length}/{projectNodes.length}
              </span>{' '}
              units active · matched activations boosted{steering !== 1 ? ` (α=${steering.toFixed(1)})` : ''}
            </>
          ) : (
            <>probe filter: none — all {projectNodes.length} units active</>
          )}
        </p>

        {/* edge-type toggle */}
        <div className="relative z-10 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.2em] text-slate-400 mb-8">
          <span>wired by:</span>
          {(['tech', 'people'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setEdgeType(t)}
              className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                edgeType === t
                  ? 'border-cyan-400/50 text-cyan-300 bg-cyan-500/10'
                  : 'border-white/10 text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeIndices.length === 0 ? (
          <p className="text-center font-mono text-sm text-slate-400">
            no units activate on this filter — clear it or select another feature
          </p>
        ) : null}

        {/* node web: shared-technology or shared-collaborator mesh behind,
            loose node grid on top; non-matching units stay visible but dim */}
        <div ref={webRef} className="relative">
          <SynapseWeb
            containerRef={webRef}
            orderedIds={nodeIds}
            mode="mesh"
            links={edgeType === 'tech' ? techLinks : peopleLinks}
            dimmedIds={dimmedIds}
            ablatedIds={ablated}
            highlightId={hoverId}
          />
          <div className="relative flex flex-wrap justify-center gap-x-8 gap-y-14 sm:gap-x-14 pb-8">
            {effectiveNodes.map((node, index) => {
              const active = matches(index);
              const pinged =
                !!hoveredSkill && !!node.technologies?.includes(hoveredSkill);
              return (
                <NeuronNode
                  key={node.id}
                  data={node}
                  index={index}
                  dimmed={!active}
                  pinged={(pinged && active) || waveIndex === index}
                  ablated={ablated.includes(node.id)}
                  onHoverChange={(h) => setHoverId(h && active ? node.id : null)}
                  onClick={() => {
                    if (!active) return;
                    setOpenIndex(index);
                    trackEvent('probe_open', { unit: node.id, layer: 'projects', method: 'click' });
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ProbePanel
            node={effectiveNodes[openIndex]}
            unitIndex={openIndex}
            ablated={ablated.includes(projectNodes[openIndex].id)}
            onToggleAblate={() => toggleAblate(projectNodes[openIndex].id)}
            onClose={() => setOpenIndex(null)}
            onNext={() => goTo(activePos + 1)}
            onPrevious={() => goTo(activePos - 1)}
            hasNext={activePos >= 0 && activePos < activeIndices.length - 1}
            hasPrevious={activePos > 0}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
