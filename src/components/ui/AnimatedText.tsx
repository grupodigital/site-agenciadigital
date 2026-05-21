'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { Fragment, useRef, type ElementType, type Ref } from 'react';
import { useInOverlay } from '@/components/TransitionContext';

type Props = {
  children: string;
  /** HTML tag for the container (e.g. 'h2', 'p'). Default 'span'. */
  as?: ElementType;
  className?: string;
  /** Seconds before the first character begins animating. */
  delay?: number;
  /** Seconds between successive characters. */
  speed?: number;
};

export default function AnimatedText({
  children,
  as: Tag = 'span',
  className,
  delay = 0,
  speed = 0.025,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  // Trigger a little inside the viewport so the animation kicks off as the
  // element is entering, not exactly at the edge.
  const isInView = useInView(ref, { margin: '-10% 0px -10% 0px' });
  const shouldReduceMotion = useReducedMotion();
  // If we're being rendered inside the rising PageTransition overlay, skip
  // the entry animation — the real {children} instance will play it once
  // the URL change settles, and we don't want the text to animate twice.
  const inOverlay = useInOverlay();

  if (shouldReduceMotion || inOverlay) {
    return (
      <Tag ref={ref as Ref<HTMLElement>} className={className}>
        {children}
      </Tag>
    );
  }

  // Split by word so line-breaks can only happen between words. Each word is
  // an inline-block wrapper with whitespace-nowrap, so its per-character
  // inline-block children can never create an intra-word break point.
  const words = children.split(' ');
  const total = children.length;
  const last = total - 1;
  let charIndex = 0;

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      aria-label={children}
      className={className}
    >
      {words.map((word, wi) => {
        const wordEl = (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const i = charIndex++;
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  initial={{ opacity: 0, x: -8 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }
                  }
                  transition={{
                    duration: 0.32,
                    ease: [0.4, 0, 0.2, 1],
                    // Entering: stagger left → right. Leaving: reverse so the
                    // rightmost char exits first.
                    delay: delay + (isInView ? i : last - i) * speed,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
        // Render a real space between words (a breakable text node), and bump
        // charIndex so the per-char stagger timing matches the full string.
        const isLast = wi === words.length - 1;
        if (!isLast) charIndex++;
        return (
          <Fragment key={wi}>
            {wordEl}
            {!isLast && ' '}
          </Fragment>
        );
      })}
    </Tag>
  );
}
