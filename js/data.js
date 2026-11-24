/* =========================================================
   Portfolio content. Edit this file to update the website.
   ========================================================= */

const PROFILE = {
  name: 'Raimi Akasyah',
  fullName: 'Raimi Akasyah bin Abdul Halim',
  initials: 'RA',
  photo: '', // e.g. 'assets/photo.jpg' — leave empty to show initials
  title: 'Junior Solution Architect',
  roles: ['AI Solutions', 'Web Development', 'UI/UX'],
  status: 'Solution Architect at Pepper Labs',
  location: 'Hulu Langat, Selangor, Malaysia',
  email: 'raimiremy24@gmail.com',
  github: 'https://github.com/Raimi-Akasyah',
  githubLabel: 'github.com/Raimi-Akasyah',
  resumePdf: 'assets/Raimi-Akasyah-Resume.pdf',
  languages: ['Malay (Native)', 'English (Good working knowledge)'],
  tagline:
    'I turn unclear requirements into practical AI and web prototypes, and explain the technology in a way people actually understand.',
  summary:
    'Information Technology graduate turned Solution Architect with hands-on experience bridging business requirements and technical implementation across AI solutions, AWS-based tools, web applications, dashboards, RAG pipelines, QA/UAT and stakeholder demonstrations. I progressed from Intern to permanent Solution Architect at Pepper Labs, where my work has expanded to AI proof-of-concept design and solution architecture discussions covering on-premise integration, IAM and security.',
  strengths:
    'Strongest in turning unclear requirements into practical prototypes, coordinating with cross-functional teams, and explaining technical solutions in a simple, user-friendly way.',
};

const STATS = [
  '6 AI trainings delivered',
  '8 projects shipped',
  'AWS & Generative AI',
  'Bachelor of IT, UiTM',
];

const SKILLS = [
  {
    group: 'AI & Generative AI',
    icon: 'sparkles',
    items: ['RAG pipelines', 'Prompt engineering', 'LLM workflows', 'AI chatbot testing', 'Knowledge-base preparation', 'AI solution POC design'],
  },
  {
    group: 'AWS',
    icon: 'cloud',
    items: ['Amazon Quick (Chat Agents, Flow, Dashboard)', 'Amazon Bedrock', 'SageMaker', 'S3', 'IAM & Roles Anywhere fundamentals'],
  },
  {
    group: 'Solution Architecture',
    icon: 'layers',
    items: ['Requirements discussion', 'Solution design', 'On-premise / cloud integration (SQL Server, S3)', 'Security & network considerations'],
  },
  {
    group: 'Web Development',
    icon: 'code',
    items: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Bootstrap 4', 'Responsive UI', 'Plesk deployment'],
  },
  {
    group: 'Programming & Data',
    icon: 'database',
    items: ['Python', 'Java', 'SQL', 'JSON', 'CSV / XLSX / PDF document handling'],
  },
  {
    group: 'Solution Delivery',
    icon: 'check',
    items: ['Prototyping', 'QA testing', 'UAT preparation', 'User walkthroughs', 'Technical support', 'Stakeholder training'],
  },
  {
    group: 'Design & Tools',
    icon: 'palette',
    items: ['UI/UX design', 'CSS animations', 'GitHub', 'VS Code', 'Google Drive', 'Google Sheets', 'Gamma', 'Prezi AI', 'Manus AI'],
  },
];

