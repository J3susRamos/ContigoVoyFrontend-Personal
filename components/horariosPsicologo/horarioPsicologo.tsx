import React, { useEffect, useState } from "react";
import ZonaHorariaSelect from "./zonaHorariaSelect";
import { Horarios, BotonHorarioProps, CitasPendientesApiResponse } from "@/interface";
import { GetCitasPendientes } from "@/app/apiRoutes";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const convertirHoraZona = (fechaISO: string, hora: string, zonaOrigen: string, zonaDestino: string): string => {
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
    className={`w-full p-3 rounded-full font-semibold ${ocupada ? "line-through bg-[#EDEDED] text-[#CACACB]" : "bg-[#EAEAFF] text-[#634AE2]"
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
  const isMobile = useIsMobile();
  const diasVisibles = isMobile ? 3 : 6;

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
      fetchCitasPendientes();
    }
  }, [idPsicologo]);

  const fechaBase = new Date();
  fechaBase.setDate(fechaBase.getDate() + semanaOffset * 7);
  fechaBase.setHours(0, 0, 0, 0);

  const hoyISO = new Date().toISOString().split("T")[0];
  const mananaISO = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const formateadorFecha = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" });
  const cambiarSemana = (direccion: number) => {
    if (isMobile) {
      setSemanaOffset((prev) => Math.max(0, prev + direccion)); // En móvil, se mueve normalmente
    } else {
      const nuevaSemanaOffset = semanaOffset + direccion;
      if (nuevaSemanaOffset >= 0) {
        setSemanaOffset(nuevaSemanaOffset);
      }
    }
  };

  const diasAmostrar: Date[] = [];
  let contador = 0;
  let fechaIterada = new Date(fechaBase);
  
  while (diasAmostrar.length < diasVisibles) {
    const diaSemana = fechaIterada.getDay();
    if (diaSemana !== 0) { // Excluir domingos
      diasAmostrar.push(new Date(fechaIterada));
    }
    contador++;
    fechaIterada = new Date(fechaBase);
    fechaIterada.setDate(fechaBase.getDate() + contador);
  }

  return (
    <div className="p-5 bg-white w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-center text-[#634AE2]">¡Escoge el mejor horario que se adapte a ti!</h2>
      <div className="flex justify-center mt-2">
        <ZonaHorariaSelect onChange={setZonaHoraria} />
      </div>

      <div className="flex items-start gap-4">
        {/* Flecha izquierda*/}
        <button
          onClick={() => cambiarSemana(-1)}
          disabled={semanaOffset === 0}
          className={`mt-5 text-4xl font-bold text-[#634AE2] ${semanaOffset === 0 ? "opacity-50" : ""}`}
        >
          &lt;
        </button>

        <div className="mt-4 overflow-x-auto">
          {/*Cabezera de dias de la semana */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {diasAmostrar.map((fecha) => {
            const diaNombre = fecha.toLocaleDateString("es-ES", { weekday: "long" });
            const diaCapitalizado = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);

            return (
              <div key={fecha.toISOString()} className="text-center p-3 w-full rounded-full bg-[#9494F3] text-white">
                <p>{diaCapitalizado}</p>
                <p className="text-md">{obtenerEtiquetaDia(fecha, hoyISO, mananaISO, formateadorFecha)}</p>
              </div>
            );
          })}
          </div>

          {/* Horas disponibles del psicologo */}
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {diasAmostrar.map((fecha) => {
  const fechaStr = fecha.toISOString().split("T")[0];
  const diaNombre = fecha.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
  const diaCapitalizado = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);

  const horasDisponibles = (horario[diaCapitalizado] || []).flatMap(([inicio, fin]) =>
    generarHorarios(inicio, fin, zonaHoraria)
  );
  const maxHoras = Math.max(
    ...Object.values(horario).flatMap((r) =>
      r.map(([i, f]) => generarHorarios(i, f, zonaHoraria).length)
    )
  );
  const horasCompletas = horasDisponibles.concat(
    Array(maxHoras - horasDisponibles.length).fill("")
  );

  const citasConvertidas =
    citasPendientes?.result?.map((cita) => ({
      fecha: cita.fecha,
      hora: convertirHoraZona(cita.fecha, cita.hora, "America/Lima", zonaHoraria),
    })) || [];

  return (
    <div key={fechaStr} className="text-center space-y-2">
      {horasCompletas.map((hora, idx) =>
        hora ? (
          <BotonHorario
            key={`${fechaStr}-${idx}-${hora}`}
            hora={hora}
            ocupada={citasConvertidas.some(
              (cita) => cita.fecha === fechaStr && cita.hora.startsWith(hora)
            )}
            onClick={() => {
              onClose();
              onOpenConfirm();
              onSelectHorario(hora, fechaStr);
            }}
          />
        ) : (
          <button
            key={`empty-${idx}`} // Usamos la fecha y el índice para hacerla única
            className="w-full p-3 rounded-full bg-[#EDEDED] text-[#CACACB]"
            disabled
          >
            -
          </button>
        )
      )}
    </div>
  );
})}
          </div>
        </div>

        {/* Flecha derecha*/}
        <button className="mt-5 text-4xl font-bold text-[#634AE2]" onClick={() => cambiarSemana(1)}>
          &gt;
        </button>
      </div>
    </div>
  );
}
