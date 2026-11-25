import type { Metadata } from "next";
import {
  DEFAULT_POST_IMAGE,
  coverOf,
  type BlogCategory,
  type BlogPostSummary,
  type ListingScope,
} from "@/lib/blog";
import { SITE } from "@/lib/site";

export const BLOG_URL = `${SITE.url}/blog`;
export const BLOG_ID = `${BLOG_URL}#blog`;
export const ORGANIZATION_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export const BLOG_DESCRIPTION =
  "Artigos da Digital Comunicação sobre marketing, estratégia comercial e comunicação institucional na região Norte.";

export function categoryDescription(category: BlogCategory) {
  return `${category.count} ${category.count === 1 ? "artigo" : "artigos"} da Digital Comunicação sobre ${category.name.toLowerCase()}: estratégias, tendências e práticas aplicadas à comunicação e ao marketing.`;
}

/** `<link rel="alternate" type="application/rss+xml">` on every blog page. */
export const BLOG_FEED_TYPES = { "application/rss+xml": "/blog/feed.xml" };

/** Share image for listing pages (posts use their own cover). */
export const BLOG_OG_IMAGES = [
  {
    url: DEFAULT_POST_IMAGE.src,
    width: DEFAULT_POST_IMAGE.width,
    height: DEFAULT_POST_IMAGE.height,
    alt: `Blog — ${SITE.name}`,
  },
];

export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).toString();
}

/** Metadata shared by every listing page (index, pages, categories). */
export function listingMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, types: BLOG_FEED_TYPES },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: BLOG_OG_IMAGES,
    },
    twitter: {
      title,
      description,
      images: BLOG_OG_IMAGES.map((image) => image.url),
    },
  };
}

/** Compact BlogPosting node used inside lists (Blog, ItemList). */
export function postListItem(post: BlogPostSummary) {
  const url = `${BLOG_URL}/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: post.title,
    datePublished: post.publishedAt,
    image: absoluteUrl(coverOf(post).src),
    ...(post.category && { articleSection: post.category.name }),
  };
}

/** ItemList of the posts on a listing page, in display order. */
export function postItemList(posts: BlogPostSummary[], startIndex = 1) {
  return {
    "@type": "ItemList",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: startIndex + i,
      url: `${BLOG_URL}/${post.slug}`,
      name: post.title,
    })),
  };
}

type Crumb = { name: string; path: string };

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Início", path: "/" }, ...crumbs].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function scopeCrumbs(scope: ListingScope, page = 1): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Blog", path: "/blog" }];
  if (scope.kind === "category") {
    crumbs.push({ name: scope.name, path: `/blog/categoria/${scope.slug}` });
  }
  if (page > 1) {
    const last = crumbs[crumbs.length - 1];
    crumbs.push({ name: `Página ${page}`, path: `${last.path}/pagina/${page}` });
  }
  return crumbs;
}

/**
 * Serialize JSON-LD for a <script> tag. Escapes "<" so text coming from
 * WordPress can never close the script element.
 */
export function jsonLd(data: object) {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
    /</g,
    "\\u003c",
  );
}
