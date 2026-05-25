'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// Rendered at the layout root (outside PageTransition) so it sits in the
// document's root stacking context — keeping it above HeroVideo during the
// rising-to-home transition, which would otherwise cover the logo.
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center px-4 py-4 md:py-5 ${
          scrolled ? 'justify-start' : 'justify-center'
        }`}
      >
        <motion.div
          layout
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          <motion.div
            animate={{
              backgroundColor: scrolled
                ? 'rgba(20, 60, 104, 0.92)'
                : 'rgba(20, 60, 104, 0)',
              padding: scrolled ? 12 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="inline-block"
          >
            <Link
              href="/"
              aria-label="Digital Comunicação"
              className="relative block h-7 w-[99px] md:h-9 md:w-[127px]"
            >
              <Image
                src="/logo-ad.svg"
                alt=""
                aria-hidden="true"
                fill
                sizes="127px"
                preload
                className="object-contain"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
