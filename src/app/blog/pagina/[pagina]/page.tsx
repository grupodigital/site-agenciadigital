import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogContent from "@/components/pages/BlogContent";
import {
  BLOG_FIRST_PAGE_SIZE,
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


export async function generateStaticParams(): Promise<Params[]> {
  const first = await getPosts({ firstPageSize: BLOG_FIRST_PAGE_SIZE });
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
    getPosts({ page, firstPageSize: BLOG_FIRST_PAGE_SIZE }),
    getCategories(),
  ]);
  if (!result) notFound();

  const path = listingHref({ kind: "all" }, page);
  const firstPosition = BLOG_FIRST_PAGE_SIZE + (page - 2) * POSTS_PER_PAGE + 1;
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
