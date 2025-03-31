'use client';

export default function SkillButton({ skill }: { skill: string }) {
  return (
    <button type="button" aria-pressed="false" className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-center cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 hover:shadow-lg aria-pressed:bg-gray-200 dark:aria-pressed:bg-gray-700">
      {skill}
    </button>
  );
}
