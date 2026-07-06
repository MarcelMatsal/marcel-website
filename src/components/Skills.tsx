'use client';

import { useState, useEffect, useRef } from 'react';
import { FaJava, FaPython, FaReact, FaCss3, FaHtml5 } from 'react-icons/fa'; // Example icons
import { SiTypescript, SiJavascript, SiR, SiNextdotjs, SiTensorflow, SiTailwindcss, SiPytorch, SiApachespark, SiGraphql } from 'react-icons/si';
import SectionHeading from './SectionHeading';
import FeatureFlow from './FeatureFlow';
import { projectNodes } from '@/lib/probeData';

interface SkillsProps {
  onSkillSelect: (selectedSkills: string[]) => void;
  /** fires with the hovered skill name (or null) so downstream units can ping */
  onSkillHover?: (skill: string | null) => void;
  /** steering coefficient α — how hard selected features drive layer_02 */
  steering?: number;
  onSteeringChange?: (value: number) => void;
}

/** stable SAE-style feature index derived from the skill name */
function featureId(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 4096;
  return `f#${String(h).padStart(4, '0')}`;
}

/** top project units this feature fires on, by activation */
function topActivations(name: string) {
  return projectNodes
    .map((node, i) => ({ node, i }))
    .filter(({ node }) => node.technologies?.includes(name))
    .sort((a, b) => b.node.activation - a.node.activation)
    .slice(0, 3);
}

