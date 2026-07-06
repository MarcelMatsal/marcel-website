'use client';

import { useCallback, useEffect, useState } from 'react';

interface NodePt {
  id: string;
  x: number;
  y: number;
}

export interface WeightedLink {
  a: string;
  b: string;
  /** 0..1 — connection strength, drives opacity/width */
  w: number;
}

interface SynapseWebProps {
  /** the relative-positioned container that holds the nodes */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** node ids in display order (newest first); matched against [data-node-id] */
  orderedIds: string[];
  /** 'chain' threads the nodes in order (temporal axon);
      'mesh' draws the weighted pairwise links passed via `links` */
  mode?: 'chain' | 'mesh';
  links?: WeightedLink[];
  /** ids currently dimmed by a filter; edges touching them fade out */
  dimmedIds?: string[];
  /** ids of ablated units; their wiring drops out entirely */
  ablatedIds?: string[];
  /** id of the hovered node; its incident edges and stubs light up */
  highlightId?: string | null;
}

/** cubic-bezier segment i → i+1 of a Catmull-Rom spline through pts */
function segmentPath(pts: NodePt[], i: number): string {
  const p0 = pts[i - 1] ?? pts[i];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[i + 2] ?? p2;
  const c1x = p1.x + (p2.x - p0.x) / 6;
  const c1y = p1.y + (p2.y - p0.y) / 6;
  const c2x = p2.x - (p3.x - p1.x) / 6;
  const c2y = p2.y - (p3.y - p1.y) / 6;
  return `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
}

/** smooth path through all points (concatenated Catmull-Rom segments) */
function smoothPath(pts: NodePt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    d += ' ' + segmentPath(pts, i).replace(/^M [^C]+/, '');
  }
  return d;
}

/** gently bowed curve between two points */
function bowedPath(a: NodePt, b: NodePt, bow = 24): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular offset
  const nx = -dy / len;
  const ny = dx / len;
  return `M ${a.x} ${a.y} Q ${mx + nx * bow} ${my + ny * bow}, ${b.x} ${b.y}`;
}

/** brighter overlay for a highlighted edge: soft halo + solid core */
function HighlightPath({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="#06b6d4" strokeWidth="6" opacity="0.14" />
      <path d={d} fill="none" stroke="url(#synapse-grad-hl)" strokeWidth="1.8" opacity="0.9" />
    </>
  );
}

/**
 * SVG synapse layer drawn behind a grid of neuron nodes. Two modes:
 * - 'chain': a bright "temporal axon" threading every unit in chronological
 *   order (with signal pulses traveling past → present) plus faint
 *   cross-connections between non-adjacent units
 * - 'mesh': weighted links between arbitrary pairs (e.g. projects that share
 *   technologies), with pulses riding the strongest connections
 * Both modes draw input stubs entering from the previous section (top) and
 * output stubs exiting toward the next one (bottom). Hovering a node
 * (highlightId) lights up every edge and stub incident to it.
 */
export default function SynapseWeb({
  containerRef,
  orderedIds,
  mode = 'chain',
  links = [],
  dimmedIds = [],
  ablatedIds = [],
  highlightId = null,
}: SynapseWebProps) {
  const [points, setPoints] = useState<NodePt[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // vertical reach of the stubs, in container coords: the enclosing section's
  // edges, which sit on the midline of the LayerDivider bands between sections
  const [extents, setExtents] = useState({ top: -48, bottom: 48 });
  const [reducedMotion, setReducedMotion] = useState(false);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const crect = el.getBoundingClientRect();
    const pts: NodePt[] = [];
    for (const id of orderedIds) {
      const node = el.querySelector(`[data-node-id="${id}"]`);
      if (!node) return;
      const r = node.getBoundingClientRect();
      pts.push({
        id,
        x: r.left + r.width / 2 - crect.left,
        y: r.top + r.height / 2 - crect.top,
      });
    }
    setPoints(pts);
    setSize({ w: crect.width, h: crect.height });
    const section = el.closest('section');
    if (section) {
      const srect = section.getBoundingClientRect();
      setExtents({ top: srect.top - crect.top, bottom: srect.bottom - crect.top });
    } else {
      setExtents({ top: -48, bottom: crect.height + 48 });
    }
  }, [containerRef, orderedIds]);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    measure();
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, containerRef]);

  if (points.length < 2 || size.w === 0) return null;

  const pointOf = new Map(points.map((p) => [p.id, p]));
  // a unit is "off" when filtered out or ablated: its wiring fades away
  const isOff = (id: string) => dimmedIds.includes(id) || ablatedIds.includes(id);

  // stubs: nodes near the top edge receive input from the previous layer,
  // nodes near the bottom edge project to the next one; their far endpoints
  // fan out across the full width to mirror the divider bands they meet
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const inputs = points
    .filter((p) => p.y < minY + 60)
    .sort((a, b) => a.x - b.x);
  const outputs = points
    .filter((p) => p.y > maxY - 60)
    .sort((a, b) => a.x - b.x);
  const fanX = (i: number, count: number) => (size.w * (i + 0.5)) / count;

  // ------- chain mode geometry -------
  // signal flows through time: oldest unit → most recent
  const chronological = [...points].reverse();
  const chainD = mode === 'chain' ? smoothPath(chronological) : '';

  // segments of the axon incident to the highlighted node
  const highlightSegments: string[] = [];
  if (mode === 'chain' && highlightId) {
    const hi = chronological.findIndex((p) => p.id === highlightId);
    if (hi > 0) highlightSegments.push(segmentPath(chronological, hi - 1));
    if (hi >= 0 && hi < chronological.length - 1)
      highlightSegments.push(segmentPath(chronological, hi));
  }

  const crossLinks: { d: string; a: string; b: string }[] = [];
  if (mode === 'chain') {
    const pair = (i: number, j: number, bow: number) =>
      crossLinks.push({
        d: bowedPath(points[i], points[j], bow),
        a: points[i].id,
        b: points[j].id,
      });
    for (let i = 0; i + 2 < points.length; i++) {
      pair(i, i + 2, i % 2 === 0 ? 26 : -26);
    }
    if (points.length > 4) {
      pair(0, 4, 40);
      pair(1, points.length - 1, -40);
    }
  }

  // ------- mesh mode geometry -------
  const meshEdges =
    mode === 'mesh'
      ? links.flatMap((link, i) => {
          const a = pointOf.get(link.a);
          const b = pointOf.get(link.b);
          if (!a || !b) return [];
          return [
            {
              key: `${link.a}-${link.b}`,
              d: bowedPath(a, b, (i % 2 === 0 ? 1 : -1) * (14 + link.w * 20)),
              w: link.w,
              a: link.a,
              b: link.b,
              dimmed: isOff(link.a) || isOff(link.b),
            },
          ];
        })
      : [];
  // pulses ride the strongest live connections
  const pulsePaths = meshEdges
    .filter((e) => !e.dimmed)
    .sort((a, b) => b.w - a.w)
    .slice(0, 2)
    .map((e) => e.d);

  const touchesHighlight = (a: string, b: string) =>
    highlightId !== null && (a === highlightId || b === highlightId);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      width={size.w}
      height={size.h}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`synapse-grad-${mode}`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={size.w}
          y2={size.h}
        >
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="synapse-grad-hl" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>

      {/* input stubs: from the divider band above down into the top-row nodes */}
      {inputs.map((p, i) => {
        const hl = p.id === highlightId && !isOff(p.id);
        const off = isOff(p.id);
        return (
          <g key={`in-${i}`}>
            <line
              x1={fanX(i, inputs.length)}
              y1={extents.top}
              x2={p.x}
              y2={p.y}
              stroke={hl ? '#67e8f9' : `url(#synapse-grad-${mode})`}
              strokeWidth={hl ? 1.8 : 1.2}
              opacity={off ? 0.05 : hl ? 0.85 : 0.3}
              strokeDasharray="3 6"
              className={reducedMotion || off ? undefined : 'synapse-flow'}
              style={{ transition: 'opacity 0.25s' }}
            />
            {/* terminal port where the stub meets the divider band */}
            <circle
              cx={fanX(i, inputs.length)}
              cy={extents.top}
              r="2.5"
              fill="#7c3aed"
              opacity={off ? 0.15 : hl ? 0.95 : 0.6}
            />
          </g>
        );
      })}

      {/* output stubs: from the bottom-row nodes down into the divider band below */}
      {outputs.map((p, i) => {
        const hl = p.id === highlightId && !isOff(p.id);
        const off = isOff(p.id);
        return (
          <g key={`out-${i}`}>
            <line
              x1={p.x}
              y1={p.y}
              x2={fanX(i, outputs.length)}
              y2={extents.bottom}
              stroke={hl ? '#67e8f9' : `url(#synapse-grad-${mode})`}
              strokeWidth={hl ? 1.8 : 1.2}
              opacity={off ? 0.05 : hl ? 0.85 : 0.3}
              strokeDasharray="3 6"
              className={reducedMotion || off ? undefined : 'synapse-flow'}
              style={{ transition: 'opacity 0.25s' }}
            />
            <circle
              cx={fanX(i, outputs.length)}
              cy={extents.bottom}
              r="2.5"
              fill="#06b6d4"
              opacity={off ? 0.15 : hl ? 0.95 : 0.6}
            />
          </g>
        );
      })}

      {mode === 'chain' && (
        <>
          {/* faint cross-connections; incident ones light up on hover,
              connections to off units drop out */}
          {crossLinks.map((link, i) => {
            const off = isOff(link.a) || isOff(link.b);
            return !off && touchesHighlight(link.a, link.b) ? (
              <HighlightPath key={`cross-${i}`} d={link.d} />
            ) : (
              <path
                key={`cross-${i}`}
                d={link.d}
                fill="none"
                stroke={`url(#synapse-grad-${mode})`}
                strokeWidth="1"
                opacity={off ? 0.03 : highlightId ? 0.07 : 0.14}
                style={{ transition: 'opacity 0.25s' }}
              />
            );
          })}

          {/* temporal axon, drawn per segment so an ablated unit's wiring
              drops out: base line + animated flow overlay */}
          {chronological.slice(0, -1).map((p, i) => {
            const off = isOff(p.id) || isOff(chronological[i + 1].id);
            const d = segmentPath(chronological, i);
            return (
              <g key={`seg-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={`url(#synapse-grad-${mode})`}
                  strokeWidth="1.5"
                  opacity={off ? 0.05 : 0.32}
                  style={{ transition: 'opacity 0.25s' }}
                />
                {!off && (
                  <path
                    d={d}
                    fill="none"
                    stroke={`url(#synapse-grad-${mode})`}
                    strokeWidth="1.5"
                    opacity="0.55"
                    strokeDasharray="10 14"
                    className={reducedMotion ? undefined : 'synapse-flow'}
                  />
                )}
              </g>
            );
          })}

          {/* axon segments incident to the hovered unit */}
          {highlightId !== null &&
            !isOff(highlightId) &&
            highlightSegments.map((d, i) => <HighlightPath key={`hl-${i}`} d={d} />)}
        </>
      )}

      {mode === 'mesh' &&
        meshEdges.map((edge) =>
          !edge.dimmed && touchesHighlight(edge.a, edge.b) ? (
            <HighlightPath key={edge.key} d={edge.d} />
          ) : (
            <path
              key={edge.key}
              d={edge.d}
              fill="none"
              stroke={`url(#synapse-grad-${mode})`}
              strokeWidth={1 + edge.w * 0.8}
              opacity={
                edge.dimmed
                  ? 0.04
                  : highlightId
                    ? 0.06
                    : 0.1 + edge.w * 0.25
              }
              style={{ transition: 'opacity 0.25s' }}
            />
          )
        )}

      {/* signal pulses; both start immediately with different periods
          (a delayed begin would leave a pulse parked at the SVG origin
          until its animation kicks in) */}
      {!reducedMotion &&
        (mode === 'chain' ? [chainD, chainD] : pulsePaths).map((d, k) => {
          const dur = mode === 'chain' ? [9, 13.5][k] : [5, 7.5][k];
          return (
            <g key={`pulse-${k}-${d.slice(0, 24)}`}>
              <circle r="7" fill="#06b6d4" opacity="0.15">
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
              </circle>
              <circle r="2.5" fill="#67e8f9">
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}
    </svg>
  );
}
