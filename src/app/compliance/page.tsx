import type { Metadata } from "next";
import ComplianceContent from "@/components/pages/ComplianceContent";
import { SITE } from "@/lib/site";

const title = "Compliance";
const description =
  "Programa de Integridade, Código de Ética e Canal de Denúncia da Digital Comunicação.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compliance" },
  openGraph: {
    title,
    description,
    url: "/compliance",
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
      name: "Compliance",
      item: `${SITE.url}/compliance`,
    },
  ],
};

export default function CompliancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ComplianceContent />
    </>
  );
}
