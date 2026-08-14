import type { Publication, ResearchArea } from "@/lib/types";

export const researchAreas: ResearchArea[] = [
  {
    title: "Cloud Networking",
    description:
      "Internet measurement and network infrastructure — path analysis, data sovereignty, and foreign surveillance detection.",
    projects: ["IP-Sage", "Country-in-the-Middle"],
  },
  {
    title: "Computer Science Education",
    description:
      "How LLMs reshape what and how we teach computing — problem decomposition pedagogies for introductory courses.",
    projects: ["CS1-LLM Experience Report", "Problem Decomposition"],
  },
];

export const publications: Publication[] = [
  {
    title:
      "Integrating Large Language Models and Evaluating Student Outcomes in an Introductory Computer Science Course",
    authors: [
      "Annapurna Vadaparty",
      "David H. Smith IV",
      "Samvrit Srinath",
      "Mounika Padala",
      "Christine Alvarado",
      "Jamie Gorson Benario",
      "Daniel Zingaro",
      "Leo Porter",
    ],
    venue: "Computers & Education",
    year: "2025",
    href: "https://arxiv.org/abs/2510.18806",
    abstract:
      "We present the design and evaluation of a new CS1 course that integrates LLMs as learning tools. Findings suggest exam performance and demographic differences are largely similar to historical cohorts, large open-ended projects are particularly valuable in an LLM context, and students found the tools helpful though concerned about over-reliance.",
    tags: ["LLMs", "CS1", "Education", "GenAI"],
  },
  {
    title: "Assessing Problem Decomposition in CS1 for the GenAI Era",
    authors: [
      "Samvrit Srinath",
      "Annapurna Vadaparty",
      "David H. Smith IV",
      "Leo Porter",
      "Daniel Zingaro",
    ],
    venue: "arXiv preprint (cs.CY)",
    year: "2025",
    href: "https://arxiv.org/abs/2511.05764",
    abstract:
      "A practitioner paper detailing Question Suites — scaffolded sequences that help students understand a problem's context before attempting to decompose it — to assess problem decomposition in introductory computing for the GenAI era.",
    tags: ["Problem Decomposition", "CS1", "GenAI", "Assessment"],
  },
];

export const researchStats = [
  { value: "2", label: "co-authored papers" },
  { value: "2", label: "active areas" },
  { value: "8", label: "papers across case studies" },
] as const;
