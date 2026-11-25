'use client';

import { useArticleProgress } from './useArticleProgress';

export default function ReadingProgress({ articleId }: { articleId: string }) {
  const { progress } = useArticleProgress(articleId);
  const percent = Math.round(progress * 100);

  return (
    <div
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-1 bg-white/15"
    >
      <div
        className="h-full origin-left bg-secondary"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
