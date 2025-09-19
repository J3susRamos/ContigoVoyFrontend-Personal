"use client";
import React, { useEffect, useState } from "react";
import { Paciente, UltimaAtencion } from "@/interface";
import showToast from "@/components/ToastStyle";
import { parseCookies } from "nookies";
import HistorialPaciente from "../Historial/modalComponents/HistorialPaciente";
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
    <div className="w-full max-w-6xl mx-auto patient-card">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Información del Paciente y Última Atención */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card de Información del Paciente */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full status-indicator"></div>
              Información del Paciente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-foreground dark:text-foreground mb-4">
                    {paciente?.nombre} {paciente?.apellido}
                  </h4>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">DNI</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.DNI || "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Celular</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.celular || "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Código</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.codigo || "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Última Atención */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full status-indicator"></div>
              Última Atención
            </h3>
            
            <div className="space-y-4">
              <div className="patient-info-item group">
                <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Diagnóstico</label>
                <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                  {ultimaAtencion?.diagnostico || "No especificado"}
                </p>
              </div>
              
              <div className="patient-info-item group">
                <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Observación</label>
                <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                  {ultimaAtencion?.observacion || "No especificado"}
                </p>
              </div>
              
              <div className="patient-info-item group">
                <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Objetivos</label>
                <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                  {ultimaAtencion?.ultimosObjetivos || "No especificado"}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Comentarios */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full status-indicator"></div>
              Comentarios de Seguimiento
            </h3>
            
            <div className="space-y-4">
              <textarea
                rows={4}
                className="w-full bg-muted/30 dark:bg-muted/30 border border-border dark:border-border rounded-lg p-4 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                value={comentario}
                placeholder="Escribe aquí tus comentarios sobre el seguimiento del paciente..."
                onChange={(e) => setComentario(e.target.value)}
              />
              
              <button
                className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-lg py-3 px-6 font-medium hover:bg-primary/90 dark:hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleActualizarComentario}
                disabled={!ultimaAtencion?.idAtencion}
              >
                💾 Actualizar Comentario
              </button>
            </div>
          </div>
        </div>
        
        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Card de Última Atención - Fecha */}
          <div className="bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-xl shadow-sm p-6 text-primary-foreground dark:text-primary-foreground patient-card">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {ultimaAtencion ? 
                  new Date(ultimaAtencion.fecha_atencion).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) 
                  : "--/--/----"
                }
              </div>
              <p className="text-primary-foreground/80 dark:text-primary-foreground/80 font-medium">
                Última Atención
              </p>
            </div>
          </div>
          
          {/* Card de Acciones */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full status-indicator"></div>
              Acciones
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowCart(true)}
                className="w-full bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-lg py-3 px-4 font-medium hover:bg-primary/90 dark:hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                📋 Ver Historial Completoooo
              </button>
            </div>
          </div>
          
          {/* Card de Estado */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full status-indicator"></div>
              Estado del Historial
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg patient-info-item">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Última Atención</span>
                <span className="text-sm font-bold text-green-800 dark:text-green-200">
                  {ultimaAtencion ? "Registrada" : "Pendiente"}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/50 rounded-lg patient-info-item">
                <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">ID Atención</span>
                <span className="text-sm font-bold text-foreground dark:text-foreground">
                  #{ultimaAtencion?.idAtencion || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal mejorado */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" 
            onClick={() => setShowCart(false)} 
          />
          <div className="relative z-10 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-card dark:bg-card rounded-xl shadow-xl border border-border dark:border-border">
             <HistorialPaciente idPaciente={idPaciente ?? 0} ultimaAtencion={ultimaAtencion}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialClinico;
