export type NodeKind =
  | 'research'
  | 'engineering'
  | 'teaching'
  | 'hackathon'
  | 'education';

export interface Collaborator {
  name: string;
  link: string;
}

export interface ProbeLink {
  label: string;
  href: string;
}

export interface ProbeNodeData {
  id: string;
  /** short label rendered under the node circle */
  label: string;
  title: string;
  subtitle?: string;
  date?: string;
  kind: NodeKind;
  /** 0..1 — drives glow intensity and the activation bar */
  activation: number;
  /** which "layer" the unit lives in, shown in the probe header */
  layer: string;
  description: string;
  longDescription?: string;
  features?: string[];
  technologies?: string[];
  collaborators?: Collaborator[];
  links?: ProbeLink[];
  imageUrl?: string;
}

/* glow colors per node kind — research/mechinterp brightest (teal↔purple),
   engineering mid, teaching/hackathon softer */
export const KIND_COLORS: Record<NodeKind, { c1: string; c2: string; tag: string }> = {
  research: { c1: '#7c3aed', c2: '#06b6d4', tag: 'research' },
  education: { c1: '#7c3aed', c2: '#a78bfa', tag: 'education' },
  engineering: { c1: '#06b6d4', c2: '#22d3ee', tag: 'engineering' },
  teaching: { c1: '#8b5cf6', c2: '#06b6d4', tag: 'teaching' },
  hackathon: { c1: '#0891b2', c2: '#67e8f9', tag: 'hackathon' },
};

export function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/* ---- feature dictionary -------------------------------------------------
   canonical skill names — Skills.tsx maps these to icons, ProbePanel and the
   model card use them to know which technologies are dictionary features */
export const languageFeatures = [
  'Java',
  'Python',
  'TypeScript',
  'JavaScript',
  'R',
  'CSS',
  'HTML',
];

export const frameworkFeatures = [
  'Pytorch',
  'TensorFlow',
  'Spark',
  'JavaFX',
  'React',
  'Next.js',
  'Tailwind CSS',
  'GraphQL',
  'Pandas',
  'Numpy',
  'Scikit-learn',
  'AWS',
  'Flask',
  'HuggingFace',
  'PEFT',
];

export const dictionaryFeatures = [...languageFeatures, ...frameworkFeatures];

/** stable SAE-style feature index derived from the skill name */
export function featureId(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 4096;
  return `f#${String(h).padStart(4, '0')}`;
}

/** deterministic per-feature attribution for a unit: which technologies
    drive its activation, scaled so the top feature reads the unit's own
    activation (ablated units correctly attribute 0 everywhere) */
export function featureAttribution(
  node: ProbeNodeData
): { name: string; value: number }[] {
  const techs = node.technologies ?? [];
  if (techs.length === 0) return [];
  const raw = techs.map((t) => {
    let h = 0;
    for (const ch of t + node.id) h = (h * 31 + ch.charCodeAt(0)) % 997;
    return { name: t, value: 0.35 + 0.65 * (h / 997) };
  });
  const max = Math.max(...raw.map((r) => r.value));
  return raw
    .map((r) => ({ name: r.name, value: (r.value / max) * node.activation }))
    .sort((a, b) => b.value - a.value);
}

/* ---- publications: saved checkpoints of the research track ------------- */
export interface PublicationVenue {
  name: string;
  /** how it appeared there */
  detail: 'oral' | 'poster' | 'thesis';
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venues: PublicationVenue[];
  year: string;
  summary: string;
  links: ProbeLink[];
}

export const publications: Publication[] = [
  {
    id: 'pub-lora-spurious-tokens',
    title:
      'LoRA Users Beware: A Few Spurious Tokens Can Manipulate Your Finetuned Model',
    authors: [
      'Marcel Mateos Salles',
      'Praney Goyal',
      'Pradyut Sekhsaria',
      'Hai Huang',
      'Randall Balestriero',
    ],
    venues: [
      { name: 'NeurIPS 2025 workshop', detail: 'poster' },
      { name: 'ICLR 2026 workshop', detail: 'oral' },
    ],
    year: '2025',
    summary:
      'Shows that a handful of spurious tokens in finetuning data is enough to steer the behavior of LoRA-finetuned language models.',
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2506.11402' }],
  },
  {
    id: 'pub-honors-thesis',
    title:
      'When Efficiency Enables Shortcuts: Studying Spurious Correlations Under LoRA Finetuning',
    authors: ['Marcel Mateos Salles'],
    venues: [{ name: 'Brown University honors thesis', detail: 'thesis' }],
    year: '2026',
    summary:
      'Investigates when and why parameter-efficient finetuning amplifies reliance on spurious correlations, and what that means for safe deployment.',
    links: [{ label: 'PDF', href: '/Marcel_Mateos_Salles_Thesis.pdf' }],
  },
];

