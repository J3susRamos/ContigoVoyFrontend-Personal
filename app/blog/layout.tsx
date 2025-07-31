export const metadata = {
  title: "Blog | Centro Psicológico Contigo Voy",
  description:
    "En el Blog de Contigo Voy encontrarás inspiración para transformar tu vida. Desde como sanar emocionalmente hasta artículos que te harán vivir con conciencia.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: ["consejos","bienestar","salud mental"],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