const EXPERIENCE = [
  {
    role: 'Solution Architect',
    company: 'Pepper Labs Sdn. Bhd.',
    period: 'July 2026 – Present',
    current: true,
    points: [
      'Design and prototype AI knowledge-assistant and document-processing solutions using Amazon Quick for Malaysian government agencies, translating business requirements into solution architecture, workflows and proof-of-concepts.',
      'Lead solution demonstrations and requirement-gathering sessions with technical and business stakeholders, and deliver hands-on training and user enablement for agency teams.',
      'Evaluate integration approaches spanning on-premise systems, cloud storage and AWS services, and contribute to discussions on IAM, network access, HTTPS and security requirements for production deployment.',
    ],
    groups: [
      {
        title: 'Amazon Quick AI Solution',
        points: [
          'Supported the design and prototyping of an AI knowledge assistant using Amazon Quick for a Malaysian government agency, developing knowledge-base and workflow concepts integrated with organisational data sources.',
          'Explored solution architecture for integrating on-premise SQL Server, file storage, Amazon S3 and Amazon Quick, and took part in discussions on IAM, Roles Anywhere, network access, HTTPS and security.',
          'Conducted solution demonstrations and gathered requirements from technical and business stakeholders.',
        ],
      },
      {
        title: 'AI Training & User Enablement',
        points: [
          'Delivered and supported Amazon Quick training sessions for government agencies, with hands-on demonstrations, user onboarding and post-training technical support.',
          'Trained internal team members and contributed to organisation-wide AI knowledge-sharing sessions, adapting technical AI concepts into practical demonstrations for audiences with varying technical backgrounds.',
        ],
      },
    ],
  },
  {
    role: 'Project Executive Intern',
    company: 'Pepper Labs Sdn. Bhd.',
    period: 'March 2026 – July 2026',
    current: false,
    points: [
      'Contributed to AI solution development across research, knowledge preparation, prototyping, testing, web development, documentation and stakeholder demonstrations.',
      'Developed and enhanced the MSME AI chatbot, including a transition from fine-tuning to a RAG approach, document ingestion for PDF/XLSX/CSV/Word files, chunking and vector-processing logic, response testing and debugging.',
      'Built supporting chatbot functions including PDF generation, Google Drive/Gmail integration, Google Sheets functionality and web-search guidance; improved response speed by reducing token usage.',
      'Built and tested Amazon Quick Chat Agents, Flows and Dashboards; prepared user guides and walkthroughs covering login, agents, flows and dashboards.',
      'Developed a K-Youth dashboard with data-driven charts, connected external data sources, troubleshot Airtable extraction issues and refined the interface.',
      'Developed and deployed responsive landing pages for AI Ready Malaysia, MSME AI, K-Youth FAQ and MyFutureJobs using HTML/CSS/JavaScript/PHP and Plesk.',
      'Supported QA/UAT by testing chatbot responses, web/mobile-web connectivity, system features and data accuracy; prepared UAT structures, user manuals and handover materials.',
      'Supported AI training and community programmes as facilitator and technical support, including K-Youth activities, AI Ready Malaysia and AI-for-community programmes.',
    ],
    groups: [],
  },
];

const PROJECTS = [
  {
    id: 'msme-ai',
    name: 'MSME AI Chatbot & RAG Pipeline',
    type: 'work',
    color: '#B0D7D8',
    image: 'assets/projects/bisnes-ai.jpg',
    link: 'https://bisnes.ai',
    linkLabel: 'bisnes.ai',
    tags: ['RAG', 'LLM', 'Python', 'Document ingestion'],
    summary: 'An AI chatbot for Malaysian businesses using retrieval-augmented generation over business documents, now live as bisnes.ai.',
    details: [
      'Moved the chatbot from a fine-tuning approach to RAG.',
      'Handled PDF, XLSX, CSV and Word inputs with chunking and vector-processing logic.',
      'Debugged chunking and batch processing issues.',
      'Added PDF generation, Google Drive/Gmail and Google Sheets functions plus web-search guidance.',
      'Improved response speed by reducing token usage.',
      'Supported UAT and system handover.',
    ],
  },
  {
    id: 'amazon-quick',
    name: 'Amazon Quick Solutions & Demonstrations',
    type: 'work',
    color: '#F7CBCA',
    tags: ['Amazon Quick', 'AWS', 'Solution design', 'Training'],
    summary: 'Chat Agents, Flows and Dashboards built as prototypes and demos for agency engagements.',
    details: [
      'Built and tested Chat Agents, Flows and Dashboards.',
      'Prototyped an AI knowledge assistant for a Malaysian government agency.',
      'Explored integrating on-premise SQL Server, file storage and Amazon S3 with Amazon Quick.',
      'Translated agency workflows into demonstrations and solution prototypes.',
      'Prepared walkthroughs, user guides and technical information.',
    ],
  },
  {
    id: 'k-youth',
    name: 'K-Youth Data Dashboard',
    type: 'work',
    color: '#D5E5E5',
    tags: ['Dashboard', 'Data', 'Airtable', 'Google AI Studio'],
    summary: 'A dashboard with the requested data and charts, built for easy reading.',
    details: [
      'Built data-driven charts from connected external data sources.',
      'Investigated and fixed Airtable extraction issues.',
      'Moved development between VS Code and Google AI Studio.',
      'Refined the interface for usability.',
    ],
  },
  {
    id: 'ai-ready',
    name: 'AI Ready Malaysia & Project Web Interfaces',
    type: 'work',
    color: '#DDD3D3',
    image: 'assets/projects/ai-ready-malaysia.jpg',
    link: 'https://ai.pepperlabs.my',
    linkLabel: 'ai.pepperlabs.my',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Plesk'],
    summary: 'Responsive landing pages and websites for Pepper Labs projects, led by the AI Ready Malaysia training platform.',
    details: [
      'Designed, built and deployed pages for AI Ready Malaysia, MSME AI, K-Youth FAQ and MyFutureJobs.',
      'Used HTML/CSS/JavaScript/PHP and deployed with Plesk.',
      'Incorporated content references and iterated designs based on project discussions and requirements.',
    ],
  },
  {
    id: 'myfuturejobs',
    name: 'MyFutureJobs AI Landing Page',
    type: 'work',
    color: '#F7CBCA',
    image: 'assets/projects/myfuturejobs.jpg',
    link: 'https://myfuturejobs.pepperlabs.my',
    linkLabel: 'myfuturejobs.pepperlabs.my',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Plesk'],
    summary: 'A responsive landing page helping Malaysian jobseekers build AI skills through AI Ready Malaysia.',
    details: [
      'Developed and deployed the responsive landing page for MyFutureJobs AI.',
      'Built with HTML/CSS/JavaScript/PHP and deployed with Plesk.',
      'Iterated the design based on project discussions and requirements.',
    ],
  },
  {
    id: 'stackt',
    name: 'STACKT Mobile Application',
    type: 'academic',
    color: '#B0D7D8',
    tags: ['Java', 'Mobile', 'Final Year Project'],
    summary: 'Final Year Project: a Java-based expense tracker.',
    details: [
      'Geolocation-based spending alerts and reminders.',
      'Receipt scanning for image-based data extraction.',
      'Monitoring and visual analytics for tracking financial habits.',
    ],
  },
  {
    id: 'portfolio',
    name: 'Interactive Personal Portfolio Website',
    type: 'academic',
    color: '#F7CBCA',
    tags: ['HTML', 'CSS3', 'JavaScript'],
    summary: 'A responsive portfolio with animations and interactive media.',
    details: [
      'Side navigation and CSS3 skill animations.',
      'JavaScript modal gallery and a custom video player.',
      'Validated contact form.',
    ],
  },
  {
    id: 'chocobae',
    name: 'ChocoBae E-commerce Web Interface',
    type: 'academic',
    color: '#DDD3D3',
    tags: ['HTML5', 'CSS', 'JavaScript', 'Bootstrap 4'],
    summary: 'A responsive e-commerce storefront interface.',
    details: [
      'Animated image sliders and a product gallery.',
      'Shopping-cart layout.',
      'Built with HTML5, CSS, JavaScript and Bootstrap 4.',
    ],
  },
];

