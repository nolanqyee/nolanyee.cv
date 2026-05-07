// ============================================================
// SITE CONFIGURATION — edit this section for your identity
// ============================================================

export const siteConfig = {
  name: "Nolan Yee",
  tagline: "CS @ UT Austin · Forty Acres Scholar",
  bio: [
    "I'm a CS student at UT Austin building full-stack applications and AI-powered tools. Since I started college, I've prioritized learning to develop software that solves real problems for people.",
    "Feel free to explore this website, or reach out if you want to build something together.",
  ],
  terminalUser: "nolan",
  terminalDomain: "nolanyee.dev",
  social: {
    github: "https://github.com/nolanqyee",
    linkedin: "https://linkedin.com/in/nolanqyee",
  },
  email: "nolanyee@utexas.edu",
  resume: "/resume.pdf",
} as const;

// ============================================================
// CONTENT MODEL
// ============================================================

export type RenderType = "text" | "markdown" | "visual";
export type VisualVariant = "project" | "experience" | "media";

export interface VisualProps {
  variant: VisualVariant;
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  tags?: string[];
  // Experience
  company?: string;
  role?: string;
  period?: string;
  // Media
  thumbnailUrl?: string;
  platform?: "spotify" | "youtube" | "other";
}

export interface ContentMeta {
  category: string;
  date?: string;
  tags?: string[];
}

export interface ContentNode {
  id: string;
  path: string;
  title: string;
  /** One-line summary used in `ls` output and portfolio lists */
  short: string;
  body: string;
  renderType: RenderType;
  visualProps?: VisualProps;
  externalUrl?: string;
  meta: ContentMeta;
  /** If true, this node appears in the portfolio website view */
  pinned?: boolean;
}

// ============================================================
// CONTENT ENTRIES
// ============================================================

