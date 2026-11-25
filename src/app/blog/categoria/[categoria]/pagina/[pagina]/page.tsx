import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogContent from "@/components/pages/BlogContent";
import {
  POSTS_PER_PAGE,
  getCategories,
  getCategoryBySlug,
  getPosts,
  listingHref,
  parsePageParam,
} from "@/lib/blog";
import {
  BLOG_ID,
  absoluteUrl,
  breadcrumbList,
  categoryDescription,
  jsonLd,
  listingMetadata,
  postItemList,
  scopeCrumbs,
} from "@/lib/blog-seo";

export const revalidate = 600;

type Params = { categoria: string; pagina: string };

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getCategories();
  return categories.flatMap((category) => {
    const pages = Math.ceil(category.count / POSTS_PER_PAGE);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({
      categoria: category.slug,
      pagina: String(i + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria, pagina } = await params;
  const category = await getCategoryBySlug(categoria);
  if (!category) return {};

  const page = parsePageParam(pagina);
  return listingMetadata({
    title: `${category.name} — Blog, página ${page}`,
    description: `${categoryDescription(category)} Página ${page}.`,
    path: listingHref(
      { kind: "category", slug: category.slug, name: category.name },
      page,
    ),
  });
}

export default async function BlogCategoryPaginatedPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria, pagina } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);
  if (!category) notFound();

  const page = parsePageParam(pagina);
  if (page === 1) permanentRedirect(`/blog/categoria/${category.slug}`);
  if (!Number.isInteger(page) || page < 1) notFound();

  const result = await getPosts({ page, categoryId: category.id });
  if (!result) notFound();

  const scope = { kind: "category" as const, slug: category.slug, name: category.name };
  const url = absoluteUrl(listingHref(scope, page));
  const structuredData = {
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: `${category.name} — Blog, página ${page}`,
        inLanguage: "pt-BR",
        isPartOf: { "@id": BLOG_ID },
        about: { "@type": "Thing", name: category.name },
        mainEntity: postItemList(result.posts, (page - 1) * POSTS_PER_PAGE + 1),
      },
      breadcrumbList(scopeCrumbs(scope, page)),
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
        scope={scope}
        currentPage={page}
        totalPages={result.totalPages}
        total={result.total}
      />
    </>
  );
}
