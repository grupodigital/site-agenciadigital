'use client';

import { useEffect, useState } from 'react';
import { Check, Link2, MessageCircle } from 'lucide-react';

function LinkedInIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type Props = {
  url: string;
  title: string;
  /**
   * rail: vertical icon column beside the article (desktop).
   * hero: icon row on the blue header (mobile).
   * inline: labelled buttons at the end of the article.
   */
  variant: 'rail' | 'hero' | 'inline';
};

export default function ShareButtons({ url, title, variant }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt('Copie o link do artigo:', url);
    }
  };

  const links = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <LinkedInIcon size={variant === 'inline' ? 16 : 18} />,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <MessageCircle size={variant === 'inline' ? 16 : 20} strokeWidth={2} aria-hidden="true" />,
    },
  ];

  const copyIcon = copied ? (
    <Check size={variant === 'inline' ? 16 : 20} strokeWidth={2} aria-hidden="true" />
  ) : (
    <Link2 size={variant === 'inline' ? 16 : 20} strokeWidth={2} aria-hidden="true" />
  );

  const status = (
    <span role="status" className="sr-only">
      {copied ? 'Link copiado' : ''}
    </span>
  );

  if (variant === 'inline') {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
          Compartilhe
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-secondary hover:text-zinc-900 sm:px-5"
            >
              <span className="hidden sm:inline-flex">{link.icon}</span>
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-12 items-center justify-center gap-2 border border-primary bg-white px-4 text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary hover:text-white sm:px-5"
          >
            <span className="hidden sm:inline-flex">{copyIcon}</span>
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
        </div>
        {status}
      </div>
    );
  }

  const isRail = variant === 'rail';
  const buttonClass = isRail
    ? 'flex h-12 w-12 items-center justify-center bg-surface text-primary transition-colors duration-300 hover:bg-primary hover:text-white'
    : 'flex h-11 w-11 items-center justify-center bg-white/10 text-white transition-colors duration-300 hover:bg-secondary hover:text-zinc-900';

  return (
    <div className={isRail ? 'flex flex-col items-center gap-2.5' : 'flex gap-2'}>
      {isRail && (
        <p className="mb-1.5 rotate-180 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600 [writing-mode:vertical-rl]">
          Compartilhar
        </p>
      )}
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Compartilhar no ${link.label}`}
          className={buttonClass}
        >
          {link.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Link copiado' : 'Copiar link do artigo'}
        className={buttonClass}
      >
        {copyIcon}
      </button>
      {status}
    </div>
  );
}
