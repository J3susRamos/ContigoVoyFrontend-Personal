"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DatosPacienteProps, Paciente } from "@/interface";
import { getPaciente } from "@/components/User/Pacientes/getPacienteData";
import { useRouter } from "next/navigation";
import { FamiliaButton } from "./TablePacientes";

const DatosPaciente: React.FC<DatosPacienteProps> = ({ idPaciente }) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const HandleGetPaciente = async (idPaciente: number) => {
    const result = await getPaciente(idPaciente);
    console.log(result.data)
    if (result.success) {
      setPaciente(result.data);
    }
  };

  useEffect(() => {
    if (idPaciente) {
      HandleGetPaciente(idPaciente).catch(error => {
        console.error("Error fetching patient data:", error);
      });
    }
  }, [idPaciente]);
   const router = useRouter();

  const handleEditPaciente = useCallback(() => {
      router.push(`/user/pacientes/EditarPaciente?id=${idPaciente}`);
    }, [router, idPaciente]);

  return (
    <div className="w-full max-w-6xl mx-auto patient-card">
      {/* Grid layout para datos del paciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Información Personal */}
        <div className="lg:col-span-2">
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full status-indicator"></div>
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Nombre</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.nombre || "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Apellido</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.apellido || "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Género</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors capitalize">
                    {paciente?.genero || "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Fecha de Nacimiento</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente
                      ? new Date(paciente.fecha_nacimiento).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Ocupación</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.ocupacion || "No especificado"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Estado Civil</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors capitalize">
                    {paciente?.estadoCivil || "No especificado"}
                  </p>
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
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Correo Electrónico</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.email || "No especificado"}
                  </p>
                </div>
                
                <div className="patient-info-item group">
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Dirección</label>
                  <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                    {paciente?.direccion || "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de Acciones */}
        <div className="space-y-6">
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full status-indicator"></div>
              Acciones
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleEditPaciente}
                className="w-full bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-lg py-3 px-4 font-medium hover:bg-primary/90 dark:hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                ✏️ Editar Paciente
              </button>
              
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <FamiliaButton idPaciente={idPaciente || 0} />
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full status-indicator"></div>
              Estado del Paciente
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg patient-info-item">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Estado</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-800 dark:text-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full status-indicator"></div>
                  Activo
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/50 rounded-lg patient-info-item">
                <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">ID Paciente</span>
                <span className="text-sm font-bold text-foreground dark:text-foreground">#{idPaciente}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosPaciente;
