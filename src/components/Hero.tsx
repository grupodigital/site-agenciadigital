'use client';

import { motion } from 'motion/react';

// In-flow spacer reserving the visual hero area (aspect-video × full width)
// inside HomeContent. The actual iframe lives in <HeroVideo /> mounted
// persistently at the layout root — so the video is ALWAYS running, never
// reloads, regardless of how the user navigates between routes.
//
// The `data-hero` attribute is observed by the Header so it can switch
// from overlay to white once the user scrolls past the hero area.
export default function Hero() {
  return (
    <div
      data-hero
      className="relative aspect-video w-full bg-primary"
    >
      {/* Scroll hint anchored to the bottom of the visual hero. Lives in the
          in-flow spacer so it scrolls away naturally with the page. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 sm:bottom-12"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/70">
          Role para descobrir
        </span>
        <span className="relative block h-8 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 block h-2 bg-secondary"
            animate={{ y: ['-100%', '400%'] }}
            transition={{
              duration: 1.8,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
          />
        </span>
      </motion.div>
    </div>
  );
}
