'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

type Props = {
  /** Background image URL. */
  src: string;
  /** Maximum pixel offset per direction (up/down). Default 80. */
  offset?: number;
};

// Reusable parallax background. Drop it as the first child of a `relative`
// parent and place the actual content with `position: relative` (or a
// z-index above 0) on top. The bg image translates vertically based on the
// parent's scroll progress through the viewport — slower than the
// foreground, giving the classic parallax depth effect.
//
// The inner motion.div is taller than its container (`-inset-y-[100px]`)
// so the y translation (±offset px) never exposes a gap at top/bottom.
export default function ParallaxBg({ src, offset = 80 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{
          y,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="absolute inset-x-0 -inset-y-[100px]"
      />
    </div>
  );
}
