"use client";
import AdminPacienteHeader from "@/components/User/Pacientes/Admin/header/AdminPacienteHeader";
import AdminPaciente from "@/components/User/Pacientes/Admin/AdminPaciente";
import { useAdminPacienteData } from "@/components/User/Pacientes/Admin/hooks/useAdminPacienteData";
import PacienteFilterSelect from "@/components/User/Pacientes/PacienteFilterSelect";

// Componente separado para la lógica de ADMIN
function AdminPacienteSection() {
  const { data, error, loading, filterStatus, fetchData, handleFilterChange } = useAdminPacienteData();

  return (
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <AdminPacienteHeader />
      
     {/* Selector de filtro con estilos de psicólogos */}
<div className="w-full h-16 bg-[#6364F4] dark:bg-primary flex items-center justify-between px-10 mx-5 mt-4">
  <div className="flex items-center">
    <h1 className="text-bold text-medium text-white dark:text-primary-foreground">
      Listado de Pacientes {filterStatus === 'deshabilitados' ? 'Deshabilitados' : 'Habilitados'}
    </h1>
  </div>
  <PacienteFilterSelect 
    filterStatus={filterStatus} 
    onFilterChange={handleFilterChange} 
  />
</div>
      
      {error && (
        <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg mx-5">
          <h2>Error cargando pacientes {filterStatus === 'deshabilitados' ? 'deshabilitados' : 'habilitados'}</h2>
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
            <p>No hay pacientes {filterStatus === 'deshabilitados' ? 'deshabilitados' : 'habilitados'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPacienteSection;