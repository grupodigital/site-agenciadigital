import type { Metadata } from "next";
import AgenciaContent from "@/components/pages/AgenciaContent";
import { SITE } from "@/lib/site";

const title = "Agência";
const description =
  "Conheça a Digital Comunicação — agência de comunicação institucional com 22 anos de mercado e escritórios em Manaus, Palmas e Boa Vista.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/agencia" },
  openGraph: {
    title,
    description,
    url: "/agencia",
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
      name: "Agência",
      item: `${SITE.url}/agencia`,
    },
  ],
};

export default function AgenciaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgenciaContent />
    </>
  );
}
