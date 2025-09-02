"use client";

import React, { useState } from "react";
import DataTable from "@/components/ui/Table/DataTable";
import Row from "@/components/ui/Table/Row";
import DataCard from "@/components/ui/DataCard";
import { CitaSinPagar } from "@/interface";
import { formatCitaDate } from "../../Citas/citas";
import { CitaSinPagarModal } from "../modal/CitaSinPagarModal";
import { useCitasSinPagar } from "../hooks/useCitasSinPagar";

interface TableCitasProps {
  filteredCitas: CitaSinPagar[];
}

const HEADERS = ["Codigo", "Nombre", "Apellido", "Motivo", "Fecha", "Mas"];

export const TableCitasSinPagar: React.FC<TableCitasProps> = ({
  filteredCitas,
}) => {
  const [selectedCita, setSelectedCita] = useState<CitaSinPagar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { aceptarCita, rechazarCita } = useCitasSinPagar();

  const handleOpenModal = (cita: CitaSinPagar) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCita(null);
    setIsModalOpen(false);
  };

  const handleAceptarCita = async (
    codigo: string,
    idCita: string,
    comentario: string,
    numero: string,
  ) => {
    try {
      await aceptarCita(codigo, idCita, comentario, numero);
      // Opcional: Refrescar la lista de citas o actualizar el estado
      handleCloseModal();
    } catch (error) {
      // El error ya se maneja en el hook
      console.error("Error en handleAceptarCita:", error);
    }
  };

  const handleRechazarCita = async (
    idBoucher: number,
    comentario: string,
    numero: string,
  ) => {
    try {
      await rechazarCita(idBoucher, comentario, numero);
      // Opcional: Refrescar la lista de citas o actualizar el estado
      handleCloseModal();
    } catch (error) {
      // El error ya se maneja en el hook
      console.error("Error en handleRechazarCita:", error);
    }
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

      <CitaSinPagarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cita={selectedCita}
        imagen={selectedCita?.boucher?.imagen}
        onAceptar={handleAceptarCita}
        onRechazar={handleRechazarCita}
      />
    </>
  );
};
