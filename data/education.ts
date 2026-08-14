import type { Club, TeachingCompany } from "@/lib/types";

export const education = {
  university: "University of California, San Diego",
  degree: "B.S./M.S. in Computer Science",
  duration: "Sep 2022 – Jun 2026",
  details: "Regents Scholar — top 1% of the incoming freshman class.",
  focus: "Systems · Networking · Machine Learning",
  courses: [
    "Advanced Data Structures",
    "Algorithmic Design",
    "Graduate Intro to Machine Learning",
    "Recommender Systems",
    "Computer Architecture",
    "Parallel Computing",
    "Wireless Networks",
    "Internet Measurement",
    "AI: Search & Optimization",
    "Database Systems",
    "Scalable Analytics",
  ],
} as const;

export const teaching: TeachingCompany[] = [
  {
    company: "UC San Diego — CSE Department",
    logo: "/assets/companies/CSE_UCSD.png",
    roles: [
      {
        role: "Education Researcher & Head Tutor (CSE 8A)",
        duration: "Jul 2023 – Present",
        description: [
          "Developed novel Problem Decomposition Question Suites, analyzing student performance to enhance teaching methodologies.",
          "Led a team of 33+ instructional staff, serving as an interim TA and running lab sections for over 100 students.",
          "Designed and documented a new curriculum for a Pilot Intro to Python course, exposing students to Pandas and Pygame.",
        ],
        technologies: ["Python", "Pandas", "Pygame"],
      },
      {
        role: "Advanced DSA Tutor (CSE 100)",
        duration: "Dec 2023 – Mar 2025",
        description: [
          "Fostered an inclusive learning environment for complex data structures like Treaps, Disjoint Sets, and Aho-Corasick Automatons.",
          "Guided students in debugging advanced algorithms using GDB and Valgrind.",
          "Authored and validated summative assessment questions for C++ and advanced data structures.",
        ],
        technologies: ["C++", "GDB", "Valgrind"],
      },
      {
        role: "Systems Programming Tutor (CSE 30)",
        duration: "Aug 2024 – Dec 2024",
        description: [
          "Hosted office hours and review sessions for over 150 students on C, Assembly, Machine Code, and Caches.",
          "Developed assignments using PrairieLearn, focusing on ARM architecture, control flow, and stack frames.",
        ],
        technologies: ["C", "ARM", "Assembly"],
      },
    ],
  },
  {
    company: "CSE — Peer Led Academic Cohorts (PACE)",
    logo: "/assets/companies/CSE_PACE.png",
    roles: [
      {
        role: "Lead Peer Mentor (CSE 89)",
        duration: "Aug 2023 – Present",
        description: [
          "Organized seminars and served as a key resource for incoming first-year and transfer students.",
          "Mentored over 200 students on course selection, internship strategies, and career paths in various CS domains.",
          "Developed and delivered lesson plans on the foundations of AI and Image Generation.",
        ],
        technologies: [],
      },
    ],
  },
];

export const clubs: Club[] = [
  {
    name: "Triton Software Engineering",
    role: "SWE / Product Manager",
    website: "https://tritonse.github.io/",
    logo: "/assets/clubs/tse.png",
  },
  {
    name: "ACM AI @ UCSD",
    role: "Technical Events Lead",
    website: "https://ai.acmucsd.com/",
    logo: "/assets/clubs/acm-ai.png",
  },
  {
    name: "UCSD CS & Engineering Society",
    role: "President · SWE · PR Chair",
    website: "https://csesucsd.com/",
    logo: "/assets/clubs/cses.png",
  },
  {
    name: "Triton Unmanned Aerial Systems",
    role: "Computer Vision — Saliency",
    website: "https://tritonuas.com/",
    logo: "/assets/clubs/tuas.png",
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "Go", "C", "C++", "Java", "SQL", "TypeScript", "JavaScript"] },
  { group: "Systems & Infrastructure", items: ["Linux", "gRPC", "BigQuery", "GCP", "Firebase", "MongoDB", "PostgreSQL"] },
  { group: "ML / AI", items: ["PyTorch", "LLMs", "Scikit-learn", "Pandas", "NumPy"] },
  { group: "Tools", items: ["Git", "GDB", "Valgrind", "Playwright", "Postman", "ThunderKittens"] },
] as const;

export const teachingStats = [
  { value: "200+", label: "students mentored" },
  { value: "33+", label: "staff led as head tutor" },
  { value: "4", label: "instructional roles" },
  { value: "2", label: "published studies" },
] as const;
