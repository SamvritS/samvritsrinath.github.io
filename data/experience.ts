import type { Company } from "@/lib/types";

export const experience: Company[] = [
  {
    company: "Arista Networks",
    logo: "/assets/companies/Arista.png",
    location: "Santa Clara, CA",
    roles: [
      {
        role: "Incoming Software Engineer",
        duration: "Jun 2026 – Present",
        description: [],
        technologies: ["Python", "C++"],
      },
      {
        role: "Platform SWE Intern (Co-op)",
        duration: "Mar 2025 – Sep 2025",
        description: [
          "Architected core software for next-gen Arista Ethernet switches with advanced PHY and loopback support.",
          "Built a switch modeling framework translating hardware register specs into traffic forwarding behaviors for simulation and validation.",
          "Designed a gRPC device communication framework from scratch — 12 APIs across 3 databases and 8 platforms.",
          "Optimized board autodetection, achieving a 96% reduction in hardware lookup time.",
          "Developed Linux SMBus middleware for I2C transactions ensuring reliable register-level access across switch platforms.",
          "Built a multiprocessing test framework for switch wiring simulation covering all Arista models.",
        ],
        technologies: ["Python", "Go", "gRPC", "C", "Linux"],
      },
      {
        role: "Software Engineer Intern",
        duration: "Jun 2024 – Sep 2024",
        description: [
          "Improved regression efficiency 15% via modularized diagnostic shells for high-speed Ethernet switches.",
          "Created performance tests for proprietary Arista ASICs focused on packet integrity and PRBS validation.",
          "Built Python diagnostics for PCIe Linkup and ASIC resets, reducing boot-up time.",
        ],
        technologies: ["Python", "C++", "C"],
      },
    ],
  },
  {
    company: "UC San Diego",
    logo: "/assets/companies/UCSD.png",
    location: "La Jolla, CA",
    roles: [
      {
        role: "Software Engineering Intern",
        duration: "Jul 2023 – Apr 2024",
        description: [
          "Built a live full-stack Java/JSP application used by 40K+ users to manage names across websites and official documents.",
          "Validated API performance and integration across 5+ databases using SQL and Postman.",
          "Automated QA with Playwright, reducing manual testing time by 30%.",
          "Implemented a scalable REST API used across 6 applications for CRUD operations and SSO on student databases.",
        ],
        technologies: ["Java", "JSP", "SQL", "Postman", "Playwright"],
      },
    ],
  },
];
