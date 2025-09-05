"use client";

import showToast from "@/components/ToastStyle";
import { UsuarioLocalStorage } from "@/interface";
import { Button, Input, ScrollShadow } from "@heroui/react";
import { X } from "lucide-react";
import { parseCookies } from "nookies";
import React, { useState, useEffect } from "react";
import { GetDisponibilidadUltimos7Dias } from "@/app/apiRoutes"; //agregado este metodo


const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface TimesInterface {
  id: number;
  dia: string;
  start: string;
  end: string;
}



export default function Week() {
  const [fecha, setFecha] = useState<TimesInterface>({
    id: 0,
    dia: "",
    start: "08:00",
    end: "18:00",
  });
  const [horarios, setHorarios] = useState<TimesInterface[]>([]);
 

//******************************************************* */
//***********************AGREGADo************************** */
 


//******************************************************* */


  const hasSchedule = (day: string) => {
    return horarios.some((horario) => horario.dia === day);
  };

  const handleDayClick = (day: string) => {
    if (hasSchedule(day)) return;
    setFecha((prev) => ({ ...prev, dia: day }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFecha((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSchedule = () => {
    if (!fecha.dia) {
      showToast("error", "Selecciona un día");
      return;
    }
    if (!fecha.start || !fecha.end) {
      showToast("error", "Completa ambas horas");
      return;
    }
    if (fecha.start >= fecha.end) {
      showToast("error", "La hora de fin debe ser mayor que la de inicio");
      return;
    }

    const newSchedule = { ...fecha, id: Date.now() };
    setHorarios((prev) => [...prev, newSchedule]);
    setFecha({ id: 0, dia: "", start: "08:00", end: "18:00" });
  };

  const formatHorariosForBackend = (horarios: TimesInterface[]) => {
    const formattedHorarios: Record<string, string[][]> = {};
    horarios.forEach(({ dia, start, end }) => {
      if (!formattedHorarios[dia]) formattedHorarios[dia] = [];
      formattedHorarios[dia].push([start, end]);
    });
    return { horario: formattedHorarios };
  };

  //***************AGREGADO************* */

// Función para determinar el turno basado en la hora (declarada fuera de handleUpdate)
const getShiftFromTime = (time: string): string => {
  const hour = parseInt(time.split(':')[0]);
  return hour < 12 ? "Mañana" : "Tarde";
};


//***************metodo a cambiar************* */
const handleUpdate = async () => {
  try {
    console.log("🔍 DEBUG - Horarios originales:", horarios);
    if (horarios.length === 0) {
      showToast("error", "No hay horarios para guardar");
      return;
    }
    
    const storedUser = localStorage.getItem("user");
    console.log("🔍 DEBUG - Usuario almacenado:", storedUser);
    if (!storedUser) {
      showToast("error", "No se encontró el usuario en el almacenamiento local");
      return;
    }
    
    const parsedUser: UsuarioLocalStorage = JSON.parse(storedUser);
    console.log("🔍 DEBUG - Usuario parseado:", parsedUser);
    
    const token = parseCookies()["session"];
    console.log("🔍 DEBUG - Token:", token ? "Token encontrado" : "Token no encontrado");
    if (!token) {
      showToast("error", "No se encontró el token de autenticación");
      return;
    }
    
    // Función para convertir nombre de día a fecha específica (esta semana)
    const getDateFromDay = (dayName: string): string => {
      const daysMap: Record<string, number> = {
        "Lunes": 1,
        "Martes": 2,
        "Miércoles": 3,
        "Jueves": 4,
        "Viernes": 5,
        "Sábado": 6
      };
      
      const today = new Date();
      const todayDay = today.getDay(); // 0 (Domingo) a 6 (Sábado)
      
      // Ajustar para que Lunes sea 1 y Domingo 7
      const adjustedTodayDay = todayDay === 0 ? 7 : todayDay;
      
      const targetDay = daysMap[dayName];
      let daysToAdd = targetDay - adjustedTodayDay;
      
      // Si el día ya pasó esta semana, calcular para la próxima semana
      if (daysToAdd < 0) {
        daysToAdd += 7;
      }
      
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      
      return targetDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };
    
    // Función para determinar el turno basado en la hora
    const getShiftFromTime = (time: string): string => {
      const hour = parseInt(time.split(':')[0]);
      return hour < 12 ? "Mañana" : "Tarde";
    };
    
    // Formatear los datos en el formato que espera el backend
    const formattedData = {
      fechas: horarios.map(horario => ({
        fecha: getDateFromDay(horario.dia),
        hora_inicio: horario.start,
        hora_fin: horario.end,
        turno: getShiftFromTime(horario.start)
      }))
    };
    
    console.log("🔍 DEBUG - Datos formateados para backend:", formattedData);
    console.log("🔍 DEBUG - JSON que se enviará:", JSON.stringify(formattedData, null, 2));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/disponibilidad/crear`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log("🔍 DEBUG - Error data:", errorData);
      
      // Manejar específicamente el error 422
      if (response.status === 422) {
        const errorMessage = errorData.description || "Ya existe una disponibilidad en ese horario";
        showToast("error", errorMessage);
      } else {
        const errorMessage = errorData.message || "Error al actualizar horarios";
        showToast("error", errorMessage);
      }
      return;
    }
    
    const responseData = await response.json();
    console.log("🔍 DEBUG - Response data:", responseData);
    
    // ✅ MANTENER: Agregar los nuevos horarios al historial local (al principio del array)
    const nuevosHorarios = horarios.map(horario => {
      const fechaFormateada = getDateFromDay(horario.dia);
      return {
        id: Date.now() + Math.random(), // ID único
        dia: horario.dia,
        fecha: fechaFormateada,
        hora_inicio: horario.start,
        hora_fin: horario.end,
        turno: getShiftFromTime(horario.start)
      };
    });
    
    // ✅ MANTENER: Combinar nuevos horarios con el historial existente y limitar a 7 elementos
    setHistorial(prev => {
      const historialCombinado = [...nuevosHorarios, ...prev];
      return historialCombinado.slice(0, 7);
    });
    
    showToast("success", "Horarios guardados correctamente");
    setHorarios([]);
    
    // ✅ ADEMÁS: Forzar recarga del historial desde el backend para asegurar consistencia
    setReloadHistorial(prev => !prev);
    
  } catch (error) {
    console.log("🔍 DEBUG - Error capturado:", error);
    showToast("error", error instanceof Error ? error.message : "Error al guardar horarios");
  }
};
  //***************hasta aqui llega metodo a cambiar************* */



  const handleDeleteSchedule = (id: number) => {
    setHorarios((prev) => prev.filter((item) => item.id !== id));
  };

//***************AGREGADO****************** */

const [historial, setHistorial] = useState<any[]>([]); //ultimos 7 dias historial
const [reloadHistorial, setReloadHistorial] = useState(false); // <- agregado

useEffect(() => {
  const fetchHistorial = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser: UsuarioLocalStorage = JSON.parse(storedUser);
      const token = parseCookies()["session"];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/disponibilidad/ultimos-7-dias`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al cargar historial");
      const data = await res.json();
      setHistorial(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchHistorial();
}, [reloadHistorial]); // ✅ ahora sí está bien cerrado


  return (
    <div className="mx-auto max-w-sm flex flex-col my-14 text-[#634AE2]">
      <span className="text-center my-5">Eliga tus días disponibles de esta semana</span>

      {/* ------------------- BOTONES DE DÍAS ------------------- */}
      <div>
        {daysOfWeek.map((day) => (
          <Button
            key={day}
            onPress={() => handleDayClick(day)}
            isDisabled={hasSchedule(day)}
            className={`gap-3 text-[#634AE2] px-4 mx-1 my-1 rounded-full transition 
              ${
                fecha.dia === day
                  ? "bg-[#634AE2] text-white"
                  : hasSchedule(day)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#D2D2FF] hover:bg-[#B8B8FF]"
              }`}
          >
            {day}
          </Button>
        ))}
      </div>

      {/* ------------------- INPUT HORAS ------------------- */}
      <div className="flex flex-row my-10 justify-between space-x-5">
        <Input
          name="start"
          label="Hora de inicio"
          radius="full"
          labelPlacement="outside"
          type="time"
          step={3600}
          min="08:00"
          max="18:00"
          value={fecha.start}
          className="!text-[#634AE2] h-[43px]"
          onChange={handleTimeChange}
        />

        <Input
          name="end"
          label="Hora de fin"
          radius="full"
          step={3600}
          min="08:00"
          max="18:00"
          type="time"
          value={fecha.end}
          labelPlacement="outside"
          className="!text-[#634AE2] rounded-full h-[43px]"
          onChange={handleTimeChange}
        />
      </div>

      {/* ------------------- BOTÓN AGREGAR ------------------- */}
      <Button
        radius="full"
        className="bg-[#634AE2] mx-auto mb-10 px-10 text-white font-light"
        onPress={handleAddSchedule}
      >
        Agregar
      </Button>

      {/* ------------------- LISTA DE HORARIOS ------------------- */}
      <div>
        <p className="mx-auto text-center">Lista de horarios seleccionados</p>

        {horarios.length > 0 ? (
          <>
            <ScrollShadow className="max-h-80 h-auto " hideScrollBar>
              {horarios.map((horario) => (
                <div
                  key={horario.id}
                  className="flex flex-row items-center justify-between rounded-3xl px-6 py-5 my-2 bg-[#D2D2FF] text-[#634AE2]"
                >
                  <span>
                    {horario.dia}: {horario.start} - {horario.end}
                  </span>
                  <button
                    onClick={() => handleDeleteSchedule(horario.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#ababf8] transition"
                  >
                    <X color="white" size={20} />
                  </button>
                </div>
              ))}
            </ScrollShadow>
            <Button
              radius="full"
              onPress={handleUpdate}
              className="mx-auto text-white bg-purple-800/75 flex items-center"
            >
              Guardar horarios
            </Button>
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">No hay horarios agregados</p>
        )}
      </div>

      {/* ------------------- TABLA DE HISTORIAL (agregado) ------------------- */}
      <div className="mt-10">
        <p className="mx-auto text-center font-semibold">Historial de la última semana</p>

        {historial.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr className="text-gray-900">
                  <th className="border px-4 py-2">Fecha</th>
                  <th className="border px-4 py-2">Hora Inicio</th>
                  <th className="border px-4 py-2">Hora Fin</th>
                  <th className="border px-4 py-2">Turno</th> {/* Columna nueva */}
                </tr>
              </thead>
              <tbody>
                {historial.map((item) => (
                  <tr key={item.id} className="text-center  dark:text-gray-200">
                    <td className="border px-4 py-2">{item.fecha}</td>
                    <td className="border px-4 py-2">{item.hora_inicio}</td>
                    <td className="border px-4 py-2">{item.hora_fin}</td>
                   <td className="border px-4 py-2">{item.turno || getShiftFromTime(item.hora_inicio)}</td> {/* Nueva celda */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No hay historial disponible</p>
        )}


        
      </div>


      
    </div>






  );



}


