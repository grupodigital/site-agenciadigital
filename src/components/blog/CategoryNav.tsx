import Link from 'next/link';
import type { BlogCategory } from '@/lib/blog';

type Props = {
  categories: BlogCategory[];
  /** Slug of the category being shown; null on "Todos". */
  active: string | null;
};

const CHIP =
  'inline-flex h-11 items-center gap-2 px-4 text-sm transition-colors duration-300 sm:px-[18px]';

export default function CategoryNav({ categories, active }: Props) {
  return (
    <nav
      aria-label="Categorias do blog"
      className="border-b border-zinc-200 bg-white"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-2 px-4 py-3.5 sm:px-6 sm:py-5">
          <li>
            <Link
              href="/blog"
              aria-current={active === null ? 'page' : undefined}
              className={`${CHIP} ${
                active === null
                  ? 'bg-primary font-semibold text-white'
                  : 'bg-surface font-medium text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              Todos
            </Link>
          </li>
          {categories.map((category) => {
            const isActive = category.slug === active;
            return (
              <li key={category.id}>
                <Link
                  href={`/blog/categoria/${category.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`${CHIP} ${
                    isActive
                      ? 'bg-primary font-semibold text-white'
                      : 'bg-surface font-medium text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  {category.name}
                  <span className={isActive ? 'text-white/75' : 'text-zinc-600'}>
                    {category.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
