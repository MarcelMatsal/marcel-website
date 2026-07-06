'use client';

import { motion } from 'framer-motion';
import { publications, type PublicationVenue } from '@/lib/probeData';

/* venue badge styling: orals get the hot treatment, posters cool cyan,
   the thesis violet — same family as the node kind colors */
const BADGE_STYLES: Record<PublicationVenue['detail'], string> = {
  oral: 'border-amber-400/50 bg-amber-400/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
  poster: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300',
  thesis: 'border-violet-400/40 bg-violet-500/10 text-violet-300',
};

function boldMarcel(author: string) {
  return author === 'Marcel Mateos Salles' ? (
    <span key={author} className="text-slate-200 font-semibold">
      {author}
    </span>
  ) : (
    <span key={author}>{author}</span>
  );
}

/**
 * Publications rendered as saved checkpoints of the research track —
 * a compact strip at the bottom of the experience layer.
 */
export default function Publications() {
  return (
    <div className="relative z-10 max-w-4xl mx-auto mt-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs text-cyan-400/80 tracking-[0.35em] uppercase text-center mb-1.5">
          {'// checkpoints · publications'}
        </p>
        <p className="text-center font-mono text-[11px] text-slate-400 tracking-[0.15em] mb-6">
          states of the research track, saved to disk
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {publications.map((pub, i) => (
          <motion.article
            key={pub.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:border-cyan-500/30 hover:shadow-[0_0_24px_rgba(6,182,212,0.12)] transition-all"
          >
            {/* checkpoint header */}
            <p className="font-mono text-[10px] text-slate-500 tracking-[0.25em] mb-2">
              ckpt_{String(i + 1).padStart(4, '0')} · saved {pub.year}
            </p>

            <h3 className="text-sm font-semibold text-slate-100 leading-snug">
              {pub.title}
            </h3>

            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {pub.authors.map((a, k) => (
                <span key={a}>
                  {boldMarcel(a)}
                  {k < pub.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <p className="mt-2 text-xs text-slate-300/90 leading-relaxed">
              {pub.summary}
            </p>

            {/* venue badges + links */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {pub.venues.map((v) => (
                <span
                  key={v.name}
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-full border tracking-wider ${BADGE_STYLES[v.detail]}`}
                >
                  {v.name} · {v.detail}
                </span>
              ))}
              {pub.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-slate-300 hover:text-cyan-200 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all tracking-wider"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
