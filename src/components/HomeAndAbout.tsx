'use client';

import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';

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
    <section id='home' className="flex flex-col sm:flex-row items-center justify-center min-h-[80vh] gap-8 px-8 sm:px-20">
      {/* Left Side: Image and Social Links */}
      <div className="flex flex-col items-center sm:items-start">
        {/* Profile Image */}
        <Image
          src="/marcel_pfp.JPEG" // Replace with your actual image file name
          alt="Marcel Mateos Salles"
          width={300} // Adjust width as needed
          height={300} // Adjust height as needed
          className="rounded-full border-4 border-gray-300 dark:border-gray-700 shadow-lg hover:scale-105 transition-transform duration-300"
        />

        {/* Social Links */}
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center gap-4 mt-4">
            {/* GitHub Link */}
            <a
              href="https://github.com/MarcelMatsal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
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

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/marcelmatsal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
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
              href="/MarcelSWEResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </a>

            {/* Location with Pin Icon - Now to the right of resume */}
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-300 font-bold">
                ATX/PVD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Name, Moving Text, and About Text */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-xl">
        {/* Name */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Marcel Mateos Salles
        </h1>

        {/* Moving Text */}
        <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mt-4 h-[2em]">
          I am a <TypeAnimation
            sequence={[
              'Software Engineer.',
              3200,
              'Deep Learning/ML Researcher.',
              3200,
              'D1 Athlete.',
              3200,
              'Teaching Assistant.',
              3200,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-blue-500 font-bold"
          />
        </div>

        {/* About Text */}
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Hey! I'm Marcel, a junior at Brown University studying Computer Science and Economics.
          I'm a <span className="text-blue-500 font-bold">backend engineer</span> and  <span className="text-blue-500 font-bold">ML/AI/DL researcher </span> with a passion for intersecting software 
          engineering with cutting-edge research in ML/AI/DL. My current research interests lie in
          LLMs, model interetability, and self-supervised learning. This summer I will be <span className="text-blue-500 font-bold"> interning at Pinterest </span> as a backend engineer in the <span className="text-blue-500 font-bold"> Infrastructure Organization </span> and am currently
          a researcher with <a href="https://randallbalestriero.github.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold hover:underline">Prof. Randall Balestriero</a>.
        </p>
      </div>

        {/* Down Arrow Button */}
        {showArrow && (
          <Link
            to="experience"
            smooth={true}
            duration={500}
            className="absolute bottom-8 flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors animate-bounce cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
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
