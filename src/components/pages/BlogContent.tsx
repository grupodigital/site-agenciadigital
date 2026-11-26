'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import AnimatedText from '@/components/ui/AnimatedText';
import BlogCta from '@/components/blog/BlogCta';
import BlogSearch from '@/components/blog/BlogSearch';
import FeaturedPost from '@/components/blog/FeaturedPost';
import Pagination from '@/components/blog/Pagination';
import PostCard from '@/components/blog/PostCard';
import type { BlogCategory, BlogPostSummary, ListingScope } from '@/lib/blog';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;

type Props = {
  /** Undefined while rendered inside the route-transition overlay (no data yet). */
  posts?: BlogPostSummary[];
  /** Shown large above the grid (page 1 of the full listing only). */
  featured?: BlogPostSummary | null;
  categories?: BlogCategory[];
  scope?: ListingScope;
  currentPage?: number;
  totalPages?: number;
  total?: number;
};

function heading(scope: ListingScope, total: number | undefined) {
  switch (scope.kind) {
    case 'all':
      return {
        eyebrow: 'Blog',
        title: 'Ideias, bastidores e comunicação.',
        lead: 'Artigos sobre marketing, estratégia comercial e comunicação institucional, a partir do que vivemos na região Norte.',
        listTitle: 'Mais recentes',
      };
    case 'category':
      return {
        eyebrow: 'Blog · Categoria',
        title: scope.name,
        lead:
          total !== undefined
            ? `${total} ${total === 1 ? 'artigo' : 'artigos'} sobre ${scope.name.toLowerCase()}.`
            : '',
        listTitle: 'Todos os artigos',
      };
    case 'search':
      return {
        eyebrow: 'Blog · Busca',
        title: `Resultados para “${scope.query}”`,
        lead:
          total !== undefined
            ? `${total} ${total === 1 ? 'artigo encontrado' : 'artigos encontrados'}.`
            : '',
        listTitle: 'Resultados',
      };
  }
}

export default function BlogContent({
  posts,
  featured = null,
  categories,
  scope = { kind: 'all' },
  currentPage = 1,
  totalPages = 1,
  total,
}: Props) {
  const text = heading(scope, total);

  return (
    <main className="flex-1">
      {/* ============================== CABEÇALHO ============================== */}
      <section
        data-hero
        className="relative bg-primary px-4 pt-32 pb-10 text-white sm:px-6 sm:pt-40 sm:pb-16 md:pt-44 md:pb-20"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0 max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
              className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-secondary sm:text-xs"
            >
              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-secondary" />
              {text.eyebrow}
              {currentPage > 1 && (
                <span className="text-white/70">
                  · Página {currentPage} de {totalPages}
                </span>
              )}
            </motion.p>

            <AnimatedText
              key={text.title}
              as="h1"
              delay={0.25}
              className="mt-4 block text-4xl font-medium leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl md:text-6xl lg:text-[64px] lg:leading-[1.05]"
            >
              {text.title}
            </AnimatedText>

            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE_STD, delay: 0.7 }}
              className="mt-6 hidden h-px w-24 origin-left bg-secondary sm:mt-8 sm:block"
            />

            {text.lead && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 }}
                className="mt-4 max-w-xl text-base leading-[1.65] text-white/80 sm:mt-7 sm:text-lg sm:leading-[1.7]"
              >
                {text.lead}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.75 }}
            className="w-full lg:max-w-[420px] lg:flex-none"
          >
            <BlogSearch
              key={scope.kind === 'search' ? scope.query : ''}
              defaultValue={scope.kind === 'search' ? scope.query : ''}
            />
            {scope.kind === 'all' && total !== undefined && categories && (
              <p className="mt-3.5 hidden text-[13px] text-white/80 sm:block">
                {total} artigos · {categories.length} categorias
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============================== POSTS ============================== */}
      <div className="relative z-10 bg-white px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-28 md:pt-20 md:pb-32">
        <div className="mx-auto max-w-7xl">
          {posts === undefined ? (
            <PostGridSkeleton />
          ) : (
            <>
              {featured && (
                <section aria-label="Artigo em destaque" className="mb-12 sm:mb-24 md:mb-28">
                  <FeaturedPost post={featured} />
                </section>
              )}

              <section aria-labelledby="lista-titulo">
                <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-3.5 sm:pb-6">
                  <h2
                    id="lista-titulo"
                    className="text-xl font-medium tracking-tight text-zinc-900 sm:text-[32px]"
                  >
                    {text.listTitle}
                  </h2>
                  {totalPages > 1 && (
                    <p className="text-[13px] text-zinc-600 sm:text-sm">
                      Página {currentPage} de {totalPages}
                    </p>
                  )}
                </div>

                {posts.length === 0 ? (
                  <EmptyState scope={scope} />
                ) : (
                  <ul className="sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </ul>
                )}

                <Pagination
                  scope={scope}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </section>
            </>
          )}
        </div>
      </div>

      <BlogCta />
    </main>
  );
}

function EmptyState({ scope }: { scope: ListingScope }) {
  return (
    <div className="py-16 sm:py-24">
      <p className="text-xl font-medium text-zinc-900 sm:text-2xl">
        {scope.kind === 'search'
          ? `Nenhum artigo encontrado para “${scope.query}”.`
          : 'Nenhum artigo publicado ainda.'}
      </p>
      {scope.kind === 'search' && (
        <p className="mt-3 text-base text-zinc-600 sm:text-lg">
          Tente outra palavra ou{' '}
          <Link href="/blog" className="font-medium text-primary underline decoration-secondary decoration-2 underline-offset-4">
            veja todos os artigos
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function PostGridSkeleton() {
  return (
    <ul
      aria-hidden="true"
      className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="animate-pulse">
          <div className="aspect-[16/10] bg-zinc-200" />
          <div className="mt-6 h-3 w-40 bg-zinc-200" />
          <div className="mt-5 h-6 w-full bg-zinc-200" />
          <div className="mt-2 h-6 w-2/3 bg-zinc-200" />
          <div className="mt-5 h-4 w-full bg-zinc-200" />
          <div className="mt-2 h-4 w-5/6 bg-zinc-200" />
        </li>
      ))}
    </ul>
  );
}
