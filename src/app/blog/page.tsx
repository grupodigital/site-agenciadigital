import BlogContent from "@/components/pages/BlogContent";
import { getCategories, getPosts } from "@/lib/blog";
import {
  BLOG_DESCRIPTION,
  BLOG_ID,
  BLOG_URL,
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbList,
  jsonLd,
  listingMetadata,
  postListItem,
  scopeCrumbs,
} from "@/lib/blog-seo";
import { SITE } from "@/lib/site";

// Must be a literal for Next.js to read it — keep in sync with BLOG_REVALIDATE.
export const revalidate = 600;

export const metadata = listingMetadata({
  title: "Blog",
  description: BLOG_DESCRIPTION,
  path: "/blog",
});

export default async function BlogPage() {
  const [result, categories] = await Promise.all([
    getPosts({ lead: 1 }),
    getCategories(),
  ]);
  const all = result?.posts ?? [];
  const [featured = null, ...posts] = all;

  const structuredData = {
    "@graph": [
      {
        "@type": "Blog",
        "@id": BLOG_ID,
        url: BLOG_URL,
        name: `Blog — ${SITE.name}`,
        description: BLOG_DESCRIPTION,
        inLanguage: "pt-BR",
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@id": WEBSITE_ID },
        blogPost: all.map(postListItem),
      },
      breadcrumbList(scopeCrumbs({ kind: "all" })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <BlogContent
        featured={featured}
        posts={posts}
        categories={categories}
        currentPage={1}
        totalPages={result?.totalPages ?? 1}
        total={result?.total}
      />
    </>
  );
}
