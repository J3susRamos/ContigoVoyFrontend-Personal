export const metadata = {
  title: "Tu Proceso, Siempre Contigo | Inicia Sesión Contigo Voy",
  description:
    "Ingresa con tu usuario para acceder a tus terapias online, horarios y seguimiento. Una plataforma segura creada para continuar tu proceso con Contigo Voy.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: ["acceder a mi terapia"],
  alternates: {
    canonical: "https://www.centropsicologicocontigovoy.com/login/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
