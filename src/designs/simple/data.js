const DATA = {
  name: 'Ruchir Dandge',
  role: 'Full Stack Developer',
  location: 'Pune, Maharashtra',
  heroLabel: 'full stack developer',

  intro:
    "Full stack developer, two years in. I build the tools students and teachers use inside a browser-based learning platform — IDEs, drag-and-drop editors, grading tools. I like small, sharp software, and writing things down.",

  resumeSummary:
    'Full stack developer with two years building browser-based developer and education tooling — IDEs, visual editors, and the infrastructure behind them. Focused on simple, well-tested systems and clear documentation.',

  now: "Tech-leading AI-IDE at Qubits Education — a Module Federation microfrontend for building ML pipelines by wiring blocks together, with a team of 7 (5 engineers, 1 backend, 1 DevOps). Shipping to production this month.",

  // Add entries here to publish the "writing" section — it stays hidden while this is empty.
  writingPosts: [],

  sideQuests: [
    {
      title: 'Manga Page Editor',
      description:
        'A drag-and-drop comic-page creator — layers, text bubbles, sound-effect stickers, autosave, and shareable pages via URL. The engine behind an earlier version of this site.',
      tag: 'Canvas',
      to: '/create',
    },
  ],

  projects: [
    {
      title: 'AI-IDE',
      description:
        'Drag-and-drop ML pipeline builder shipped as a Module Federation microfrontend; real-time TensorFlow.js inference at 30fps.',
      tag: 'TensorFlow.js',
    },
    {
      title: 'Python IDE',
      description:
        'Browser-based Python IDE with a visual step debugger, running entirely on Pyodide/WASM — no server execution.',
      tag: 'Pyodide',
    },
    {
      title: 'Website Builder',
      description:
        'Drag-and-drop website builder embedded in the platform, with two-way sync between the file tree and visual editor.',
      tag: 'GrapesJS',
    },
    {
      title: 'Gradebook',
      description:
        'Grading and export tool for teachers, built on TanStack Table with cascading filters and CSV export.',
      tag: 'TanStack Table',
    },
    {
      title: 'FinDash',
      description:
        'Full-stack dashboard for visualizing financial data across multiple parameters, with JWT-authenticated APIs.',
      tag: 'MERN',
    },
    {
      title: 'Stock Trading with DRL',
      description:
        'Reinforcement-learning trader (DDPG) that beat Dow30 benchmark returns by 6%, built on FinRL.',
      tag: 'Python · RL',
    },
  ],

  experience: [
    {
      title: 'Full Stack Developer',
      company: 'Qubits Education',
      start: '2024',
      end: 'now',
      bullets: [
        'Tech Lead on AI-IDE, a Module Federation microfrontend for visual ML-pipeline building — directing a team of 7 (5 engineers, 1 backend, 1 DevOps) through task planning and PR review; shipping to production this month.',
        'Solved real-time TensorFlow.js inference at 30fps via requestAnimationFrame throttling, and fixed a tensor memory leak that cut peak memory from 1GB to 200MB.',
        'Built a browser-based Python IDE (Pyodide/WASM) with a visual step debugger and Web Worker isolation, cutting repeat load time from 2.5s to 0.3s.',
        'Shipped a GrapesJS drag-and-drop website builder and a TanStack Table gradebook with CSV export, cutting redundant API calls 40% via smarter filter-change detection.',
      ],
    },
    {
      title: 'Full Stack Developer Intern',
      company: 'Propreturns.com',
      start: "May '23",
      end: "Aug '23",
      bullets: [
        'Ran A/B tests across platform components, lifting conversion rate by 8%.',
        'Shipped AMP Web Stories that boosted site traffic by 13%, and a Rental Yield Calculator that lifted user engagement by 5%.',
        'Cut form load times by 20% across the platform and built a Lease Agreement downloader tool.',
      ],
    },
  ],

  education: {
    degree: 'B.Tech in Naval Architecture and Ocean Engineering',
    school: 'Indian Institute of Technology Madras',
    start: '2020',
    end: '2024',
  },

  skills: [
    { label: 'languages', value: 'JavaScript, TypeScript, Python, Java, C++, C' },
    { label: 'frontend', value: 'React, Next.js, TailwindCSS, Bootstrap' },
    { label: 'backend & infra', value: 'Node.js, Express, MongoDB, MySQL, AWS' },
    { label: 'tools', value: 'Git, GitHub, Figma, Vite, Module Federation' },
  ],

  // Set to a real PDF URL to show the "download pdf" button on the resume tab.
  resumePdfUrl: null,

  links: {
    email: 'ruchirdandge7020@gmail.com',
    github: 'https://github.com/Ruchir-D',
    x: 'https://twitter.com/ruchir_dandge09',
    linkedin: 'https://www.linkedin.com/in/ruchir-dandge-54537421',
  },
};

export default DATA;
