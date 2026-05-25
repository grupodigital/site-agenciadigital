'use client';

import Image from "next/image";
import { motion } from "motion/react";
import Hero from "@/components/Hero";
import AnimatedText from "@/components/ui/AnimatedText";
import Button from "@/components/ui/Button";
import ParallaxBg from "@/components/ui/ParallaxBg";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

export default function HomeContent() {
  return (
    <>
      <main className="flex-1">
        <Hero />

        {/* ============================== SOBRE ============================== */}
        <section
          id="sobre"
          className="relative z-10 overflow-hidden bg-zinc-900 px-4 py-32 sm:px-6 md:py-40"
        >
          <ParallaxBg src="/about-bg232.jpeg" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />

          {/* Brand-stamp number — anchors the section visually and reinforces "22 anos" */}
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

          {/* Vertical accent rule on the left margin — yellow, draws on enter */}
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
                Sobre a agência
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
              >
                Há mais de 22 anos no mercado
              </AnimatedText>

              {/* Yellow draw-line below headline */}
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

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 }}
              >
                <Button href="/agencia" variant="secondary" className="mt-12">
                  Saiba mais
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
            </motion.div>
          </div>
        </section>

        {/* ============================== CLIENTES ============================== */}
        <section
          id="clientes"
          className="relative z-10 overflow-hidden bg-white px-4 py-32 sm:px-6 md:py-40"
        >
          <div className="relative z-[2] mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-secondary"
                />
                Quem confia na gente
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
              >
                Marcas que escolheram crescer conosco
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

          {/* Logo marquee — full-bleed, auto-scrolls, pauses on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={IN_VIEW}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.5 }}
            className="relative z-[2] mt-20 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          >
            <div className="group flex w-max animate-marquee items-center gap-20 hover:animate-marquee-paused sm:gap-24">
              {[...CLIENTES, ...CLIENTES].map((cliente, i) => (
                <div
                  key={`${cliente.nome}-${i}`}
                  className="flex w-30 shrink-0 items-center justify-center sm:w-48 md:w-40"
                  aria-hidden={i >= CLIENTES.length}
                >
                  <Image
                    src={cliente.logo}
                    alt={i < CLIENTES.length ? cliente.nome : ""}
                    width={300}
                    height={160}
                    className="h-auto w-full opacity-55 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ============================== SELOS ============================== */}
        <section
          id="selos"
          aria-label="Certificações e filiações"
          className="relative z-10 border-t border-zinc-200/70 bg-white px-4 py-16 sm:px-6 md:py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 md:gap-x-20"
          >
            {SELOS.map((selo) => (
              <div
                key={selo.nome}
                className="flex w-24 items-center justify-center sm:w-28 md:w-32"
              >
                <Image
                  src={selo.logo}
                  alt={selo.nome}
                  width={240}
                  height={120}
                  className="h-auto w-full opacity-55 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </motion.div>
        </section>
      </main>
    </>
  );
}

const CLIENTES = [
  {
    nome: "Governo do Amazonas",
    logo: "/clientes/logo-gov-horizontal-contraste.svg",
  },
  { nome: "Prefeitura de Manaus", logo: "/clientes/logo-pmm-nova.png" },
  { nome: "Governo do Tocantins", logo: "/clientes/logo-governotocantins.svg" },
  {
    nome: "Prefeitura de Palmas",
    logo: "/clientes/logo-prefeiturapalmas.svg",
  },
  {
    nome: "Assembleia Legislativa do Tocantins",
    logo: "/clientes/logo-assembleiatocantins.svg",
  },
  {
    nome: "Poder Judiciário do Tocantins",
    logo: "/clientes/logo-judiciariotocantins.svg",
  },
  { nome: "Sebrae", logo: "/clientes/Logo-Sebrae.svg" },
  { nome: "Beny", logo: "/clientes/logo-beny.svg" },
] as const;

const SELOS = [
  { nome: "ABAP", logo: "/selos/logo-abap.svg" },
  { nome: "ABRADi", logo: "/selos/logo-abradi.svg" },
  { nome: "CENP", logo: "/selos/logo-cenp.svg" },
  { nome: "Fenapro", logo: "/selos/logo-fenapro.svg" },
] as const;
