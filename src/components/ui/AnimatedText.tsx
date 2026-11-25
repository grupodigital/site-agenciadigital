'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { Fragment, useRef, type ElementType, type ReactNode, type Ref } from 'react';
import { usePathname } from 'next/navigation';
import { useInOverlay, useTransition } from '@/components/TransitionContext';

type Props = {
  children: string;
  /** HTML tag for the container (e.g. 'h2', 'p'). Default 'span'. */
  as?: ElementType;
  className?: string;
  /** Seconds before the first character begins animating. */
  delay?: number;
  /** Seconds between successive characters. */
  speed?: number;
  /**
   * Animate with CSS on first paint instead of waiting for hydration and an
   * in-view check. Defaults to true for `h1` — the page title is above the
   * fold and usually the LCP element, so it must not stay invisible until
   * the JS bundle loads.
   */
  eager?: boolean;
};

export default function AnimatedText({
  children,
  as: Tag = 'span',
  className,
  delay = 0,
  speed = 0.025,
  eager = Tag === 'h1',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  // Trigger a little inside the viewport so the animation kicks off as the
  // element is entering, not exactly at the edge. `once: true` so the
  // animation plays only on the first scroll-in and doesn't replay each
  // time the element leaves and re-enters the viewport.
  const isInView = useInView(ref, {
    margin: '-10% 0px -10% 0px',
    once: true,
  });
  const shouldReduceMotion = useReducedMotion();
  // If we're being rendered inside the rising PageTransition overlay, skip
  // the entry animation — the real {children} instance will play it once
  // the URL change settles, and we don't want the text to animate twice.
  const inOverlay = useInOverlay();
  // Landing on this page through the overlay transition: the overlay already
  // showed this title, so the real page renders it in place instead of
  // blinking it out and animating it again.
  const pathname = usePathname();
  const { arrivedVia } = useTransition();
  const alreadyShown = eager && arrivedVia === pathname;

  if (inOverlay || alreadyShown) {
    return (
      <Tag ref={ref as Ref<HTMLElement>} className={className}>
        {children}
      </Tag>
    );
  }

  // Same per-character effect, driven by a CSS keyframe (globals.css,
  // `.animate-char-in`) so it starts with the first paint — no JS needed.
  // Reduced motion is handled by the stylesheet's media query.
  if (eager) {
    return (
      <Tag ref={ref as Ref<HTMLElement>} aria-label={children} className={className}>
        {splitWords(children, (char, i) => (
          <span
            key={i}
            aria-hidden
            className="animate-char-in inline-block"
            style={{ animationDelay: `${delay + i * speed}s` }}
          >
            {char}
          </span>
        ))}
      </Tag>
    );
  }

  if (shouldReduceMotion) {
    return (
      <Tag ref={ref as Ref<HTMLElement>} className={className}>
        {children}
      </Tag>
    );
  }

  const last = children.length - 1;

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      aria-label={children}
      className={className}
    >
      {splitWords(children, (char, i) => (
        <motion.span
          key={i}
          aria-hidden
          // `opacity-0` keeps the SSR markup hidden so the text doesn't flash
          // visible before motion hydrates and applies its own opacity. Once
          // motion sets an inline style, it overrides the class.
          className="inline-block opacity-0"
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
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
      ))}
    </Tag>
  );
}

/**
 * Splits text into per-character nodes grouped by word. Each word is an
 * inline-block, nowrap wrapper so line breaks can only happen between words
 * (never inside one); words are separated by a real, breakable space. The
 * index passed to `renderChar` counts spaces too, so stagger timing follows
 * the full string.
 */
function splitWords(
  text: string,
  renderChar: (char: string, index: number) => ReactNode,
) {
  const words = text.split(' ');
  let charIndex = 0;
  return words.map((word, wi) => {
    const isLast = wi === words.length - 1;
    const wordEl = (
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((char) => renderChar(char, charIndex++))}
      </span>
    );
    if (!isLast) charIndex++;
    return (
      <Fragment key={wi}>
        {wordEl}
        {!isLast && ' '}
      </Fragment>
    );
  });
}
