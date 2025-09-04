"use client";

import showToast from "@/components/ToastStyle";
import { Button, ScrollShadow } from "@heroui/react";
import { X } from "lucide-react";
import { parseCookies } from "nookies";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Spinner } from "@heroui/spinner";
import { TimeInput } from "@heroui/react";
import { parseTime, Time } from "@internationalized/date";

interface Horario {
  created_at: string;
  fecha: string;
  hora_fin: string;
  hora_inicio: string;
  idDisponibilidad: number;
  idPsicologo: number;
  turno: string;
  updated_at: string;
}

interface Historial {
  past: Horario[];
  future: Horario[];
}

interface TimesInterface {
  id: number;
  dia: string;
  start: string;
  end: string;
}

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const stringToTimeValue = (timeString: string) => {
  if (!timeString) return null;
  return parseTime(timeString);
};

const timeValueToString = (timeValue: Time | null) => {
  if (!timeValue) return "";
  const hh = String(timeValue.hour).padStart(2, "0");
  const mm = String(timeValue.minute).padStart(2, "0");
  return `${hh}:${mm}`;
};

function validateSession() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    showToast("error", "No se encontró el usuario en el almacenamiento local");
    return null;
  }
  const token = parseCookies()["session"];
  if (!token) {
    showToast("error", "No se encontró el token de autenticación");
    return null;
  }
  return token;
}

