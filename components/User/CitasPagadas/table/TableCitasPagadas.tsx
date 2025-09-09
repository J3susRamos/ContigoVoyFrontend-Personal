"use client";

import React, { useState } from "react";
import DataTable from "@/components/ui/Table/DataTable";
import Row from "@/components/ui/Table/Row";
import DataCard from "@/components/ui/DataCard";
import { CitaSinPagar } from "@/interface";
import { formatCitaDate } from "../../Citas/citas";
import { useCitasPagadas } from "../hooks/useCitasPagadas";
import { CitaPagadaModal } from "../modal/CitaPagadaModal";

interface TableCitasProps {
  filteredCitas: CitaSinPagar[];
}

const HEADERS = ["Codigo", "Nombre", "Apellido", "Motivo", "Fecha", "Mas"];

export const TableCitasPagadas: React.FC<TableCitasProps> = ({
  filteredCitas,
}) => {
  const [selectedCita, setSelectedCita] = useState<CitaSinPagar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (cita: CitaSinPagar) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCita(null);
    setIsModalOpen(false);
  };

  const renderTableRow = (cita: CitaSinPagar) => (
    <Row
      values={[
        cita.paciente.idPaciente.toString(),
        cita.paciente.nombre,
        cita.paciente.apellido,
        cita.motivo_Consulta,
        cita.fecha_cita,
      ]}
      {...(cita.boucher && {
        onBoucher: () => {
          handleOpenModal(cita);
        },
      })}
    ></Row>
  );

  const renderCard = (cita: CitaSinPagar) => (
    <DataCard
      paciente={{
        nombre: `${cita.paciente.nombre} ${cita.paciente.apellido}`,
        codigo: cita.paciente.idPaciente.toString() || "",
      }}
      info={[
        { label: "Motivo", value: cita.motivo_Consulta },
        { label: "Fecha", value: formatCitaDate(cita.fecha_cita) },
        { label: "Hora", value: cita.hora_cita },
        { label: "Duración", value: cita.duracion.toString() + " minutos" },
      ]}
      {...(cita.boucher && {
        onBoucher: () => {
          handleOpenModal(cita);
        },
      })}
    ></DataCard>
  );

  return (
    <>
      <DataTable
        headers={HEADERS}
        data={filteredCitas}
        renderRow={renderTableRow}
        renderCard={renderCard}
      />

      <CitaPagadaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cita={selectedCita}
        imagen={selectedCita?.boucher?.imagen}
      />
    </>
  );
};
