"use client";
import React, { useEffect, useState } from "react";
import { Paciente, UltimaAtencion } from "@/interface";
import showToast from "@/components/ToastStyle";
import { parseCookies } from "nookies";
import DetallesPaciente from "../Historial/DetallesPaciente";
import { getPaciente } from "@/components/User/Pacientes/getPacienteData";
import { getUltimaAtencion } from "@/components/User/Pacientes/getUltimaAtencionData";

const HistorialClinico = ({ idPaciente }: {idPaciente:number | null}) => {
  const [showCart, setShowCart] = useState(false);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [ultimaAtencion, setUltimaAtencion] = useState<UltimaAtencion | null>(null);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (idPaciente) {
      // Properly handle both Promises
      HandleGetPaciente(idPaciente).catch(error => {
        console.error("Error fetching patient data:", error);
      });
      
      HandleGetUltimaAtencion(idPaciente).catch(error => {
        console.error("Error fetching last attention data:", error);
      });
    }
  }, [idPaciente]);
  
  useEffect(() => {
    setComentario(ultimaAtencion?.comentario || "");
  }, [ultimaAtencion]);

  const HandleGetPaciente = async (idPaciente: number) => {
    const result = await getPaciente(idPaciente);
    if (result.success) {
      setPaciente(result.data);
    }
  };
  const HandleGetUltimaAtencion = async (idPaciente: number) => {
    const result = await getUltimaAtencion(idPaciente);
    if (result.success) {
      setUltimaAtencion(result.data);
    }
  };

  const handleActualizarComentario = async () => {
    if (!ultimaAtencion?.idAtencion) return;
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/atenciones/${ultimaAtencion.idAtencion}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "Comentario actualizado correctamente");
      } else {
        showToast("error", data.message || "Error al actualizar comentario");
      }
    } catch {
      showToast("error", "Error de conexión al actualizar comentario");
    }
  };

  return (
    <div className="pb-8 bg-[#eaeded]">
      <div
        className="flex justify-center"
        style={{ position: "relative", zIndex: 100, marginTop: "-180px" }}
      >
    <div className="flex justify-center p-6">
      <div className="mt-2 w-[500px]">
        <div className="p-4 bg-white text-[#634AE2] rounded-3xl shadow">
          <div className="flex pl-6">
            <div className="w-[60%] pr-4">
              <div className="font-bold text-3xl">{paciente?.nombre} {paciente?.apellido}</div>
              <div className="align-items-center">
                <div className="flex">
                  <div className="font-bold pt-5">DNI</div>
                  <div className="pt-5 ml-16">{paciente?.DNI}</div>
                </div>
                <div className="flex">
                  <div className="font-bold pt-5">Celular</div>
                  <div className="pt-5 ml-9">{paciente?.celular}</div>
                </div>
                <div className="flex">
                  <div className="font-bold pt-5">Código</div>
                  <div className="pt-5 ml-9">{paciente?.codigo}</div>
                </div>
              </div>
            </div>
            <div className="w-[35%] pr-3">
              <div className="bg-[#634AE2] rounded-3xl text-white p-2 text-center">
                <div className="text-4xl">{ultimaAtencion ? ultimaAtencion.fecha_atencion : "--/--"}</div>
                <div className="pt-1">Última atención</div>
              </div>
              <div className="border-2 border-[#634AE2] rounded-full text-center mt-2 py-2">
                <button onClick={() => setShowCart(true)}>Ver historial clínico</button>
              </div>
            </div>
          </div>

          <hr className="mt-3 border-[#9494F3]" />
          <div className="font-bold text-3xl text-center pt-2">Última Atención</div>
          <div className="flex">
            <div className="font-bold pt-1 w-20">Diagnóstico</div>
            <div className="pt-1 ml-14">{ultimaAtencion?.diagnostico}</div>
          </div>
          <div className="flex">
            <div className="font-bold pt-3 w-20">Observación</div>
            <div className="pt-3 ml-14">{ultimaAtencion?.observacion}</div>
          </div>
          <div className="flex">
            <div className="font-bold pt-3 w-20">Objetivos</div>
            <div className="pt-3 ml-14">{ultimaAtencion?.ultimosObjetivos}</div>
          </div>
        </div>

        <textarea
          rows={4}
          className="bg-white w-full border font-light text-[#634AE2] p-6 rounded-3xl mt-3 placeholder:text-[#634AE2]"
          value={comentario}
          placeholder="Comentario..."
          onChange={(e) => setComentario(e.target.value)}
        />

        <div className="ml-8 space-x-20">
          <button
            className="ml-5 border-2 rounded-full border-[#634AE2] text-[#634AE2] w-36 
                    disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleActualizarComentario}
            disabled={!ultimaAtencion?.idAtencion}
          >
            Actualizar
          </button>
        </div>

        {showCart && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
            onClick={() => setShowCart(false)}
          >
            <div
              className="relative bg-white p-6 rounded-3xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <DetallesPaciente ultimaAtencion={ultimaAtencion} />
            </div>
          </div>
        )}
      </div>
    </div>
      </div>
    </div>
  );
};

export default HistorialClinico;