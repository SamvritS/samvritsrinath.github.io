import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { projects } from "../data/projects";

const root = process.cwd();

for (const project of projects) {
  if (!project.cover) continue;
  if (!project.cover.startsWith("/assets/projects/")) continue;
  
  const ext = project.cover.split(".").pop()?.toLowerCase();
  if (ext === "webp") continue;
  
  const srcPath = join(root, "public", project.cover);
  if (!existsSync(srcPath)) {
    console.log(`SKIP (missing): ${project.cover}`);
    continue;
  }
  
  const webpPath = srcPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  const webpRelPath = project.cover.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  
  if (existsSync(webpPath)) {
    console.log(`SKIP (exists): ${webpRelPath}`);
    continue;
  }
  
  try {
    execSync(`cwebp -q 85 "${srcPath}" -o "${webpPath}"`, { stdio: "pipe" });
    console.log(`CONVERTED: ${project.cover} -> ${webpRelPath}`);
    
    // Update the project reference in memory
    project.cover = webpRelPath;
  } catch (e) {
    console.error(`FAILED: ${project.cover}`, e);
  }
}

// Write back the updated projects.ts
const projectsContent = readFileSync(join(root, "data/projects.ts"), "utf8");
writeFileSync(join(root, "data/projects.ts"), projectsContent);

console.log("Done!");