/** find a unit across both layers by exact id, then label/title substring */
export function resolveUnit(query: string): ProbeNodeData | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const all = [...experienceNodes, ...projectNodes];
  return (
    all.find((n) => n.id === q) ??
    all.find((n) => n.label.toLowerCase().includes(q)) ??
    all.find((n) => n.title.toLowerCase().includes(q)) ??
    null
  );
}

export const experienceNodes: ProbeNodeData[] = [
  {
    id: 'exp-pinterest-fulltime',
    label: 'Pinterest SWE',
    title: 'Software Engineer',
    subtitle: 'Pinterest',
    date: 'Incoming July 2026',
    kind: 'engineering',
    activation: 0.78,
    layer: 'experience',
    description: 'Incoming summer 2026.',
  },
  {
    id: 'exp-head-ta-1460',
    label: 'Head TA · CL',
    title: 'Head Teaching Assistant',
    subtitle: 'CSCI1460: Computational Linguistics',
    date: 'Dec 2025 - May 2026',
    kind: 'teaching',
    activation: 0.6,
    layer: 'experience',
    description: 'Brown University.',
  },
  {
    id: 'exp-pinterest-intern',
    label: 'Pinterest Intern',
    title: 'Software Engineer Intern',
    subtitle: 'Pinterest',
    date: 'Summer 2025',
    kind: 'engineering',
    activation: 0.74,
    layer: 'experience',
    description: 'Backend - Observability Team.',
    longDescription:
      'Developed GenAI tools (such as agents, MCP servers, anomaly detection) for all engineers at Pinterest.',
  },
  {
    id: 'exp-ta-deep-learning',
    label: 'TA · Deep Learning',
    title: 'Teaching Assistant',
    subtitle: 'CSCI 1470: Deep Learning',
    date: 'Dec 2024 - May 2025',
    kind: 'teaching',
    activation: 0.62,
    layer: 'experience',
    description: 'Brown University.',
  },
  {
    id: 'exp-galilai',
    label: 'GalilAI Research',
    title: 'Researcher',
    subtitle: 'GalilAI Group @ Brown University',
    date: 'Oct 2024 - Present',
    kind: 'research',
    activation: 0.96,
    layer: 'experience',
    description: 'Researching spurious correlation in language models.',
    longDescription:
      'Papers in workshops at NeurIPS 2025 (poster) and ICLR 2026 (oral).',
    links: [
      { label: 'Check out our new paper!', href: 'https://arxiv.org/abs/2506.11402' },
    ],
  },
  {
    id: 'exp-dexcom',
    label: 'Dexcom Intern',
    title: 'Software Engineer Intern',
    subtitle: 'Dexcom',
    date: 'Jun 2024 - Aug 2024',
    kind: 'engineering',
    activation: 0.7,
    layer: 'experience',
    description:
      'Developed architecture for a new mobile app and designed a novel algorithm to target 700k new stakeholders.',
  },
  {
    id: 'exp-ta-econ',
    label: 'TA · Big Data',
    title: 'Teaching Assistant',
    subtitle: 'Econ 1000: Using Big Data to Solve Social and Economic Problems',
    date: 'Sep 2023 - Dec 2023',
    kind: 'teaching',
    activation: 0.55,
    layer: 'experience',
    description: 'Brown University.',
  },
  {
    id: 'exp-save-lab',
    label: 'SAVE Lab',
    title: 'Researcher',
    subtitle: 'SAVE Lab @ UTSA',
    date: 'May 2023 - Sep 2023',
    kind: 'research',
    activation: 0.82,
    layer: 'experience',
    description: 'Updated tensorflow models / data pipelines.',
  },
  {
    id: 'exp-brown',
    label: 'Brown · CS-Econ',
    title:
      'Bachelor of Science in Computer Science-Economics, Magna Cum Laude, Honors in Computer Science-Economics',
    subtitle: 'Brown University',
    date: 'Sep 2022 - May 2026',
    kind: 'education',
    activation: 0.9,
    layer: 'experience',
    description: 'GPA: 4.0/4.0',
    longDescription:
      'Honors Thesis: When Efficiency Enables Shortcuts: Studying Spurious Correlations Under LoRA Finetuning',
    links: [
      { label: 'Read the thesis', href: '/Marcel_Mateos_Salles_Thesis.pdf' },
    ],
  },
];

