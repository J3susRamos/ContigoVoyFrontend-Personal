"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DatePicker, DateValue } from "@heroui/react";

import { ChevronLeft } from "lucide-react";

import HeaderPaciente from "../components/HeaderPaciente";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";

import useSelector from "../hooks/useSelector";
import CustomSelector from "../custom/CustomSelector";
import CitaPreviewCard from "../components/CitaPreviewCard";

import { Cita } from "../types/pacienteInterfaces";
import { pageSizes, estadosCita, estadosVoucher } from "../utils/constants";
import { GetCitas } from "../apiRoutes";
import { formatDate } from "../utils/formatDate";
import usePaciente from "../hooks/usePaciente";

const Citas = () => {
  const router = useRouter();

  const paciente = usePaciente();

  const [startDayFilter, setStartDayFilter] = useState<DateValue | null>(null);
  const [endDayFilter, setEndDayFilter] = useState<DateValue | null>(null);

  const [pageSize, handlerpageSize] = useSelector("2");
  const [selectedCitaState, handlerChangeCitaState] = useSelector();
  const [selectedVoucherState, handlerChangeVoucherState] = useSelector();

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showedCitas, setShowedCitas] = useState<Cita[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      try {
        const data = await GetCitas(
          currentPage,
          +pageSize,
          "",
          "",
          startDayFilter,
          endDayFilter,
          signal
        );
        const citasResponse = data.citas;
        const citasInfo = citasResponse.data as Cita[];
        const formatCitas = citasInfo.map((c) => ({
          ...c,
          fecha_cita: formatDate(c.fecha_cita),
        }));

        setShowedCitas(formatCitas);
        setLastPage(citasResponse.last_page);
        setLoading(false);
      } catch (error: any) {
        if (error.name != "AbortError") {
          console.error("Error fetching citas:", error);
        }
      }
    }
    fetchData();

    return () => controller.abort();
  }, [currentPage, pageSize, startDayFilter, endDayFilter]);

  const errorDatePicker = { start: "", end: "" };
  if (startDayFilter && endDayFilter) {
    if (startDayFilter.compare(endDayFilter) > 0) {
      errorDatePicker.start = "Rango de fechas incorrecto";
      errorDatePicker.end = "!!";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6">
        <HeaderPaciente paciente={paciente} />
        <div className="flex flex-col gap-y-5 mb-5">
          <div className="order-1 flex flex-col gap-y-5">
            <Link href="/paciente" className="sm:w-scv10">
              <button className=" flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2">
                <ChevronLeft strokeWidth={4} />
                Regresar
              </button>
            </Link>

            <h1 className="w-fit block text-cv8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
              Mis citas
            </h1>
          </div>

          <div className="order-7 sm:order-2 flex flex-col lg:flex-row gap-y-scv5 items-center lg:justify-between w-full">
            <div className="w-full lg:w-[50%] flex flex-col sm:flex-row gap-4">
              <CustomSelector
                items={estadosCita}
                value={selectedCitaState}
                handleSelectionChange={handlerChangeCitaState}
                label="Estado cita"
              />
              <CustomSelector
                items={estadosVoucher}
                value={selectedVoucherState}
                handleSelectionChange={handlerChangeVoucherState}
                label="Estado voucher"
              />
              <CustomSelector
                items={pageSizes}
                value={pageSize}
                handleSelectionChange={(e) =>
                  handlerpageSize(e, () => {
                    setCurrentPage(1);
                  })
                }
                label="Tamaño de página"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-fit">
              <DatePicker
                className="w-full sm:w-[180px]"
                classNames={{
                  inputWrapper: "text-card-foreground shadow bg-card border",
                }}
                labelPlacement="outside"
                label="Inicio rango fecha"
                value={startDayFilter}
                onChange={setStartDayFilter}
                isInvalid={!!errorDatePicker.start}
                errorMessage={errorDatePicker.start}
              />
              <DatePicker
                className="w-full sm:w-[180px]"
                classNames={{
                  inputWrapper: "text-card-foreground shadow bg-card border",
                }}
                labelPlacement="outside"
                label="Fin rango fecha"
                value={endDayFilter}
                onChange={setEndDayFilter}
                isInvalid={!!errorDatePicker.end}
                errorMessage={errorDatePicker.end}
              />
            </div>
          </div>

          <hr className="order-6 sm:order-3 mb-scv4 sm:mb-0" />

          <div className="order-4">
            {showedCitas === null ? (
              <div>Cargando...</div>
            ) : showedCitas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 !mb-scv3 auto-rows-fr h-full">
                {showedCitas.map((cita) => (
                  <div key={cita.idCita} className="relative h-full">
                    {loading && (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-70 animate-pulse z-10 pointer-events-none rounded-md" />
                    )}
                    <div
                      className={
                        loading
                          ? "pointer-events-none opacity-50 h-full"
                          : "h-full"
                      }
                    >
                      <CitaPreviewCard cita={cita} router={router} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Usted no tiene citas registradas</p>
            )}
          </div>

          <div className="order-5">
            <Pagination
              onNext={() => setCurrentPage((prev) => prev + 1)}
              onPrevious={() => setCurrentPage((prev) => prev - 1)}
              totalPages={lastPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Citas;
