"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/User/Citas/NavbarCitas";
import HeaderUser from "@/components/User/HeaderUser";
import { GenericFilters } from "@/components/ui/EmptyTable";
import ListarCitas from "@/components/User/Citas/ListarCitas";


export interface FiltersCitas extends GenericFilters {
  genero: string[];
  estado: string[];
  edad: string[];
  fechaInicio: string[];
}

const FiltersInitialState: FiltersCitas = {
  genero: [],
  estado: [],
  edad: [],
  fechaInicio: [],
};

const columns = [
  { name: "Paciente", uid: "paciente", sortable: true },
  { name: "Código", uid: "codigo", sortable: true },
  { name: "Motivo", uid: "motivo", sortable: true },
  { name: "Estado", uid: "estado", sortable: true },
  { name: "Fecha de Inicio", uid: "fecha_inicio", sortable: true },
  { name: "Duración", uid: "duracion", sortable: true },
];

export default function App() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [filters, setFilters] = useState<FiltersCitas>(FiltersInitialState);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol !== "PSICOLOGO") {
      router.push("/unauthorized");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);


  if (isAuthorized === null) return null;
  return (
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <HeaderUser title="Lista de citas" />
      <Navbar
        filterValue={filterValue}
        filters={filters}
        setFilters={setFilters}
        onSearchChange={onSearchChange}
        columns={columns}
        onAddNew={() => {}}
        menuOpen={menuAbierto}
        setMenuOpen={setMenuAbierto}
      />
      <section className={`${menuAbierto && 'opacity-50'}`}>
        <ListarCitas filters={filters} filterValue={filterValue}/>
      </section>
      {/* {error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-destructive dark:text-destructive">
            {error}
          </div>
        </div>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <TableCitas
              filteredCitas={filteredItems}
              headerColumns={headerColumns}
              selectedKeys={selectedKeys}
              menuOpen={menuAbierto}
              setSelectedKeysAction={setSelectedKeys}
              onCitaDeleted={(idCita) => {
                setCitas((prevCitas) =>
                  prevCitas.filter(
                    (cita) => Number(cita.idCita) !== Number(idCita)
                  )
                );
              }}
            />
          ) : (
            <EmptyTable
              filters={
                !!filterValue ||
                Object.values(filters).some(
                  (filter) => filter && filter.length > 0
                )
              }
              messages={{
                emptyTitle: "No hay citas registradas",
                noResultsDescription:
                  "No hay citas que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.",
                emptyDescription:
                  "Aún no se han programado citas médicas en el sistema.",
              }}
            />
          )}
        </>
      )} */}
    </div>
  );
}
