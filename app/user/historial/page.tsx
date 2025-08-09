"use client";
import React, { useMemo, useCallback } from "react";
import { Navbar } from "@/components/User/Historial/header/SearchNavbar";
import { TableComponent } from "@/components/User/Historial/table/TableComponent";
import HeaderUser from "@/components/User/HeaderUser";
import { ListaAtencion } from "@/interface";
import { useHistorialPacientes } from "@/components/User/Historial/hooks/useHistorialPacientes";

const columns = [
  { name: "Código", uid: "codigo", sortable: true },
  { name: "Paciente", uid: "paciente", sortable: true },
  { name: "Fecha de Cita", uid: "fecha_inicio", sortable: true },
  { name: "Diagnóstico", uid: "diagnostico", sortable: true },
];

export default function App() {
  const {
    filterValue,
    atencion,
    visibleColumns,
    setVisibleColumns,
    isAuthorized,
    isLoading,
    onSearchChange,
    onClear,
    handleSortByDate,
    handleSortByName,
  } = useHistorialPacientes();

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // Renderizado de celda (lógica de presentación en el componente)
  const renderCell = useCallback((atencion: ListaAtencion, columnKey: React.Key) => {
    const cellValue = atencion[columnKey as keyof typeof atencion];

    switch (columnKey) {
      case "codigo":
        return atencion.codigo;
      case "paciente":
        return atencion.nombre_completo;
      case "diagnostico":
        return atencion.diagnostico;
      case "fecha_inicio":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {atencion.hora_inicio && (
              <p className="text-bold text-small capitalize">{atencion.hora_inicio}</p>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (isAuthorized === null || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Aquí puedes agregar un spinner o loading component */}
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <HeaderUser title="Historial de pacientes" />
      <Navbar
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        onClear={onClear}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columns={columns}
        onSortByDate={handleSortByDate}
        onSortByName={handleSortByName}
      />
      <section>
        <TableComponent
          atencion={atencion}
          headerColumns={headerColumns}
          renderCellAction={renderCell}
        />
      </section>
    </div>
  );
}