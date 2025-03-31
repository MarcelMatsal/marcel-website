'use client';

import { useState, useEffect } from 'react';

interface Collaborator {
  name: string;
  link: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  longDescription?: string;
  features?: string[];
  githubLink?: string;
  demoLink?: string;
  imageUrl?: string;
  collaborators?: Collaborator[];
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  isExpanded: boolean;
  onExpand: (expanded: boolean) => void;
}

export default function ProjectCard({ 
  title, 
  description, 
  technologies,
  longDescription,
  features,
  githubLink,
  demoLink,
  imageUrl,
  collaborators,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isExpanded,
  onExpand
}: ProjectCardProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onExpand(false);
    }, 200);
  };

  return (
    <div className="relative">
      {/* Regular Card View */}
      <div 
        className={`border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
          isExpanded ? 'invisible' : 'hover:scale-[1.02]'
        }`}
        onClick={() => onExpand(!isExpanded)}
      >
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Project Preview
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span key={tech} className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded whitespace-nowrap">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {(isExpanded || isClosing) && (
        <>
          <div 
            className={`fixed inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm z-[150] transition-opacity duration-200 ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div 
              className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg max-w-4xl w-full max-h-[100vh] overflow-y-auto relative shadow-2xl border border-gray-200/20 dark:border-gray-700/20 transition-all duration-200 ${
                isClosing 
                  ? 'opacity-0 translate-y-4' 
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation Arrows */}
              {hasPrevious && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious?.();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10 backdrop-blur-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              {hasNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext?.();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10 backdrop-blur-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {/* Project Image */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={title}
                    className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Project Preview
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Short Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {description}
                </p>

                {/* Long Description */}
                {longDescription && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">About the Project</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {longDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                {features && features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Key Features</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                      {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Collaborators */}
                {collaborators && collaborators.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Collaborators</h3>
                    <div className="flex flex-wrap gap-2">
                      {collaborators.map((collaborator, index) => (
                        <a
                          key={index}
                          href={collaborator.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {collaborator.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4 items-center">
                  {githubLink && (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View on GitHub
                    </a>
                  )}
                  {demoLink && (
                    <a
                      href={demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