/* Sessions where Raimi was the trainer */
const TRAININGS = [
  { programme: 'AI For Community @ NADI', date: '2026-08-01', venue: 'NADI Mulia Jaya', place: 'Selangor' },
  { programme: 'AI For Community @ NADI', date: '2026-08-01', venue: 'NADI Taman Ahmad Razali', place: 'Ampang, Selangor' },
  { programme: 'AI For Community @ NADI', date: '2026-08-15', venue: 'NADI Linggi', place: 'Negeri Sembilan' },
  { programme: 'AI For Community @ NADI', date: '2026-09-20', venue: 'NADI Bukit Selambau, NADI Lembah Bujang & NADI Kota Kuala Muda', place: 'Kedah', online: true },
  { programme: 'AI For Community @ NADI', date: '2026-09-20', venue: 'NADI Desa Tun Razak', place: 'Kuala Lumpur' },
  { programme: 'Kampung Angkat MADANI', date: '2026-10-23', venue: 'SK St. Edmund', place: 'Limbang, Sarawak' },
];

const TRAINING_STATS = [
  { n: '6', label: 'sessions as trainer' },
  { n: '8', label: 'venues' },
  { n: '5', label: 'states & territories' },
];

const PUBLIC_SECTOR_NOTE =
  'For public sector agencies, we build an AI solution around the agency’s own use case, present it to their team, and then train staff hands-on so they can use it themselves.';

