"use client";

import React from "react";
import DataTable from "@/components/ui/Table/DataTable";
import Row from "@/components/ui/Table/Row";
import DataCard from "@/components/ui/DataCard";
import { CitaActionButtons } from "./CitaActionButtons";
import { canEditCita, formatCitaDate, formatCitaTime, shouldShowPacientButton } from "./citas";
import { Citas } from "@/interface";


interface TableCitasProps {
    filteredCitas: Citas[];
    onDeleteAction: (id: number) => void;
    onEditAction: (cita: Citas) => void;
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

export const TableCitas: React.FC<TableCitasProps> = ({
    filteredCitas,
    onDeleteAction,
    onEditAction,
}) => {
    const handleDelete = (cita: Citas) => {
        onDeleteAction(Number(cita.idCita));
    };

    const handleEdit = (cita: Citas) => {
        if (canEditCita(cita)) {
            onEditAction(cita);
        }
    };

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
            onDelete={() => handleDelete(cita)}
            onEdit={canEditCita(cita) ? () => handleEdit(cita) : undefined}
        >
            <CitaActionButtons
                idCita={cita.idCita}
                showPacientButton={shouldShowPacientButton(cita)}
            />
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
            onDelete={() => handleDelete(cita)}
            onEdit={() => handleEdit(cita)}
        >
            <CitaActionButtons
                idCita={cita.idCita}
                showPacientButton={shouldShowPacientButton(cita)}
            />
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