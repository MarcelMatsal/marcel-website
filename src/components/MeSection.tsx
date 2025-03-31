'use client';

import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';

export default function MeSection() {
  return (
<section id="home" className="flex flex-col sm:flex-row items-center justify-center min-h-[80vh] text-center sm:text-left gap-6">
  {/* Profile Image */}
  <div className="flex-shrink-0">
    <Image
      src="/marcel_pfp.JPEG"
      alt="Marcel Mateos Salles"
      width={350}
      height={350}
      className="rounded-[50%] border-4 border-gray-300 dark:border-gray-700 shadow-lg hover:scale-105 transition-transform duration-300"
    />
  </div>

  {/* Name and Animated Text */}
  <div>
    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Marcel Mateos Salles</h1>
    <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-xl mt-4">
      I am a <TypeAnimation
        sequence={[
          'Software Engineer',
          2000,
          'Deep Learning/ML Researcher',
          2000,
          'D1 Athlete',
          2000,
          'Teaching Assistant',
          2000,
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
        className="text-blue-500 font-bold" 
        />
      </div>
      <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-xl mt-4">
            <a href="https://www.linkedin.com/in/marcelmatsal/" className="text-blue-500 font-bold">LinkedIn</a>
            <a href="https://github.com/marcelmatsal" className="text-blue-500 font-bold">GitHub</a>
        </div>
    </div>
    </section>
  );
}
