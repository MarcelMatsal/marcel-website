'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HomeAndAboutSection from '@/components/HomeAndAbout';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import TimelineSection from '@/components/ExperienceTimeline';
import LayerDivider from '@/components/LayerDivider';
import ResidualStream from '@/components/ResidualStream';
import InterpConsole from '@/components/InterpConsole';

export default function Home() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [steering, setSteering] = useState(1);

  // interpretability console: `steer <α>` command
  useEffect(() => {
    const onSteer = (e: Event) => {
      const value = (e as CustomEvent).detail?.value;
      if (typeof value === 'number') setSteering(value);
    };
    window.addEventListener('interp:steer', onSteer);
    return () => window.removeEventListener('interp:steer', onSteer);
  }, []);

  return (
    <>
      <Navbar />
      {/* scroll-progress rail styled as the residual stream (desktop only) */}
      <ResidualStream />
      {/* hidden console (press ` / ~) driving probe/ablate/filter/steer/backprop */}
      <InterpConsole />
      <main className="pt-[64px]"> {/* Adjust padding for fixed Navbar */}
        <HomeAndAboutSection />
        <LayerDivider direction="expand" />
        <TimelineSection />
        <LayerDivider direction="contract" />
        <Skills
          onSkillSelect={setSelectedSkills}
          onSkillHover={setHoveredSkill}
          steering={steering}
          onSteeringChange={setSteering}
        />
        <LayerDivider direction="expand" />
        <Projects
          selectedSkills={selectedSkills}
          hoveredSkill={hoveredSkill}
          steering={steering}
        />
        <LayerDivider direction="contract" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
