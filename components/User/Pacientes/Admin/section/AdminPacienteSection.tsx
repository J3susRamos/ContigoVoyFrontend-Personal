"use client";
import AdminPacienteHeader from "@/components/User/Pacientes/Admin/header/AdminPacienteHeader";
import AdminPaciente from "@/components/User/Pacientes/Admin/AdminPaciente";
import { useAdminPacienteData } from "@/components/User/Pacientes/Admin/hooks/useAdminPacienteData";

// Componente separado para la lógica de ADMIN
function AdminPacienteSection() {
  const { data, error, loading, fetchData } = useAdminPacienteData();

  return (
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <AdminPacienteHeader />
      {error && (
        <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg mx-5">
          <h2>Error cargando pacientes deshabilitados</h2>
          <p>{error}</p>
        </div>
      )}
      <div className="mx-5">
        {loading ? (
          <div className="text-center py-8 text-primary dark:text-primary-foreground">
            Cargando...
          </div>
        ) : data && data.length > 0 ? (
          <AdminPaciente
            Data={data}
            refreshData={fetchData}
          />
        ) : (
          <div className="text-center py-8 text-primary dark:text-primary-foreground">
            <p>No hay pacientes deshabilitados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPacienteSection;