'use client';

import { useEffect, useState } from 'react';

/** Distance (px) from the top of the viewport at which a heading counts as "current". */
const ACTIVE_OFFSET = 140;

/**
 * Tracks how far the reader is through the element with `articleId` (0–1)
 * and which of `headingIds` they are currently reading.
 */
export function useArticleProgress(articleId: string, headingIds: string[] = []) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = headingIds.join('|');

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const article = document.getElementById(articleId);
      if (!article) return;

      // 0 when the article's top reaches the top of the viewport, 1 when its
      // bottom reaches the bottom of the viewport.
      const rect = article.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      setProgress(
        scrollable > 0
          ? Math.min(Math.max(-rect.top / scrollable, 0), 1)
          : rect.top < 0 ? 1 : 0,
      );

      let current: string | null = null;
      for (const id of ids) {
        const heading = document.getElementById(id);
        if (heading && heading.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      setActiveId(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [articleId, idsKey]);

  return { progress, activeId };
}
