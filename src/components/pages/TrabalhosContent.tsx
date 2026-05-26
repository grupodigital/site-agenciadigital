'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import AnimatedText from '@/components/ui/AnimatedText';
import Button from '@/components/ui/Button';
import VideoStack from '@/components/ui/VideoStack';
import { TRABALHOS } from '@/lib/trabalhos';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

export default function TrabalhosContent() {
  return (
    <>
      <main className="flex-1">
        {/* ============================== HERO (imagem) ============================== */}
        <section
          data-hero
          className="relative aspect-[3/4] w-full overflow-hidden bg-primary sm:aspect-video"
        >
          <Image
            src="/bg-footer.jpeg"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/20"
          />

          <div className="absolute inset-0 z-[2] flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 md:pb-28">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
                className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 bg-secondary"
                />
                Portfólio
              </motion.p>

              <AnimatedText
                as="h1"
                delay={0.35}
                className="mt-6 block max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Projetos que comunicam com propósito.
              </AnimatedText>

              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: EASE_STD, delay: 0.95 }}
                className="mt-8 block h-px w-24 origin-left bg-secondary"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
                className="mt-8 max-w-xl text-base leading-[1.7] text-white/80 sm:text-lg"
              >
                Uma seleção de campanhas, identidades e iniciativas digitais
                desenvolvidas para o setor público e privado na região Norte.
              </motion.p>
            </div>
          </div>

          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.2 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] block h-px origin-left bg-secondary/70"
          />
        </section>

        {/* ============================== TRABALHOS (stacking + vídeo) ============================== */}
        <section
          id="trabalhos"
          className="relative z-10 bg-surface px-4 pt-20 pb-10 sm:px-6 sm:pt-28 sm:pb-12 md:pt-40 md:pb-16"
        >
          <div className="relative mx-auto mb-12 max-w-7xl sm:mb-20 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 bg-secondary"
                />
                Em movimento
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
              >
                Produções recentes para assistir agora
              </AnimatedText>

              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.8, ease: EASE_STD, delay: 0.55 }}
                className="mt-8 block h-px w-24 origin-left bg-secondary"
              />
            </motion.div>
          </div>

          <VideoStack items={TRABALHOS} />
        </section>

        {/* ============================== CTA ============================== */}
        <section
          id="cta"
          className="relative z-10 overflow-hidden bg-primary px-4 py-20 text-white sm:px-6 sm:py-24 md:py-32 lg:py-40"
        >
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 0.12, scale: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="pointer-events-none absolute -right-[3vw] top-[10%] z-[1] select-none font-semibold leading-none text-secondary"
            style={{ fontSize: 'clamp(120px, 28vw, 460px)' }}
          >
            →
          </motion.span>

          <div className="relative z-[2] mx-auto max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 bg-secondary"
              />
              Próximo projeto
            </motion.p>

            <AnimatedText
              as="h2"
              delay={0.15}
              className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
            >
              O próximo case pode ser o seu.
            </AnimatedText>

            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.8, ease: EASE_STD, delay: 0.55 }}
              className="mt-8 block h-px w-24 origin-left bg-secondary"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.45 }}
              className="mt-8 max-w-xl text-base leading-[1.8] text-white/70 sm:text-lg"
            >
              Conte sua história, seu desafio ou sua meta — vamos transformar
              isso em comunicação que move pessoas e gera resultado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 }}
              className="mt-12"
            >
              <Button href="/agencia" variant="secondary">
                Conheça a agência
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

