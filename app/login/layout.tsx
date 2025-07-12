export const metadata = {
  title: "Tu Proceso, Siempre Contigo | Inicia Sesión Contigo Voy",
  description:
    "Ingresa con tu usuario para acceder a tus terapias online, horarios y seguimiento. Una plataforma segura creada para continuar tu proceso con Contigo Voy.",
  authors: [{ name: "Contigo Voy" }],
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
