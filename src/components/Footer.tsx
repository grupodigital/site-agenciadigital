'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { OFFICES, SITE } from '@/lib/site';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

// Single source of truth for addresses/phones: lib/site.ts (also used by
// the Organization JSON-LD and llms.txt).
const ESCRITORIOS = OFFICES.map((office) => ({
  cidade: `${office.cidade}, ${office.uf}`,
  endereco: office.endereco,
  telefone: office.telefone,
  tel: office.telefoneE164 ? `tel:${office.telefoneE164}` : null,
}));

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const footer = footerRef.current;
      const bg = bgRef.current;
      if (!footer || !bg) return;
      const rect = footer.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when footer hasn't entered the viewport, 1 when it's fully past
      const progress = Math.max(
        0,
        Math.min(1, (vh - rect.top) / (vh + rect.height)),
      );
      // Translate range — image moves slower than scroll for the parallax effect
      const translateY = (0.5 - progress) * 200;
      bg.style.transform = `translate3d(0, ${translateY}px, 0)`;
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-10 overflow-hidden bg-primary text-white"
    >
      {/* Parallax photo background */}
      {/* next/image (lazy, resized AVIF/WebP) instead of a CSS background,
          which the browser would download at full size on every page load. */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[800px] opacity-35 will-change-transform"
      >
        <Image
          src="/foto-bner.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
      </div>

      {/* Watermark marquee — "Digital Comunicação" passing slowly behind */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[42%] z-[1] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap text-[clamp(5rem,12vw,11rem)] font-semibold uppercase leading-none tracking-tight text-white opacity-[0.04]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>Digital Comunicação ·</span>
          ))}
        </div>
      </div>

      {/* Top content */}
      <div className="relative z-[3] mx-auto w-full max-w-7xl px-4 pt-16 pb-32 sm:px-6 sm:pt-20 sm:pb-40 md:pt-24 md:pb-48 lg:pb-64 xl:pb-72">
        {/* Address grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
          {ESCRITORIOS.map((escritorio, i) => (
            <motion.div
              key={escritorio.cidade}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.1 }}
            >
              <span aria-hidden="true" className="block h-px w-8 bg-secondary" />
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-white">
                {escritorio.cidade}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {escritorio.endereco}
              </p>
              {escritorio.telefone && escritorio.tel && (
                <a
                  href={escritorio.tel}
                  className="mt-2 inline-block text-sm text-white/80 transition-colors hover:text-secondary"
                >
                  {escritorio.telefone}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom signature: big logo half-clipped (kept as brand signature) */}
      <div className="relative w-full">
        <div
          aria-hidden="true"
          className="relative aspect-[1080/306] w-full"
          style={{
            backgroundImage: "url('/logo-ad.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
            opacity: 0.5,
            marginBottom: 'calc(-100vw * 306 / 1080 / 2.3)',
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-1 px-4 text-center text-xs text-white/80 sm:flex-row sm:justify-center sm:gap-20 sm:text-sm">
        {/* Year is computed at build and again on the client — they only
            differ across New Year until the next deploy. */}
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {SITE.name}.
        </p>
        <p>Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
