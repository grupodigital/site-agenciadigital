import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PostCover from './PostCover';
import { formatPostDate, type BlogPostSummary } from '@/lib/blog';

export default function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-14"
    >
      <PostCover
        post={post}
        preload
        sizes="(min-width: 1024px) 660px, 100vw"
        className="aspect-[16/10] w-full lg:w-[56%] lg:flex-none"
      />

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]">
          <span className="bg-secondary px-2.5 py-1.5 text-zinc-900">Destaque</span>
          {post.category && (
            <span className="text-primary">{post.category.name}</span>
          )}
        </p>

        <h2 className="mt-4 text-[26px] font-medium leading-[1.18] tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-primary sm:mt-6 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
          {post.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-[15px] leading-[1.65] text-zinc-600 sm:mt-5 sm:text-lg sm:leading-[1.7] lg:line-clamp-4">
          {post.excerpt}
        </p>

        <p className="mt-3 text-[13px] text-zinc-600 sm:mt-6 sm:text-sm">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {' · '}
          {post.readingMinutes} min de leitura
        </p>

        <span className="mt-8 hidden items-center gap-2.5 text-[15px] font-semibold text-primary sm:inline-flex">
          Ler artigo
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
