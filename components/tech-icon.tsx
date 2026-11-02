import { GLYPHS, type IconGlyph } from "./tech-icon-glyphs";

// The map is the previous react-icons naming, kept here so data/skills.tsx and the
// rest of the content sheet never have to know which set a mark came from.
const BY_NAME: Record<string, string> = {
  React: "React",
  "Next.js": "Nextdotjs",
  TypeScript: "Typescript",
  JavaScript: "Javascript",
  Firebase: "Firebase",
  MongoDB: "Mongodb",
  Go: "Go",
  Python: "Python",
  "C++": "Cplusplus",
  C: "C",
  Linux: "Linux",
  Docker: "Docker",
  gRPC: "Server",
  Java: "Java",
  JSP: "Java",
  SQL: "Database",
  Git: "Git",
  Playwright: "Cog",
  Postman: "Postman",
  GCP: "Google",
  BigQuery: "Google",
  PyTorch: "Pytorch",
  TensorFlow: "Tensorflow",
  "Scikit-learn": "Scikitlearn",
  Pandas: "Pandas",
  NumPy: "Numpy",
  Electron: "Electron",
  SQLite: "Sqlite",
  OpenAI: "Openaigym",
  Claude: "Anthropic",
  "Hugging Face": "Nvidia",
  ARM: "Arm",
  NVIDIA: "Nvidia",
  PostgreSQL: "Postgresql",
  Supabase: "Supabase",
  Vercel: "Vercel",
  Threejs: "Threedotjs",
  Flask: "Flask",
  CUDA: "Nvidia",
  Llama: "Nvidia",
  gdb: "Microchip",
  GDB: "Microchip",
  Valgrind: "Microchip",
  Gurobi: "Numpy",
  "RIPE Atlas API": "Server",
  Prisma: "Server",
};

export function glyphFor(name: string): IconGlyph | undefined {
  const key = BY_NAME[name];
  return key ? GLYPHS[key] : undefined;
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const glyph = glyphFor(name);
  if (!glyph) return null;
  return (
    <svg
      viewBox={glyph.viewBox}
      width="1em"
      height="1em"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d={glyph.path} />
    </svg>
  );
}
