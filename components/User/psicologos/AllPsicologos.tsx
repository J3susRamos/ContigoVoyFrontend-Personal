"use client";
import { PsicologoPreviewData } from "@/interface";
import React from "react";
import PsicologoTable from "./table/PsicologoTable";
import ModalEditarPsicologo from "./modal/ModalEditarPsicologo";
import ModalConfirmarEstado from "./modal/ModalConfirmarEstado";
import { useModalState } from "./hooks/useModalState";

export default function AllPsicologos({
  Data,
  filterStatus,
  refreshData,
}: {
  Data: PsicologoPreviewData[];
  filterStatus: 'activos' | 'inactivos';
  refreshData: () => void;
}) {
  const {
    isEditModalOpen,
    isEstadoModalOpen,
    selectedId,
    estadoId,
    openEditModal,
    closeEditModal,
    openEstadoModal,
    closeEstadoModal,
  } = useModalState();

  const llave = true ? filterStatus === 'inactivos' : false;

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full mt-4">
          <PsicologoTable
            data={Data}
            onEdit={openEditModal}
            onDisable={openEstadoModal}
            llave={llave}
          />
        </div>
      </div>

      <ModalEditarPsicologo
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        selectedId={selectedId}
        refreshData={refreshData}
      />

      <ModalConfirmarEstado
        isOpen={isEstadoModalOpen}
        onClose={closeEstadoModal}
        estadoId={estadoId}
        filterStatus={filterStatus}
        refreshData={refreshData}
      />
    </>
  );
}