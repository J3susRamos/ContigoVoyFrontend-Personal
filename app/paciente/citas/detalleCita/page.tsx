"use client";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import HeaderPaciente from "../../components/HeaderPaciente";
import { Cita, Paciente } from "../../types/pacienteInterfaces";
import { Button } from "@heroui/react";
import { Video, RefreshCw, UploadCloud, ChevronLeft } from "lucide-react";
import { PostBoucher } from "../../apiRoutes";
import showToast from "@/components/ToastStyle";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { GetCita } from "../../apiRoutes";
import usePaciente from "../../hooks/usePaciente";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

const setCitaQuery = (setCita: Dispatch<SetStateAction<Cita | null>>, router : AppRouterInstance) => {
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
  const [cita, setCita] = useState<Cita | null>(null);
  const paciente = usePaciente();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setCitaQuery(setCita,router)
  }, []);

  const canNotUpload = Boolean(
    cita
      ? cita.bouchers?.some((boucher) => boucher.estado == "pendiente")
      : true
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
        {cita?.idCita}
        <hr />
        {cita?.fecha_cita}
        <hr />
        {cita?.hora_cita}
        <hr />
        <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Video className="w-4 h-4 text-purple-500" />
          <span>Videollamada en línea</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={cita?.estado_Cita !== "confirmada"}
          >
            <Video className="w-4 h-4 mr-2" />
            {cita?.estado_Cita === "confirmada"
              ? "Ingresar a videollamada"
              : "Cita pendiente"}
          </Button>

          <Button variant="shadow" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Volver a agendar
          </Button>
        </div>
        <hr />
        {!canNotUpload && (
          <div>
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
                  if (state) setCitaQuery(setCita,router);
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
                    <span className="font-medium">Haz clic para subir</span> o
                    arrastra el archivo
                  </p>
                  <p
                    className={`text-xs text-gray-500 pb-4 ${
                      preview ? "dark:text-gray-300" : "dark:text-gray-500"
                    } mt-1`}
                  >
                    PNG, JPG o PDF (MAX. 5MB)
                  </p>
                </label>
                <button className="w-full py-1 bg-slate-800" type="submit">
                  Subir Voucher
                </button>
              </form>
            </div>
          </div>
        )}

        <hr />
        <h3>Mis comprobantes</h3>
        {(cita?.bouchers ? cita.bouchers : []).map((b) => (
          <img key={b.idBoucher} src={b.imagen} />
        ))}
      </div>
    </div>
  );
};
export default DetalleCita;
