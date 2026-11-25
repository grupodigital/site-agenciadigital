'use client';

import { ChevronDown } from 'lucide-react';
import type { TocItem } from '@/lib/blog';
import { useArticleProgress } from './useArticleProgress';

type Props = {
  items: TocItem[];
  articleId: string;
  readingMinutes: number;
};

/** Desktop: sticky side list that highlights the section being read. */
export function PostTocAside({ items, articleId, readingMinutes }: Props) {
  const { progress, activeId } = useArticleProgress(
    articleId,
    items.map((item) => item.id),
  );
  const remaining = Math.ceil(readingMinutes * (1 - progress));

  return (
    <nav aria-label="Neste artigo">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
        Neste artigo
      </p>
      <ol className="mt-4 border-l border-zinc-200">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`-ml-px block border-l-2 py-2.5 pl-[18px] text-[15px] leading-[1.45] transition-colors duration-300 ${
                  isActive
                    ? 'border-secondary font-semibold text-primary'
                    : 'border-transparent text-zinc-600 hover:text-primary'
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-[13px] text-zinc-600">
        {remaining > 0 ? `Faltam cerca de ${remaining} min` : 'Leitura concluída'}
      </p>
    </nav>
  );
}

/** Mobile / tablet: collapsible list above the article. */
export function PostTocDetails({ items }: { items: TocItem[] }) {
  return (
    <details className="group border border-zinc-200">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
        Neste artigo · {items.length} {items.length === 1 ? 'seção' : 'seções'}
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <ol className="list-decimal space-y-2.5 pr-4 pb-4 pl-9 text-[15px] leading-[1.5] text-zinc-700 marker:text-zinc-500">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="hover:text-primary">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
