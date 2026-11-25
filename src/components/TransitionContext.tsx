'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

// Shared state for the page transition. PageTransition writes to `target`
// (the pathname the user just clicked but hasn't navigated to yet) and any
// other component can read it to react to the upcoming route — e.g. the
// HeroVideo fades in as soon as the user requests the home route, not only
// after the URL actually changes.
type TransitionContextValue = {
  target: string | null;
  setTarget: (next: string | null) => void;
  /**
   * Pathname most recently reached through the overlay transition. The page
   * the user lands on was already shown (fully drawn) in the overlay, so its
   * above-the-fold entrance animations must not replay — that's what made
   * the title blink out and re-animate after every transition.
   */
  arrivedVia: string | null;
  setArrivedVia: (path: string | null) => void;
};

const TransitionContext = createContext<TransitionContextValue>({
  target: null,
  setTarget: () => {},
  arrivedVia: null,
  setArrivedVia: () => {},
});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<string | null>(null);
  const [arrivedVia, setArrivedVia] = useState<string | null>(null);
  return (
    <TransitionContext.Provider
      value={{ target, setTarget, arrivedVia, setArrivedVia }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

/**
 * Timing of the overlay's rise (phase 1, `y`) and expansion (phase 2,
 * `scale`). Shared by PageTransition and HeroVideo, which rises in sync
 * when the destination is the home page.
 */
export const TRANSITION_TIMING = {
  y: { duration: 0.42, ease: [0.32, 0.72, 0, 1] },
  scale: { duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] },
} as const;

export function useTransition() {
  return useContext(TransitionContext);
}

// Marker context: PageTransition wraps the rising motion.div's children in
// this provider so descendants (the target page's Header, etc.) know they
// are the "rising" instance — and the static {children} version should hide
// itself during the transition to avoid two overlapping headers.
const OverlayContext = createContext(false);

export function OverlayProvider({ children }: { children: ReactNode }) {
  return (
    <OverlayContext.Provider value={true}>{children}</OverlayContext.Provider>
  );
}

export function useInOverlay() {
  return useContext(OverlayContext);
}
