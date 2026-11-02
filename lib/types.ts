export type Link = {
  label: string;
  href: string;
  external?: boolean;
};

export type Metric = {
  value: string;
  label: string;
};

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  source?: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover";
};

export type Paper = {
  title: string;
  venue: string;
  year?: string;
  href: string;
};

export type VisualId =
  | "ownership-pipeline"
  | "specsplit-topology"
  | "honeyllm-flow"
  | "citm-topology"
  | "optfantasy-comparison"
  | "lomaverse-orbit"
  | "megakernel-anatomy";

export type ProductStageMode = "hero" | "case-study";
export type VisualMode = ProductStageMode | "diagram" | "figure";

export type ContentSection =
  | { type: "prose"; heading: string; body: string[] }
  | { type: "metrics"; heading?: string; metrics: Metric[] }
  | { type: "visual"; heading?: string; visual: VisualId; caption?: string }
  | { type: "figure"; heading?: string; figure: Figure }
  | { type: "gallery"; heading?: string; images: Figure[] }
  | { type: "links"; heading?: string; links: Link[] }
  | { type: "paper"; heading?: string; paper: Paper }
  | {
      type: "system";
      heading?: string;
      components: { name: string; receives: string; emits: string }[];
    }
  | {
      type: "implementation";
      heading?: string;
      decisions: { choice: string; why: string }[];
    }
  | {
      type: "evidence";
      heading?: string;
      items: { result: string; basis: string }[];
    };

export type ProjectStatus =
  | "published"
  | "research"
  | "coursework"
  | "client";

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  category: string;
  year: string;
  featured: boolean;
  hue: string;
  cover?: string;
  coverAlt?: string;
  coverFit?: "contain" | "cover";
  paper?: Paper;
  metrics: Metric[];
  technologies: string[];
  links: Link[];
  sections: ContentSection[];
  problem: string;
  contribution: string[];
  status: ProjectStatus;
  role: string;
  team?: string;
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
  hue: string;
};

export type CitationType = "inproceedings" | "article" | "misc";

export type Citation = {
  type: CitationType;
  key: string;
  authors?: string[];
  title: string;
  year: string;
  booktitle?: string;
  journal?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  eprint?: string;
  archivePrefix?: string;
  primaryClass?: string;
  howpublished?: string;
  note?: string;
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
  citation: Citation;
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
