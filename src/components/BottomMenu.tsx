'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Menu, X } from 'lucide-react';
import { useTransition } from './TransitionContext';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/agencia', label: 'Agência' },
  { href: '/trabalhos', label: 'Trabalhos' },
  { href: '/compliance', label: 'Compliance' },
];

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/digital.comunicacao/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/digital.comunicacao/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://br.linkedin.com/company/digitalcomunicacao',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/channel/UCivXcRMub28XdiFwiRthTnw',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// Smooth ease-out expo — matches the curve used elsewhere in the site
// (see PageTransition) so the menu feels native to the rest of the UI.
const EASE = [0.16, 1, 0.3, 1] as const;

const GLASS_CLASSES =
  'bg-primary/65 backdrop-blur-xl backdrop-saturate-150';

function isActiveLink(href: string, pathname: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function BottomMenu() {
  const pathname = usePathname();
  const { target } = useTransition();
  const [open, setOpen] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  const current =
    NAV_LINKS.find((link) => isActiveLink(link.href, pathname)) ?? NAV_LINKS[0];

  // Close as soon as the user requests a new route — PageTransition sets
  // `target` on link click, before the URL actually changes. Also covers the
  // case where pathname changes by other means (e.g. browser back).
  useEffect(() => {
    setOpen(false);
  }, [target, pathname]);

  // Detect when the user reaches the bottom of the page. While at the bottom,
  // the menu acts as a soft "peek": auto-opens with a scroll-to-top affordance
  // instead of the close X. Threshold is small so it fires only at the very end.
  useEffect(() => {
    const onScroll = () => {
      const threshold = 4;
      const reached =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold;
      setAtBottom(reached);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Mirror open ↔ atBottom: auto-open when reaching the bottom, auto-close on
  // leaving. Only triggers on changes — manual toggles aren't overridden.
  useEffect(() => {
    setOpen(atBottom);
  }, [atBottom]);

  // Scroll lock + Esc only for manual opens. While at the bottom we want the
  // user to be able to scroll up naturally (which will also close the menu).
  useEffect(() => {
    if (!open || atBottom) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, atBottom]);

  const toggle = () => setOpen((v) => !v);

  const handleClick = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setOpen(false);
    } else {
      toggle();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && !atBottom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[70] flex flex-col items-center px-4">
        {/* Menu panel — rises from below the bar when opening, slides back down on close. */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 24, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 24, scaleY: 0.96 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ transformOrigin: 'bottom center' }}
              className={`pointer-events-auto mb-3 flex w-full max-w-md flex-col items-center px-7 py-9 text-center text-white shadow-2xl md:px-10 md:py-12 ${GLASS_CLASSES}`}
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                Menu
              </p>

              <ul className="space-y-1">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = isActiveLink(href, pathname);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`inline-block text-3xl font-medium leading-[1.5] transition-[color,letter-spacing] duration-300 ease-out hover:tracking-wide hover:text-secondary ${
                          isActive ? 'text-secondary' : 'text-white/95'
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-8 flex items-center gap-5 md:mt-10 md:gap-6">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noreferrer"
                      className="block size-5 text-white/70 transition-[color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-secondary md:size-6"
                    >
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Morphing bar: full-width closed → small X square when open.
            Single click target for the whole open/close gesture. */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={
            atBottom
              ? 'Voltar ao topo'
              : open
                ? 'Fechar menu'
                : 'Abrir menu'
          }
          aria-expanded={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          className={`pointer-events-auto cursor-pointer overflow-hidden text-white shadow-2xl ${GLASS_CLASSES} ${
            open ? 'h-12 w-12' : 'h-12 w-full max-w-[230px] md:h-14'
          }`}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {open ? (
              <motion.div
                key={atBottom ? 'top' : 'x'}
                initial={{ opacity: 0 }}
                // Wait for the bar to finish shrinking before fading in — motion's
                // `layout` uses scale transforms that would otherwise stretch the
                // icon during the width transition.
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2, delay: 0.4, ease: EASE },
                }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE } }}
                className="flex h-full w-full gap-5 items-center justify-center"
              >
                {atBottom ? (
                  <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <X size={20} strokeWidth={2} aria-hidden="true" />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="closed"
                initial={{ opacity: 0 }}
                // Same idea on close — wait for the bar to widen back before
                // showing the label + hamburger so they don't get stretched.
                animate={{
                  opacity: 1,
                  transition: { duration: 0.25, delay: 0.35, ease: EASE },
                }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE } }}
                className="flex h-full items-center justify-between px-5 md:px-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white md:text-sm">
                  {current.label}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 items-center justify-center text-white"
                >
                  <Menu size={22} strokeWidth={2} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
