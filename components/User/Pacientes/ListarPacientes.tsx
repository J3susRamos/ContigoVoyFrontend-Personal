import React, { useState, useMemo } from "react";
import { Paciente } from "@/interface";

import { NavbarPacientes } from "@/components/User/Pacientes/NavbarPacientesComponent";
import TablePacientes from "./TablePacientes";
export interface FiltersPaciente {
  genero: string[];
  edad: string[];
  fechaUltimaCita: string[];
}

export const FiltersInitialState: FiltersPaciente = {
  genero: [],
  edad: [],
  fechaUltimaCita: [],
};

export default function ListarPacientes() {
  const [paciente, setPaciente] = useState<Paciente[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [filters, setFilters] = useState<FiltersPaciente>(FiltersInitialState);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const pacientesFiltrados = useMemo(() => {
    let result = [...paciente];

    if (filters.genero.length > 0) {
      result = result.filter((p) => filters.genero.includes(p.genero));
    }

    if (filters.edad.length > 0) {
      result = result.filter((p) =>
        filters.edad.some((rango) => {
          const [min, max] = rango.split(" - ").map(Number);
          return p.edad >= min && p.edad <= max;
        })
      );
    }

    if (filters.fechaUltimaCita.length === 2) {
      const [from, to] = filters.fechaUltimaCita;
      const fromDate = new Date(from + "T00:00:00");
      const toDate = new Date(to + "T23:59:59");

      result = result.filter((p) => {
        const fechaPaciente = new Date(p.ultima_cita_fecha);
        return fechaPaciente >= fromDate && fechaPaciente <= toDate;
      });
    }

    return result;
  }, [paciente, filters]);

  const pacientesFinales = useMemo(() => {
    if (!filterValue) return pacientesFiltrados;

    return pacientesFiltrados.filter((pac) =>
      `${pac.nombre} ${pac.DNI} ${pac.celular}`
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  }, [pacientesFiltrados, filterValue]);

  const onSearchChange = (value?: string) => {
    setFilterValue(value || "");
  };


  return (
    <>
      <NavbarPacientes
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        filters={filters}
        setFilters={setFilters}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />
      <TablePacientes
        filteredPacientes={pacientesFinales}
        setPaciente={setPaciente}
        className={`${menuAbierto && "opacity-50"}`}
      />
    </>
  );
}
