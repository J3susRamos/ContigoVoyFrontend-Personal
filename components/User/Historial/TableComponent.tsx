"use client";
import React, { useEffect, useState } from "react";
import { ListaAtencion } from "@/interface";
import CardsView from "./views/CardsView";
import EmptyState from "./views/EmptyView";
import PatientModal from "./modal/PatientModal";
import TableView from "./views/TableView";

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
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return (
      <div className="w-full min-h-[400px] bg-[#f6f7f7] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 w-48 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="bg-gray-300 h-4 w-full rounded"></div>
            <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
            <div className="bg-gray-300 h-4 w-4/6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[600px] bg-gradient-to-br from-[#f6f7f7] to-[#e8eaed] py-8 dark:bg-gradient-to-br dark:from-[#7f7fee]/30 dark:to-[#23234a]">
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