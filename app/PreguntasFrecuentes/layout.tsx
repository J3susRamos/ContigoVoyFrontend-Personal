export const metadata = {
  title: "Preguntas Frecuentes | Terapia Psicológica - Contigo Voy",
  description:
    "¿Tienes dudas sobre nuestros servicios de atención psicológica en línea? En nuestra sección de preguntas frecuentes, resuelve tus inquietudes y se parte de nosotros.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: [
    "precios, como funciona la terapia",
    "duración tratamiento",
    "psicología accesible",
  ],
  alternates: {
    canonical: "https://centropsicologicocontigovoy.com/PreguntasFrecuentes",
  },
};

export default function PreguntasFrecuentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
