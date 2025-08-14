import { Icons } from "@/icons";
import React, { useEffect, useState } from "react";
import {
    DatePacienteProps,
    UltimaAtencion,
} from "@/interface";
import { getUltimaAtencion } from "@/components/User/Pacientes/getUltimaAtencionData";
import { HistorialPaciente } from "./HistorialPaciente";

export const DatePaciente: React.FC<DatePacienteProps> = ({ idPaciente }) => {
    const [showCart, setShowCart] = useState(false);
    const [ultimaAtencion, setUltimaAtencion] = useState<UltimaAtencion | null>(null);
    const HandleGetUltimaAtencion = async (idPaciente: number) => {
        const result = await getUltimaAtencion(idPaciente);
        if (result.success) {
            setUltimaAtencion(result.data);
        }
    };

    useEffect(() => {
        HandleGetUltimaAtencion(idPaciente).catch(error => {
            console.error("Error fetching última atención:", error);
        });
    }, [idPaciente]);

    return (
        <div className="w-full p-4 md:p-6">
            <div className="bg-white text-[#634AE2] rounded-3xl shadow-lg overflow-hidden">
                {/* Sección Superior */}
                <div className="flex flex-col md:flex-row p-6">
                    {/* Información del Paciente */}
                    <div className="w-full md:w-[60%] pr-0 md:pr-4 mb-6 md:mb-0">
                        <div className="flex flex-col md:flex-row md:items-end gap-2">
                            <h1 className="font-bold text-2xl md:text-3xl">
                                {ultimaAtencion?.nombre} {ultimaAtencion?.apellido}
                            </h1>
                            <span className="font-bold text-xl text-[#634AE2]/80">
                                ({ultimaAtencion?.edad} años)
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center">
                                <span className="font-bold w-20">DNI</span>
                                <span className="ml-4">{ultimaAtencion?.DNI}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold w-20">Celular</span>
                                <span className="ml-4">{ultimaAtencion?.celular}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold w-20">Código</span>
                                <span className="ml-4">{ultimaAtencion?.codigo}</span>
                            </div>
                        </div>
                    </div>

                    {/* Panel Derecho */}
                    <div className="w-full md:w-[40%] flex flex-col space-y-4">
                        <div className="bg-[#634AE2] rounded-2xl text-white p-4 text-center shadow-md">
                            <div className="text-3xl md:text-4xl font-medium">
                                {ultimaAtencion ? ultimaAtencion.fecha_atencion : "--/--"}
                            </div>
                            <div className="text-sm md:text-base opacity-90">última atención</div>
                        </div>

                        <button
                            onClick={() => setShowCart(true)}
                            className="border-2 border-[#634AE2] rounded-full py-2 px-4 text-[#634AE2] font-medium hover:bg-[#634AE2] hover:text-white transition-colors duration-200 text-center"
                        >
                            Ver historial clínico
                        </button>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-[#9494F3] mx-6"></div>

                {/* Detalles de Atención */}
                <div className="p-6">
                    <h2 className="font-bold text-2xl md:text-3xl text-center mb-6">
                        Última Atención
                    </h2>

                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row">
                            <span className="font-bold w-full md:w-40 flex-shrink-0">Diagnóstico</span>
                            <span className="mt-1 md:mt-0">{ultimaAtencion?.diagnostico || "No especificado"}</span>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            <span className="font-bold w-full md:w-40 flex-shrink-0">Observación</span>
                            <span className="mt-1 md:mt-0">{ultimaAtencion?.observacion || "No hay observaciones"}</span>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            <span className="font-bold w-full md:w-40 flex-shrink-0">Últimos objetivos</span>
                            <span className="mt-1 md:mt-0">{ultimaAtencion?.ultimosObjetivos || "No especificados"}</span>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            <span className="font-bold w-full md:w-40 flex-shrink-0">Fecha de atención</span>
                            <span className="mt-1 md:mt-0">{ultimaAtencion?.fecha_completa || "No especificada"}</span>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            <span className="font-bold w-full md:w-40 flex-shrink-0">Documentos adicionales</span>
                            <div className="mt-2 md:mt-0 flex flex-wrap gap-3">
                                <button className="border-2 rounded-full border-[#634AE2] px-4 py-1 flex items-center justify-center gap-2 hover:bg-[#634AE2] hover:text-white transition-colors duration-200">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: Icons.download.replace(/<svg /, '<svg fill="currentColor" '),
                                        }}
                                        className="w-5 h-5"
                                    />
                                    Descargar
                                </button>
                                <button className="border-2 rounded-full border-[#634AE2] px-4 py-1 flex items-center justify-center gap-2 hover:bg-[#634AE2] hover:text-white transition-colors duration-200">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: Icons.eye.replace(/<svg /, '<svg fill="currentColor" '),
                                        }}
                                        className="w-5 h-5"
                                    />
                                    Vista Previa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comentarios */}
            <div className="mt-6">
                <textarea
                    className="bg-white w-full border border-[#9494F3] rounded-2xl p-4 text-[#634AE2] placeholder-[#634AE2]/50 focus:outline-none focus:ring-2 focus:ring-[#634AE2] focus:border-transparent shadow-sm resize-none h-32"
                    placeholder={ultimaAtencion?.comentario ? "" : "Aún no hay comentarios"}
                    value={ultimaAtencion?.comentario || ""}
                    readOnly
                />
                <div className="flex justify-center mt-4">
                    <button className="border-2 rounded-full border-[#634AE2] text-[#634AE2] px-8 py-2 hover:bg-[#634AE2] hover:text-white transition-colors duration-200 font-medium">
                        Actualizar
                    </button>
                </div>
            </div>
            {/* Modal de Historial */}
            {showCart && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 md:pt-20 z-50 p-4 overflow-y-auto">
                    <div
                        className="relative bg-white rounded-2xl w-full overflow-y-auto shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowCart(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-[#634AE2]"
                        >
                            ✕
                        </button>
                        <HistorialPaciente idPaciente={idPaciente} ultimaAtencion={ultimaAtencion} />
                    </div>
                </div>
            )}
        </div>
    );
};
