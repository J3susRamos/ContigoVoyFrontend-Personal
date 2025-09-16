"use client";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import HeaderPaciente from "../../components/HeaderPaciente";
import { Cita } from "../../types/pacienteInterfaces";
import { Video, RefreshCw, UploadCloud, ChevronLeft } from "lucide-react";
import { PostBoucher } from "../../apiRoutes";
import showToast from "@/components/ToastStyle";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { GetCita, ReprogramarCita } from "../../apiRoutes";
import usePaciente from "../../hooks/usePaciente";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NoDataBox } from "../../components/NoDataBox";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

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

const validateImageFile = async (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    showToast(
      "error",
      `La imagen ${file.name} es demasiado grande. Máximo 5MB.`
    );
    return "";
  }

  if (!file.type.startsWith("image/")) {
    showToast("error", `${file.name} no es un archivo de imagen válido.`);
    return "";
  }

  return imageToBase64(file);
};

const joinVideoCall = (link: string | undefined | null) => {
  if (link) window.open(link, "_blank");
};

const setCitaQuery = (
  setCita: Dispatch<SetStateAction<Cita | null>>,
  router: AppRouterInstance
) => {
  const citaStorage = sessionStorage.getItem("miCita");
  if (citaStorage) {
    const getMyCita = async (id: number) => {
      const data = await GetCita(id);
      setCita(data.citas);
    };

    try {
      const formatCita = JSON.parse(citaStorage) as Cita;
      const idCita = formatCita.idCita;
      getMyCita(idCita);
    } catch (error) {
      console.error("Error al parsear la cita:", error);
      router.push("/paciente");
    }
  } else {
    router.push("/paciente");
  }
};

const DetalleCita = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cita, setCita] = useState<Cita | null>(null);
  const paciente = usePaciente();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setCitaQuery(setCita, router);
  }, [router]);

  const canNotUpload = Boolean(
    cita
      ? cita.bouchers?.some((boucher) =>
          ["pendiente", "aceptado"].includes(boucher.estado)
        ) || cita.estado_Cita != "Sin pagar"
      : true
  );

  const canReprogramate = ["Sin pagar", "Pendiente"].includes(
    cita?.estado_Cita ?? ""
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Primer archivo seleccionado
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    if (file && allowedTypes.includes(file.type)) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6">
        <HeaderPaciente paciente={paciente} />
        <button
          onClick={() => router.back()}
          className=" flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2"
        >
          <ChevronLeft strokeWidth={4} />
          Regresar
        </button>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Fecha Cita
                  </Label>
                  <p className="text-lg font-semibold">{cita?.fecha_cita}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Hora Cita
                  </Label>
                  <p className="text-lg font-semibold">{cita?.hora_cita}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Estado Cita
                  </Label>
                  <p className="text-lg font-semibold">{cita?.estado_Cita}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Fecha de pago límite
                  </Label>
                  <p className="text-lg font-semibold">{cita?.fecha_limite}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Terapeuta asignado
                  </Label>
                  <p className="text-lg font-semibold">
                    {cita?.apellidoPsicologo ? cita.apellidoPsicologo : ""}{" "}
                    {cita?.nombrePsicologo ? cita.nombrePsicologo : ""}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Identificador Cita
                  </Label>
                  <p className="text-lg font-semibold">{cita?.idCita}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-gray-400 mb-3 block">
                Motivo consulta
              </Label>
              <div className="max-h-[400px] text-justify leading-8 lg:leading-7 sm:max-h-[200px] overflow-auto">
                <p>{cita?.motivo_Consulta}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <hr />
        <Card>
          <CardContent className="p-4 space-y-6">
            <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Video className="w-4 h-4 text-purple-500" />
              <span>Videollamada en línea</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onPress={() => joinVideoCall(cita?.jitsi_url)}
                disabled={cita?.estado_Cita !== "Pendiente"}
                color={
                  cita?.estado_Cita === "Pendiente" ? "primary" : "secondary"
                }
              >
                <Video className="w-4 h-4 mr-2" />
                {cita?.estado_Cita === "Pendiente"
                  ? "Ingresar a videollamada"
                  : "Cita " + cita?.estado_Cita}
              </Button>

              <Button
                onPress={onOpen}
                variant="shadow"
                className="w-full"
                disabled={!canReprogramate}
                color={canReprogramate ? "warning" : "secondary"}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Volver a agendar
              </Button>
            </div>
          </CardContent>
        </Card>
        <hr />
        {!canNotUpload && (
          <>
            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-1">
                  Subir Comprobante
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
                    onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const fileImg = formData.get("files") as File;
                      const img64 = await validateImageFile(fileImg);
                      const state = await PostBoucher(cita?.idCita, img64);
                      if (state) setCitaQuery(setCita, router);
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
                          preview ? "dark:text-gray-200" : "dark:text-gray-400"
                        }`}
                      >
                        <span className="font-medium">Haz clic para subir</span>{" "}
                        o arrastra el archivo
                      </p>
                      <p
                        className={`text-xs text-gray-500 pb-4 ${
                          preview ? "dark:text-gray-300" : "dark:text-gray-500"
                        } mt-1`}
                      >
                        PNG, JPG o PDF (MAX. 5MB)
                      </p>
                    </label>
                    <button
                      className="w-full py-1 bg-slate-300 dark:bg-slate-800"
                      type="submit"
                    >
                      Subir Voucher
                    </button>
                  </form>
                </div>
              </CardContent>
            </Card>
            <hr />
          </>
        )}

        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-gray-400 mb-3 block">
              Vouchers subidos
            </Label>

            {cita?.bouchers && cita.bouchers.length > 0 ? (
              cita.bouchers.map((b) => (
                <div
                  className="flex flex-col sm:flex-row gap-x-8 mb-3 border-2 border-slate-300 dark:border-purple-700 p-6 rounded-md box-border"
                  key={b.codigo}
                >
                  <div className="w-[300px] h-[300px] relative border-2 border-slate-200 dark:border-gray-500 rounded-md">
                    <Image
                      alt="Voucher Paciente"
                      key={b.idBoucher}
                      src={b.imagen}
                      fill
                      className="object-scale-down"
                    />
                  </div>

                  <div className="flex-1 grid items-center grid-cols sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-400">
                        Identificador Voucher
                      </Label>
                      <p className="text-lg font-semibold">{b.codigo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400">
                        Fecha subida
                      </Label>
                      <p className="text-lg font-semibold">{b.fecha}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400">
                        Estado voucher
                      </Label>
                      <p className="text-lg font-semibold">{b.estado}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoDataBox info="Usted no ha subido vouchers para esta cita" />
            )}
          </CardContent>
        </Card>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-warning-400">
                ¿Seguro de reprogramar su cita?
              </ModalHeader>
              <ModalBody>
                <p className="text-md">Esta acción no se puede deshacer.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (cita) {
                      ReprogramarCita(cita.idCita).then((res) => {
                        if (res) setCitaQuery(setCita, router);
                        onClose();
                      });
                    }
                  }}
                >
                  Reprogramar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default DetalleCita;
