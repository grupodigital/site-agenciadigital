import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogContent from "@/components/pages/BlogContent";
import { getCategories, getPosts, parsePageParam } from "@/lib/blog";

type SearchParams = { q?: string | string[]; pagina?: string | string[] };

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const query = first((await searchParams).q);
  return {
    title: query ? `Busca: ${query} — Blog` : "Busca — Blog",
    // Result pages are endless variations of the same content.
    robots: { index: false, follow: true },
    // Don't inherit the home page's canonical from the root layout.
    alternates: { canonical: null },
  };
}

export default async function BlogSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = first(params.q).slice(0, 100);
  if (!query) redirect("/blog");

  const rawPage = first(params.pagina);
  const page = rawPage ? parsePageParam(rawPage) : 1;
  if (!Number.isInteger(page) || page < 1) notFound();

  const [result, categories] = await Promise.all([
    getPosts({ page, search: query }),
    getCategories(),
  ]);
  if (!result && page > 1) notFound();

  return (
    <BlogContent
      posts={result?.posts ?? []}
      categories={categories}
      scope={{ kind: "search", query }}
      currentPage={page}
      totalPages={result?.totalPages ?? 1}
      total={result?.total ?? 0}
    />
  );
}
