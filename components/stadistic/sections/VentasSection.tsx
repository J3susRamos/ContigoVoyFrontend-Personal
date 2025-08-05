import Sales from "../modules/sales";
import { SectionProps } from "../types";

function VentasSection({ dateRange }: SectionProps) {
  return (
    <section className="space-y-4">
      <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Reporte de Ventas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Análisis de ingresos y transacciones
        </p>
      </header>
      <div className="mt-6">
        <Sales />
      </div>
    </section>
  );
}

export default VentasSection;