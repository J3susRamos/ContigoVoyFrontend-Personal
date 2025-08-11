'use client';
import AllPsicologos from "@/components/User/psicologos/AllPsicologos";
import PsicologoFilterSelect from "@/components/User/psicologos/filter/PsicologoFilterSelect";
import PsicologoHeader from "@/components/User/psicologos/header/PsicologoHeader";
import { usePsicologosData } from "@/components/User/psicologos/hooks/usePsicologosData";

export default function Psicologos() {
  const { data, error, loading, filterStatus, fetchData, handleFilterChange } = usePsicologosData();

  return (
    <section className="bg-[#f8f8ff] dark:bg-background min-h-screen">
      <PsicologoHeader />
      <div className="mx-5 flex justify-end items-center">
        <PsicologoFilterSelect filterStatus={filterStatus} onFilterChange={handleFilterChange} />
      </div>
      {error && (
        <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg mx-5">
          <h2>Error cargando psicologos</h2>
          <p>{error}</p>
        </div>
      )}
      <div className="mx-5">
        {loading ? (
          <div className="text-center py-8 text-primary dark:text-primary-foreground">Cargando...</div>
        ) : data?.result?.data && data.result.data.length > 0 ? (
          <AllPsicologos 
            Data={data.result.data} 
            filterStatus={filterStatus}
            refreshData={fetchData}
          />
        ) : (
          <div className="text-center py-8 text-primary dark:text-primary-foreground">
            <p>No se encontraron psicólogos {filterStatus === 'inactivos' ? 'inactivos' : 'activos'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
