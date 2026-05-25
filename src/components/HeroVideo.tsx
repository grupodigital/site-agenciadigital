'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { preconnect, prefetchDNS } from 'react-dom';
import { useTransition } from './TransitionContext';

// Single persistent iframe instance mounted at the body root from first
// load and NEVER unmounted. The Vimeo player keeps running across every
// navigation — no reloads, no buffering, no gaps when entering or leaving
// home.
//
// Phase machine for visual position:
// - rising:  user just clicked Home → animate up from below in sync with
//            the PageTransition overlay's two-phase timing (y first, scale
//            with delay). z above overlay so it's visible during the rise.
// - home:    on /, no pending transition → anchored at top, visible.
// - leaving: on /, user clicked another route → stay visible at top while
//            the overlay rises and covers it from below. z below overlay
//            so it gets covered naturally.
// - hidden:  on a non-home route → opacity 0 (iframe stays mounted and
//            playing in the background, just not visible).
export default function HeroVideo() {
  const pathname = usePathname();
  const { target } = useTransition();

  // Warm DNS/TLS to Vimeo CDNs as early as possible.
  prefetchDNS('https://player.vimeo.com');
  preconnect('https://player.vimeo.com');
  preconnect('https://i.vimeocdn.com');
  preconnect('https://f.vimeocdn.com', { crossOrigin: 'anonymous' });

  let phase: 'rising' | 'home' | 'leaving' | 'hidden';
  if (target === '/') {
    phase = 'rising';
  } else if (pathname === '/') {
    phase = target === null ? 'home' : 'leaving';
  } else {
    phase = 'hidden';
  }

  // Only mount the iframe when the video is — or is about to be — visible.
  // On non-home initial loads we don't pay the cost of loading the Vimeo
  // player at all. On click-back-to-home, the iframe mounts together with
  // the rising animation. We lose the "never reload" guarantee in that one
  // case but save megabytes on every internal-route first paint.
  const shouldMountIframe = phase !== 'hidden';

  // Keyframe arrays force motion to actually animate THROUGH the values
  // (vs trying to be clever about "no change needed"). The rising phase
  // mirrors PageTransition's overlay exactly: y first, scale with a delay.
  const animateProps =
    phase === 'rising'
      ? { y: ['100%', '0%'], scale: [0.55, 1], opacity: 1 }
      : phase === 'home' || phase === 'leaving'
      ? { y: '0%', scale: 1, opacity: 1 }
      : { opacity: 0 };

  // z above overlay (z-40) during rising so the video shows during the
  // animation; below overlay otherwise so the overlay can cover it when
  // leaving home.
  const zIndex = phase === 'rising' ? 45 : 5;

  return (
    <motion.div
      aria-hidden={phase === 'hidden'}
      className="pointer-events-none fixed inset-x-0 top-0 aspect-video w-full overflow-hidden bg-primary"
      style={{ transformOrigin: '50% 100%', zIndex }}
      animate={animateProps}
      transition={
        phase === 'rising'
          ? {
              y: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
              scale: { duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2 },
            }
          : { duration: 0.3 }
      }
    >
      {shouldMountIframe && (
        <iframe
          src="https://player.vimeo.com/video/1193740756?background=1&autoplay=1&loop=1&muted=1&dnt=1"
          title="Vídeo de apresentação"
          allow="autoplay; fullscreen; picture-in-picture"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {/* Top gradient — helps Header readability in overlay mode */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"
      />

      {/* Bottom gradient — cinematic vignette into the section below */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
      />

      {/* Soft full-coverage tint — unifies the video tone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/10"
      />

      {/* Bottom-right: vertical agency label */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden items-center gap-3 [writing-mode:vertical-rl] rotate-180 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55 sm:bottom-10 sm:right-10 md:flex">
        Digital Comunicação
        <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-secondary" />
      </div>

      {/* Bottom hairline — closes the frame, draws on mount */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 block h-px origin-left bg-secondary/70"
      />
    </motion.div>
  );
}
