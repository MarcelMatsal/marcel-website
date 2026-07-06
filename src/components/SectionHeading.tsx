'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  overline: string;
  title: string;
  sub?: string;
}

export default function SectionHeading({ overline, title, sub }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative z-10 text-center mb-8"
    >
      <p className="font-mono text-xs text-cyan-400/80 tracking-[0.35em] uppercase mb-2">
        {overline}
      </p>
      <h2 className="text-3xl font-bold tracking-[0.08em] text-slate-100">{title}</h2>
      <div className="synapse-divider w-48 mx-auto mt-4" />
      {sub && <p className="mt-4 text-sm text-slate-400">{sub}</p>}
    </motion.div>
  );
}
