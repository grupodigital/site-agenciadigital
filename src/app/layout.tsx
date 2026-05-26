import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import BottomMenu from "@/components/BottomMenu";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import PageTransition from "@/components/PageTransition";
import { TransitionProvider } from "@/components/TransitionContext";
import { OFFICES, SITE, SOCIAL_LINKS } from "@/lib/site";
import "./globals.css";

const googleSans = localFont({
  src: "../../public/font/GoogleSans.ttf",
  variable: "--font-google-sans",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    template: `%s | ${SITE.name}`,
    default: `${SITE.name} — ${SITE.tagline}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Agência Digital",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
};

// One root AdvertisingAgency entity with all the data Google likes for
// local rich results: full description, founding date, social profiles
// (sameAs), states served, all office addresses, and reachable contact
// points. The @id lets future schemas reference this one entity.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "AdvertisingAgency",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  logo: `${SITE.url}/logo-ad-azul.svg`,
  image: `${SITE.url}/opengraph-image`,
  description: SITE.description,
  email: SITE.email,
  foundingDate: SITE.foundingDate,
  sameAs: SOCIAL_LINKS.map((s) => s.href),
  areaServed: OFFICES.map((office) => ({
    "@type": "State",
    name: office.estado,
  })),
  address: OFFICES.map((office) => ({
    "@type": "PostalAddress",
    streetAddress: office.endereco,
    addressLocality: office.cidade,
    addressRegion: office.uf,
    addressCountry: "BR",
  })),
  contactPoint: OFFICES.filter((o) => o.telefoneE164).map((office) => ({
    "@type": "ContactPoint",
    telephone: office.telefoneE164,
    contactType: "customer service",
    areaServed: "BR",
    availableLanguage: ["Portuguese"],
  })),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE.url}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${googleSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TransitionProvider>
          <HeroVideo />
          <PageTransition>{children}</PageTransition>
          <Header />
          <Footer />
          <BottomMenu />
        </TransitionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </body>
    </html>
  );
}
