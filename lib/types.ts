export type Link = {
  label: string;
  href: string;
  external?: boolean;
};

export type Metric = {
  value: string;
  label: string;
};

export type DiagramNodeKind = "source" | "process" | "storage" | "output";

export type DiagramNode = {
  id: string;
  label: string;
  sublabel?: string;
  kind?: DiagramNodeKind;
};

export type DiagramData = {
  title?: string;
  nodes: DiagramNode[];
  edges: [string, string][];
};

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  source?: string;
};

export type ContentSection =
  | { type: "prose"; heading: string; body: string[] }
  | { type: "metrics"; heading?: string; metrics: Metric[] }
  | { type: "diagram"; heading?: string; diagram: DiagramData }
  | { type: "figure"; heading?: string; figure: Figure }
  | { type: "gallery"; heading?: string; images: Figure[] }
  | { type: "links"; heading?: string; links: Link[] };

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  category: string;
  year: string;
  featured: boolean;
  cover?: string;
  coverAlt?: string;
  metrics: Metric[];
  technologies: string[];
  links: Link[];
  sections: ContentSection[];
};

export type WorkRole = {
  role: string;
  duration: string;
  description: string[];
  technologies: string[];
};

export type Company = {
  company: string;
  logo?: string;
  location?: string;
  roles: WorkRole[];
};

export type ResearchArea = {
  title: string;
  description: string;
  projects: string[];
  papers: Publication[];
};

export type Publication = {
  title: string;
  authors?: string[];
  venue: string;
  year: string;
  href: string;
  abstract: string;
  tags: string[];
  note?: string;
};

export type Club = {
  name: string;
  role: string;
  website: string;
  logo?: string;
};

export type TeachingCompany = {
  company: string;
  logo?: string;
  roles: WorkRole[];
};