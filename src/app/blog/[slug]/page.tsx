import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/pages/BlogPostContent";
import {
  BLOG_FIRST_PAGE_SIZE,
  coverOf,
  getPostBySlug,
  getPosts,
  getRelatedPosts,
} from "@/lib/blog";
import {
  BLOG_FEED_TYPES,
  BLOG_ID,
  BLOG_URL,
  ORGANIZATION_ID,
  absoluteUrl,
  breadcrumbList,
  jsonLd,
} from "@/lib/blog-seo";
import { SITE } from "@/lib/site";

export const revalidate = 600;

type Params = { slug: string };

// Prerender the most recent posts at build time; older ones are rendered on
// first visit and then cached (ISR).
export async function generateStaticParams(): Promise<Params[]> {
  const first = await getPosts({ firstPageSize: BLOG_FIRST_PAGE_SIZE });
  return (first?.posts ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  const cover = coverOf(post);
  const images = [
    {
      url: cover.src,
      width: cover.width,
      height: cover.height,
      alt: cover.alt || post.title,
    },
  ];

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.length ? post.tags : undefined,
    authors: [{ name: post.author?.name ?? SITE.name }],
    alternates: { canonical: url, types: BLOG_FEED_TYPES },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
      authors: [post.author?.name ?? SITE.name],
      section: post.category?.name,
      tags: post.tags,
      images,
    },
    twitter: {
      title: post.title,
      description: post.description,
      images: images.map((image) => image.url),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);

  const url = `${BLOG_URL}/${post.slug}`;
  const cover = coverOf(post);

  const structuredData = {
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: post.title,
        description: post.description,
        abstract: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        inLanguage: "pt-BR",
        wordCount: post.wordCount,
        timeRequired: `PT${post.readingMinutes}M`,
        image: {
          "@type": "ImageObject",
          url: absoluteUrl(cover.src),
          width: cover.width,
          height: cover.height,
        },
        ...(post.category && {
          articleSection: post.category.name,
          about: { "@type": "Thing", name: post.category.name },
        }),
        ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
        // Individual authors are a Person working for the agency; the
        // team account ("Redação Digital") is the agency itself.
        author:
          post.author && !post.author.isTeam
            ? {
                "@type": "Person",
                name: post.author.name,
                ...(post.author.bio && { description: post.author.bio }),
                worksFor: { "@id": ORGANIZATION_ID },
              }
            : {
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                name: SITE.name,
                url: SITE.url,
              },
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@type": "Blog", "@id": BLOG_ID },
        // Sections as named, linkable parts — lets answer engines cite and
        // deep-link the exact passage.
        hasPart: post.toc.map((item) => ({
          "@type": "WebPageElement",
          name: item.text,
          url: `${url}#${item.id}`,
        })),
        ...(related.length > 0 && {
          relatedLink: related.map((r) => `${BLOG_URL}/${r.slug}`),
        }),
      },
      breadcrumbList([
        { name: "Blog", path: "/blog" },
        ...(post.category
          ? [{ name: post.category.name, path: `/blog/categoria/${post.category.slug}` }]
          : []),
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <BlogPostContent post={post} related={related} url={url} />
    </>
  );
}
