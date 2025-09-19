"use client";
import ListarPacientes from "@/components/User/Pacientes/ListarPacientes";
import HeaderUser from "@/components/User/HeaderUser";
import { NavbarPacientes } from "@/components/User/Pacientes/NavbarPacientesComponent";
import { FiltersInitialState, FiltersPaciente } from "@/interface";
import { useState } from "react";

// Componente separado para la lógica de PSICÓLOGO
function PsicoPacienteSection() {
  const [filterValue, setFilterValue] = useState("");
  const [filters, setFilters] = useState<FiltersPaciente>(FiltersInitialState);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const onSearchChange = (value?: string) => {
    setFilterValue(value || "");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202] transition-colors duration-300">

      <HeaderUser title="Lista de pacientes" />
      <NavbarPacientes
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        filters={filters}
        setFilters={setFilters}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />
      <section className={`${menuAbierto && 'opacity-50'}`}>
        <ListarPacientes filters={filters} filterValue={filterValue} />
      </section>
    </div>
  );
}

export default PsicoPacienteSection;