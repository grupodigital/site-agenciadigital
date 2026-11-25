'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import Button from '@/components/ui/Button';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

export default function BlogCta() {
  return (
    <section className="relative z-10 bg-primary px-4 py-16 text-white sm:px-6 sm:py-24 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-secondary sm:text-xs"
          >
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-secondary" />
            Da leitura para a prática
          </motion.p>
          <AnimatedText
            as="h2"
            delay={0.15}
            className="mt-4 block text-[28px] font-medium leading-[1.15] tracking-tight sm:mt-6 sm:text-4xl md:text-5xl md:leading-[1.1]"
          >
            Quer aplicar essas ideias na comunicação da sua instituição?
          </AnimatedText>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={IN_VIEW}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
          className="flex-none"
        >
          <Button href="/agencia" variant="secondary">
            <span className="inline-flex items-center gap-2.5">
              Conheça a agência
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
