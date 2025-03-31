'use client';

import { useState, useEffect, useRef } from 'react';
import { FaJava, FaPython, FaReact, FaCss3, FaHtml5 } from 'react-icons/fa'; // Example icons
import { SiTypescript, SiJavascript, SiR, SiNextdotjs, SiTensorflow, SiTailwindcss, SiPytorch, SiApachespark, SiGraphql } from 'react-icons/si';

export default function Skills({ onSkillSelect }: { onSkillSelect: (selectedSkills: string[]) => void }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Show tooltip when component mounts if not shown in this session
  useEffect(() => {
    const hasShownTooltip = sessionStorage.getItem('hasShownTooltip');
    if (!hasShownTooltip) {
      setShowTooltip(true);
      sessionStorage.setItem('hasShownTooltip', 'true');
    }
  }, []);

  // Load selected skills from localStorage
  useEffect(() => {
    const savedSkills = localStorage.getItem('selectedSkills');
    if (savedSkills) {
      const parsedSkills = JSON.parse(savedSkills);
      setSelectedSkills(parsedSkills);
    }
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
    {name: 'CSS', icon: <FaCss3 />},
    {name: 'HTML', icon: <FaHtml5 />}
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
  ];

  return (
    <section id="skills" className="py-20 relative">
      {/* Horizontal Split */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Programming Languages Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">Programming Languages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {programmingLanguages.map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border text-center cursor-pointer transition-transform duration-300 ${
                  selectedSkills.includes(name)
                    ? 'bg-gray-200 dark:bg-gray-700 scale-[1.05] shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.05] hover:shadow-lg'
                }`}
                onClick={() => handleSkillClick(name)}
              >
                {icon}
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div 
            ref={tooltipRef}
            className="absolute top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100] animate-bounce"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select skills to filter projects
              </p>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white dark:border-t-gray-800"></div>
          </div>
        )}

        {/* Frameworks Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">Frameworks/Libraries</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {frameworks.map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border text-center cursor-pointer transition-transform duration-300 ${
                  selectedSkills.includes(name)
                    ? 'bg-gray-200 dark:bg-gray-700 scale-[1.05] shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.05] hover:shadow-lg'
                }`}
                onClick={() => handleSkillClick(name)}
              >
                {icon}
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
