import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Blog de Psicología Online – Bienestar y consejos | Contigo Voy",
    template: "%s | Blog Contigo Voy"
  },
  description:
    "Blog de psicología online con consejos para tu bienestar, manejo de emociones y desarrollo personal con Contigo Voy.",
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