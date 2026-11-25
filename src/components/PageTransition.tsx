'use client';

import { AnimatePresence, MotionGlobalConfig, motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { createElement, useEffect, type ComponentType } from 'react';
import {
  OverlayProvider,
  TRANSITION_TIMING,
  useTransition,
} from './TransitionContext';

// Loaders for the overlay versions of the route pages. Kept as plain
// functions (not only wrapped in next/dynamic) so the chunks can be fetched
// ahead of time: on idle after the first load and on link intent. Without
// that, the chunk only started downloading on click and the panel rose empty
// for ~300 ms.
const PAGE_LOADERS: Record<string, () => Promise<{ default: ComponentType }>> = {
  '/': () => import('./pages/HomeContent'),
  '/agencia': () => import('./pages/AgenciaContent'),
  '/trabalhos': () => import('./pages/TrabalhosContent'),
  '/blog': () => import('./pages/BlogContent'),
  '/compliance': () => import('./pages/ComplianceContent'),
};

// Pages whose chunk has already loaded, rendered directly. Going through
// next/dynamic (React.lazy) would suspend once even for a loaded module, and
// React 19 holds a revealed Suspense boundary back for ~300 ms — the panel
// rose empty for that long.
const loadedPages = new Map<string, ComponentType>();

function loadPage(path: string) {
  return PAGE_LOADERS[path]().then((mod) => {
    loadedPages.set(path, mod.default);
    return mod;
  });
}

// Fallback for a click that beats the preload (very first interaction).
const PAGE_COMPONENTS: Record<string, ComponentType> = Object.fromEntries(
  Object.keys(PAGE_LOADERS).map((path) => [
    path,
    dynamic(() => loadPage(path), { ssr: false }),
  ]),
);

/**
 * Overlay content for `path`: the already-loaded page component when the
 * preload finished (rendered synchronously), else the lazy fallback. Both
 * references are module-level and stable per path.
 */
function OverlayPage({ path }: { path: string }) {
  return createElement(loadedPages.get(path) ?? PAGE_COMPONENTS[path]);
}

/** Safety net: never leave animations globally disabled. */
const SKIP_ANIMATIONS_MAX_MS = 3000;
let skipAnimationsTimer: ReturnType<typeof setTimeout> | undefined;

function setSkipAnimations(skip: boolean) {
  clearTimeout(skipAnimationsTimer);
  MotionGlobalConfig.skipAnimations = skip;
  if (skip) {
    skipAnimationsTimer = setTimeout(
      () => setSkipAnimations(false),
      SKIP_ANIMATIONS_MAX_MS,
    );
  }
}

/** The internal, transition-enabled pathname a link points to, if any. */
function transitionPath(link: HTMLAnchorElement | null) {
  if (!link) return null;
  if (link.target && link.target !== '_self') return null;
  if (link.hasAttribute('download')) return null;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) return null;
  try {
    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return null;
    return url.pathname in PAGE_LOADERS ? url.pathname : null;
  } catch {
    return null;
  }
}

function closestLink(target: EventTarget | null) {
  return (target as Element | null)?.closest?.('a') ?? null;
}

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
  const { target, setTarget, setArrivedVia } = useTransition();

  // Warm up every overlay page once the browser is idle after first load —
  // the chunks are small and it makes the first transition as smooth as the
  // rest.
  useEffect(() => {
    const preloadAll = () => {
      for (const path of Object.keys(PAGE_LOADERS)) void loadPage(path);
    };
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(preloadAll, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(preloadAll, 2000);
    return () => clearTimeout(timer);
  }, []);

  // On intent (hover, focus, touch), fetch the page chunk and the route's
  // data, so both are ready by the time the overlay finishes rising.
  useEffect(() => {
    const warmed = new Set<string>();
    const onIntent = (e: Event) => {
      const path = transitionPath(closestLink(e.target));
      if (!path || path === pathname || warmed.has(path)) return;
      warmed.add(path);
      void loadPage(path);
      router.prefetch(path);
    };
    const events = ['pointerover', 'focusin', 'touchstart'] as const;
    for (const type of events) {
      document.addEventListener(type, onIntent, { capture: true, passive: true });
    }
    return () => {
      for (const type of events) {
        document.removeEventListener(type, onIntent, { capture: true });
      }
    };
  }, [pathname, router]);

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
      const path = transitionPath(closestLink(e.target));
      if (!path || path === pathname) return;
      // Respect "reduce motion": let <Link> navigate normally, no overlay.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      if (!loadedPages.has(path)) void loadPage(path);
      router.prefetch(path);
      setTarget(path);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname, router, setTarget]);

  // When the actual URL catches up to the target, let the new route paint
  // underneath (two frames, so its mount effects have run), re-enable
  // animations and drop the overlay — which fades out over an identical
  // page.
  useEffect(() => {
    if (!target || pathname !== target) return;
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        setSkipAnimations(false);
        setTarget(null);
      });
    });
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [pathname, target, setTarget]);

  const swapToTarget = () => {
    if (!target) return;
    // The overlay already shows the destination fully drawn. Make the real
    // route mount in its final state too (entrance animations complete
    // instantly) so nothing blinks out and re-animates when the overlay goes.
    setSkipAnimations(true);
    setArrivedVia(target);
    router.push(target);
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {target && target in PAGE_LOADERS && (
          <motion.div
            key={target}
            initial={{ y: '100%', scale: 0.55 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              // Phase 1: block rises from below.
              // Phase 2: block expands from bottom-center to fill the viewport.
              ...TRANSITION_TIMING,
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
                'scale' in definition
              ) {
                swapToTarget();
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
              <OverlayPage path={target} />
            </OverlayProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
