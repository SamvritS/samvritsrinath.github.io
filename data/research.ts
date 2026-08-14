import type { ResearchArea } from "@/lib/types";

export const researchAreas: ResearchArea[] = [
  {
    title: "Cloud Networking",
    description:
      "Internet measurement and network infrastructure — path analysis, data sovereignty, and foreign surveillance detection.",
    projects: ["IP-Sage", "Country-in-the-Middle"],
    papers: [
      {
        title: "Identifying Operators of IP Services At Scale with OperatorSage",
        venue: "IMC 2025 · lab paper",
        year: "2025",
        href: "/assets/papers/OperatorLLMs_IMC25.pdf",
        abstract:
          "OperatorSage automates the attribution of IP service operators using an LLM over DNS, TLS, and WHOIS evidence — 46× faster and 16% more accurate than manual analysis, applied to 150K+ IPv4 addresses. The system behind the IP-Sage platform.",
        tags: ["LLMs", "IP attribution", "Measurement"],
        note: "Lab paper I contributed to — the IP-Sage system.",
      },
      {
        title:
          "Country-in-the-Middle: Measuring Paths between People and their Governments",
        venue: "IMC 2025 · lab paper",
        year: "2025",
        href: "/assets/papers/gov_traceroutes_paper.pdf",
        abstract:
          "Identifying countries that sit on the network path between residents and their government services — a pilot of 149 countries refined into an in-depth study of 11, analyzing 9,000+ IP-level paths and the data-sovereignty exposure they reveal.",
        tags: ["Traceroutes", "Data sovereignty", "Measurement"],
        note: "Lab paper I contributed to — UCSD Early Research Scholars Program.",
      },
    ],
  },
  {
    title: "Computer Science Education",
    description:
      "How LLMs reshape what and how we teach computing — problem decomposition pedagogies for introductory courses.",
    projects: ["CS1-LLM Experience Report", "Problem Decomposition"],
    papers: [
      {
        title: "CS1-LLM: Integrating LLMs into CS1 Instruction",
        venue: "ITiCSE 2024 · lab paper",
        year: "2024",
        href: "/assets/papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
        abstract:
          "An experience report on a CS1 course that fully embraces LLMs from the start — emphasizing explaining code, testing, and decomposing large problems into functions an LLM can solve, with frequent formative assessment of those skills.",
        tags: ["LLMs", "CS1", "Experience report"],
        note: "Lab paper I contributed to — experience report for the CS1-LLM course.",
      },
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
    ],
  },
];
