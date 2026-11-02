// Content files carry typographic dashes, but the site's voice is hyphenated.
// One normaliser keeps a data edit from leaking an em dash into the page.
export const clean = (s: string) => s.replace(/[\u2014\u2013]/g, "-");
