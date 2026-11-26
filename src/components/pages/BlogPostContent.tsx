'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import AuthorMonogram from '@/components/blog/AuthorMonogram';
import BlogCta from '@/components/blog/BlogCta';
import PostCard from '@/components/blog/PostCard';
import { PostTocAside, PostTocDetails } from '@/components/blog/PostToc';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareButtons from '@/components/blog/ShareButtons';
import {
  coverOf,
  formatPostDate,
  listingHref,
  type BlogPost,
  type BlogPostSummary,
} from '@/lib/blog';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;
const ARTICLE_ID = 'artigo';

type Props = {
  post: BlogPost;
  related: BlogPostSummary[];
  /** Absolute URL of this post, for the share links. */
  url: string;
};

export default function BlogPostContent({ post, related, url }: Props) {
  const hasToc = post.toc.length >= 2;
  const cover = coverOf(post);

  return (
    <main className="flex-1">
      <ReadingProgress articleId={ARTICLE_ID} />

      {/* Título, imagem e texto formam um único <article> semântico. */}
      <article aria-labelledby="post-title">
        {/* ============================== CABEÇALHO ============================== */}
        <header
          data-hero
          className="relative bg-primary px-4 pt-28 pb-24 text-white sm:px-6 sm:pt-40 sm:pb-44 md:pt-44 md:pb-52"
        >
          <div className="mx-auto max-w-4xl">
            <motion.nav
              aria-label="Você está em"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
            >
              <ol className="flex flex-wrap items-center gap-2.5 text-sm text-white/80">
                <li className="hidden sm:block">
                  <Link href="/" className="hover:text-secondary">
                    Início
                  </Link>
                </li>
                <li aria-hidden="true" className="hidden sm:block">
                  /
                </li>
                <li>
                  <Link href="/blog" className="inline-flex min-h-11 items-center hover:text-secondary sm:min-h-0">
                    <span aria-hidden="true" className="mr-2 sm:hidden">←</span>
                    Blog
                  </Link>
                </li>
                {post.category && (
                  <>
                    <li aria-hidden="true" className="hidden sm:block">
                      /
                    </li>
                    <li className="hidden sm:block">
                      <Link
                        href={listingHref({ kind: 'category', slug: post.category.slug, name: post.category.name })}
                        className="text-white hover:text-secondary"
                      >
                        {post.category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </motion.nav>

            {post.category && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
                className="mt-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-secondary sm:mt-10 sm:text-xs"
              >
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-secondary" />
                {post.category.name}
              </motion.p>
            )}

            {/* Title is the LCP candidate: slide in, never start invisible. */}
            <motion.h1
              id="post-title"
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
              className="mt-3.5 text-[32px] font-medium leading-[1.12] tracking-tight sm:mt-5 sm:text-5xl md:text-[60px] md:leading-[1.06]"
            >
              {post.title}
            </motion.h1>

            {post.description && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.45 }}
                className="mt-6 hidden max-w-3xl text-xl leading-[1.6] text-white/80 sm:block"
              >
                {post.description}
              </motion.p>
            )}

            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE_STD, delay: 0.6 }}
              className="mt-8 hidden h-px w-24 origin-left bg-secondary sm:block"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.55 }}
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/80 sm:mt-8 sm:text-sm"
            >
              {post.author ? (
                <span className="inline-flex items-center gap-2.5">
                  <AuthorMonogram name={post.author.name} />
                  <span>
                    Por <span className="font-medium text-white">{post.author.name}</span>
                  </span>
                </span>
              ) : (
                <span className="font-medium text-white">Digital Comunicação</span>
              )}
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min de leitura</span>
            </motion.div>

            <div className="mt-5 lg:hidden">
              <ShareButtons url={url} title={post.title} variant="hero" />
            </div>
          </div>
        </header>

        {/* ============================== IMAGEM ============================== */}
        <div className="px-4 sm:px-6">
            {/* Likely the LCP element: slide in, but never start invisible. */}
            <motion.figure
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.4 }}
              className="relative z-10 mx-auto -mt-16 max-w-5xl shadow-[0_30px_60px_rgba(13,42,74,0.18)] ring-1 ring-white/15 sm:-mt-32 md:-mt-36"
            >
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                preload
                sizes="(min-width: 1072px) 1024px, 100vw"
                className="h-auto w-full"
              />
            </motion.figure>
        </div>

        {/* ============================== CORPO ============================== */}
        <div className="bg-white px-4 pt-8 sm:px-6 sm:pt-16 md:pt-20">
          <div className="mx-auto flex max-w-7xl items-start justify-center gap-14">
            <aside aria-label="Compartilhar" className="sticky top-28 hidden flex-none lg:block">
              <ShareButtons url={url} title={post.title} variant="rail" />
            </aside>

            <div className="min-w-0 max-w-[680px] flex-1">
              {hasToc && (
                <div className="mb-9 xl:hidden">
                  <PostTocDetails items={post.toc} />
                </div>
              )}

              <div
                id={ARTICLE_ID}
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <footer className="mt-14 border-t border-zinc-200 pt-8 sm:mt-18">
                {post.tags.length > 0 && (
                  <ul aria-label="Tags" className="mb-8 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={listingHref({ kind: 'search', query: tag })}
                          className="inline-flex h-9 items-center bg-surface px-3.5 text-sm text-zinc-900 transition-colors duration-300 hover:bg-zinc-200"
                        >
                          # {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <ShareButtons url={url} title={post.title} variant="inline" />

                <div className="mt-10 bg-surface p-6 sm:mt-12 sm:p-8">
                  {post.author && (
                    <div className="mb-6 flex items-start gap-4 border-b border-zinc-200 pb-6 sm:gap-5">
                      <AuthorMonogram name={post.author.name} size="lg" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          Escrito por
                        </p>
                        <p className="mt-1.5 text-xl font-medium text-zinc-900">
                          {post.author.name}
                        </p>
                        {post.author.bio && (
                          <p className="mt-2 text-base leading-[1.65] text-zinc-600">
                            {post.author.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <Image
                      src="/logo-ad-azul.svg"
                      alt="Digital Comunicação"
                      width={120}
                      height={34}
                      className="h-auto w-[96px] flex-none sm:mt-1 sm:w-[108px]"
                    />
                    <div>
                      {!post.author && (
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          Escrito por Digital Comunicação
                        </p>
                      )}
                      <p className="text-base leading-[1.65] text-zinc-600">
                        Agência de comunicação institucional com 22 anos de mercado e
                        escritórios em Manaus, Palmas e Boa Vista.
                      </p>
                      <Link
                        href="/agencia"
                        className="mt-1 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary"
                      >
                        Conheça a agência
                        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            {hasToc && (
              <aside className="sticky top-28 hidden w-72 flex-none xl:block">
                <PostTocAside
                  items={post.toc}
                  articleId={ARTICLE_ID}
                  readingMinutes={post.readingMinutes}
                />
              </aside>
            )}
          </div>
        </div>
      </article>

      {/* ============================== CONTINUE LENDO ============================== */}
      {related.length > 0 && (
        <section
          aria-labelledby="continue-lendo"
          className="bg-white px-4 pt-16 pb-20 sm:px-6 sm:pt-28 sm:pb-28 md:pt-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-3.5 sm:pb-6">
              <h2
                id="continue-lendo"
                className="text-xl font-medium tracking-tight text-zinc-900 sm:text-[32px]"
              >
                Continue lendo
              </h2>
              <Link
                href="/blog"
                className="hidden items-center gap-2 text-[15px] font-semibold text-primary sm:inline-flex"
              >
                Ver todos os artigos
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
            <ul className="sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <BlogCta />
    </main>
  );
}