export const projectNodes: ProbeNodeData[] = [
  {
    id: 'proj-lora-thesis',
    label: 'LoRA × Spurious Corr.',
    title:
      'When Efficiency Enables Shortcuts: Studying Spurious Correlations Under LoRA Finetuning',
    kind: 'research',
    activation: 0.97,
    layer: 'projects',
    description:
      'Honors thesis investigating how LoRA finetuning can introduce and amplify spurious correlations in language models.',
    technologies: ['Python', 'Pytorch', 'HuggingFace', 'PEFT'],
    longDescription:
      "This honors thesis investigates the relationship between parameter-efficient finetuning (specifically LoRA) and spurious correlations in language models. LoRA's low-rank constraint forces models to find efficient shortcuts, which can cause them to rely on spurious features in the training data rather than the intended signal. The thesis provides empirical evidence and analysis of when and why this occurs, with implications for the safe deployment of finetuned language models.",
    features: [
      "Studied how LoRA's low-rank structure encourages reliance on spurious correlations during finetuning",
      'Conducted controlled experiments across multiple datasets and model architectures',
      'Analyzed the tradeoff between parameter efficiency and robustness to distribution shift',
    ],
    links: [{ label: 'Read the thesis', href: '/Marcel_Mateos_Salles_Thesis.pdf' }],
    imageUrl: '/thesis_image.png',
  },
  {
    id: 'proj-reddit-depression',
    label: 'Depression Detection',
    title: 'Reddit Depression Symptom Detection',
    kind: 'research',
    activation: 0.88,
    layer: 'projects',
    description:
      'A computational linguistics project that uses Reddit data to detect symptoms of depression.',
    technologies: ['Python', 'Pytorch', 'HuggingFace', 'Pandas', 'Scikit-learn'],
    longDescription:
      'This project uses Reddit data to detect symptoms of depression. I used two techniques to generate embeddings from Reddit comments: averaged BERT embeddings and LDA topics. I then trained a Random Forest Classifier to detect ten different depression symptoms, achieveing accuracies close to the research paper with smaller models.',
    features: [
      'Generated two separate embedding representations of Reddit comments to train a Random Forest Classifier',
      'Achieved near SOTA performance from a research paper while using a smaller BERT model (DistilBERT)',
      'Utilized LDA topics or BERT to generate embeddings',
    ],
    imageUrl: '/reddit.png',
  },
  {
    id: 'proj-spotiduo',
    label: 'SpotiDuo',
    title: 'SpotiDuo',
    kind: 'engineering',
    activation: 0.72,
    layer: 'projects',
    description:
      'A music-based language learning app featuring support for over 150 languages, user inputs, and a recommendation algorithm to continue learning',
    technologies: ['Java', 'TypeScript', 'JavaScript', 'React', 'AWS', 'Spark'],
    longDescription:
      'SpotiDuo is a full-stack web app intended to help language learners on their journey of learning and discovery. The app bridges the enjoyment of listening to music with the task of learning languages to allow for people to learn as they listen. While using the web-app, the user can listen to a song in a language that they are trying to learn, and see the lyrics come up in their native language and the language they are working on learning. Blanks will appear in the lyrics and using what they hear, know from the language that they speak, and from what they have already learned, write in what the word in the blank should be. This will allow them to work on their grammar and comprehension. After the song finishes, if the user enjoyed the song, they will have the option to play with a song that is similar to the song they just used.',
    features: [
      'Built a webapp that allows users to learn languages by listening to songs in other languages by filling in lyrics to reinforce listening',
      'Led the backend team and designed architecture for interaction between frontend and backend',
      'Utilized Spotify API to get metadata from songs and developed a recommendation algorithm to prompt users with new songs',
    ],
    collaborators: [
      { name: 'Allen Wang', link: 'https://allenwang.co/' },
      { name: 'Charlene Chen', link: 'https://www.linkedin.com/in/chen-charlene/' },
      { name: 'Andrew Chen', link: 'https://www.linkedin.com/in/andrew-z-chen/' },
    ],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/MarcelMatsal/spotiduo' },
      { label: 'Live Demo', href: 'https://www.youtube.com/watch?v=qPu-ch3UULo' },
    ],
    imageUrl: '/SpotiDuo.png',
  },
  {
    id: 'proj-little-label-learners',
    label: 'Little Label Learners',
    title: 'Little Label Learners',
    kind: 'research',
    activation: 0.85,
    layer: 'projects',
    description:
      'A novel semisupervised learning technique based on biological development.',
    technologies: ['Python', 'TensorFlow', 'Keras', 'Numpy'],
    longDescription:
      'Modern neural networks often use vast volumes of data, far more than what a human needs, to learn to recognize common objects. Plus, these models often suffer from catastrophic forgetting during continual learning tasks, whereas humans can learn nearly unlimited numbers of novel conceptual classes. With Little Label Learners, we present a gradual supervised learning routine that uses increasing numbers of class-representation and labeled-data over epochs to mimic the data diet of infants. We demonstrate that our model is able to learn new classes effectively, comparable to fullysupervised routines using significantly more labeled images and datasets that contain all labels of interest.',
    features: [
      'Pioneered the development of a biology-mimicking deep learning model that enhances adaptability and minimizes data requirements',
      'Implemented a seamless transition from self-supervised to semi-supervised learning, along with dynamic category introduction',
      'Demonstrated ability to outperform purely self-supervised learning while coming within 10% of fully-supervised learning',
    ],
    collaborators: [
      { name: 'Winston Li', link: 'https://www.linkedin.com/in/winston-y-li/' },
      { name: 'John Ryan Byers', link: 'https://jrbyers.github.io/Portfolio-Website/' },
    ],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/lwinstony8/LittleLabelLearners',
      },
      {
        label: 'Live Demo',
        href: 'https://github.com/MarcelMatsal/LittleLabelLearnersWriteUpandSlides',
      },
    ],
    imageUrl: '/LittleLabelLearnersHeader.png',
  },
  {
    id: 'proj-spacepals',
    label: 'SpacePals',
    title: 'SpacePals',
    kind: 'hackathon',
    activation: 0.52,
    layer: 'projects',
    description:
      'Hack@Brown 2024 project aimed at entertaining users through a pokemon-like game of space exploration.',
    technologies: ['Python', 'React', 'CSS', 'Flask', 'GraphQL', 'CLIP', 'OpenAI'],
    longDescription:
      "With SpacePals you can embark on a journey to discover the cosmos! Take pictures of all the alien animlas that you find along the way, and look back at them later on in your Explorers's Guide! You can see your progress there as you progress on your journey and learn some cool information about all the animals you encounter. We used the CLIP model and gave it names of things that it should be able to recognize. We then built the frontend and connected it using GraphQl. We worked on getting the ability to take images and then have our model on the backend categorize what the image is showing. It is then update in your traveler's guide to show that you have found the alien.",
    features: [
      'Spearheaded development of webapp that allows users to capture different space animals by taking pictures of them',
      "Engineered frontend system that's updated in real-time as the backend utilizes CLIP to classify the image taken",
      'Integrated GraphQL to establish efficient communication between the frontend and backend systems',
    ],
    collaborators: [
      { name: 'John Ryan Byers', link: 'https://jrbyers.github.io/Portfolio-Website/' },
      { name: 'Nathan DePiero', link: 'https://nathandepiero.vercel.app/' },
      { name: 'Marcus Lee', link: 'https://www.linkedin.com/in/lee-marcus-j/' },
    ],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/jrbyers/SpacePals' },
      { label: 'Live Demo', href: 'https://devpost.com/software/spacepals' },
    ],
    imageUrl: '/spacepals.png',
  },
  {
    id: 'proj-campfire-stories',
    label: 'Campfire Stories',
    title: 'Campfire Stories',
    kind: 'hackathon',
    activation: 0.46,
    layer: 'projects',
    description:
      'Hack@Brown 2023 project aimed at improving camping safety through storytelling.',
    technologies: [
      'Python',
      'JavaScript',
      'React',
      'CSS',
      'Azure',
      'OpenAI',
      'text-davinci-003',
    ],
    longDescription:
      "Our project is all about the outdoors and enjoying being around a campfire with your friends. Many things can be done around a campfire but our team agreed that one of the best things to do is tell scary stories with your friends. We used this as the inspiration for our project. Our project expands upon the idea of campfire stories and allows the user to input a theme/noun. This theme/noun will then be converted into a scary story that you can share with your friends around the campfire. Furthermore, the story that is generated by our project incorporates safety tips so that everyone that is listening to the story learns about camping safety, preventing injuries, and preventing forest fires. We built a website using React and OpenAI's API. We used their pre-trained text-davinci-003 model to generate random scary stories based on the theme/noun that the user inputs.",
    features: [
      'Developed a website for generating scary campfire stories based on user-inputted themes and incorporating safety tips',
      'Implemented a seamless user interface for displaying generated stories, ensuring an immersive storytelling experience',
      'Incorporated safety tips within the generated stories to promote camping safety, injury prevention, and wildfire awareness',
    ],
    collaborators: [
      { name: 'John Ryan Byers', link: 'https://jrbyers.github.io/Portfolio-Website/' },
      { name: 'Nathan DePiero', link: 'https://nathandepiero.vercel.app/' },
      { name: 'Marcus Lee', link: 'https://www.linkedin.com/in/lee-marcus-j/' },
    ],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/jrbyers/CampfireStories' },
      { label: 'Live Demo', href: 'https://devpost.com/software/campfire-stories-3j4wv6' },
    ],
    imageUrl: '/campfireStories.png',
  },
];
