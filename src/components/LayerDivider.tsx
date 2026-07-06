'use client';

/**
 * Fully-connected "weight matrix" band drawn between two sections: a few
 * points on one edge fan out to many on the other, like the edges between
 * two layers of a network diagram. Percentage coordinates keep it fluid;
 * negative margins tuck it into the sections' existing padding so it adds
 * no extra vertical space.
 */
export default function LayerDivider({
  direction = 'expand',
}: {
  direction?: 'expand' | 'contract';
}) {
  const few = [38, 50, 62];
  const many = [8, 20, 32, 44, 56, 68, 80, 92];
  const top = direction === 'expand' ? few : many;
  const bottom = direction === 'expand' ? many : few;

  return (
    <div
      aria-hidden="true"
      className="relative h-28 -my-14 pointer-events-none overflow-hidden"
    >
      <svg className="w-full h-full">
        {/* full connection mesh, very faint */}
        {top.map((tx, i) =>
          bottom.map((bx, j) => (
            <line
              key={`${i}-${j}`}
              x1={`${tx}%`}
              y1="0%"
              x2={`${bx}%`}
              y2="100%"
              stroke={(i + j) % 2 === 0 ? '#7c3aed' : '#06b6d4'}
              strokeWidth="1"
              opacity="0.08"
            />
          ))
        )}

        {/* a few brighter "active weights" with signal flow */}
        {top.map((tx, i) => (
          <line
            key={`hot-${i}`}
            x1={`${tx}%`}
            y1="0%"
            x2={`${bottom[(i * 3 + 1) % bottom.length]}%`}
            y2="100%"
            stroke={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'}
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="3 8"
            className="synapse-flow"
          />
        ))}

        {/* endpoint terminals */}
        {top.map((x, i) => (
          <circle key={`t-${i}`} cx={`${x}%`} cy="0%" r="2" fill="#7c3aed" opacity="0.5" />
        ))}
        {bottom.map((x, i) => (
          <circle key={`b-${i}`} cx={`${x}%`} cy="100%" r="2" fill="#06b6d4" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}
