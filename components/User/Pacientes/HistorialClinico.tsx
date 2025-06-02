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
    <div className="pb-8 bg-background dark:bg-background">
      <div
        className="flex justify-center"
        style={{ position: "relative", zIndex: 100, marginTop: "-180px" }}
      >
        <div className="flex justify-center p-6">
          <div className="mt-2 w-[500px]">
            <div className="p-4 bg-card dark:bg-card text-primary dark:text-primary rounded-3xl shadow-lg dark:shadow-xl border dark:border-border">
              <div className="flex pl-6">
                <div className="w-[60%] pr-4">
                  <div className="font-bold text-3xl text-card-foreground dark:text-card-foreground">
                    {paciente?.nombre} {paciente?.apellido}
                  </div>
                  <div className="align-items-center">
                    <div className="flex">
                      <div className="font-bold pt-5 text-card-foreground dark:text-card-foreground">DNI</div>
                      <div className="pt-5 ml-16 text-card-foreground dark:text-card-foreground">{paciente?.DNI}</div>
                    </div>
                    <div className="flex">
                      <div className="font-bold pt-5 text-card-foreground dark:text-card-foreground">Celular</div>
                      <div className="pt-5 ml-9 text-card-foreground dark:text-card-foreground">{paciente?.celular}</div>
                    </div>
                    <div className="flex">
                      <div className="font-bold pt-5 text-card-foreground dark:text-card-foreground">Código</div>
                      <div className="pt-5 ml-9 text-card-foreground dark:text-card-foreground">{paciente?.codigo}</div>
                    </div>
                  </div>
                </div>
                <div className="w-[35%] pr-3">
                  <div className="bg-primary dark:bg-primary rounded-3xl text-primary-foreground dark:text-primary-foreground p-2 text-center">
                    <div className="text-4xl">{ultimaAtencion ? ultimaAtencion.fecha_atencion : "--/--"}</div>
                    <div className="pt-1">Última atención</div>
                  </div>
                  <div className="border-2 border-primary dark:border-primary rounded-full text-center mt-2 py-2 text-primary dark:text-primary hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors">
                    <button onClick={() => setShowCart(true)}>Ver historial clínico</button>
                  </div>
                </div>
              </div>

              <hr className="mt-3 border-muted dark:border-muted" />
              <div className="font-bold text-3xl text-center pt-2 text-card-foreground dark:text-card-foreground">Última Atención</div>
              <div className="flex">
                <div className="font-bold pt-1 w-20 text-card-foreground dark:text-card-foreground">Diagnóstico</div>
                <div className="pt-1 ml-14 text-card-foreground dark:text-card-foreground">{ultimaAtencion?.diagnostico}</div>
              </div>
              <div className="flex">
                <div className="font-bold pt-3 w-20 text-card-foreground dark:text-card-foreground">Observación</div>
                <div className="pt-3 ml-14 text-card-foreground dark:text-card-foreground">{ultimaAtencion?.observacion}</div>
              </div>
              <div className="flex">
                <div className="font-bold pt-3 w-20 text-card-foreground dark:text-card-foreground">Objetivos</div>
                <div className="pt-3 ml-14 text-card-foreground dark:text-card-foreground">{ultimaAtencion?.ultimosObjetivos}</div>
              </div>
            </div>

            <textarea
              rows={4}
              className="bg-card dark:bg-card w-full border border-border dark:border-border font-light text-card-foreground dark:text-card-foreground p-6 rounded-3xl mt-3 placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={comentario}
              placeholder="Comentario..."
              onChange={(e) => setComentario(e.target.value)}
            />

            <div className="ml-8 space-x-20">
              <button
                className="ml-5 border-2 rounded-full border-primary dark:border-primary text-primary dark:text-primary w-36 py-2 
                        disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors"
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
                  className="relative bg-card dark:bg-card p-6 rounded-3xl z-10 border dark:border-border"
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
