"use client";
import React, { useState } from "react";
import { ListaAtencion } from "@/interface";
import CardsView from "../views/CardsView";
import EmptyState from "../views/EmptyView";
import PatientModal from "../modal/PatientModal";
import TableView from "../views/TableView";

interface TableProps {
  atencion: ListaAtencion[];
  headerColumns: { name: string; uid: string; sortable?: boolean }[];
  renderCellAction: (atencion: ListaAtencion, columnKey: keyof ListaAtencion | string) => React.ReactNode;
}

export const TableComponent: React.FC<TableProps> = ({
  atencion,
  headerColumns,
  renderCellAction,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);


  const handleVerMas = (item: ListaAtencion) => {
    if (item.idPaciente) {
      setSelectedPacienteId(item.idPaciente);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPacienteId(null);
  };


  return (
    <div className="w-full my-4">
      {atencion.length > 0 ? (
        <>
          {/* Vista de tabla para pantallas grandes (xl en adelante) */}
          <div className="hidden xl:block">
            <TableView
              atencion={atencion}
              headerColumns={headerColumns}
              renderCellAction={renderCellAction}
              onVerMas={handleVerMas}
            />
          </div>

          {/* Vista de cards para pantallas medianas y pequeñas */}
          <div className="block xl:hidden">
            <CardsView
              atencion={atencion}
              onVerMas={handleVerMas}
            />
          </div>
        </>
      ) : (
        <EmptyState />
      )}

      {/* Modal para detalles del paciente */}
      <PatientModal
        isOpen={showModal}
        onClose={handleCloseModal}
        pacienteId={selectedPacienteId || ""}
      />
    </div>
  );
};