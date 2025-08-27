"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Button,
  useDisclosure,
  DatePicker,
  DateValue,
} from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  UploadCloud,
  Video,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import showToast from "@/components/ToastStyle";

import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import HeaderPaciente from "../components/HeaderPaciente";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";

import useSelector from "../hooks/useSelector";
import CustomSelector from "../custom/CustomSelector";
import CitaPreviewCard from "../components/CitaPreviewCard";

import { Cita, Paciente } from "../types/pacienteInterfaces";
import { pageSizes, estadosCita, estadosVoucher } from "../utils/constants"
import { GetCitas, PostBoucher } from "../apiRoutes";
import { formatDate } from "../utils/formatDate";

const imageToBase64 = async (file: File) => {
  try {
    showToast("info", `Procesando imagen`);
    const webpImage = await convertImageToWebP(file);
    const base64 = await convertToBase64(webpImage);
    if (base64.length > 400000) {
      showToast(
        "error",
        `La imagen ${file.name} procesada sigue siendo muy grande. Intenta con una imagen más pequeña.`
      );
      return "";
    }
    showToast("success", `imagen(es) cargada(s) correctamente.`);
    return base64;
  } catch (error) {
    console.error(`Error processing image ${file.name}:`, error);
    showToast("error", `Error al procesar ${file.name}. Intenta nuevamente.`);
    return "";
  }
};

// const validateImageFile = async (file: File) => {
//   if (file.size > 5 * 1024 * 1024) {
//     showToast(
//       "error",
//       `La imagen ${file.name} es demasiado grande. Máximo 5MB.`
//     );
//     return "";
//   }

//   if (!file.type.startsWith("image/")) {
//     showToast("error", `${file.name} no es un archivo de imagen válido.`);
//     return "";
//   }

//   return imageToBase64(file);
// };

const initializePaciente = (setPaciente : Dispatch<SetStateAction<Paciente | null>>) => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.rol === "PACIENTE") {
          setPaciente({
            id: +user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email || "paciente@contigo.voy",
            telefono: user.telefono || "+51 999 888 777",
            fechaNacimiento: user.fechaNacimiento || "1990-01-01",
          });
        }
      }
    }
  };

const Citas = () => {
  
  // const {isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [paciente, setPaciente] = useState<Paciente | null>(null);

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
      } catch (error : any) {
        if (error.name != 'AbortError') {
          console.error("Error fetching citas:", error);
        } 
      }
    }
    fetchData();
    
    return () => controller.abort();

  }, [currentPage, pageSize, startDayFilter, endDayFilter]);

  useEffect(() => {
    initializePaciente(setPaciente);
  }, []);

  const errorDatePicker = { start: "", end: "" };
  if (startDayFilter && endDayFilter) {
    if (startDayFilter.compare(endDayFilter) > 0) {
      errorDatePicker.start = "Rango de fechas incorrecto";
      errorDatePicker.end = "!!";
    }
  }

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]; // Primer archivo seleccionado
  //   const allowedTypes = [
  //     "image/png",
  //     "image/jpeg",
  //     "image/webp",
  //     "application/pdf",
  //   ];
  //   if (file && allowedTypes.includes(file.type)) {
  //     const objectUrl = URL.createObjectURL(file);
  //     setPreview(objectUrl);
  //   }
  // };

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
                {showedCitas.map((cita) =>  (
                  <div key={cita.idCita} className="relative h-full">
                    {loading && (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-70 animate-pulse z-10 pointer-events-none rounded-md" />
                    )}
                    <div className={loading ? "pointer-events-none opacity-50 h-full" : "h-full"}>
                      <CitaPreviewCard cita={cita}/>
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
        {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Mi cita
                </ModalHeader>
                <ModalBody>
                  {selectedCita?.idCita}
                  <hr />
                  {selectedCita?.fecha_cita}
                  <hr />
                  {selectedCita?.hora_cita}
                  <hr />
                  <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Video className="w-4 h-4 text-purple-500" />
                    <span>Videollamada en línea</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full"
                      disabled={selectedCita?.estado_Cita !== "confirmada"}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {selectedCita?.estado_Cita === "confirmada"
                        ? "Ingresar a videollamada"
                        : "Cita pendiente"}
                    </Button>

                    <Button variant="shadow" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Volver a agendar
                    </Button>
                  </div>
                  <hr />
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Comprobante
                    </label>
                    <div
                      style={{
                        backgroundImage: preview
                          ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${preview})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        borderStyle: preview ? "solid" : "dashed",
                      }}
                      className="border-2 border-dashed rounded-lg  text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <form
                        method="post"
                        onSubmit={async (
                          e: React.FormEvent<HTMLFormElement>
                        ) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const fileImg = formData.get("files") as File;
                          const img64 = await validateImageFile(fileImg);
                          await PostBoucher(selectedCita?.idCita, img64);
                        }}
                      >
                        <input
                          name="files"
                          type="file"
                          className="hidden"
                          id="file-upload"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="cursor-pointe">
                          <UploadCloud
                            className={`pt-6 box-content w-8 h-8 mx-auto ${
                              preview ? "text-gray-200" : "text-gray-400"
                            } mb-2`}
                          />
                          <p
                            className={`text-sm text-gray-600 ${
                              preview
                                ? "dark:text-gray-200"
                                : "dark:text-gray-400"
                            }`}
                          >
                            <span className="font-medium">
                              Haz clic para subir
                            </span>{" "}
                            o arrastra el archivo
                          </p>
                          <p
                            className={`text-xs text-gray-500 pb-4 ${
                              preview
                                ? "dark:text-gray-300"
                                : "dark:text-gray-500"
                            } mt-1`}
                          >
                            PNG, JPG o PDF (MAX. 5MB)
                          </p>
                        </label>
                        <button
                          className="w-full py-1 bg-slate-800"
                          type="submit"
                        >
                          Subir Voucher
                        </button>
                      </form>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal> */}
      </div>
    </div>
  );
};

export default Citas;
