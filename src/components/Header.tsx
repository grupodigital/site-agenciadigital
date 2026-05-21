'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useInOverlay, useTransition } from './TransitionContext';

type Variant = 'overlay' | 'white';

// Rendered inside each page's Content so it lives inside the rising
// motion.div during the PageTransition — meaning the header physically
// rises and scales with the new page block, instead of being a static
// piece of chrome at the top of the layout.
//
// `overlay` (home): transparent over the video, switches to white once
// the user has scrolled past the hero area.
// `white` (other routes): always white, no scroll listener.
export default function Header({ variant = 'white' }: { variant?: Variant }) {
  const [pastHero, setPastHero] = useState(false);
  const inOverlay = useInOverlay();
  const { target } = useTransition();

  // If a transition is in flight and we are NOT the rising overlay's header,
  // hide ourselves — the rising target page's header is taking the spotlight.
  const hidden = target !== null && !inOverlay;

  useEffect(() => {
    if (variant !== 'overlay') {
      setPastHero(false);
      return;
    }
    setPastHero(false);

    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero]');
      const threshold = hero ? hero.offsetTop + hero.offsetHeight - 64 : 64;
      setPastHero(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [variant]);

  const light = variant === 'white' || pastHero;

  return (
    <header
      aria-hidden={hidden}
      className={`absolute inset-x-0 top-0 z-50 transition-colors duration-300 ${
        light ? 'bg-white text-zinc-900' : 'bg-transparent text-white'
      } ${hidden ? 'invisible' : ''}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 md:px-6 md:py-5">
        <Link
          href="/"
          aria-label="Digital Comunicação"
          className="relative block h-7 w-[99px] md:h-9 md:w-[127px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-ad.svg"
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              light ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-ad-azul.svg"
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              light ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </Link>
      </div>
    </header>
  );
}
