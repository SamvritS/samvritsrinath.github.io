import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/research`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/resume`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const work: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...statics, ...work];
}