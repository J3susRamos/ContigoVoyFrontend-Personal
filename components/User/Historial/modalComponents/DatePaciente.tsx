import {Icons} from "@/icons";
import React, {useEffect, useState} from "react";
import {
    DatePacienteProps,
    UltimaAtencion,
} from "@/interface";
import {getUltimaAtencion} from "@/components/User/Pacientes/getUltimaAtencionData";
import { HistorialPaciente } from "./HistorialPaciente";

export const DatePaciente: React.FC<DatePacienteProps> = ({idPaciente}) => {
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
        <div className="max-w-[480px]">
            <div className="bg-[#fff] h-max text-[#634AE2] rounded-3xl">
                <div className="flex pl-6">
                    <div className="w-[60%] pr-4">
                        <div className="font-bold text-3xl">
                            {ultimaAtencion?.nombre} {ultimaAtencion?.apellido}
                        </div>
                        <div className="font-bold text-xl">({ultimaAtencion?.edad} años)</div>
                        <div className="align-items-center">
                            <div className="flex align-items-center">
                                <div className="font-bold pt-5">DNI</div>
                                <div className="pt-5 ml-16">{ultimaAtencion?.DNI}</div>
                            </div>
                            <div className="flex align-items-center">
                                <div className="font-bold pt-5">Celular</div>
                                <div className="pt-5 ml-9">{ultimaAtencion?.celular}</div>
                            </div>
                            <div className="flex align-items-center">
                                <div className="font-bold pt-5">Codigo</div>
                                <div className="pt-5 ml-9">{ultimaAtencion?.codigo}</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[35%] pr-3">
                        <div className="bg-[#634AE2] rounded-3xl text-[#fff] p-2 text-center">
                            <div className="text-4xl">{ultimaAtencion ? ultimaAtencion.fecha_atencion : "--/--"}</div>
                            <div className="pt-1">última atención</div>
                        </div>
                        <div
                            className="border-2 border-[#634AE2] rounded-full text-center mt-2 justify-items-center pl-3 pr-3">
                            <button onClick={() => setShowCart(true)}>
                                Ver historial clínico
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="mt-3 border-[#9494F3]"/>
                <div className="font-bold text-3xl text-center pt-2">
                    Ultima Atencion
                </div>
                <div className="flex">
                    <div className="font-bold pt-1 w-20">Diagnóstico</div>
                    <div className="pt-1 ml-14">{ultimaAtencion?.diagnostico}</div>
                </div>
                <div className="flex">
                    <div className="font-bold pt-3 w-20">Observación</div>
                    <div className="pt-3 ml-14">{ultimaAtencion?.observacion}</div>
                </div>
                <div className="flex">
                    <div className="font-bold pt-3 w-20">Últimos objetivos</div>
                    <div className="pt-3 ml-14">{ultimaAtencion?.ultimosObjetivos}</div>
                </div>
                <div className="flex">
                    <div className="font-bold pt-3 w-20">Fecha de atención</div>
                    <div className="pt-3 ml-14">
                        {ultimaAtencion?.fecha_completa}
                    </div>
                </div>
                <div className="flex">
                    <div className="font-bold pt-3 w-20">Documentos adicionales</div>
                    <div className="pt-5 ml-14 flex gap-5">
                        <button
                            className="border-2 rounded-full border-[#634AE2] w-40 flex items-center justify-center gap-1 h-9">
              <span
                  dangerouslySetInnerHTML={{
                      __html: Icons.download.replace(
                          /<svg /,
                          '<svg fill="#634AE2" '
                      ),
                  }}
                  style={{
                      width: "1.4em",
                      height: "1.4em",
                  }}
              />
                            Descarga
                        </button>
                        <button
                            className="border-2 rounded-full border-[#634AE2] w-40 flex items-center justify-center gap-1 h-9">
              <span
                  dangerouslySetInnerHTML={{
                      __html: Icons.eye.replace(/<svg /, '<svg fill="#634AE2" '),
                  }}
                  style={{
                      width: "1.4em",
                      height: "1.4em",
                  }}
              />
                            Vista Previa
                        </button>
                    </div>
                </div>
            </div>
            <textarea
                className="bg-[#fff] w-full border-1 font-light text-[#634AE2] p-6 rounded-3xl mt-3 placeholder:text-[#634AE2]"
                placeholder="Aun no hay comentarios"
                value={ultimaAtencion?.comentario}
            />
            <div className="ml-8 space-x-20">
                <button className="ml-5 border-2 rounded-full border-[#634AE2] text-[#634AE2] w-36">
                    Actualizar
                </button>
            </div>
            {showCart && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 justify-center pt-32 z-10 pl-72"
                    onClick={() => setShowCart(false)}
                >
                    <div
                        className="relative bg-white p-6 rounded-3xl z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <HistorialPaciente idPaciente={idPaciente} ultimaAtencion={ultimaAtencion}/>
                    </div>
                </div>
            )}
        </div>
    );
};