const CONTENT: ContentNode[] = [
  // ── Root files ────────────────────────────────────────────
  {
    id: "welcome.md",
    path: "/welcome.md",
    title: "Welcome",
    short: "Start here",
    body: `# Hi, I'm Nolan.

Type \`ls\` to explore, \`cat <file>\` to read, or \`help\` for a full command list.

**Quick start:**
- \`ls /projects\` — things I've built
- \`ls /experience\` — where I've worked
- \`ls /research\` — papers and research
- \`ls /misc\` — everything else
- \`photo\` — what I look like
- \`cat bio.md\` — a quick bio about me`,
    renderType: "markdown",
    meta: { category: "root" },
  },
  {
    id: "bio.md",
    path: "/bio.md",
    title: "Bio",
    short: "About me",
    body: `# About Me

**Nolan Yee** — Austin, TX

CS student at UT Austin and Forty Acres Scholar (1 of 20 from 90,000+ applicants). I build full-stack applications, AI tools, and the occasional neural network. Currently founding my startup, Bubble, leading engineering at TPEO, and doing research on AI in human fields.

When I'm not coding, I'm writing songs, playing guitar and piano, or grinding competitive Pokémon.

**Education:** B.S. Computer Science, The University of Texas at Austin (Expected 2028)

**Contact:** nolanyee@utexas.edu · https://linkedin.com/in/nolanqyee · https://github.com/nolanqyee`,
    renderType: "markdown",
    meta: { category: "root", tags: ["bio"] },
  },

  // ── Experience ────────────────────────────────────────────
  {
    id: "experience/bubble.md",
    path: "/experience/bubble.md",
    title: "Bubble",
    short: "Founded a prompt-first CRM with an LLM action agent and Redis-cached contact layer",
    body: `# Bubble
  Founding Engineer · October 2025 – Present
  
  Built Bubble — a prompt-first CRM that translates natural-language input into structured networking workflows — implementing an LLM action agent with 95% CRUD accuracy and a Redis-cached contact layer that cut query latency by 45%.
  
  https://bubbleai.framer.website/`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "experience", date: "2025-10", tags: ["startup", "ai", "engineering"] },
  },
  {
    id: "experience/tpeo.md",
    path: "/experience/tpeo.md",
    title: "Texas Product Engineering Organization",
    short: "Created Via, a UT campus navigation tool, and currently lead our Engineering curriculum",
    body: `# Texas Product Engineering Organization
Engineering Lead · September 2025 – Present

Selected as 1 of 10 from 250+ applicants, I lead engineering curriculum for TPEO fellows and built Via — a UT campus navigation app with a PostGIS spatial engine (sub-200ms queries) and a ranking algorithm using temporal decay and social voting.

https://github.com/via-team/frontend`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "experience", date: "2025-09", tags: ["leadership", "engineering"] },
  },
  {
    id: "experience/convergent.md",
    path: "/experience/convergent.md",
    title: "Texas Convergent",
    short: "Built Vibecheck, a social media and collaboration app for musicians",
    body: `# Texas Convergent
Software Engineer · September 2025 – January 2026

Built Vibecheck, a cross-platform music collaboration app, optimizing feed performance by 40% via infinite-scroll, handling 300+ media uploads through Firebase, and shipping core messaging and workspace features across 12 Agile sprints.

https://github.com/swarit-1/dam-music`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "experience", date: "2025-09", tags: ["engineering", "mobile"] },
  },
  {
    id: "experience/echowellness.md",
    path: "/experience/echowellness.md",
    title: "EchoWellness",
    short: "Built a full-stack fundraising website and led the organization as president",
    body: `# EchoWellness
President & Lead Web Developer · June 2023 – April 2025

Built EchoWellness's full-stack fundraising platform using React and PHP, automating outreach for 150+ users, raising $10,000+, and increasing donor outreach by 30% and site traffic by 120%.

https://theechowellness.org/`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "experience", date: "2023-06", tags: ["nonprofit", "fullstack", "leadership"] },
  },

  // ── Projects ──────────────────────────────────────────────
  {
    id: "projects/gamification.md",
    path: "/projects/gamification.md",
    title: "Gamified Productivity Tracker",
    short: "Full-stack productivity app built around a motivating point system",
    body: `# Gamification
**Stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Recharts, Supabase

A full-stack productivity app built around a personal points system — every productive action gets a value, creating the same motivational pull as leveling up in a video game, applied to real life.

https://github.com/nolanqyee/Gamification`,
    renderType: "markdown",
    externalUrl: "https://github.com/nolanqyee/Gamification",
    pinned: true,
    meta: { category: "projects", tags: ["fullstack", "productivity"] },
  },
  {
    id: "projects/image-manipulator.md",
    path: "/projects/image-manipulator.md",
    title: "Java Image Manipulator",
    short: "Photoshop clone built in Spring",
    body: `# Image Manipulator
**Stack:** Java, Spring, Maven

A Spring-based image processing engine supporting 4,000×4,000px edits, multi-format exports, and chroma-key compositing for seamless background replacement — optimized pixel-level routines cut average operation time by 35%.`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "projects", tags: ["java", "systems"] },
  },
  {
    id: "projects/genre-classifier.md",
    path: "/projects/genre-classifier.md",
    title: "Music Genre Classification Neural Network",
    short: "Classifies song genres from audio features with 72.4% accuracy",
    body: `# Music Genre Classifier
**Stack:** PyTorch, Python, NumPy, Pandas, Scikit-learn

A neural network classifying song genres from audio features with 72.4% accuracy across 1,000+ samples, with a Scikit-learn preprocessing pipeline and architecture tuned via GridSearchCV with ReLU, Batch Normalization, and Dropout.

https://github.com/nolanqyee/Genre-Classifier`,
    renderType: "markdown",
    externalUrl: "https://github.com/nolanqyee/Genre-Classifier",
    pinned: true,
    meta: { category: "projects", tags: ["ml", "python"] },
  },
  {
    id: "projects/se-lab.md",
    path: "/projects/se-lab.md",
    title: "ARM System Emulator",
    short: "Full software emulation of an ARM processor and cache",
    body: `# ARM System Emulator
**Stack:** C, ARM Assembly

A full software emulation of an ARM processor written in C — supporting ARM assembly instructions with a complete pipeline, hazard detection and forwarding units, branch handling, stall logic, and an L1 cache.`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "projects", tags: ["systems", "architecture"] },
  },
  {
    id: "projects/studytrackr.md",
    path: "/projects/studytrackr.md",
    title: "StudyTrackr",
    short: "React productivity suite with real-time time tracking and progress dashboards",
    body: `# StudyTrackr
**Stack:** React, JavaScript, LocalStorage

A React productivity suite with real-time time tracking and progress dashboards for 50+ active users — built with hooks and LocalStorage for state persistence, with a 78% increase in task completion after UX iteration.

https://nolanqyee.github.io/studytrackr/`,
    renderType: "markdown",
    externalUrl: "https://nolanqyee.github.io/studytrackr/",
    pinned: false,
    meta: { category: "projects", tags: ["web"] },
  },

  // ── Education ─────────────────────────────────────────────
  {
    id: "education/ut-austin.md",
    path: "/education/ut-austin.md",
    title: "B.S. Computer Science",
    short: "The University of Texas at Austin · Forty Acres Scholar · Expected 2028",
    body: `# The University of Texas at Austin
B.S. Computer Science · Expected May 2028

Forty Acres Scholar — selected as 1 of 20 recipients (from 90,000+ applicants) of UT Austin's premier full-ride, merit-based scholarship.

**Relevant coursework:** Data Structures, Computer Architecture, Statistics, Computational Biology, Discrete Math, Calculus I–III

**Activities:** Texas Product Engineering Organization (Engineering Lead), Freshmen Research Initiative

**Honors:** National Merit Scholarship Winner (top 0.5%) · 4× AIME Qualifier (top 2.5%) · USA Computing Olympiad Gold (top 7.5%)`,
    renderType: "markdown",
    meta: { category: "education", date: "2023-08" },
  },

  // ── Research ──────────────────────────────────────────────
  {
    id: "research/ai-music-paper.md",
    path: "/research/ai-music-paper.md",
    title: "AI Music & Emotional Impact",
    short: "Studied how knowing a song is AI-generated changes its emotional impact",
    body: `# Independent Research
Independent Researcher

Studied how listener awareness of AI authorship changes the emotional impact of music — comparing responses across groups who knew and didn't know whether what they were hearing was made by an AI or a human.

https://docs.google.com/document/d/1JH1LayCb9H9Wy-j0yTq0vY8CB2bBi2iUsPyFAsX0RvQ/edit?usp=sharing`,
    renderType: "markdown",
    externalUrl: "https://docs.google.com/document/d/1JH1LayCb9H9Wy-j0yTq0vY8CB2bBi2iUsPyFAsX0RvQ/edit?usp=sharing",
    pinned: true,
    meta: { category: "research", tags: ["ai", "music", "research"] },
  },
  {
    id: "research/machine-penalty.md",
    path: "/research/machine-penalty.md",
    title: "The Machine Penalty",
    short: "Contributed to Dr. Daniel Shank's published book on how humans judge AI",
    body: `# Missouri University of Science and Technology
Research Intern · Dr. Daniel Shank · May 2024 – November 2024

Contributed to Dr. Shank's published book on AI perception by synthesizing 30+ HCI sources, analyzing 200+ LLM and GAN outputs with NumPy, Pandas, and Matplotlib, and automating significance testing for 2,500+ datapoints — cutting prep time by 60%.

https://link.springer.com/book/10.1007/978-3-031-86061-4`,
    renderType: "markdown",
    externalUrl: "https://link.springer.com/book/10.1007/978-3-031-86061-4",
    pinned: true,
    meta: { category: "research", date: "2024-05", tags: ["ai", "hci", "research"] },
  },
  {
    id: "research/fri.md",
    path: "/research/fri.md",
    title: "Freshmen Research Initiative, EvoDevOmics Stream",
    short: "Used ML and RNA sequencing to study gene expression in frogs and immortal jellyfish",
    body: `# The University of Texas at Austin
Research Fellow · Dr. Joseph Dubie · Freshmen Research Initiative

Processed RNA sequencing data and ran ML models to identify the genetic basis of frog midbrain development and the reverse-aging mechanisms of the immortal jellyfish — building pipelines to clean and analyze raw genomic output.`,
    renderType: "markdown",
    pinned: true,
    meta: { category: "research", date: "2023-09", tags: ["biology", "ml", "research"] },
  },

  // ── Misc / Media ──────────────────────────────────────────
  {
    id: "misc/spotify.md",
    path: "/misc/spotify.md",
    title: "Singer-Songwriter",
    short: "Original indie pop/folk pop, published 5 songs",
    body: `# Singer-Songwriter

Indie pop / singer-songwriter — often very sad. Built around fingerpicked guitar or piano, with lyrics that try to say something honest. The hope is that someone hears one of my songs and feels a little less alone.

https://open.spotify.com/artist/6zkX3EAZywzPDRSLR4gmLw?si=YDM_9aOaQQmWEg5xBmzSKw`,
    renderType: "markdown",
    externalUrl: "https://open.spotify.com/artist/6zkX3EAZywzPDRSLR4gmLw?si=YDM_9aOaQQmWEg5xBmzSKw",
    pinned: true,
    meta: { category: "misc", tags: ["music", "creative"] },
  },
  {
    id: "misc/pokemon.md",
    path: "/misc/pokemon.md",
    title: "Competitive Pokémon Player",
    short: "Peaked #2 in National Dex Ubers on Pokémon Showdown with 1900+ Elo",
    body: `# Competitive Pokémon Player

Peak rank #2 in National Dex Ubers on Pokémon Showdown with 1900+ Elo — one of the most complex unrestricted formats in competitive Pokémon, where team building and matchup knowledge matter as much as in-game execution.`,
    renderType: "text",
    pinned: true,
    meta: { category: "misc", tags: ["gaming", "competitive"] },
  },
  {
    id: "misc/github.md",
    path: "/misc/github.md",
    title: "GitHub",
    short: "Source code and open-source work",
    body: `All my open-source code lives here.\n\nRun \`open /misc/github.md\` to view on GitHub.`,
    renderType: "text",
    externalUrl: "https://github.com/nolanqyee",
    meta: { category: "misc", tags: ["code"] },
  },
  {
    id: "misc/linkedin.md",
    path: "/misc/linkedin.md",
    title: "LinkedIn",
    short: "Professional profile",
    body: `Connect with me on LinkedIn.\n\nRun \`open /misc/linkedin.md\` to open profile.`,
    renderType: "text",
    externalUrl: "https://linkedin.com/in/nolanqyee",
    meta: { category: "misc", tags: ["professional"] },
  },
];

export default CONTENT;

// ── Lookup helpers ────────────────────────────────────────

export function getNodeByPath(path: string): ContentNode | undefined {
  const normalized = path.endsWith("/") && path !== "/"
    ? path.slice(0, -1)
    : path;
  return CONTENT.find((n) => n.path === normalized);
}

export function getChildNodes(dirPath: string): ContentNode[] {
  const base = dirPath === "/" ? "" : dirPath.replace(/\/$/, "");
  return CONTENT.filter((n) => {
    if (n.path === base) return false;
    const relative = n.path.startsWith(base + "/")
      ? n.path.slice(base.length + 1)
      : null;
    if (!relative) return false;
    return !relative.includes("/");
  });
}

export function getPinnedByCategory(category: string): ContentNode[] {
  return CONTENT.filter((n) => n.meta.category === category && n.pinned);
}

export const TOP_LEVEL_DIRS = [
  "experience",
  "projects",
  "education",
  "research",
  "misc",
] as const;

export type TopLevelDir = (typeof TOP_LEVEL_DIRS)[number];
