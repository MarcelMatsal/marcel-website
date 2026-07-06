'use client';

import { Link } from 'react-scroll';
import { useState } from 'react';
import { FaGithub, FaGraduationCap, FaLinkedin } from 'react-icons/fa';

const NAV_LINKS = [
  { to: 'experience', label: 'Experience', duration: 250 },
  { to: 'skills', label: 'Skills', duration: 250 },
  { to: 'projects', label: 'Projects', duration: 250 },
  { to: 'contact', label: 'Contact', duration: 500 },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-[#05050f]/85 backdrop-blur-sm border-b border-cyan-500/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Name */}
          <div className="flex-shrink-0">
            <Link
              to="home"
              smooth={true}
              duration={250}
              offset={-64}
              className="text-xl font-bold tracking-wide cursor-pointer bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all"
            >
              Marcel Mateos Salles
            </Link>
          </div>

          {/* Hamburger menu button */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-cyan-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {NAV_LINKS.map(({ to, label, duration }) => (
                <Link
                  key={to}
                  to={to}
                  smooth={true}
                  duration={duration}
                  offset={-64}
                  className="text-slate-400 hover:text-cyan-300 px-3 py-2 text-sm font-medium tracking-wider transition-colors cursor-pointer"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Social Links */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="https://github.com/marcelmatsal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-xl text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <FaGithub />
            </a>
            <a
              href="https://scholar.google.com/citations?hl=en&user=7QmQOSgAAAAJ&inst=7213243471243491304"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Scholar"
              className="text-xl text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <FaGraduationCap />
            </a>
            <a
              href="https://www.linkedin.com/in/marcelmatsal/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-xl text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <FaLinkedin />
            </a>
            <a
              href="/Marcel_Mateos_Salles_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-300 hover:text-cyan-200 transition-all border border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] rounded px-2 py-1"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_LINKS.map(({ to, label, duration }) => (
                <Link
                  key={to}
                  to={to}
                  smooth={true}
                  duration={duration}
                  offset={-64}
                  className="block text-slate-300 hover:text-cyan-300 px-3 py-2 text-base font-medium tracking-wider transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-cyan-500/15 pt-4 flex flex-col space-y-2">
                <a
                  href="https://github.com/marcelmatsal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-cyan-300 px-3 py-2 text-base font-medium transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://scholar.google.com/citations?hl=en&user=7QmQOSgAAAAJ&inst=7213243471243491304"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-cyan-300 px-3 py-2 text-base font-medium transition-colors"
                >
                  Scholar
                </a>
                <a
                  href="https://www.linkedin.com/in/marcelmatsal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-cyan-300 px-3 py-2 text-base font-medium transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="/Marcel_Mateos_Salles_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-cyan-300 px-3 py-2 text-base font-medium transition-colors"
                  download
                >
                  Resume
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
