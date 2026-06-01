'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import YouTubeModal from './YouTubeModal';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type VideoItem = {
  videoId: string;
  titulo: string;
};

type Props = {
  items: readonly VideoItem[];
  /** Columns on large screens (md+). Mobile is always 1, tablet 2. Default 3. */
  columns?: 2 | 3;
};

const GRID_COLS: Record<NonNullable<Props['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
};

// Reusable video grid: rectangular cards laid out side by side so every
// production is visible at once — no scroll-through. Each card shows a
// YouTube thumbnail, title and centered play button; clicking any card
// opens the shared YouTubeModal.
export default function VideoStack({ items, columns = 3 }: Props) {
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);

  return (
    <>
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 ${GRID_COLS[columns]}`}
      >
        {items.map((video, i) => (
          <motion.button
            key={video.videoId}
            type="button"
            onClick={() => setOpenVideoId(video.videoId)}
            aria-label={`Assistir ${video.titulo}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: (i % columns) * 0.08 }}
            className="group relative block aspect-video w-full overflow-hidden bg-zinc-900"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg)`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"
            />

            {/* Play button — vertically centered on the card. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl shadow-black/40 transition duration-300 group-hover:scale-110 sm:h-16 sm:w-16"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 h-5 w-5 sm:ml-1 sm:h-7 sm:w-7"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
              <h3 className="text-base font-medium leading-tight text-white sm:text-lg">
                {video.titulo}
              </h3>
            </div>
          </motion.button>
        ))}
      </div>

      <YouTubeModal
        videoId={openVideoId}
        onClose={() => setOpenVideoId(null)}
      />
    </>
  );
}
