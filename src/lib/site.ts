export const SITE = {
  name: "Digital Comunicação",
  shortName: "Digital",
  url: "https://agenciadigital.com.vc",
  locale: "pt_BR",
  description:
    "Estratégia, design e tecnologia em um único lugar. Conheça a Digital Comunicação.",
  tagline: "Estratégia, design e tecnologia em um único lugar.",
  keywords: [
    "agência digital",
    "marketing digital",
    "design",
    "branding",
    "desenvolvimento web",
    "estratégia digital",
    "comunicação",
  ],
} as const;

export const NAV_PAGES = [
  { href: "/", label: "Home", priority: 1.0, changeFrequency: "weekly" as const },
  { href: "/agencia", label: "Agência", priority: 0.8, changeFrequency: "monthly" as const },
  { href: "/trabalhos", label: "Trabalhos", priority: 0.9, changeFrequency: "monthly" as const },
  { href: "/compliance", label: "Compliance", priority: 0.3, changeFrequency: "yearly" as const },
];
