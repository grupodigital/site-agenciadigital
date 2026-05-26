export type Trabalho = {
  videoId: string;
  titulo: string;
  /**
   * ISO date used for the VideoObject JSON-LD `uploadDate` field. Recommended
   * by Google for video rich results — set it per video as you learn the
   * real publication dates. Falls back to a generic recent date when absent.
   */
  uploadDate?: string;
};

export const TRABALHOS: readonly Trabalho[] = [
  { videoId: "vxI5XLf7yvs", titulo: "Balanço — Saneamento Básico" },
  { videoId: "oNzX-nu3k4c", titulo: "Sebrae RR — Quem empreende faz história" },
  {
    videoId: "r9oWZpt7OLo",
    titulo: "PMM — Festival Folclórico 2025",
    uploadDate: "2025-06-15",
  },
  { videoId: "BmT9STgXWdI", titulo: "PMM — Bolsa Idiomas" },
  { videoId: "9mkuwF1W-Jo", titulo: "Passa Fácil" },
  {
    videoId: "OxizmVT53d0",
    titulo: "Governo do AM — Complexo Sul (depoimento)",
  },
  { videoId: "lturr12bHuw", titulo: "Governo do AM — Saúde Digital" },
  { videoId: "LCZwvsJzQMw", titulo: "Governo do AM — Recupera Fone" },
  { videoId: "Xfbxh05NIuA", titulo: "Feiras Municipais" },
  { videoId: "vVlrNcaG-Ag", titulo: "Palmas Tá Crescendo" },
  { videoId: "p9AWvZKfxJc", titulo: "Vídeo institucional" },
  { videoId: "h1eSsCVecSw", titulo: "Assembleia Legislativa do Tocantins" },
];

// First N items shown on the home page as recent highlights.
export const TRABALHOS_HIGHLIGHTS = TRABALHOS.slice(0, 5);

export const VIDEO_UPLOAD_DATE_FALLBACK = "2024-01-01T00:00:00-04:00";
