'use client';

import { Link } from 'react-scroll';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Name */}
          <div className="flex-shrink-0">
            <Link
              to="home"
              smooth={true}
              duration={250}
              offset={-64}
              className="text-xl font-bold cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Marcel Mateos Salles
            </Link>
          </div>

          {/* Hamburger menu button */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
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
              <Link
                to="experience"
                smooth={true}
                duration={250}
                offset={-64}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Experience
              </Link>
              <Link
                to="skills"
                smooth={true}
                duration={250}
                offset={-64}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Skills
              </Link>
              <Link
                to="projects"
                smooth={true}
                duration={250}
                offset={-64}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Projects
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-64}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side - Social Links */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href="https://github.com/marcelmatsal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <i className="fab fa-github"></i>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/marcelmatsal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <i className="fab fa-linkedin"></i>
              LinkedIn
            </a>
            <a
              href="/MarcelSWEResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="experience"
                smooth={true}
                duration={250}
                offset={-64}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Experience
              </Link>
              <Link
                to="skills"
                smooth={true}
                duration={250}
                offset={-64}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Skills
              </Link>
              <Link
                to="projects"
                smooth={true}
                duration={250}
                offset={-64}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-64}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col space-y-2">
                <a
                  href="https://github.com/marcelmatsal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/marcelmatsal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="/MarcelSWEResume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-base font-medium transition-colors"
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
