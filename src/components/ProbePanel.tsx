'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { KIND_COLORS, hexToRgba, type ProbeNodeData } from '@/lib/probeData';

interface ProbePanelProps {
  node: ProbeNodeData;
  unitIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  /** whether this unit is currently ablated */
  ablated?: boolean;
  /** counterfactual toggle: zero the unit out / bring it back */
  onToggleAblate?: () => void;
}

function ProbeLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/90 mb-2">
      {children}
    </h3>
  );
}

export default function ProbePanel({
  node,
  unitIndex,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  ablated = false,
  onToggleAblate,
}: ProbePanelProps) {
  const { c1, c2, tag } = KIND_COLORS[node.kind];

  // keyboard navigation: Escape closes, arrows step between units
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (hasNext) onNext?.();
          break;
        case 'ArrowLeft':
          if (hasPrevious) onPrevious?.();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  // lock body scroll while the probe is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-[#05050f]/85 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-auto bg-[#0b0b1c]/95 backdrop-blur rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-cyan-500/20 shadow-[0_0_60px_rgba(124,58,237,0.25),0_0_120px_rgba(6,182,212,0.12)]"
        >
          {/* probe header bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-[#0b0b1c]/95 backdrop-blur border-b border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: `radial-gradient(circle, ${c2}, ${c1})`,
                  boxShadow: `0 0 10px ${hexToRgba(c2, 0.8)}`,
                }}
              />
              <span className="font-mono text-xs text-slate-400 tracking-widest truncate">
                NEURON PROBE · unit_{String(unitIndex).padStart(2, '0')} · layer_
                {node.layer} · {tag}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {onToggleAblate && (
                <button
                  onClick={onToggleAblate}
                  title={
                    ablated
                      ? 'Restore this unit to the network'
                      : 'Zero this unit out and see the network without it'
                  }
                  className={`px-2 py-1 rounded font-mono text-[11px] tracking-wider transition-colors ${
                    ablated
                      ? 'text-cyan-300 hover:bg-cyan-500/10'
                      : 'text-rose-400/90 hover:bg-rose-500/10'
                  }`}
                >
                  {ablated ? '↺ restore' : '⊘ ablate'}
                </button>
              )}
              {hasPrevious && (
                <button
                  onClick={onPrevious}
                  aria-label="Previous unit"
                  className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {hasNext && (
                <button
                  onClick={onNext}
                  aria-label="Next unit"
                  className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close probe"
                className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* image */}
          {node.imageUrl && (
            <div className="aspect-video bg-[#05050f] relative overflow-hidden border-b border-white/5">
              <Image
                src={node.imageUrl}
                alt={node.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* title / role */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-slate-100">
              {node.title}
            </h2>
            {(node.subtitle || node.date) && (
              <p className="mt-1 font-mono text-sm text-slate-400">
                {node.subtitle}
                {node.subtitle && node.date ? ' · ' : ''}
                {node.date}
              </p>
            )}

            {/* activation strength bar */}
            <div className="mt-6 mb-6">
              <ProbeLabel>Activation Strength</ProbeLabel>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${c1}, ${c2})`,
                      boxShadow: `0 0 12px ${hexToRgba(c2, 0.7)}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${node.activation * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
                <span className="font-mono text-sm text-cyan-300 w-12 text-right">
                  {node.activation.toFixed(2)}
                </span>
              </div>
            </div>

            {/* description */}
            <div className="mb-6">
              <ProbeLabel>Feature Description</ProbeLabel>
              <p className="text-slate-300">{node.description}</p>
              {node.longDescription && (
                <p className="text-slate-300 mt-3">{node.longDescription}</p>
              )}
            </div>

            {/* features */}
            {node.features && node.features.length > 0 && (
              <div className="mb-6">
                <ProbeLabel>Top Activations</ProbeLabel>
                <ul className="space-y-2 text-slate-300">
                  {node.features.map((feature, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-xs text-violet-400 pt-1 shrink-0">
                        [{i}]
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* technologies */}
            {node.technologies && node.technologies.length > 0 && (
              <div className="mb-6">
                <ProbeLabel>Connected Features</ProbeLabel>
                <div className="flex flex-wrap gap-2">
                  {node.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-200 whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* collaborators */}
            {node.collaborators && node.collaborators.length > 0 && (
              <div className="mb-6">
                <ProbeLabel>Co-activated Units</ProbeLabel>
                <div className="flex flex-wrap gap-2">
                  {node.collaborators.map((collaborator, i) => (
                    <a
                      key={i}
                      href={collaborator.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/5 text-violet-200 hover:bg-violet-500/15 transition-colors text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {collaborator.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* links */}
            {node.links && node.links.length > 0 && (
              <div>
                <ProbeLabel>Output</ProbeLabel>
                <div className="flex flex-wrap gap-3 items-center">
                  {node.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
