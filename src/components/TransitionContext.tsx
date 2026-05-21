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
};

const TransitionContext = createContext<TransitionContextValue>({
  target: null,
  setTarget: () => {},
});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<string | null>(null);
  return (
    <TransitionContext.Provider value={{ target, setTarget }}>
      {children}
    </TransitionContext.Provider>
  );
}

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
