import type { ResearchArea } from "@/lib/types";

export const researchAreas: ResearchArea[] = [
  {
    title: "Cloud Networking",
    hue: "#14b8a6",
    description:
      "Internet measurement and network infrastructure: path analysis, data sovereignty, and foreign surveillance detection.",
    projects: ["IP-Sage", "Country-in-the-Middle"],
    papers: [
      {
        title: "Identifying Operators of IP Services At Scale with OperatorSage",
        venue: "IMC 2025 · lab paper",
        year: "2025",
        href: "/assets/papers/OperatorLLMs_IMC25.pdf",
        abstract:
          "OperatorSage automates the attribution of IP service operators using an LLM over DNS, TLS, and WHOIS evidence: 46× faster and 16% more accurate than manual analysis, applied to 150K+ IPv4 addresses. The system behind the IP-Sage platform.",
        tags: ["LLMs", "IP attribution", "Measurement"],
        citation: {
          type: "misc",
          key: "operatorsage2025",
          title:
            "Identifying Operators of IP Services At Scale with OperatorSage",
          year: "2025",
          howpublished: "IMC 2025 lab paper",
        },
      },
      {
        title:
          "Country-in-the-Middle: Measuring Paths between People and their Governments",
        venue: "IMC 2025 · lab paper",
        year: "2025",
        href: "/assets/papers/gov_traceroutes_paper.pdf",
        abstract:
          "Identifying countries that sit on the network path between residents and their government services: a pilot of 149 countries refined into an in-depth study of 11, analyzing 9,000+ IP-level paths and the data-sovereignty exposure they reveal.",
        tags: ["Traceroutes", "Data sovereignty", "Measurement"],
        citation: {
          type: "misc",
          key: "countryinthemiddle2025",
          title:
            "Country-in-the-Middle: Measuring Paths between People and their Governments",
          year: "2025",
          howpublished: "IMC 2025 lab paper",
        },
      },
    ],
  },
  {
    title: "Computer Science Education",
    hue: "#38bdf8",
    description:
      "How LLMs reshape what and how we teach computing: problem decomposition pedagogies for introductory courses.",
    projects: ["CS1-LLM Experience Report", "Problem Decomposition"],
    papers: [
      {
        title: "CS1-LLM: Integrating LLMs into CS1 Instruction",
        authors: [
          "Annapurna Vadaparty",
          "Daniel Zingaro",
          "David H. Smith IV",
          "Mounika Padala",
          "Christine Alvarado",
          "Jamie Gorson Benario",
          "Leo Porter",
        ],
        venue: "ITiCSE 2024 · lab paper",
        year: "2024",
        href: "/assets/papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
        abstract:
          "An experience report on a CS1 course that fully embraces LLMs from the start, emphasizing explaining code, testing, and decomposing large problems into functions an LLM can solve, with frequent formative assessment of those skills.",
        tags: ["LLMs", "CS1", "Experience report"],
        citation: {
          type: "inproceedings",
          key: "vadaparty2024cs1llm",
          authors: [
            "Annapurna Vadaparty",
            "Daniel Zingaro",
            "David H. Smith IV",
            "Mounika Padala",
            "Christine Alvarado",
            "Jamie Gorson Benario",
            "Leo Porter",
          ],
          title: "CS1-LLM: Integrating LLMs into CS1 Instruction",
          year: "2024",
          booktitle:
            "Proceedings of the 2024 Innovation and Technology in Computer Science Education V. 1 (ITiCSE 2024)",
          doi: "10.1145/3649217.3653584",
          url: "https://doi.org/10.1145/3649217.3653584",
        },
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
        citation: {
          type: "misc",
          key: "vadaparty2025integrating",
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
          title:
            "Integrating Large Language Models and Evaluating Student Outcomes in an Introductory Computer Science Course",
          year: "2025",
          eprint: "2510.18806",
          archivePrefix: "arXiv",
          primaryClass: "cs.CY",
          doi: "10.48550/arXiv.2510.18806",
          url: "https://arxiv.org/abs/2510.18806",
          note: "Preprint",
        },
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
          "A practitioner paper detailing Question Suites, scaffolded sequences that help students understand a problem's context before attempting to decompose it, to assess problem decomposition in introductory computing for the GenAI era.",
        tags: ["Problem Decomposition", "CS1", "GenAI", "Assessment"],
        citation: {
          type: "misc",
          key: "srinath2025decomposition",
          authors: [
            "Samvrit Srinath",
            "Annapurna Vadaparty",
            "David H. Smith IV",
            "Leo Porter",
            "Daniel Zingaro",
          ],
          title: "Assessing Problem Decomposition in CS1 for the GenAI Era",
          year: "2025",
          eprint: "2511.05764",
          archivePrefix: "arXiv",
          primaryClass: "cs.CY",
          doi: "10.48550/arXiv.2511.05764",
          url: "https://arxiv.org/abs/2511.05764",
        },
      },
    ],
  },
];
