"use client";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { DatosPacienteProps, CitasConteo } from "@/interface";
import showToast from "@/components/ToastStyle";

const CitasPaciente: React.FC<DatosPacienteProps> = ({ idPaciente }) => {
  const [citas, setCitas] = useState<CitasConteo>({
    pendientes: 0,
    canceladas: 0,
    confirmadas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const HandleGetCitas = async (idPaciente: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/citas/${idPaciente}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCitas(data.result); 
        showToast("success", "Citas obtenidas correctamente");
      } else {
        showToast("error", data.message || "Error al obtener las citas");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idPaciente) {
      HandleGetCitas(idPaciente).catch(error => {
        console.error("Error fetching patient appointments:", error);
      });
    }
  }, [idPaciente]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto patient-card">
        <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-foreground dark:text-foreground font-medium">Cargando citas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto patient-card">
        <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-8 text-center">
          <div className="text-red-600 dark:text-red-400 font-medium">
            ❌ Error: {error}
          </div>
        </div>
      </div>
    );
  }

  const citasData = [
    {
      title: "Citas Pendientes",
      value: citas.pendientes,
      icon: "⏳",
      color: "bg-yellow-500 dark:bg-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-800 dark:text-yellow-200"
    },
    {
      title: "Citas Confirmadas", 
      value: citas.confirmadas,
      icon: "✅",
      color: "bg-green-500 dark:bg-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-800 dark:text-green-200"
    },
    {
      title: "Citas Canceladas",
      value: citas.canceladas,
      icon: "❌",
      color: "bg-red-500 dark:bg-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20", 
      textColor: "text-red-800 dark:text-red-200"
    },
    {
      title: "Citas Ausencias",
      value: 0,
      icon: "👤",
      color: "bg-gray-500 dark:bg-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      textColor: "text-gray-800 dark:text-gray-200"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto patient-card">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-2 flex items-center gap-2">
          <div className="w-3 h-3 bg-primary dark:bg-primary rounded-full status-indicator"></div>
          Resumen de Citas
        </h2>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Estadísticas detalladas de las citas del paciente
        </p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {citasData.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} rounded-xl p-6 patient-card border border-border dark:border-border hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {item.icon}
              </div>
              <div className={`text-3xl font-bold ${item.textColor}`}>
                {item.value}
              </div>
            </div>
            <h3 className={`font-semibold ${item.textColor}`}>
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card de Resumen */}
        <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full status-indicator"></div>
            Resumen Total
          </h3>
          
          <div className="space-y-4">
            <div className="patient-info-item group">
              <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Total de Citas</label>
              <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                {citas.pendientes + citas.confirmadas + citas.canceladas} citas registradas
              </p>
            </div>
            
            <div className="patient-info-item group">
              <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Estado Actual</label>
              <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                {citas.pendientes > 0 ? `${citas.pendientes} citas pendientes` : "Sin citas pendientes"}
              </p>
            </div>
            
            <div className="patient-info-item group">
              <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Tasa de Confirmación</label>
              <p className="text-foreground dark:text-foreground font-medium mt-1 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg group-hover:bg-muted/50 dark:group-hover:bg-muted/50 transition-colors">
                {citas.confirmadas + citas.canceladas + citas.pendientes > 0 
                  ? `${Math.round((citas.confirmadas / (citas.confirmadas + citas.canceladas + citas.pendientes)) * 100)}%`
                  : "No hay datos suficientes"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Card de Próximas Acciones */}
        <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border p-6 patient-card">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full status-indicator"></div>
            Próximas Acciones
          </h3>
          
          <div className="space-y-4">
            {citas.pendientes > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⏳</span>
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Citas Pendientes
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Hay {citas.pendientes} cita{citas.pendientes !== 1 ? 's' : ''} pendiente{citas.pendientes !== 1 ? 's' : ''} de confirmación
                </p>
              </div>
            )}
            
            {citas.confirmadas > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">✅</span>
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Citas Confirmadas
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {citas.confirmadas} cita{citas.confirmadas !== 1 ? 's' : ''} confirmada{citas.confirmadas !== 1 ? 's' : ''} para atender
                </p>
              </div>
            )}
            
            {citas.pendientes === 0 && citas.confirmadas === 0 && (
              <div className="p-4 bg-muted/50 dark:bg-muted/50 rounded-lg text-center">
                <span className="text-4xl mb-2 block">📅</span>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  No hay citas activas en este momento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitasPaciente;