'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import AnimatedText from '@/components/ui/AnimatedText';
import Button from '@/components/ui/Button';
import ParallaxBg from '@/components/ui/ParallaxBg';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

export default function AgenciaContent() {
  return (
    <>
      <Header variant="overlay" />
      <main className="flex-1">
        {/* ============================== HERO (imagem) ============================== */}
        <section
          data-hero
          className="relative aspect-video w-full overflow-hidden bg-black"
        >
          <Image
            src="/foto-bner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Top gradient — Header readability */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"
          />
          {/* Bottom cinematic vignette into the next section */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          />
          {/* Soft full-coverage tint — unifies tone with the video aesthetic */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/30"
          />

          {/* Hero copy — anchored to bottom-left like a cinematic title card */}
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
                A agência
              </motion.p>

              <AnimatedText
                as="h1"
                delay={0.35}
                className="mt-6 block max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Sua parceira em resultados reais.
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
                Comunicação pública com presença, estratégia e resultado.
              </motion.p>
            </div>
          </div>

          {/* Bottom hairline — closes the hero frame, draws on mount */}
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.2 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] block h-px origin-left bg-secondary/70"
          />
        </section>

        {/* ============================== SOBRE / 22 ANOS ============================== */}
        <section
          id="sobre"
          className="relative z-10 overflow-hidden bg-zinc-900 px-4 py-32 sm:px-6 md:py-40"
        >
          <ParallaxBg src="/about-bg232.jpeg" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />

          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 0.18, scale: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="pointer-events-none absolute -right-[3vw] top-[6%] z-[1] select-none font-semibold leading-none text-secondary"
            style={{ fontSize: 'clamp(220px, 32vw, 520px)' }}
          >
            22
          </motion.span>

          <motion.span
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={IN_VIEW}
            transition={{ duration: 1, ease: EASE_STD, delay: 0.2 }}
            className="pointer-events-none absolute left-4 top-32 z-[2] hidden h-24 w-px origin-top bg-secondary sm:left-6 md:block md:top-40"
          />

          <div className="relative z-[3] mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="max-w-2xl text-white"
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
                />
                Quem somos
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
              >
                Há mais de 22 anos no mercado.
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
                className="mt-8 text-base leading-[1.8] text-white/75 sm:text-lg"
              >
                A Digital Comunicação constrói uma presença sólida na região
                Norte, atuando de forma próxima e conectada à realidade do
                Amazonas, Tocantins e Roraima. Com experiência consolidada em
                atendimento publicitário para o setor público, a agência reúne
                conhecimento, estrutura e visão para desenvolver comunicação
                relevante, eficiente e alinhada às demandas institucionais.
              </motion.p>
            </motion.div>

            {/* Three KPI tiles — stitched into the sobre section */}
            <div className="mt-20 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
              {KPIS.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={IN_VIEW}
                  transition={{
                    duration: 0.7,
                    ease: EASE_OUT,
                    delay: 0.2 + i * 0.1,
                  }}
                  className="bg-zinc-900/60 px-6 py-10 backdrop-blur-sm md:px-10 md:py-12"
                >
                  <p className="text-5xl font-medium leading-none tracking-tight text-secondary md:text-6xl">
                    {kpi.value}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-white/80">
                    {kpi.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {kpi.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== MISSÃO / VISÃO / VALORES ============================== */}
        <section
          id="mvv"
          className="relative z-10 overflow-hidden bg-white px-4 py-32 sm:px-6 md:py-40"
        >
          <div className="relative z-[2] mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="max-w-3xl"
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
                />
                O que nos guia
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
              >
                Missão, visão e valores.
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

            <div className="mt-16 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-12">
              {MVV.map((item, i) => (
                <motion.article
                  key={item.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={IN_VIEW}
                  transition={{
                    duration: 0.7,
                    ease: EASE_OUT,
                    delay: 0.15 + i * 0.1,
                  }}
                  className="relative border-t border-zinc-200 pt-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-px left-0 block h-px w-16 bg-secondary"
                  />
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                    {String(i + 1).padStart(2, '0')} — {item.kicker}
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight text-zinc-900 md:text-3xl">
                    {item.titulo}
                  </h3>
                  {item.descricao && (
                    <p className="mt-5 text-base leading-[1.8] text-zinc-600">
                      {item.descricao}
                    </p>
                  )}
                  {item.lista && (
                    <ul className="mt-6 space-y-3">
                      {item.lista.map((v) => (
                        <li
                          key={v}
                          className="flex items-center gap-3 text-base text-zinc-800"
                        >
                          <span
                            aria-hidden="true"
                            className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
                          />
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== ATUAÇÃO REGIONAL ============================== */}
        <section
          id="atuacao"
          className="relative z-10 overflow-hidden bg-surface px-4 py-32 sm:px-6 md:py-40"
        >
          <div className="relative z-[2] mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="max-w-3xl"
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
                />
                Atuação
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
              >
                Presença na região Norte.
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
                className="mt-8 max-w-2xl text-base leading-[1.8] text-zinc-600 sm:text-lg"
              >
                Três escritórios estrategicamente posicionados para atender com
                proximidade e velocidade os desafios de comunicação institucional
                do Amazonas, Tocantins e Roraima.
              </motion.p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 gap-px bg-zinc-200 md:mt-20 md:grid-cols-3">
              {ESCRITORIOS.map((escritorio, i) => (
                <motion.div
                  key={escritorio.cidade}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={IN_VIEW}
                  transition={{
                    duration: 0.7,
                    ease: EASE_OUT,
                    delay: 0.15 + i * 0.1,
                  }}
                  className="bg-white px-6 py-10 md:px-10 md:py-12"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-secondary">
                    {escritorio.uf}
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight text-zinc-900 md:text-3xl">
                    {escritorio.cidade}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                    {escritorio.descricao}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== PRÊMIOS ============================== */}
        <section
          id="premios"
          className="relative z-10 overflow-hidden bg-zinc-900 px-4 py-32 text-white sm:px-6 md:py-40"
        >
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 0.08, scale: 1 }}
            viewport={IN_VIEW}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="pointer-events-none absolute -left-[2vw] bottom-[6%] z-[1] select-none font-semibold leading-none text-white"
            style={{ fontSize: 'clamp(180px, 26vw, 420px)' }}
          >
            ★
          </motion.span>

          <div className="relative z-[2] mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="max-w-3xl"
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
                />
                Reconhecimento
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
              >
                Prêmios que reforçam a entrega.
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
                className="mt-8 max-w-2xl text-base leading-[1.8] text-white/70 sm:text-lg"
              >
                Conquistas no Prêmio Amazonense de Propaganda e Marketing entre
                2015 e 2019, em categorias de TV, jornal, rádio e internet.
              </motion.p>
            </motion.div>

            <div className="mt-16 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 md:mt-20 md:grid-cols-5">
              {PREMIOS.map((premio, i) => (
                <motion.div
                  key={premio.ano}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={IN_VIEW}
                  transition={{
                    duration: 0.6,
                    ease: EASE_OUT,
                    delay: 0.1 + i * 0.06,
                  }}
                  className="bg-zinc-900 px-5 py-8 md:px-6 md:py-10"
                >
                  <p className="text-3xl font-medium leading-none tracking-tight text-secondary md:text-4xl">
                    {premio.ano}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                    {premio.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== CTA ============================== */}
        <section
          id="cta"
          className="relative z-10 overflow-hidden bg-white px-4 py-32 sm:px-6 md:py-40"
        >
          <div className="relative z-[2] mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
              />
              Vamos conversar
            </motion.p>

            <AnimatedText
              as="h2"
              delay={0.15}
              className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
            >
              Tem uma dúvida ou desafio?
            </AnimatedText>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.4 }}
              className="mx-auto mt-8 max-w-2xl text-base leading-[1.8] text-zinc-600 sm:text-lg"
            >
              Fale com a gente e entenda o que podemos fazer pela sua empresa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.55 }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button href="mailto:contato@agenciadigital.com.vc" variant="primary">
                Fale com a gente
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
              <a
                href="tel:+5592991925298"
                className="text-sm font-medium text-zinc-700 transition-colors hover:text-secondary"
              >
                ou ligue (92) 99192-5298
              </a>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

const KPIS = [
  {
    value: '+22',
    label: 'Anos de mercado',
    detail: 'Trajetória consolidada em comunicação institucional.',
  },
  {
    value: '3',
    label: 'Escritórios',
    detail: 'Manaus, Palmas e Boa Vista — perto de quem importa.',
  },
  {
    value: '+50',
    label: 'Marcas atendidas',
    detail: 'Setor público e privado, em campanhas de impacto.',
  },
];

type MvvItem = {
  kicker: string;
  titulo: string;
  descricao?: string;
  lista?: readonly string[];
};

const MVV: readonly MvvItem[] = [
  {
    kicker: 'Missão',
    titulo: 'Soluções que conectam.',
    descricao:
      'Oferecer soluções criativas e eficientes para nossos clientes, promovendo uma comunicação assertiva e de qualidade.',
  },
  {
    kicker: 'Visão',
    titulo: 'Referência em comunicação.',
    descricao:
      'Ser referência em comunicação publicitária, reconhecida pelo atendimento, parceria e excelentes resultados.',
  },
  {
    kicker: 'Valores',
    titulo: 'O que sustenta nossa entrega.',
    lista: ['Ética', 'Eficiência', 'Comprometimento', 'Respeito'],
  },
];

const ESCRITORIOS = [
  {
    uf: 'Amazonas',
    cidade: 'Manaus',
    descricao:
      'Sede histórica da agência, com atuação consolidada junto a órgãos estaduais e municipais do AM.',
  },
  {
    uf: 'Tocantins',
    cidade: 'Palmas',
    descricao:
      'Operação dedicada ao atendimento de instituições públicas e privadas no Tocantins.',
  },
  {
    uf: 'Roraima',
    cidade: 'Boa Vista',
    descricao:
      'Presença regional para atender com proximidade as demandas de comunicação no extremo Norte.',
  },
];

const PREMIOS = [
  { ano: '2015', label: 'Propaganda e Marketing' },
  { ano: '2016', label: 'Propaganda e Marketing' },
  { ano: '2017', label: 'Propaganda e Marketing' },
  { ano: '2018', label: 'Propaganda e Marketing' },
  { ano: '2019', label: 'Propaganda e Marketing' },
];
