export const metadata = {
  title: "Consulta Psicológica Online | Reserva tu Cita ",
  description:
    "Agenda tu terapia psicológica en minutos. Psicólogos online disponibles para ti. Conecta desde donde estés. Tu primera sesión es gratuita.",
  authors: [{ name: "Contigo Voy" }],
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
};

export default function ReservaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
