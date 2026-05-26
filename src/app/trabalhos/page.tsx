import type { Metadata } from "next";
import TrabalhosContent from "@/components/pages/TrabalhosContent";
import { SITE } from "@/lib/site";
import { TRABALHOS, VIDEO_UPLOAD_DATE_FALLBACK } from "@/lib/trabalhos";

const title = "Trabalhos";
const description =
  "Vídeos, campanhas e cases produzidos pela Digital Comunicação para o setor público no Amazonas, Tocantins e Roraima.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/trabalhos" },
  openGraph: {
    title,
    description,
    url: "/trabalhos",
  },
  twitter: { title, description },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Trabalhos",
      item: `${SITE.url}/trabalhos`,
    },
  ],
};

// One VideoObject per work. Google requires uploadDate; we fall back to a
// generic recent date when the per-video field isn't set — replace those
// fallbacks with real publication dates as you confirm them.
const videosLd = TRABALHOS.map((video) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.titulo,
  description: `${video.titulo} — produção Digital Comunicação.`,
  thumbnailUrl: [
    `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
  ],
  uploadDate: video.uploadDate ?? VIDEO_UPLOAD_DATE_FALLBACK,
  contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
  publisher: { "@id": `${SITE.url}/#organization` },
}));

export default function TrabalhosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {videosLd.map((video) => (
        <script
          key={video.contentUrl}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(video) }}
        />
      ))}
      <TrabalhosContent />
    </>
  );
}
