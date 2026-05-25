'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

const ESCRITORIOS = [
  {
    cidade: 'Manaus, AM',
    endereco: 'Rua Estrela Sirius, 9 — Aleixo',
    telefone: '(92) 99192-5298',
    tel: 'tel:+5592991925298',
  },
  {
    cidade: 'Palmas, TO',
    endereco: 'Quadra 106 Norte Alameda, Plano Diretor Norte',
    telefone: '(63) 99221-1001',
    tel: 'tel:+5563992211001',
  },
  {
    cidade: 'Boa Vista, RR',
    endereco: 'Av. Ville Roy, 4301 — 308 — Canarinho',
    telefone: null,
    tel: null,
  },
];

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
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[800px] bg-[url(/foto-bner.jpg)] bg-cover bg-center opacity-35 will-change-transform"
      />

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
      <div className="relative z-[3] mx-auto w-full max-w-7xl px-4 pt-20 pb-95 sm:px-6 md:pt-25 lg:pb-80 xl:pb-70">
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

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-20 text-center text-sm text-white/80">
        <p>@2026 Digital Comunicação.</p>
        <p>Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
