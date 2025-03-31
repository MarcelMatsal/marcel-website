'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomeAndAboutSection from '@/components/HomeAndAbout';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import TimelineSection from '@/components/ExperienceTimeline';

export default function Home() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  return (
    <>
      <Navbar />
      <main className="pt-[64px]"> {/* Adjust padding for fixed Navbar */}
        <HomeAndAboutSection />
        <TimelineSection />
        {/* Pass setSelectedSkills as a prop to Skills */}
        <Skills onSkillSelect={setSelectedSkills} />
        {/* Pass selectedSkills as a prop to Projects */}
        <Projects selectedSkills={selectedSkills} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
