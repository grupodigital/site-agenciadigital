export const SITE = {
  name: "Digital Comunicação",
  shortName: "Digital",
  url: "https://agenciadigital.com.vc",
  locale: "pt_BR",
  description:
    "Agência de comunicação institucional há mais de 22 anos. Estratégia, criação e mídia para o setor público no Amazonas, Tocantins e Roraima.",
  tagline:
    "Comunicação institucional para o setor público na região Norte.",
  email: "contato@agenciadigital.com.vc",
  // Compliance: exibidos em /compliance. O formulário do Canal de Denúncia
  // também envia as manifestações para emailDenuncias.
  emailDenuncias: "denuncias@agenciadigital.com.vc",
  emailOuvidoria: "ouvidoria@agenciadigital.com.vc",
  // ISO year — used for Organization.foundingDate in JSON-LD. Update if the
  // real founding year is different.
  foundingDate: "2003",
  themeColor: "#143c68",
  keywords: [
    "agência de publicidade",
    "comunicação institucional",
    "publicidade setor público",
    "agência publicidade Manaus",
    "agência publicidade Palmas",
    "agência publicidade Boa Vista",
    "agência publicidade Amazonas",
    "agência publicidade Tocantins",
    "agência publicidade Roraima",
    "marketing público",
    "campanha institucional",
    "branding",
    "produção audiovisual",
  ],
} as const;

export const OFFICES = [
  {
    cidade: "Manaus",
    uf: "AM",
    estado: "Amazonas",
    endereco: "Rua Estrela Sirius, 9 — Aleixo",
    telefone: "(92) 99192-5298",
    telefoneE164: "+5592991925298",
  },
  {
    cidade: "Palmas",
    uf: "TO",
    estado: "Tocantins",
    endereco: "Quadra 106 Norte Alameda, Plano Diretor Norte",
    telefone: "(63) 99221-1001",
    telefoneE164: "+5563992211001",
  },
  {
    cidade: "Boa Vista",
    uf: "RR",
    estado: "Roraima",
    endereco: "Av. Ville Roy, 4301 — 308 — Canarinho",
    telefone: null,
    telefoneE164: null,
  },
] as const;

export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/digital.comunicacao/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/digital.comunicacao/",
  },
  {
    label: "LinkedIn",
    href: "https://br.linkedin.com/company/digitalcomunicacao",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCivXcRMub28XdiFwiRthTnw",
  },
] as const;

export const NAV_PAGES = [
  { href: "/", label: "Início", priority: 1.0, changeFrequency: "weekly" as const },
  { href: "/agencia", label: "Agência", priority: 0.8, changeFrequency: "monthly" as const },
  { href: "/trabalhos", label: "Trabalhos", priority: 0.9, changeFrequency: "monthly" as const },
  { href: "/compliance", label: "Compliance", priority: 0.3, changeFrequency: "yearly" as const },
];
