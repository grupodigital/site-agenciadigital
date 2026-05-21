import type { Metadata } from "next";
import AgenciaContent from "@/components/pages/AgenciaContent";

const title = "Agência";
const description =
  "Conheça a Digital Comunicação — agência digital especializada em estratégia, design e tecnologia.";

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

export default function AgenciaPage() {
  return <AgenciaContent />;
}
