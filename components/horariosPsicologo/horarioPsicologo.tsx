import React, { useEffect, useState } from "react";
import ZonaHorariaSelect from "./zonaHorariaSelect";
import { Horarios, BotonHorarioProps, CitasPendientesApiResponse } from "@/interface";
import { GetCitasPendientes } from "@/app/apiRoutes";

const convertirHoraZona = (fechaISO: string, hora: string, zonaDestino: string): string => {
  const fecha = new Date(`${fechaISO}T${hora}:00`);
  return fecha.toLocaleTimeString("es-ES", {
    timeZone: zonaDestino,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const generarHorarios = (inicio: string, fin: string, zonaDestino: string): string[] => {
  const horas: string[] = [];
  const actual = new Date(`2025-01-01T${inicio}`);
  const end = new Date(`2025-01-01T${fin}`);

  while (actual <= end) {
    horas.push(actual.toLocaleTimeString("es-ES", {
      timeZone: zonaDestino,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }));
    actual.setMinutes(actual.getMinutes() + 60);
  }
  return horas;
};

const obtenerEtiquetaDia = (fecha: Date, hoyISO: string, mananaISO: string, formateador: Intl.DateTimeFormat): string => {
  const fechaISO = fecha.toISOString().split("T")[0];
  return fechaISO === hoyISO ? "Hoy" : fechaISO === mananaISO ? "Mañana" : formateador.format(fecha).concat(".");
};

const BotonHorario: React.FC<BotonHorarioProps> = ({ hora, ocupada, onClick }) => (
  <button
    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
      ocupada
        ? "line-through bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
        : "bg-[#634AE2] text-white dark:bg-[#7B61FF] shadow-sm hover:shadow-md hover:bg-[#5840D0] dark:hover:bg-[#6B52E8] active:scale-95 cursor-pointer"
    }`}
    disabled={ocupada}
    onClick={onClick}
  >
    {hora}
  </button>
);

export default function HorarioPsicologo({ idPsicologo, horario, onClose, onOpenConfirm, onSelectHorario }:
  {
    idPsicologo: number; horario: Horarios;
    onClose: () => void;
    onOpenConfirm: () => void;
    onSelectHorario: (hora: string, fecha: string) => void;
  }) {
  const [citasPendientes, setCitasPendientes] = useState<CitasPendientesApiResponse | null>(null);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [zonaHoraria, setZonaHoraria] = useState("America/Lima");
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);

  useEffect(() => {
    const fetchCitasPendientes = async () => {
      try {
        const data = await GetCitasPendientes(idPsicologo);
        setCitasPendientes(data);
      } catch (error) {
        console.error("Error obteniendo citas pendientes:", error);
      }
    };

    if (idPsicologo) {
      fetchCitasPendientes().catch((error) => {
        console.error("Error in fetchCitasPendientes:", error);
      });
    }
  }, [idPsicologo]);

  const fechaBase = new Date();
  fechaBase.setDate(fechaBase.getDate() + semanaOffset * 7);
  fechaBase.setHours(0, 0, 0, 0);

  const hoyISO = new Date().toISOString().split("T")[0];
  const mananaISO = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const cambiarSemana = (direccion: number) => {
    setSemanaOffset((prev) => Math.max(0, prev + direccion));
    setDiaSeleccionado(0);
  };

  const formateadorFecha = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" });

  // Generar días de la semana
  const dias = Array.from({ length: 6 }).map((_, index) => {
    const fecha = new Date(fechaBase);
    if (semanaOffset === 0) {
      fecha.setDate(fechaBase.getDate() + index);
    } else {
      const diaSemana = fechaBase.getDay();
      const offsetHastaLunes = diaSemana === 0 ? 1 : 1 - diaSemana;
      fecha.setDate(fechaBase.getDate() + offsetHastaLunes + index);
    }
    return fecha;
  });

  const fechaActual = dias[diaSeleccionado];
  const fechaStr = fechaActual.toISOString().split("T")[0];
  const diaNombre = fechaActual.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
  const diaCapitalizado = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);

  const horasDisponibles = (horario[diaCapitalizado] || []).flatMap(([inicio, fin]) =>
    generarHorarios(inicio, fin, zonaHoraria)
  );

  const citasConvertidas = citasPendientes?.result?.map((cita) => ({
    fecha: cita.fecha,
    hora: convertirHoraZona(cita.fecha, cita.hora, zonaHoraria),
  })) || [];

  // Calcular la altura máxima para las columnas de horarios
  const calcularAlturaMaxima = () => {
    let maxHoras = 0;
    Object.values(horario).forEach((rangos) => {
      rangos.forEach(([inicio, fin]) => {
        const horas = generarHorarios(inicio, fin, zonaHoraria);
        maxHoras = Math.max(maxHoras, horas.length);
      });
    });
    return maxHoras;
  };

  const alturaMaxima = calcularAlturaMaxima();

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white w-full max-w-6xl mx-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Desktop View - Mejorado */}
      <div className="hidden lg:block p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#634AE2] dark:text-[#7B61FF] mb-3">
            ¡Escoge el mejor horario que se adapte a ti!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Selecciona tu zona horaria y elige el día y hora para tu cita
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-64">
            <ZonaHorariaSelect onChange={setZonaHoraria} />
          </div>
        </div>

        {/* Navegación y semana actual */}
        <div className="flex items-center justify-between mb-6 px-4">
          <button
            onClick={() => cambiarSemana(-1)}
            disabled={semanaOffset === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              semanaOffset === 0 
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed" 
                : "bg-[#634AE2] text-white hover:bg-[#5840D0] active:scale-95"
            }`}
          >
            <span className="text-lg">←</span>
            Semana anterior
          </button>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {semanaOffset === 0 ? "Esta semana" : `Semana ${semanaOffset + 1}`}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dias[0] && `${dias[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - ${dias[5].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`}
            </p>
          </div>

          <button
            onClick={() => cambiarSemana(1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-[#634AE2] text-white hover:bg-[#5840D0] active:scale-95 transition-all duration-200"
          >
            Semana siguiente
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* Grid de días y horarios */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="grid grid-cols-6 gap-4">
            {dias.map((fecha) => {
              const fechaStr = fecha.toISOString().split("T")[0];
              const diaNombre = fecha.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
              const diaCapitalizado = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);
              const horasDisponibles = (horario[diaCapitalizado] || []).flatMap(([inicio, fin]) =>
                generarHorarios(inicio, fin, zonaHoraria)
              );

              return (
                <div key={fechaStr} className="flex flex-col">
                  {/* Header del día */}
                  <div className={`text-center p-3 rounded-t-xl mb-3 ${
                    fecha.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
                      ? "bg-[#E8E4FF] dark:bg-[#2A2A3A] text-[#634AE2] dark:text-[#7B61FF] border-2 border-[#634AE2]"
                      : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}>
                    <p className="font-bold text-lg capitalize">
                      {fecha.toLocaleDateString("es-ES", { weekday: "long" })}
                    </p>
                    <p className="text-sm font-medium">
                      {obtenerEtiquetaDia(fecha, hoyISO, mananaISO, formateadorFecha)}
                    </p>
                  </div>

                  {/* Lista de horarios */}
                  <div 
                    className="space-y-2 flex-1 min-h-0 overflow-y-auto p-1"
                    style={{ maxHeight: `${alturaMaxima * 60}px` }}
                  >
                    {horasDisponibles.length > 0 ? (
                      horasDisponibles.map((hora) => (
                        <BotonHorario
                          key={`${fechaStr}-${hora}`}
                          hora={hora}
                          ocupada={citasConvertidas.some((cita) => cita.fecha === fechaStr && cita.hora.startsWith(hora))}
                          onClick={() => {
                            onClose();
                            onOpenConfirm();
                            onSelectHorario(hora, fechaStr);
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                        No disponible
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex justify-center items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#634AE2]"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span>Ocupado</span>
          </div>
        </div>
      </div>

      {/* Mobile View - Mantenido igual */}
      <div className="lg:hidden p-4">
        <h2 className="text-lg font-bold text-center text-[#634AE2] mb-3">
          ¡Escoge tu horario ideal!
        </h2>
        
        <div className="flex justify-center mb-4">
          <ZonaHorariaSelect onChange={setZonaHoraria} />
        </div>

        {/* Navegación de semanas */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={() => cambiarSemana(-1)}
            disabled={semanaOffset === 0}
            className={`w-10 h-10 rounded-full bg-[#634AE2] text-white font-bold text-xl flex items-center justify-center ${
              semanaOffset === 0 ? "opacity-30" : "active:scale-90"
            }`}
          >
            ←
          </button>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {semanaOffset === 0 ? "Esta semana" : `Semana ${semanaOffset + 1}`}
          </span>
          <button
            onClick={() => cambiarSemana(1)}
            className="w-10 h-10 rounded-full bg-[#634AE2] text-white font-bold text-xl flex items-center justify-center active:scale-90"
          >
            →
          </button>
        </div>

        {/* Selector de días - Scroll horizontal */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-hide">
          {dias.map((fecha, index) => {
            const diaNombre = fecha.toLocaleDateString("es-ES", { weekday: "long" });
            const diaCorto = diaNombre.slice(0, 3).charAt(0).toUpperCase() + diaNombre.slice(1, 3);
            const etiqueta = obtenerEtiquetaDia(fecha, hoyISO, mananaISO, formateadorFecha);
            
            return (
              <button
                key={fecha.toISOString()}
                onClick={() => setDiaSeleccionado(index)}
                className={`flex-shrink-0 min-w-[70px] p-3 rounded-xl transition-all duration-200 ${
                  diaSeleccionado === index
                    ? "bg-[#634AE2] text-white shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="text-xs font-semibold">{diaCorto}</div>
                <div className="text-xs mt-1">{etiqueta}</div>
              </button>
            );
          })}
        </div>

        {/* Horarios disponibles */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
            Horarios disponibles
          </h3>
          
          {horasDisponibles.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {horasDisponibles.map((hora) => (
                <BotonHorario
                  key={hora}
                  hora={hora}
                  ocupada={citasConvertidas.some((cita) => cita.fecha === fechaStr && cita.hora.startsWith(hora))}
                  onClick={() => {
                    onClose();
                    onOpenConfirm();
                    onSelectHorario(hora, fechaStr);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No hay horarios disponibles este día</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}