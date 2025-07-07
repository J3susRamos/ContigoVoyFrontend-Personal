"use client";

import React from "react";
import {Citas} from "@/interface";
import DataTable from "@/components/ui/Table/DataTable";
import {Icons} from "@/icons";
import Row from "@/components/ui/Table/Row";
import DataCard from "@/components/ui/DataCard";

interface TableProps {
    filteredCitas: Citas[];
    onDeleteAction: (id: number) => void;
    onEditAction: (cita: Citas) => void;
}

export const TableCitas: React.FC<TableProps> = ({
                                                     filteredCitas,
                                                     onDeleteAction,
                                                     onEditAction,
                                                 }) => {
    const headers = [
        "Paciente",
        "Código",
        "Motivo",
        "Estado",
        "Fecha de Inicio",
        "Duración",
        "Más",
    ];

    interface AtencionButtonProps {
        idCita: number;
    }

    const AtencionButton = ({ idCita }: AtencionButtonProps) => {
        const handleClick = () => {
            localStorage.setItem("idCita", String(idCita));
            window.location.href = "/user/historial/AtencionPaciente";
        };

        return (
            <button
                onClick={handleClick}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
            >
        <span
            className="text-lg text-[#3df356]"
            dangerouslySetInnerHTML={{ __html: Icons.hand }}
            style={{ width: "30px", height: "30px", fill: "#3df356" }}
        />
                <span className="text-xs text-[#3df356] mt-1">Atención</span>
            </button>
        );
    };

    return (
        <DataTable
            headers={headers}
            data={filteredCitas}
            renderRow={(c) => (
                <Row
                    values={[
                        c.paciente,
                        c.codigo,
                        c.motivo,
                        c.estado,
                        c.fecha_inicio,
                        c.duracion,
                    ]}
                    onDelete={() => onDeleteAction(Number(c.idCita))}
                    onEdit={() => onEditAction(c)}
                >
                    <AtencionButton idCita={Number(c.idCita)} />
                </Row>
            )}
            renderCard={(c) => (
                <DataCard
                    paciente={{ nombre: c.paciente, codigo: c.codigo }}
                    info={[
                        { label: "Estado", value: c.estado },
                        { label: "Motivo", value: c.motivo },
                        {
                            label: "Fecha",
                            value: new Date(c.fecha_inicio).toLocaleDateString(),
                        },
                        {
                            label: "Hora",
                            value: new Date(c.fecha_inicio).toLocaleTimeString(),
                        },
                        { label: "Duración", value: c.duracion },
                    ]}
                    onDelete={() => onDeleteAction(Number(c.idCita))}
                    onEdit={() => onEditAction(c)}
                >
                    <AtencionButton idCita={Number(c.idCita)} />
                </DataCard>
            )}
        />
    );
};