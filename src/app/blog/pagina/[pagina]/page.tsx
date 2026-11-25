import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogContent from "@/components/pages/BlogContent";
import {
  POSTS_PER_PAGE,
  getCategories,
  getPosts,
  listingHref,
  parsePageParam,
} from "@/lib/blog";
import {
  BLOG_DESCRIPTION,
  BLOG_ID,
  absoluteUrl,
  breadcrumbList,
  jsonLd,
  listingMetadata,
  postItemList,
  scopeCrumbs,
} from "@/lib/blog-seo";

export const revalidate = 600;

type Params = { pagina: string };

// Page 1 also shows the featured post (see app/blog/page.tsx).
const LEAD = 1;

export async function generateStaticParams(): Promise<Params[]> {
  const first = await getPosts({ lead: LEAD });
  const total = first?.totalPages ?? 1;
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    pagina: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const page = parsePageParam((await params).pagina);
  return listingMetadata({
    title: `Blog — página ${page}`,
    description: `${BLOG_DESCRIPTION} Página ${page}.`,
    path: listingHref({ kind: "all" }, page),
  });
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const page = parsePageParam((await params).pagina);
  if (page === 1) permanentRedirect("/blog");
  if (!Number.isInteger(page) || page < 1) notFound();

  const [result, categories] = await Promise.all([
    getPosts({ page, lead: LEAD }),
    getCategories(),
  ]);
  if (!result) notFound();

  const path = listingHref({ kind: "all" }, page);
  const firstPosition = POSTS_PER_PAGE + LEAD + (page - 2) * POSTS_PER_PAGE + 1;
  const structuredData = {
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl(path),
        url: absoluteUrl(path),
        name: `Blog — página ${page}`,
        inLanguage: "pt-BR",
        isPartOf: { "@id": BLOG_ID },
        mainEntity: postItemList(result.posts, firstPosition),
      },
      breadcrumbList(scopeCrumbs({ kind: "all" }, page)),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <BlogContent
        posts={result.posts}
        categories={categories}
        currentPage={page}
        totalPages={result.totalPages}
        total={result.total}
      />
    </>
  );
}
