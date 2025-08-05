import Clients from "../modules/clients";
import { SectionProps } from "../types";

function ClientesSection({ dateRange }: SectionProps) {
  return (
    <section className="space-y-4">
      <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Estadísticas de Clientes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Análisis detallado de la información de clientes
        </p>
      </header>
      <div className="mt-6">
        <Clients />
      </div>
    </section>
  );
}

export default ClientesSection;