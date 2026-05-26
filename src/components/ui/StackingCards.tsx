'use client';

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {
  Children,
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from 'react';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Total "shrink budget" and "peek budget" — divided across the stack so that
// pyramid depth and visible top strip stay constant regardless of how many
// cards the page has. With these caps, 5 cards and 12 cards look balanced.
const SHRINK_BUDGET = 0.16; // deepest card ends at ~84% scale
const PEEK_BUDGET_PX = 88; // total height of all peek strips above the top card
const MAX_STAGGER_PX = 22; // per-card stagger ceiling so 2–3 card stacks don't crowd

type StackContextValue = {
  progress: MotionValue<number>;
  total: number;
};

const StackContext = createContext<StackContextValue | null>(null);

type StackProps = {
  children: ReactNode;
  className?: string;
};

// Wrapper that hosts the sticky children and provides scroll room. The
// trailing spacer is critical: sticky elements are constrained by their
// containing block's CONTENT box (not padding box), so the last card needs
// real in-flow content after it to park against.
export default function StackingCards({ children, className = '' }: StackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const total = Children.count(children);

  return (
    <StackContext.Provider value={{ progress: scrollYProgress, total }}>
      <div ref={ref} className={`relative space-y-8 md:space-y-[15vh] ${className}`}>
        {children}
        <div aria-hidden="true" className="h-16 md:h-[15vh]" />
      </div>
    </StackContext.Provider>
  );
}

type CardProps = {
  index: number;
  className?: string;
  children: ReactNode;
};

export function StickyCard({ index, className = '', children }: CardProps) {
  const ctx = useContext(StackContext);
  if (!ctx) {
    throw new Error('StickyCard must be rendered inside StackingCards');
  }
  const { progress, total } = ctx;

  // Per-card stagger and shrink shrink with `total` so the total peek height
  // and pyramid depth stay constant regardless of stack length.
  const layers = Math.max(1, total - 1);
  const stagger = Math.min(MAX_STAGGER_PX, PEEK_BUDGET_PX / layers);
  const shrinkPerLayer = SHRINK_BUDGET / layers;

  // Each subsequent card that stacks on top of this one shrinks it,
  // simulating depth — the further "back" a card sits, the smaller it
  // reads. The result is a pyramid silhouette at the peek strips.
  const scale = useTransform(progress, (p) => {
    // Estimate the index of whichever card is currently on top, given
    // wrapper scroll progress. Cards stack roughly evenly across the
    // scroll range, so progress * total ≈ current top index.
    const currentTopFloat = p * total;
    const stackedAbove = Math.max(0, currentTopFloat - index);
    const clamped = Math.min(total - 1 - index, stackedAbove);
    return 1 - clamped * shrinkPerLayer;
  });

  return (
    <div
      className="sticky"
      style={{ top: `calc(96px + ${index * stagger}px)` }}
    >
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        style={{ scale, transformOrigin: 'center top' }}
        className={`mx-auto max-w-7xl ${className}`}
      >
        {children}
      </motion.article>
    </div>
  );
}
