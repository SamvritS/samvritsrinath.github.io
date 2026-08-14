export const site = {
  name: "Samvrit Srinath",
  shortName: "SS",
  tagline: "Research · Systems · Software",
  location: "San Diego / San Jose",
  bio: "I build systems that make computers understand the world — internet measurement, distributed systems, and machine learning infrastructure at the intersection of research and production engineering.",
  headline: "Software Engineer · Researcher",
  contact: {
    email: "sasrinath@ucsd.edu",
    linkedin: "https://linkedin.com/in/samvrit-srinath",
    github: "https://github.com/SamvritSrinath",
  },
  resume: {
    label: "Download PDF",
    href: "/Samvrit_Srinath_Resume.pdf",
  },
  url: "https://samvrit.vercel.app",
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;