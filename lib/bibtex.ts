import type { Citation, CitationType } from "@/lib/types";

const FIELD_ORDER = [
  "author",
  "title",
  "booktitle",
  "journal",
  "year",
  "volume",
  "pages",
  "doi",
  "eprint",
  "archivePrefix",
  "primaryClass",
  "howpublished",
  "note",
  "url",
] as const;

type Field = (typeof FIELD_ORDER)[number];

const TEXT_FIELDS = new Set<Field>([
  "author",
  "title",
  "booktitle",
  "journal",
  "howpublished",
  "note",
]);

const TYPES = new Set<CitationType>(["inproceedings", "article", "misc"]);

const ESCAPES: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};

export function escapeBibtex(value: string): string {
  return value.replace(/[\\&%$#_{}~^]/g, (char) => ESCAPES[char]);
}

export function toBibtex(citation: Citation): string {
  if (!TYPES.has(citation.type)) {
    throw new Error(`invalid citation type: ${citation.type}`);
  }
  if (!/^[A-Za-z][A-Za-z0-9:_-]*$/.test(citation.key)) {
    throw new Error(`invalid citation key: ${citation.key}`);
  }
  if (!/^\d{4}$/.test(citation.year)) {
    throw new Error(`invalid citation year: ${citation.year}`);
  }
  if (!citation.title.trim()) {
    throw new Error(`citation ${citation.key} has no title`);
  }

  const values: Partial<Record<Field, string>> = {
    author: citation.authors?.length
      ? citation.authors.join(" and ")
      : undefined,
    title: citation.title,
    booktitle: citation.booktitle,
    journal: citation.journal,
    year: citation.year,
    volume: citation.volume,
    pages: citation.pages,
    doi: citation.doi,
    eprint: citation.eprint,
    archivePrefix: citation.archivePrefix,
    primaryClass: citation.primaryClass,
    howpublished: citation.howpublished,
    note: citation.note,
    url: citation.url,
  };

  const fields: string[] = [];
  for (const field of FIELD_ORDER) {
    const value = values[field];
    if (!value) continue;
    const text = TEXT_FIELDS.has(field) ? escapeBibtex(value) : value;
    fields.push(`  ${field} = {${text}}`);
  }

  return `@${citation.type}{${citation.key},\n${fields.join(",\n")}\n}`;
}

export function formatCitation(citation: Citation, venue: string): string {
  const authors = citation.authors?.length
    ? `${citation.authors.join(", ")}. `
    : "";
  return `${authors}${citation.title}. ${venue}, ${citation.year}.`;
}

export function duplicateCitationKeys(citations: Citation[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const citation of citations) {
    if (seen.has(citation.key)) duplicates.add(citation.key);
    seen.add(citation.key);
  }
  return [...duplicates];
}
