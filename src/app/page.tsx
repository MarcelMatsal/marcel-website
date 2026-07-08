'use client';

import { useState } from 'react';
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
import InferenceRun from '@/components/InferenceRun';
import EmbedSequence from '@/components/EmbedSequence';
import { resolveUnit } from '@/lib/probeData';

export default function Home() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  return (
    <>
      <Navbar />
      {/* scroll-progress rail styled as the residual stream (desktop only) */}
      <ResidualStream />
      {/* hidden console (press ` / ~) driving probe/ablate/filter/steer/backprop */}
      <InterpConsole />
      {/* guided forward pass triggered from the hero button or `run` */}
      <InferenceRun />
      {/* hero content → token chips → embedding vectors at the start of a run */}
      <EmbedSequence />
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
