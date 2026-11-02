import assert from "node:assert/strict";
import test from "node:test";
import {
  duplicateCitationKeys,
  escapeBibtex,
  formatCitation,
  toBibtex,
} from "../../lib/bibtex";
import { researchAreas } from "../../data/research";
import type { Citation } from "../../lib/types";

const sample: Citation = {
  type: "inproceedings",
  key: "test2025",
  authors: ["Ada Lovelace", "Alan Turing"],
  title: "Escaping & Symbols_ in {BibTeX}",
  year: "2025",
  booktitle: "Proceedings of $Things #1",
  doi: "10.1000/test",
  url: "https://example.com/a_b?x=1&y=2",
};

test("serializes a complete entry with escaped text fields", () => {
  const bib = toBibtex(sample);

  assert.match(bib, /^@inproceedings\{test2025,\n/);
  assert.match(bib, /author = \{Ada Lovelace and Alan Turing\}/);
  assert.match(bib, /title = \{Escaping \\& Symbols\\_ in \\\{BibTeX\\\}\}/);
  assert.match(bib, /booktitle = \{Proceedings of \\\$Things \\#1\}/);
  assert.match(bib, /year = \{2025\}/);
  assert.match(bib, /doi = \{10\.1000\/test\}/);
  assert.match(bib, /url = \{https:\/\/example\.com\/a_b\?x=1&y=2\}/);
  assert.ok(bib.endsWith("}"));
});

test("escapes BibTeX special characters", () => {
  assert.equal(
    escapeBibtex("50% & $5 #1_a{b}"),
    "50\\% \\& \\$5 \\#1\\_a\\{b\\}",
  );
});

test("rejects keys, years, and titles that cannot be trusted", () => {
  assert.throws(
    () => toBibtex({ ...sample, key: "1bad" }),
    /invalid citation key/,
  );
  assert.throws(
    () => toBibtex({ ...sample, year: "25" }),
    /invalid citation year/,
  );
  assert.throws(() => toBibtex({ ...sample, title: " " }), /has no title/);
});

test("detects duplicate citation keys", () => {
  assert.deepEqual(
    duplicateCitationKeys([
      sample,
      { ...sample, key: "other2025" },
      { ...sample, key: "test2025" },
    ]),
    ["test2025"],
  );
});

test("every research paper has one unique, syntactically valid entry", () => {
  const papers = researchAreas.flatMap((area) => area.papers);

  assert.equal(papers.length, 5);
  assert.deepEqual(
    duplicateCitationKeys(papers.map((paper) => paper.citation)),
    [],
  );

  for (const paper of papers) {
    const bib = toBibtex(paper.citation);
    assert.match(bib, /^@(inproceedings|article|misc)\{/);
    assert.match(bib, new RegExp(`^@[a-z]+\\{${paper.citation.key},`));
    assert.ok(bib.includes(`year = {${paper.year}}`));
  }
});

test("verified metadata stays attached to the right entry", () => {
  const papers = researchAreas.flatMap((area) => area.papers);
  const cs1 = papers.find(
    (paper) => paper.citation.key === "vadaparty2024cs1llm",
  );
  const decomposition = papers.find(
    (paper) => paper.citation.key === "srinath2025decomposition",
  );

  assert.equal(cs1?.citation.doi, "10.1145/3649217.3653584");
  assert.match(
    toBibtex(cs1!.citation),
    /booktitle = \{Proceedings of the 2024 Innovation and Technology in Computer Science Education V\. 1 \(ITiCSE 2024\)\}/,
  );
  assert.equal(decomposition?.citation.eprint, "2511.05764");
  assert.equal(decomposition?.citation.primaryClass, "cs.CY");
});

test("formats a readable citation without escaping it", () => {
  assert.equal(
    formatCitation(sample, "Proceedings of the Test"),
    "Ada Lovelace, Alan Turing. Escaping & Symbols_ in {BibTeX}. Proceedings of the Test, 2025.",
  );
});
