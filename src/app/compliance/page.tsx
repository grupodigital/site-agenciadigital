import type { Metadata } from "next";
import ComplianceContent from "@/components/pages/ComplianceContent";

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

export default function CompliancePage() {
  return <ComplianceContent />;
}