export default function Skills({
  onSkillSelect,
  onSkillHover,
  steering = 1,
  onSteeringChange,
}: SkillsProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Show tooltip when component mounts if not shown in this session
  useEffect(() => {
    const hasShownTooltip = sessionStorage.getItem('hasShownTooltip');
    if (!hasShownTooltip) {
      setShowTooltip(true);
      sessionStorage.setItem('hasShownTooltip', 'true');
    }
  }, []);

  // Load selected skills from localStorage and propagate to the projects filter
  useEffect(() => {
    const savedSkills = localStorage.getItem('selectedSkills');
    if (savedSkills) {
      const parsedSkills = JSON.parse(savedSkills);
      setSelectedSkills(parsedSkills);
      onSkillSelect(parsedSkills);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection Observer to hide tooltip when navbar overlaps it
  useEffect(() => {
    if (!tooltipRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setShowTooltip(false);
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px 0px 0px'
      }
    );

    observer.observe(tooltipRef.current);

    return () => observer.disconnect();
  }, []);

  // interpretability console: `filter <skill>` toggles, `clear` resets
  useEffect(() => {
    const onFilter = (e: Event) => {
      const { skill, clear } = (e as CustomEvent).detail ?? {};
      if (clear) {
        setSelectedSkills([]);
        onSkillSelect([]);
        localStorage.setItem('selectedSkills', JSON.stringify([]));
        return;
      }
      const all = [...programmingLanguages, ...frameworks].map((s) => s.name);
      const match = all.find((n) => n.toLowerCase() === String(skill).toLowerCase());
      if (match) handleSkillClick(match);
    };
    window.addEventListener('interp:filter', onFilter);
    return () => window.removeEventListener('interp:filter', onFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSkills]);

  const handleSkillClick = (skillName: string) => {
    const isSelected = selectedSkills.includes(skillName);
    const updatedSkills = isSelected
      ? selectedSkills.filter((s) => s !== skillName)
      : [...selectedSkills, skillName];

    setSelectedSkills(updatedSkills);
    onSkillSelect(updatedSkills);
    localStorage.setItem('selectedSkills', JSON.stringify(updatedSkills));

    // Hide tooltip when first skill is selected
    if (updatedSkills.length > 0) {
      setShowTooltip(false);
    }
  };

  const programmingLanguages = [
    { name: 'Java', icon: <FaJava /> },
    { name: 'Python', icon: <FaPython /> },
    { name: 'TypeScript', icon: <SiTypescript /> },
    { name: 'JavaScript', icon: <SiJavascript /> },
    { name: 'R', icon: <SiR /> },
    { name: 'CSS', icon: <FaCss3 /> },
    { name: 'HTML', icon: <FaHtml5 /> }
  ];

  const frameworks = [
    { name: 'Pytorch', icon: <SiPytorch /> },
    { name: 'TensorFlow', icon: <SiTensorflow /> },
    { name: 'Spark', icon: <SiApachespark /> },
    { name: 'JavaFX', icon: <FaJava /> }, // Using Java icon as fallback since JavaFX is Java-based
    { name: 'React', icon: <FaReact /> },
    { name: 'Next.js', icon: <SiNextdotjs /> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
    { name: 'GraphQL', icon: <SiGraphql /> },
    { name: 'Pandas', icon: <FaPython /> },
    { name: 'Numpy', icon: <FaPython /> },
    { name: 'Scikit-learn', icon: <FaPython /> },
    { name: 'AWS', icon: <FaPython /> },
    { name: 'Flask', icon: <FaPython /> },
    { name: 'HuggingFace', icon: <FaPython /> },
    { name: 'PEFT', icon: <FaPython /> },
  ];

  const renderChip = ({ name, icon }: { name: string; icon: React.ReactNode }) => {
    const isSelected = selectedSkills.includes(name);
    const tops = topActivations(name);
    return (
      <button
        key={name}
        type="button"
        data-skill-chip={name}
        className={`group relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border font-mono text-sm cursor-pointer transition-all duration-300 ${
          isSelected
            ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-200 shadow-[0_0_18px_rgba(6,182,212,0.35)] scale-[1.04]'
            : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-violet-500/50 hover:text-violet-200 hover:shadow-[0_0_14px_rgba(124,58,237,0.3)] hover:scale-[1.04]'
        }`}
        onClick={() => handleSkillClick(name)}
        onMouseEnter={() => onSkillHover?.(name)}
        onMouseLeave={() => onSkillHover?.(null)}
        onFocus={() => onSkillHover?.(name)}
        onBlur={() => onSkillHover?.(null)}
      >
        {/* feature status dot */}
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            isSelected
              ? 'bg-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.9)]'
              : 'bg-slate-600 group-hover:bg-violet-400'
          }`}
        />
        {icon}
        <span>{name}</span>
        <span className="text-[9px] text-slate-500">{featureId(name)}</span>

        {/* feature card, SAE-dashboard style */}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:flex group-focus-visible:flex flex-col gap-1.5 w-60 p-3 rounded-lg border border-cyan-500/25 bg-[#0b0b1c] shadow-[0_0_20px_rgba(6,182,212,0.15)] text-left normal-case">
          <span className="text-[10px] tracking-[0.2em] text-cyan-400/90 uppercase">
            {featureId(name)} · {name.toLowerCase()}
          </span>
          {tops.length > 0 ? (
            <>
              <span className="text-[9px] text-slate-500 tracking-wider uppercase">
                top activating units
              </span>
              {tops.map(({ node, i }) => (
                <span key={node.id} className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span className="text-violet-400 shrink-0">u{String(i).padStart(2, '0')}</span>
                  <span className="truncate flex-1">{node.label}</span>
                  <span className="flex-none w-10 h-1 rounded-full bg-white/10 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]"
                      style={{ width: `${node.activation * 100}%` }}
                    />
                  </span>
                  <span className="text-cyan-300">{node.activation.toFixed(2)}</span>
                </span>
              ))}
            </>
          ) : (
            <span className="text-[10px] text-slate-500">
              no project units activate on this feature — yet
            </span>
          )}
        </span>
      </button>
    );
  };

  return (
    <section ref={sectionRef} id="skills" className="relative py-20 px-6 sm:px-12 overflow-hidden">
      {/* signal lines flowing through the dictionary, plus feed lines from
          selected features toward the projects layer */}
      <FeatureFlow sectionRef={sectionRef} selected={selectedSkills} />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          overline="// feature_dictionary"
          title="Skills"
          sub="Select features to filter which project units activate downstream."
        />

        {/* Horizontal Split */}
        <div className="relative grid md:grid-cols-2 gap-10">
          {/* Programming Languages Section */}
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-400/90 mb-4 text-center md:text-left">
              Programming Languages
            </h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {programmingLanguages.map(renderChip)}
            </div>
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div
              ref={tooltipRef}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0b0b1c] p-3 rounded-lg border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] z-[100] animate-bounce"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-cyan-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-slate-300">
                  Select skills to filter projects
                </p>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#0b0b1c]"></div>
            </div>
          )}

          {/* Frameworks Section */}
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.25em] text-violet-400/90 mb-4 text-center md:text-left">
              Frameworks/Libraries
            </h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {frameworks.map(renderChip)}
            </div>
          </div>
        </div>

        {/* dictionary readout + steering control */}
        <p className="relative font-mono text-[10px] text-slate-500 tracking-[0.2em] text-center mt-10">
          {selectedSkills.length > 0
            ? `${selectedSkills.length} feature${selectedSkills.length > 1 ? 's' : ''} feeding layer_02 ↓`
            : `${programmingLanguages.length + frameworks.length} features idle — select to feed layer_02`}
        </p>
        {onSteeringChange && (
          <div
            className={`relative flex items-center justify-center gap-3 mt-4 font-mono text-[10px] tracking-wider transition-opacity ${
              selectedSkills.length > 0 ? 'text-slate-400' : 'text-slate-600 opacity-50'
            }`}
          >
            <label htmlFor="steering">steering coefficient α =</label>
            <input
              id="steering"
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={steering}
              disabled={selectedSkills.length === 0}
              onChange={(e) => onSteeringChange(Number(e.target.value))}
              className="w-40 accent-cyan-400 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-cyan-300 w-8">{steering.toFixed(1)}</span>
          </div>
        )}
      </div>
    </section>
  );
}
