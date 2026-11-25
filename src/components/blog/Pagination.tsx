import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { listingHref, type ListingScope } from '@/lib/blog';

/** Page numbers to show: first, last, and current ±1, with gaps as null. */
function pageWindow(current: number, total: number) {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | null)[] = [];
  pages.forEach((page, i) => {
    if (i > 0 && page - pages[i - 1] > 1) out.push(null);
    out.push(page);
  });
  return out;
}

const ITEM =
  'inline-flex h-11 min-w-11 items-center justify-center px-3 text-sm font-semibold transition-colors duration-300';

type Props = {
  scope: ListingScope;
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ scope, currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginação do blog"
      className="mt-14 flex flex-wrap items-center justify-center gap-2 sm:mt-20"
    >
      {currentPage > 1 && (
        <Link
          href={listingHref(scope, currentPage - 1)}
          aria-label="Página anterior"
          className={`${ITEM} gap-2 text-primary hover:bg-primary hover:text-white`}
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          <span className="hidden sm:inline">Anterior</span>
        </Link>
      )}

      {pageWindow(currentPage, totalPages).map((page, i) =>
        page === null ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-zinc-500">
            …
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className={`${ITEM} bg-primary text-white`}
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={listingHref(scope, page)}
            aria-label={`Página ${page}`}
            className={`${ITEM} bg-surface text-zinc-900 hover:bg-primary hover:text-white`}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={listingHref(scope, currentPage + 1)}
          aria-label="Próxima página"
          className={`${ITEM} gap-2 text-primary hover:bg-primary hover:text-white`}
        >
          <span className="hidden sm:inline">Próxima</span>
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
