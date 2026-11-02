// One vocabulary for every copy gate. Before this existed the same list lived in
// three places that had already drifted: a source grep over app+components+data,
// a regex in the content test, and a different array in the browser test.
const BANNED_TERMS = [
  "seamless",
  "robust",
  "revolutionary",
  "cutting-edge",
  "next-generation",
  "innovative",
  "powerful",
  "transformative",
  "unlock",
  "reimagine",
  "ecosystem",
  "journey",
  "mission",
  "at the intersection of",
];

export const BANNED_COPY = new RegExp(
  BANNED_TERMS.map((term) => `\\b${term}\\b`).join("|"),
  "i",
);
