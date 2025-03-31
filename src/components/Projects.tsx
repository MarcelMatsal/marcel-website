'use client';

import ProjectCard from './ProjectCard';
import { useState, useEffect } from 'react';

interface ProjectsProps {
  selectedSkills: string[];
}

export default function Projects({ selectedSkills }: ProjectsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedIndex === null) return;

      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'Escape':
          setExpandedIndex(null);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex]);

  const projects = [
    {
      title: "Reddit Depression Symptom Detection",
      description: "A computational linguistics project that uses Reddit data to detect symptoms of depression.",
      technologies: ["Python", "Pytorch", "HuggingFace", "Pandas", "Scikit-learn"],
      longDescription: "This project uses Reddit data to detect symptoms of depression. I used two techniques to generate embeddings from Reddit comments: averaged BERT embeddings and LDA topics. I then trained a Random Forest Classifier to detect ten different depression symptoms, achieveing accuracies close to the research paper with smaller models.",
      features: [
        "Generated two separate embedding representations of Reddit comments to train a Random Forest Classifier",
        "Achieved near SOTA performance from a research paper while using a smaller BERT model (DistilBERT)",
        "Utilized LDA topics or BERT to generate embeddings"
      ],
      githubLink: undefined,
      demoLink: undefined,
      imageUrl: "/reddit.png"
    },

    {
      title: "SpotiDuo",
      description: "A music-based language learning app featuring support for over 150 languages, user inputs, and a recommendation algorithm to continue learning",
      technologies: ["Java", "TypeScript", "JavaScript", "React", "AWS", "Spark"],
      longDescription: "SpotiDuo is a full-stack web app intended to help language learners on their journey of learning and discovery. The app bridges the enjoyment of listening to music with the task of learning languages to allow for people to learn as they listen. While using the web-app, the user can listen to a song in a language that they are trying to learn, and see the lyrics come up in their native language and the language they are working on learning. Blanks will appear in the lyrics and using what they hear, know from the language that they speak, and from what they have already learned, write in what the word in the blank should be. This will allow them to work on their grammar and comprehension. After the song finishes, if the user enjoyed the song, they will have the option to play with a song that is similar to the song they just used.",
      features: [
        "Built a webapp that allows users to learn languages by listening to songs in other languages by filling in lyrics to reinforce listening",
        "Led the backend team and designed architecture for interaction between frontend and backend",
        "Utilized Spotify API to get metadata from songs and developed a recommendation algorithm to prompt users with new songs",
      ],
      collaborators: [
        { name: "Allen Wang", link: "https://allenwang.co/" },
        { name: "Charlene Chen", link: "https://www.linkedin.com/in/chen-charlene/" },
        { name: "Andrew Chen", link: "https://www.linkedin.com/in/andrew-z-chen/" },
      ],
      githubLink: "https://github.com/MarcelMatsal/spotiduo",
      demoLink: "https://www.youtube.com/watch?v=qPu-ch3UULo",
      imageUrl: "/SpotiDuo.png"
    },
    {
      title: "Little Label Learners",
      description: "A novel semisupervised learning technique based on biological development.",
      technologies: ["Python", "TensorFlow", "Keras", "Numpy"],
      longDescription: "Modern neural networks often use vast volumes of data, far more than what a human needs, to learn to recognize common objects. Plus, these models often suffer from catastrophic forgetting during continual learning tasks, whereas humans can learn nearly unlimited numbers of novel conceptual classes. With Little Label Learners, we present a gradual supervised learning routine that uses increasing numbers of class-representation and labeled-data over epochs to mimic the data diet of infants. We demonstrate that our model is able to learn new classes effectively, comparable to fullysupervised routines using significantly more labeled images and datasets that contain all labels of interest.",
      features: [
        "Pioneered the development of a biology-mimicking deep learning model that enhances adaptability and minimizes data requirements",
        "Implemented a seamless transition from self-supervised to semi-supervised learning, along with dynamic category introduction",
        "Demonstrated ability to outperform purely self-supervised learning while coming within 10% of fully-supervised learning"
      ],
      collaborators: [
        { name: "Winston Li", link: "https://www.linkedin.com/in/winston-y-li/" },
        { name: "John Ryan Byers", link: "https://jrbyers.github.io/Portfolio-Website/" },
      ],
      githubLink: "https://github.com/lwinstony8/LittleLabelLearners",
      demoLink: "https://github.com/MarcelMatsal/LittleLabelLearnersWriteUpandSlides",
      imageUrl: "/LittleLabelLearnersHeader.png"
    },
    {
      title: "SpacePals",
      description: "Hack@Brown 2024 project aimed at entertaining users through a pokemon-like game of space exploration.",
      technologies: ["Python", "React", "CSS", "Flask", "GraphQL", "CLIP", "OpenAI"],
      longDescription: "With SpacePals you can embark on a journey to discover the cosmos! Take pictures of all the alien animlas that you find along the way, and look back at them later on in your Explorers's Guide! You can see your progress there as you progress on your journey and learn some cool information about all the animals you encounter. We used the CLIP model and gave it names of things that it should be able to recognize. We then built the frontend and connected it using GraphQl. We worked on getting the ability to take images and then have our model on the backend categorize what the image is showing. It is then update in your traveler's guide to show that you have found the alien.",
      features: [
        "Spearheaded development of webapp that allows users to capture different space animals by taking pictures of them",
        "Engineered frontend system that's updated in real-time as the backend utilizes CLIP to classify the image taken",
        "Integrated GraphQL to establish efficient communication between the frontend and backend systems"
      ],
      collaborators: [
        { name: "John Ryan Byers", link: "https://jrbyers.github.io/Portfolio-Website/" },
        { name: "Nathan DePiero", link: "https://nathandepiero.vercel.app/" },
        { name: "Marcus Lee", link: "https://www.linkedin.com/in/lee-marcus-j/" },
      ],
      githubLink: "https://github.com/jrbyers/SpacePals",
      demoLink: "https://devpost.com/software/spacepals",
      imageUrl: "/spacepals.png"
    },
    {
      title: "Campfire Stories",
      description: "Hack@Brown 2023 project aimed at improving camping safety through storytelling.",
      technologies: ["Python","JavaScript", "React", "CSS", "Azure", "OpenAI", "text-davinci-003"],
      longDescription: "Our project is all about the outdoors and enjoying being around a campfire with your friends. Many things can be done around a campfire but our team agreed that one of the best things to do is tell scary stories with your friends. We used this as the inspiration for our project. Our project expands upon the idea of campfire stories and allows the user to input a theme/noun. This theme/noun will then be converted into a scary story that you can share with your friends around the campfire. Furthermore, the story that is generated by our project incorporates safety tips so that everyone that is listening to the story learns about camping safety, preventing injuries, and preventing forest fires. We built a website using React and OpenAI's API. We used their pre-trained text-davinci-003 model to generate random scary stories based on the theme/noun that the user inputs.",
      features: [
        "Developed a website for generating scary campfire stories based on user-inputted themes and incorporating safety tips",
        "Implemented a seamless user interface for displaying generated stories, ensuring an immersive storytelling experience",
        "Incorporated safety tips within the generated stories to promote camping safety, injury prevention, and wildfire awareness"
      ],
      collaborators: [
        { name: "John Ryan Byers", link: "https://jrbyers.github.io/Portfolio-Website/" },
        { name: "Nathan DePiero", link: "https://nathandepiero.vercel.app/" },
        { name: "Marcus Lee", link: "https://www.linkedin.com/in/lee-marcus-j/" },
      ],
      githubLink: "https://github.com/jrbyers/CampfireStories",
      demoLink: "https://devpost.com/software/campfire-stories-3j4wv6",
      imageUrl: "/campfireStories.png"
    }
  ];

  const filteredProjects = selectedSkills.length > 0
    ? projects.filter(project =>
        project.technologies.some(tech => selectedSkills.includes(tech))
      )
    : projects;

  const handleNext = () => {
    if (expandedIndex !== null && expandedIndex < filteredProjects.length - 1) {
      setExpandedIndex(expandedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (expandedIndex !== null && expandedIndex > 0) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleExpand = (index: number, expanded: boolean) => {
    setExpandedIndex(expanded ? index : null);
  };

  return (
    <section id="projects" className="py-20 px-8 sm:px-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Recent Projects</h2>
      {filteredProjects.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-lg">
          There are no current projects being featured with that selected skill
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              longDescription={project.longDescription}
              features={project.features}
              githubLink={project.githubLink}
              demoLink={project.demoLink}
              imageUrl={project.imageUrl}
              collaborators={project.collaborators}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={expandedIndex !== null && expandedIndex < filteredProjects.length - 1}
              hasPrevious={expandedIndex !== null && expandedIndex > 0}
              isExpanded={expandedIndex === index}
              onExpand={(expanded) => handleExpand(index, expanded)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
