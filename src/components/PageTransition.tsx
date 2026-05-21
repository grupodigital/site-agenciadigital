'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ComponentType } from 'react';
import HomeContent from './pages/HomeContent';
import AgenciaContent from './pages/AgenciaContent';
import TrabalhosContent from './pages/TrabalhosContent';
import ComplianceContent from './pages/ComplianceContent';
import { OverlayProvider, useTransition } from './TransitionContext';

const PAGE_COMPONENTS: Record<string, ComponentType> = {
  '/': HomeContent,
  '/agencia': AgenciaContent,
  '/trabalhos': TrabalhosContent,
  '/compliance': ComplianceContent,
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Target route the user wants to navigate to. Set on link click,
  // cleared after the route catches up. While set, an overlay containing
  // the target route's content animates over the current page.
  // Stored in shared context so other components (e.g. HeroVideo) can react
  // to the upcoming route during the transition.
  const { target, setTarget } = useTransition();

  // Intercept clicks on internal links so we can run the cover animation
  // before the URL actually changes.
  //
  // We listen in the CAPTURE phase on the document so we fire BEFORE
  // Next.js' <Link> handler (which is attached at the React root, runs
  // during bubble). stopImmediatePropagation prevents Link's handler from
  // running at all — otherwise it would call router.push() immediately
  // and our overlay would be racing against an already-changed URL.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const link = (e.target as Element | null)?.closest?.('a');
      if (!link) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      let url: URL;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return;
      // Only intercept routes we know how to render in the overlay.
      if (!(url.pathname in PAGE_COMPONENTS)) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      setTarget(url.pathname);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  // When the actual URL catches up to the target, drop the overlay.
  useEffect(() => {
    if (target && pathname === target) {
      setTarget(null);
    }
  }, [pathname, target]);

  const TargetPage = target ? PAGE_COMPONENTS[target] : null;

  return (
    <>
      {children}

      <AnimatePresence>
        {target && TargetPage && (
          <motion.div
            key={target}
            initial={{ y: '100%', scale: 0.55 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              // Phase 1: block rises from below
              y: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
              // Phase 2: block expands from bottom-center to fill the viewport
              scale: { duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] },
              // Fade-out on exit (after the URL change, when the real route
              // is already rendered underneath the overlay).
              opacity: { duration: 0.2 },
            }}
            onAnimationComplete={(definition) => {
              // Fires when the full `animate` target finishes. At this point
              // the overlay fully covers the screen — safe to swap the URL.
              if (
                typeof definition === 'object' &&
                definition !== null &&
                'scale' in definition &&
                target
              ) {
                router.push(target);
              }
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'white',
              transformOrigin: '50% 100%',
              willChange: 'transform',
              // Below the header (z-50) so the nav bar stays visible during
              // the transition, but above all body content so the new page
              // truly covers the current one.
              zIndex: 40,
              overflowY: 'auto',
            }}
          >
            <OverlayProvider>
              <TargetPage />
            </OverlayProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
