"use client";

import React from "react";
import DataTable from "@/components/ui/Table/DataTable";
import Row from "@/components/ui/Table/Row";
import DataCard from "@/components/ui/DataCard";
import { Citas } from "@/interface";
import { formatCitaDate, formatCitaTime } from "../../Citas/citas";


interface TableCitasProps {
  filteredCitas: Citas[];
}

const HEADERS = [
  "Paciente",
  "Código",
  "Motivo",
  "Estado",
  "Fecha de Inicio",
  "Duración",
  "Más",
];

export const TableCitasSinPagar: React.FC<TableCitasProps> = ({
  filteredCitas,
}) => {

  const renderTableRow = (cita: Citas) => (
    <Row
      values={[
        cita.paciente,
        cita.codigo || '',
        cita.motivo,
        cita.estado,
        cita.fecha_inicio,
        cita.duracion,
      ]}
    >
    </Row>
  );

  const renderCard = (cita: Citas) => (
    <DataCard
      paciente={{
        nombre: cita.paciente,
        codigo: cita.codigo || ''
      }}
      info={[
        { label: "Estado", value: cita.estado },
        { label: "Motivo", value: cita.motivo },
        { label: "Fecha", value: formatCitaDate(cita.fecha_inicio) },
        { label: "Hora", value: formatCitaTime(cita.fecha_inicio) },
        { label: "Duración", value: cita.duracion },
      ]}
    >
    </DataCard>
  );

  return (
    <DataTable
      headers={HEADERS}
      data={filteredCitas}
      renderRow={renderTableRow}
      renderCard={renderCard}
    />
  );
};