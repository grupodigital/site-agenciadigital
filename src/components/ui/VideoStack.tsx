'use client';

import { useState } from 'react';
import StackingCards, { StickyCard } from './StackingCards';
import YouTubeModal from './YouTubeModal';

export type VideoItem = {
  videoId: string;
  titulo: string;
};

type Props = {
  items: readonly VideoItem[];
};

// Reusable "stacking video cards" block: full-width cards with a YouTube
// thumbnail background, title and centered play button. Each card scales
// down a touch as later cards stack on top (handled by StickyCard), and
// clicking any card opens the shared YouTubeModal.
export default function VideoStack({ items }: Props) {
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);

  return (
    <>
      <StackingCards>
        {items.map((video, i) => (
          <StickyCard key={video.videoId} index={i}>
            <button
              type="button"
              onClick={() => setOpenVideoId(video.videoId)}
              aria-label={`Assistir ${video.titulo}`}
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
                className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl shadow-black/40 transition duration-300 group-hover:scale-110 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-0.5 h-5 w-5 sm:ml-1 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-8 md:p-12">
                <h3 className="text-lg font-medium leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                  {video.titulo}
                </h3>
              </div>
            </button>
          </StickyCard>
        ))}
      </StackingCards>

      <YouTubeModal
        videoId={openVideoId}
        onClose={() => setOpenVideoId(null)}
      />
    </>
  );
}
