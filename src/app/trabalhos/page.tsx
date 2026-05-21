import type { Metadata } from "next";
import TrabalhosContent from "@/components/pages/TrabalhosContent";

const title = "Trabalhos";
const description =
  "Cases, projetos e trabalhos desenvolvidos pela Digital Comunicação.";

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

export default function TrabalhosPage() {
  return <TrabalhosContent />;
}
