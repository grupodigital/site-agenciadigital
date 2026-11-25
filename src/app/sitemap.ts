import type { MetadataRoute } from "next";
import { getCategories, getPostIndex } from "@/lib/blog";
import { NAV_PAGES, SITE } from "@/lib/site";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A WordPress outage shouldn't take the whole sitemap down with it.
  const [posts, categories] = await Promise.all([
    getPostIndex().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const now = new Date();
  // The blog index changes whenever a post is published or edited.
  const blogUpdated = posts.reduce<Date | undefined>((latest, post) => {
    const d = new Date(post.modifiedAt);
    return !latest || d > latest ? d : latest;
  }, undefined);

  const pages: MetadataRoute.Sitemap = NAV_PAGES.map(
    ({ href, priority, changeFrequency }) => ({
      url: `${SITE.url}${href === "/" ? "" : href}`,
      lastModified: href === "/blog" ? (blogUpdated ?? now) : now,
      changeFrequency,
      priority,
    }),
  );

  return [
    ...pages,
    // No lastModified: WordPress doesn't expose one per category, and a
    // made-up date is worse than none.
    ...categories.map(({ slug }) => ({
      url: `${SITE.url}/blog/categoria/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.map(({ slug, modifiedAt }) => ({
      url: `${SITE.url}/blog/${slug}`,
      lastModified: new Date(modifiedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
