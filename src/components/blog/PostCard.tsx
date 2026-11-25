import Link from 'next/link';
import PostCover from './PostCover';
import { formatPostDate, type BlogPostSummary } from '@/lib/blog';

/**
 * Responsive post card: a compact row with a thumbnail on phones, a full
 * card with cover, excerpt and meta from `sm` up.
 */
export default function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <li className="border-b border-zinc-200 sm:border-0">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-4 py-5 sm:flex-col sm:gap-0 sm:py-0"
      >
        <PostCover
          post={post}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 104px"
          className="h-[78px] w-[104px] flex-none sm:aspect-[16/10] sm:h-auto sm:w-full"
        />

        <div className="min-w-0">
          {post.category && (
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-primary sm:mt-6 sm:text-xs sm:tracking-[0.16em]">
              <span
                aria-hidden="true"
                className="hidden h-1.5 w-1.5 flex-none bg-secondary sm:inline-block"
              />
              <span className="truncate">{post.category.name}</span>
            </p>
          )}

          <h3 className="mt-1.5 text-base font-medium leading-snug text-zinc-900 transition-colors duration-300 group-hover:text-primary sm:mt-3.5 sm:text-[23px] sm:leading-[1.3]">
            {post.title}
          </h3>

          <p className="mt-3 hidden text-base leading-[1.65] text-zinc-600 sm:line-clamp-3">
            {post.excerpt}
          </p>

          <p className="mt-1.5 text-xs text-zinc-600 sm:mt-4 sm:text-[13px]">
            <time dateTime={post.date} className="sm:hidden">
              {formatPostDate(post.date, 'short')}
            </time>
            <time dateTime={post.date} className="hidden sm:inline">
              {formatPostDate(post.date)}
            </time>
            {' · '}
            {post.readingMinutes} min
            <span className="hidden sm:inline"> de leitura</span>
          </p>
        </div>
      </Link>
    </li>
  );
}