/* type: community | public | events */
const GALLERY = [
  { file: 'nadi-training-1', type: 'community', caption: 'Leading an AI For Community @ NADI session at a NADI digital transformation centre' },
  { file: 'nadi-training-3', type: 'community', caption: 'One-to-one help during an AI For Community @ NADI session' },
  { file: 'nadi-training-4', type: 'community', caption: 'Explaining AI tools to community participants at NADI' },
  { file: 'nadi-training-2', type: 'community', caption: 'Guiding participants through hands-on exercises at NADI' },
  { file: 'nadi-training-5', type: 'community', caption: 'Starting a NADI session with a pre-assessment' },
  { file: 'kampung-angkat-limbang-2', type: 'community', caption: 'Kampung Angkat MADANI at SK St. Edmund, Limbang: “AI or real?” activity' },
  { file: 'kampung-angkat-limbang-1', type: 'community', caption: 'Kampung Angkat MADANI at SK St. Edmund, Limbang, Sarawak' },
  { file: 'public-sector-amazon-quick', type: 'public', caption: 'Presenting an Amazon Quick flow built around an agency’s daily economic briefing' },
  { file: 'public-sector-ai-pintar', type: 'public', caption: 'Presenting an AI assistant solution to a ministry team' },
  { file: 'public-sector-training-2', type: 'public', caption: 'Walking a public sector team through the solution we built for them' },
  { file: 'public-sector-training-1', type: 'public', caption: 'Hands-on AI training for public sector officers' },
  { file: 'public-sector-training-4', type: 'public', caption: 'Supporting officers one-to-one during a public sector training' },
  { file: 'public-sector-training-3', type: 'public', caption: 'Answering questions during a public sector AI training' },
  { file: 'nadi-expo-booth', type: 'events', caption: 'Demonstrating AI at the AI For Community @ NADI booth' },
  { file: 'expo-booth-demo', type: 'events', caption: 'Showing a visitor an AI demo at the Pepper Labs booth' },
  { file: 'expo-booth-1', type: 'events', caption: 'Running demos at the AI For Community @ NADI exhibition booth' },
  { file: 'kiro-quick-fiesta', type: 'events', caption: 'Kiro and Amazon Quick Fiesta Malaysia (AWS)' },
  { file: 'aws-event-networking', type: 'events', caption: 'Talking AI solutions at an AWS event' },
  { file: 'kiro-leveling-workshop', type: 'events', caption: 'Kiro Leveling with AWS Kiro workshop (Pepper Labs × AWS)' },
  { file: 'hands-on-session', type: 'events', caption: 'Hands-on build session with participants' },
];

const EDUCATION = [
  {
    degree: 'Bachelor of Information Technology (Hons.)',
    school: 'Universiti Teknologi MARA (UiTM)',
    place: 'Arau, Perlis',
    period: 'March 2021 – July 2026',
  },
  {
    degree: 'Diploma in Information Management',
    school: 'Universiti Teknologi MARA (UiTM)',
    place: 'Kota Samarahan, Sarawak',
    period: 'October 2020 – February 2023',
  },
];

const CERTS = [
  { name: 'Bengkel Eksplorasi AI!: Kuasai Generatif AI & LLMs', issuer: 'MASTIC, MOSTI', date: 'October 2025' },
  { name: 'Reference Management Software', issuer: 'UiTM', date: 'May 2025' },
  { name: 'Oracle Academy Database Design', issuer: 'Oracle Academy', date: 'June 2024' },
];

/* Desktop wallpaper scenes (from the Lumora design). darkText = hero text turns dark. */
const SCENES = [
  { label: 'Golden Hour', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4', swatch: 'linear-gradient(135deg,#f6b38a,#c98bb9 55%,#6c6fb0)' },
  { label: 'Still Water', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4', swatch: 'linear-gradient(135deg,#9fd0e0,#6c9fc4 55%,#3f5f8a)' },
  { label: 'Deep Woods', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4', swatch: 'linear-gradient(135deg,#dfe8d8,#a9c3a1 55%,#5f7d5a)', darkText: true },
  { label: 'Quiet Dawn', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4', swatch: 'linear-gradient(135deg,#f3c49b,#b98a6c 55%,#5b4a3f)' },
];

const OVERLAY_IMG = 'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png';

/* Lucide-style icon paths (24x24, stroke) */
const ICONS = {
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  minus: '<path d="M5 12h14"/>',
  square: '<rect width="14" height="14" x="5" y="5" rx="2"/>',
  restore: '<rect width="12" height="12" x="4" y="8" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  list: '<path d="M3 6h18M3 12h18M3 18h12"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  pin: '<path d="M20 10c0 5-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"/>',
  wifi: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0M8.5 16.43a5 5 0 0 1 7 0"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  battery: '<rect width="16" height="10" x="2" y="7" rx="2"/><path d="M22 11v2M6 11v2M10 11v2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.12a1.64 1.64 0 0 1 1.67-1.67h2a5.56 5.56 0 0 0 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>',
  chevronR: '<path d="m9 18 6-6-6-6"/>',
  chevronL: '<path d="m15 18-6-6 6-6"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  zoomIn: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
  zoomOut: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M8 11h6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  arrowR: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  presentation: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
  star: '<path d="M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2 2 0 0 0 1.5 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.8 3.6a2 2 0 0 0-.6 1.8l.9 5.2a.5.5 0 0 1-.8.5l-4.6-2.4a2 2 0 0 0-1.9 0l-4.6 2.4a.5.5 0 0 1-.8-.5l.9-5.2a2 2 0 0 0-.6-1.8L1.3 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.5-1.1z"/>',
  video: '<path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
};