const getHistorialPsicologo = async (
  setHistorial: Dispatch<SetStateAction<Historial>>
) => {
  try {
    const token = validateSession();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/disponibilidad/last-next-7-days`,
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
    console.log(data);
    setHistorial({ future: data.data.future, past: data.data.last });
  } catch (err) {
    console.error(err);
  }
};

const postNuevosHorarios = async (horarios: TimesInterface[]) => {
  try {
    if (horarios.length === 0) {
      showToast("error", "No hay horarios para guardar");
      return false;
    }

    const token = validateSession();
    if (!token) return false;

    const getDateFromDay = (dayName: string): string => {
      const daysMap: Record<string, number> = {
        Lunes: 1,
        Martes: 2,
        Miércoles: 3,
        Jueves: 4,
        Viernes: 5,
        Sábado: 6,
      };

      const today = new Date();
      const todayDay = today.getDay();

      const adjustedTodayDay = todayDay === 0 ? 7 : todayDay;

      const targetDay = daysMap[dayName];
      let daysToAdd = targetDay - adjustedTodayDay;

      if (daysToAdd < 0) {
        daysToAdd += 7;
      }

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);

      return targetDate.toISOString().split("T")[0];
    };

    const getShiftFromTime = (time: string): string => {
      const hour = parseInt(time.split(":")[0]);
      return hour < 12 ? "Mañana" : "Tarde";
    };

    const formattedData = {
      fechas: horarios.map((horario) => ({
        fecha: getDateFromDay(horario.dia),
        hora_inicio: horario.start,
        hora_fin: horario.end,
        turno: getShiftFromTime(horario.start),
      })),
    };

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
      if (response.status === 422) {
        const errorMessage =
          errorData.description ||
          "Ya existe una disponibilidad en ese horario";
        showToast("error", errorMessage);
      } else {
        const errorMessage =
          errorData.message || "Error al actualizar horarios";
        showToast("error", errorMessage);
      }
      return false;
    }
    return true;
  } catch (error) {
    showToast(
      "error",
      error instanceof Error ? error.message : "Error al guardar horarios"
    );
    return false;
  }
};

export default function Week() {
  const [fecha, setFecha] = useState<TimesInterface>({
    id: 0,
    dia: "",
    start: "08:00",
    end: "18:00",
  });
  const [horarios, setHorarios] = useState<TimesInterface[]>([]);
  const [historial, setHistorial] = useState<Historial>({
    past: [],
    future: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const handleGetHistorial = async () => {
      await getHistorialPsicologo(setHistorial);
      setLoading(false);
    };
    handleGetHistorial();
  }, []);

  const hasSchedule = (day: string) => {
    return horarios.some((horario) => horario.dia === day);
  };

  const handleDayClick = (day: string) => {
    if (hasSchedule(day)) return;
    setFecha((prev) => ({ ...prev, dia: day }));
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

  const getShiftFromTime = (time: string): string => {
    const hour = parseInt(time.split(":")[0]);
    return hour < 12 ? "Mañana" : "Tarde";
  };

  const handleUpdate = async () => {
    setSaving(true);
    const status = await postNuevosHorarios(horarios);
    setSaving(false);
    if (status) {
      setLoading(true);
      await getHistorialPsicologo(setHistorial);
      setLoading(false);
    }
  };

  const handleDeleteSchedule = (id: number) => {
    setHorarios((prev) => prev.filter((item) => item.id !== id));
  };

  const historialFuturo = historial.future;
  const historialPasado = historial.past;
  
  return (
    <div className="mx-auto max-w-sm flex flex-col my-14 text-[#634AE2]">
      <span className="text-center my-5">
        Eliga tus días disponibles de esta semana
      </span>

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
        <TimeInput
          label="Hora de inicio"
          radius="full"
          labelPlacement="outside"
          hourCycle={24}
          granularity="hour"
          minValue={new Time(8)}
          maxValue={new Time(18)}
          value={stringToTimeValue(fecha.start)}
          className="!text-[#634AE2] h-[43px]"
          onChange={(timeValue) => {
            if (timeValue) {
              setFecha((prev) => ({
                ...prev,
                start: timeValueToString(timeValue), // Convertir de vuelta a string
              }));
            }
          }}
        />

        <TimeInput
          label="Hora de fin"
          radius="full"
          labelPlacement="outside"
          hourCycle={24}
          granularity="hour"
          minValue={new Time(8)}
          maxValue={new Time(18)}
          value={stringToTimeValue(fecha.end)}
          className="!text-[#634AE2] h-[43px]"
          onChange={(timeValue) => {
            if (timeValue) {
              setFecha((prev) => ({
                ...prev,
                end: timeValueToString(timeValue),
              }));
            }
          }}
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

            {saving ? (
              <div className="flex justify-center mt-5">
                <Spinner size="lg" />
              </div>
            ) : (
              <Button
                radius="full"
                onPress={handleUpdate}
                className="mx-auto text-white bg-purple-800/75 flex items-center"
              >
                Guardar horarios
              </Button>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No hay horarios agregados
          </p>
        )}
      </div>

      {/* ------------------- TABLA DE HISTORIAL (agregado) ------------------- */}
      <div className="mt-10">
        <p className="mx-auto text-center font-semibold">Historial</p>
        {loading ? (
          <div className="flex justify-center mt-6">
            <Spinner size="lg" />
          </div>
        ) : historialPasado.length > 0 || historialFuturo.length > 0 ? (
          <div className="overflow-x-auto mt-4 flex flex-col gap-y-8">
            <div>
              <p className="mx-auto text-center font-semibold">Última semana</p>
              {historialPasado.length > 0 ? (
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-200">
                    <tr className="text-gray-900">
                      <th className="border px-4 py-2">Fecha</th>
                      <th className="border px-4 py-2">Hora Inicio</th>
                      <th className="border px-4 py-2">Hora Fin</th>
                      <th className="border px-4 py-2">Turno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialPasado.map((item, i) => (
                      <tr key={i} className="text-center  text-gray-200">
                        <td className="border px-4 py-2">{item.fecha}</td>
                        <td className="border px-4 py-2">{item.hora_inicio}</td>
                        <td className="border px-4 py-2">{item.hora_fin}</td>
                        <td className="border px-4 py-2">
                          {item.turno || getShiftFromTime(item.hora_inicio)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">
                  No tiene horarios registrados en los ùltimos 7 dias
                </p>
              )}
            </div>
            <div>
              <p className="mx-auto text-center font-semibold">
                Próxima semana
              </p>
              {historialFuturo.length > 0 ? (
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-200">
                    <tr className="text-gray-900">
                      <th className="border px-4 py-2">Fecha</th>
                      <th className="border px-4 py-2">Hora Inicio</th>
                      <th className="border px-4 py-2">Hora Fin</th>
                      <th className="border px-4 py-2">Turno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialFuturo.map((item, i) => (
                      <tr key={i} className="text-center  text-gray-200">
                        <td className="border px-4 py-2">{item.fecha}</td>
                        <td className="border px-4 py-2">{item.hora_inicio}</td>
                        <td className="border px-4 py-2">{item.hora_fin}</td>
                        <td className="border px-4 py-2">
                          {item.turno || getShiftFromTime(item.hora_inicio)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No tiene pròximos horarios</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No hay historial disponible
          </p>
        )}
      </div>
    </div>
  );
}
