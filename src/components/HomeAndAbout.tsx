'use client';

import Image from 'next/image';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NeuralCanvas from './NeuralCanvas';
import LogitTyper from './LogitTyper';

export default function HomeAndAboutSection() {
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide arrow if we're not at the top of the page
      setShowArrow(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col sm:flex-row items-center justify-center min-h-[calc(100vh-64px)] gap-8 px-8 sm:px-20 overflow-hidden"
    >
      {/* Animated neural network backdrop */}
      <div className="absolute inset-0">
        <NeuralCanvas className="absolute inset-0 opacity-70" />
        {/* soft color vignettes over the graph — kept clear of the section
            edges so the hero blends into the shared page background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_25%,rgba(124,58,237,0.12),transparent_50%),radial-gradient(ellipse_at_80%_55%,rgba(6,182,212,0.09),transparent_50%)]" />
      </div>

      {/* Left Side: Image and Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center sm:items-start"
      >
        {/* Profile Image with glowing gradient ring */}
        <div
          data-embed="bos"
          className="rounded-full p-[3px] bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] shadow-[0_0_45px_rgba(124,58,237,0.35),0_0_90px_rgba(6,182,212,0.2)]"
        >
          <Image
            src="/marcel_pfp.JPEG"
            alt="Marcel Mateos Salles"
            width={300}
            height={300}
            priority
            className="rounded-full border-4 border-[#05050f] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center gap-4 mt-5">
            {/* GitHub Link */}
            <a
              href="https://github.com/MarcelMatsal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </a>

            {/* Google Scholar Link */}
            <a
              href="https://scholar.google.com/citations?hl=en&user=7QmQOSgAAAAJ&inst=7213243471243491304"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 10a8 8 0 0 1 7.162 3.44L24 9.5z" />
              </svg>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/marcelmatsal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>

            {/* Resume Link */}
            <a
              href="/Marcel_Mateos_Salles_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </a>

            {/* Location with Pin Icon */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="text-slate-400 font-bold">SF/ATX</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Name, Moving Text, and About Text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left max-w-xl"
      >
        {/* mono overline */}
        <p className="font-mono text-xs text-cyan-400/80 tracking-[0.35em] uppercase mb-3">
          {'// forward pass'}
        </p>

        {/* Name */}
        <h1
          data-embed="marcel mateos salles"
          className="text-4xl sm:text-6xl font-bold tracking-wide text-slate-100"
        >
          Marcel Mateos Salles
        </h1>

        {/* Moving Text, sampled from a logit readout */}
        <LogitTyper />

        {/* About Text */}
        <p className="text-slate-300 mt-1">
          Hey! I&apos;m Marcel, a recent grad from Brown University with a degree
          in Computer Science and Economics. I&apos;m a{' '}
          <span data-embed="backend_engineer" className="text-cyan-400 font-bold">
            backend engineer
          </span>{' '}
          and{' '}
          <span data-embed="ml/ai" className="text-violet-400 font-bold">
            ML/AI
          </span>{' '}
          researcher
          with a passion for intersecting software engineering with
          cutting-edge research in ML/AI. My current research interests lie in
          LLMs, model interpretability, and self-supervised learning. I&apos;m a
          member of the{' '}
          <a
            data-embed="galilai"
            href="https://galilai-group.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 font-bold hover:underline"
          >
            GalilAI Group{' '}
          </a>
          with{' '}
          <a
            href="https://randallbalestriero.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 font-bold hover:underline"
          >
            Prof. Randall Balestriero
          </a>{' '}
          and an incoming Software Engineer at{' '}
          <span data-embed="pinterest" className="text-cyan-400 font-bold">
            Pinterest!
          </span>
        </p>

        {/* guided tour: execute the whole site as one forward pass */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('interp:run'))}
          title="Watch the network run — a guided pass through every layer"
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] px-4 py-2 rounded-full border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        >
          {'▶ run_forward_pass()'}
        </button>
      </motion.div>

      {/* Down Arrow Button */}
      {showArrow && (
        <Link
          to="experience"
          smooth={true}
          duration={500}
          className="absolute bottom-8 z-10 flex items-center justify-center w-12 h-12 rounded-full border border-cyan-500/30 bg-[#0b0b1c]/80 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all animate-bounce cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-cyan-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </Link>
      )}
    </section>
  );
}
