'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AnimatedText from '@/components/ui/AnimatedText';
import Button from '@/components/ui/Button';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

type Tone = 'primary' | 'secondary' | 'zinc' | 'cream';

const TONE_CLASSES: Record<Tone, { bg: string; text: string; kicker: string }> = {
  primary: {
    bg: 'bg-primary',
    text: 'text-white',
    kicker: 'text-secondary',
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-zinc-900',
    kicker: 'text-primary',
  },
  zinc: {
    bg: 'bg-zinc-900',
    text: 'text-white',
    kicker: 'text-secondary',
  },
  cream: {
    bg: 'bg-[#e9e6df]',
    text: 'text-zinc-900',
    kicker: 'text-primary',
  },
};

export default function TrabalhosContent() {
  const [openProjeto, setOpenProjeto] = useState<Projeto | null>(null);

  // Scroll lock + ESC to close while the video modal is open.
  useEffect(() => {
    if (!openProjeto) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenProjeto(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [openProjeto]);

  return (
    <>
      <main className="flex-1">
        {/* ============================== HERO (imagem) ============================== */}
        <section
          data-hero
          className="relative aspect-video w-full overflow-hidden bg-black"
        >
          <Image
            src="/bg-footer.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/35"
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
                  className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
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

        {/* ============================== FILTRO / CATEGORIAS ============================== */}
        <section
          aria-label="Categorias"
          className="relative z-10 border-b border-zinc-200 bg-white px-4 py-10 sm:px-6 md:py-12"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Filtrar
              </p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {CATEGORIAS.map((cat, i) => (
                  <li key={cat}>
                    <button
                      type="button"
                      className={`relative pb-1 font-medium transition-colors ${
                        i === 0
                          ? 'text-zinc-900'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                      aria-pressed={i === 0}
                    >
                      {cat}
                      {i === 0 && (
                        <motion.span
                          aria-hidden="true"
                          layoutId="filter-underline"
                          className="absolute inset-x-0 -bottom-px block h-px bg-secondary"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ============================== GRID DE PROJETOS ============================== */}
        <section
          id="projetos"
          className="relative z-10 overflow-hidden bg-white px-4 py-24 sm:px-6 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24">
              {PROJETOS.map((projeto, i) => {
                const tone = TONE_CLASSES[projeto.tone];
                // Slight vertical offset on every other card → magazine rhythm
                const offsetClass =
                  i % 2 === 1 ? 'md:mt-24' : i % 2 === 0 ? 'md:mt-0' : '';
                return (
                  <motion.article
                    key={projeto.titulo}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={IN_VIEW}
                    transition={{
                      duration: 0.8,
                      ease: EASE_OUT,
                      delay: (i % 2) * 0.1,
                    }}
                    className={`group ${offsetClass}`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenProjeto(projeto)}
                      className="block w-full text-left"
                      aria-label={`Assistir vídeo: ${projeto.titulo} — ${projeto.cliente}`}
                    >
                      <div
                        className={`relative aspect-[4/3] w-full overflow-hidden ${tone.bg}`}
                      >
                        {/* Logo do cliente como watermark — placeholder visual */}
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                          <Image
                            src={projeto.logo}
                            alt=""
                            width={400}
                            height={200}
                            className={`h-auto w-full max-w-[60%] opacity-25 transition duration-700 group-hover:scale-105 group-hover:opacity-40 ${
                              projeto.invertLogo ? 'invert brightness-0' : ''
                            }`}
                          />
                        </div>

                        {/* Diagonal sweep accent — yellow line drawn on hover */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-6 top-6 block h-px w-12 origin-left scale-x-0 bg-secondary transition-transform duration-500 ease-out group-hover:scale-x-100"
                        />

                        {/* Top-left tag */}
                        <p
                          className={`absolute left-6 top-12 text-[10px] font-semibold uppercase tracking-[0.28em] ${tone.kicker}`}
                        >
                          {projeto.categoria}
                        </p>

                        {/* Bottom-right index */}
                        <p
                          className={`absolute right-6 bottom-6 text-xs font-semibold uppercase tracking-[0.22em] ${tone.text} opacity-50`}
                        >
                          {String(i + 1).padStart(2, '0')}
                          <span className="mx-2 opacity-50">/</span>
                          {String(PROJETOS.length).padStart(2, '0')}
                        </p>

                        {/* Hover overlay — soft tint */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30"
                        />

                        {/* Play badge — centered, scales in on hover */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex h-16 w-16 scale-90 items-center justify-center rounded-full bg-white/95 text-zinc-900 opacity-0 shadow-2xl transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 md:h-20 md:w-20">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="translate-x-[1px]"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </div>

                      <div className="mt-6 flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                            {projeto.cliente}
                          </p>
                          <h3 className="mt-2 text-xl font-medium leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-primary sm:text-2xl md:text-3xl">
                            {projeto.titulo}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-zinc-600 md:text-base">
                            {projeto.resumo}
                          </p>
                        </div>

                        <span
                          aria-hidden="true"
                          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-300 text-zinc-700 transition-all duration-500 group-hover:border-secondary group-hover:bg-secondary group-hover:text-zinc-900"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="translate-x-[1px]"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  </motion.article>
                );
              })}
            </div>

            {/* Loadmore — visual only for mocked state */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="mt-24 flex flex-col items-center gap-4 border-t border-zinc-200 pt-16 text-center"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Mais projetos em breve
              </p>
              <p className="max-w-md text-sm text-zinc-600">
                Estamos preparando uma nova leva de cases para compartilhar.
                Volte em breve.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ============================== CTA ============================== */}
        <section
          id="cta"
          className="relative z-10 overflow-hidden bg-zinc-900 px-4 py-32 text-white sm:px-6 md:py-40"
        >
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 0.12, scale: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="pointer-events-none absolute -right-[3vw] top-[10%] z-[1] select-none font-semibold leading-none text-secondary"
            style={{ fontSize: 'clamp(180px, 28vw, 460px)' }}
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
                className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
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

      {/* ============================== VIDEO MODAL ============================== */}
      <AnimatePresence>
        {openProjeto && (
          <motion.div
            key="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            onClick={() => setOpenProjeto(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Vídeo: ${openProjeto.titulo}`}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md sm:px-6"
          >
            <motion.div
              key="video-panel"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              {/* Close button — top-right, outside the video frame on desktop */}
              <button
                type="button"
                onClick={() => setOpenProjeto(null)}
                aria-label="Fechar vídeo"
                className="absolute -top-12 right-0 z-10 inline-flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-secondary sm:-top-14"
              >
                <X size={24} strokeWidth={1.8} />
              </button>

              {/* Video frame */}
              <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl">
                <iframe
                  key={openProjeto.titulo}
                  src={`${openProjeto.videoUrl}?autoplay=1&dnt=1`}
                  title={openProjeto.titulo}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              {/* Project meta below the video */}
              <div className="mt-6 flex flex-col gap-3 text-white sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-secondary">
                    {openProjeto.categoria}
                  </p>
                  <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight sm:text-3xl md:text-4xl">
                    {openProjeto.titulo}
                  </h2>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-white/55">
                    {openProjeto.cliente}
                  </p>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-white/70">
                  {openProjeto.resumo}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const CATEGORIAS = [
  'Todos',
  'Campanha',
  'Branding',
  'Digital',
  'Audiovisual',
  'Institucional',
];

type Projeto = {
  cliente: string;
  titulo: string;
  resumo: string;
  categoria: string;
  logo: string;
  tone: Tone;
  invertLogo?: boolean;
  /** Vimeo player URL (without query string). Mocked with the agency reel for now. */
  videoUrl: string;
};

const MOCK_VIDEO = 'https://player.vimeo.com/video/1193740756';

const PROJETOS: readonly Projeto[] = [
  {
    cliente: 'Governo do Amazonas',
    titulo: 'Amazonas em movimento',
    resumo:
      'Campanha institucional sobre os principais avanços do estado em infraestrutura, saúde e educação.',
    categoria: 'Campanha · 2025',
    logo: '/clientes/logo-gov-horizontal-contraste.svg',
    tone: 'primary',
    videoUrl: MOCK_VIDEO,
  },
  {
    cliente: 'Prefeitura de Manaus',
    titulo: 'Manaus que faz',
    resumo:
      'Plataforma de comunicação para mostrar entregas da gestão municipal em tom direto e próximo do cidadão.',
    categoria: 'Institucional · 2025',
    logo: '/clientes/logo-pmm-nova.png',
    tone: 'zinc',
    videoUrl: MOCK_VIDEO,
  },
  {
    cliente: 'Governo do Tocantins',
    titulo: 'Tocantins +',
    resumo:
      'Conceito visual e campanha publicitária integrada para reforçar o posicionamento do estado.',
    categoria: 'Branding · 2024',
    logo: '/clientes/logo-governotocantins.svg',
    tone: 'cream',
    videoUrl: MOCK_VIDEO,
  },
  {
    cliente: 'Sebrae',
    titulo: 'Empreender no Norte',
    resumo:
      'Série de conteúdos digitais com micro e pequenos empreendedores da região amazônica.',
    categoria: 'Digital · 2024',
    logo: '/clientes/Logo-Sebrae.svg',
    tone: 'secondary',
    videoUrl: MOCK_VIDEO,
  },
  {
    cliente: 'Assembleia Legislativa do Tocantins',
    titulo: 'Vozes do plenário',
    resumo:
      'Filme institucional sobre o trabalho legislativo e seu impacto direto no cotidiano dos tocantinenses.',
    categoria: 'Audiovisual · 2024',
    logo: '/clientes/logo-assembleiatocantins.svg',
    tone: 'primary',
    invertLogo: true,
    videoUrl: MOCK_VIDEO,
  },
  {
    cliente: 'Beny',
    titulo: 'Reposicionamento de marca',
    resumo:
      'Atualização da identidade visual e da comunicação digital com foco em conexão com novos públicos.',
    categoria: 'Branding · 2023',
    logo: '/clientes/logo-beny.svg',
    tone: 'zinc',
    invertLogo: true,
    videoUrl: MOCK_VIDEO,
  },
];
