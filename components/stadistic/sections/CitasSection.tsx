import Appointments from "../modules/appointments";
import { SectionProps } from "../types";

function CitasSection({ dateRange }: SectionProps) {
  return (
    <section className="space-y-4">
      <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Citas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Control y seguimiento de citas programadas
        </p>
      </header>
      <div className="mt-6">
        <Appointments />
      </div>
    </section>
  );
}

export default CitasSection;