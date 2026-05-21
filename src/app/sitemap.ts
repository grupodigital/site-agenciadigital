import type { MetadataRoute } from "next";
import { NAV_PAGES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return NAV_PAGES.map(({ href, priority, changeFrequency }) => ({
    url: `${SITE.url}${href === "/" ? "" : href}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
