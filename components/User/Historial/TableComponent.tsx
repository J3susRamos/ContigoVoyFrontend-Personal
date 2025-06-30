"use client";

import React, {useEffect, useState} from "react";
import {ListaAtencion} from "@/interface";
import {DatePaciente} from "./DatePaciente";

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
    const [showCart, setShowCart] = useState(false);
    const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);
    const [, setSelectedCitaId] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className="relative max-h-[585px] overflow-auto rounded-lg pt-6 pl-8 pr-8 text-[#634AE2]">
            <table className="w-8/12 border-separate border-spacing-y-3">
                <thead className="sticky top-0 bg-[#6364F4] overflow-hidden">
                <tr>
                    {headerColumns.map((column, index) => (
                        <th
                            key={column.uid}
                            className={`text-[#fff] font-normal text-lg text-center p-4 ${
                                index === 0
                                    ? "rounded-tl-full"
                                    : index === headerColumns.length - 1
                                        ? "rounded-tr-full"
                                        : ""
                            }`}
                        >
                            {column.name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {atencion.length > 0 ? (
                    atencion.map((atencion, index) => (
                        <tr key={index} className="bg-[#fff] pt-8">
                            {headerColumns.map((column, index) => (
                                <td
                                    key={column.uid}
                                    className={`font-normal text-lg text-center p-6 ${
                                        index === 0 ? "rounded-l-3xl" : ""
                                    } ${
                                        index === headerColumns.length - 1 ? "rounded-r-3xl" : ""
                                    }`}
                                >
                                    {renderCellAction(atencion, column.uid)}
                                </td>
                            ))}
                            <td className="text-center bg-[#eaeded]">
                                <button
                                    className={`ml-2 h-10 w-32 rounded-full font-normal text-x1 ${
                                        !atencion.idPaciente
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#634AE2] text-[#fff] hover:bg-[#5340D2]"
                                    }`}
                                    onClick={() => {
                                        if (atencion.idPaciente) {
                                            setSelectedPacienteId(atencion.idPaciente);
                                            setSelectedCitaId(atencion.idCita);
                                            setShowCart(true);
                                        }
                                    }}
                                    disabled={!atencion.idPaciente}
                                >
                                    Ver más
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headerColumns.length} className="text-center p-4">
                            No se encontraron citas
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {showCart && selectedPacienteId && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-end pt-24 z-10 pr-28"
                    onClick={() => setShowCart(false)}
                >
                    <div
                        className="relative bg-white p-6 rounded-3xl z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DatePaciente
                            idPaciente={Number(selectedPacienteId)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
