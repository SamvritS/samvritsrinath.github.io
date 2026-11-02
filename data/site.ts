export const site = {
  name: "Samvrit Srinath",
  shortName: "SS",
  tagline: "Software Engineer · Research · Systems",
  location: "San Jose, CA",
  bio: "Software engineer. Ethernet switch software at Arista. Large-scale internet measurement research at UCSD.",
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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://samvrit.vercel.app",
} as const;

export const nav = [
  { label: "Projects", href: "/work" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;