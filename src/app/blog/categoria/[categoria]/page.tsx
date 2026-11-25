import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogContent from "@/components/pages/BlogContent";
import { getCategories, getCategoryBySlug, getPosts } from "@/lib/blog";
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

type Params = { categoria: string };

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getCategories();
  return categories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).categoria);
  if (!category) return {};

  return listingMetadata({
    title: `${category.name} — Blog`,
    description: categoryDescription(category),
    path: `/blog/categoria/${category.slug}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const categories = await getCategories();
  const slug = (await params).categoria;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const result = await getPosts({ categoryId: category.id });
  const scope = { kind: "category" as const, slug: category.slug, name: category.name };
  const url = absoluteUrl(`/blog/categoria/${category.slug}`);

  const structuredData = {
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: `${category.name} — Blog`,
        description: categoryDescription(category),
        inLanguage: "pt-BR",
        isPartOf: { "@id": BLOG_ID },
        about: { "@type": "Thing", name: category.name },
        mainEntity: postItemList(result?.posts ?? []),
      },
      breadcrumbList(scopeCrumbs(scope)),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <BlogContent
        posts={result?.posts ?? []}
        categories={categories}
        scope={scope}
        currentPage={1}
        totalPages={result?.totalPages ?? 1}
        total={result?.total ?? 0}
      />
    </>
  );
}
