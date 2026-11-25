import Form from 'next/form';
import { Search } from 'lucide-react';

export default function BlogSearch({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <Form action="/blog/busca" role="search" className="w-full">
      <label
        htmlFor="blog-busca"
        className="block text-[13px] font-medium text-white/80"
      >
        Buscar no blog
      </label>
      <div className="mt-2.5 flex h-[52px] items-center bg-white sm:h-14">
        <input
          id="blog-busca"
          type="search"
          name="q"
          required
          minLength={2}
          defaultValue={defaultValue}
          placeholder="Ex.: estratégia comercial"
          className="h-full min-w-0 flex-1 bg-transparent pl-4 text-base text-zinc-900 outline-none placeholder:text-zinc-500 sm:pl-5"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="flex h-full w-14 flex-none items-center justify-center text-primary transition-colors duration-300 hover:bg-secondary hover:text-zinc-900"
        >
          <Search size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </Form>
  );
}
