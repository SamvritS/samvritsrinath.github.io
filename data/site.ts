export const site = {
  name: "Samvrit Srinath",
  shortName: "SS",
  tagline: "Software Engineer · Research · Systems",
  location: "San Diego / San Jose",
  bio: "Software engineer building networking, distributed systems, and machine-learning infrastructure — from Ethernet switch software at Arista to large-scale internet measurement research at UCSD.",
  headline: "Software Engineer · Researcher",
  contact: {
    email: "samvrit@gmail.com",
    linkedin: "https://linkedin.com/in/samvrit-srinath",
    github: "https://github.com/SamvritS",
  },
  resume: {
    label: "Download PDF",
    href: "/Samvrit_Srinath_Resume.pdf",
  },
  url: "https://samvrit.vercel.app",
} as const;

export const nav = [
  { label: "Projects", href: "/work" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;