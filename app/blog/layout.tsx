import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Blog | Centro Psicológico Contigo Voy",
    template: "%s | Blog Contigo Voy"
  },
  description:
    "En el Blog de Contigo Voy encontrarás inspiración para transformar tu vida. Desde como sanar emocionalmente hasta artículos que te harán vivir con conciencia.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: ["consejos", "bienestar", "salud mental", "psicología", "blog psicológico"],
  alternates: {
    canonical: "https://centropsicologicocontigovoy.com/blog/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'Centro Psicológico Contigo Voy',
    title: 'Blog | Centro Psicológico Contigo Voy',
    description: 'Artículos sobre psicología, bienestar y salud mental. Encuentra inspiración para transformar tu vida.',
    url: 'https://centropsicologicocontigovoy.com/blog/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@contigovoy',
    creator: '@contigovoy',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
