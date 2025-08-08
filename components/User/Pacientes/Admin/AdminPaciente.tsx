"use client";
import { PacienteDisabled } from "@/interface";
import React from "react";
import AdminPacienteTable from "./table/AdminPacienteTable";
import { useModalState } from "./hooks/useModalState";
import ModalConfirmarPacienteAdmin from "./modal/ModalConfirmarPacienteAdmin";

export default function AdminPaciente({
  Data,
  refreshData,
}: {
  Data: PacienteDisabled[];
  refreshData: () => void;
}) {
  const {
      isEstadoModalOpen,
      estadoId,
      openEstadoModal,
      closeEstadoModal,
    } = useModalState();

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full mt-4">
          <AdminPacienteTable data={Data} onDisable={openEstadoModal} />
        </div>
      </div>

      <ModalConfirmarPacienteAdmin
        isOpen={isEstadoModalOpen}
        onClose={closeEstadoModal}
        estadoId={estadoId}
        refreshData={refreshData}
      />
    </>
  );
}