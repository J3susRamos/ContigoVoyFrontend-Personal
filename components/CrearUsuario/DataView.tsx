import { FormData } from "@/interface";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  Textarea,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import { toast, Zoom } from "react-toastify";
import Image from "next/image";

export const DataView = ({
  formData,
  onBack,
  setFormData,
  setIsSend,
}: {
  formData: FormData;
  onBack: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setIsSend: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSubmit = async (e: React.FormEvent) => {                                                                        
    e.preventDefault();
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/psicologos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, especialidades: especialidad }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsSend(true);
        console.log("Éxito:", data.description);
      } else {
        if (
          data.errors &&
          data.errors.email &&
          data.errors.email.includes("The email has already been taken.")
        ) {
          toast.warning(
            "El email ya está siendo utilizado por otra cuenta. Por favor, utiliza un email diferente.",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: 1,
              theme: "colored",
              transition: Zoom,
            }
          );
        } else {
          toast.warn(
            data.message || "Ha ocurrido un error al procesar tu solicitud.",
            {
              position: "bottom-right",
              autoClose: 1300,
            }
          );
        }
        console.error(
          "Error en la solicitud:",
          data.message || "Error desconocido"
        );
        console.error("Detalles:", data.errors || "No hay detalles");
      }
    } catch (error) {
      toast.error("Error de conexión. Por favor, intenta de nuevo más tarde.", {
        position: "top-center",
        autoClose: 1300,
      });
      console.error("Error al enviar al backend:", error);
    }
  };
  
  const especialidadesMap: Record<string, number> = {
    "cognitivo-conductual": 1,
    neuropsicologia: 2,
    psicoanalisis: 3,
    psicopedagogia: 4,
    gestalt: 5,
    "racional-emotivo": 6,
  };
  
  const [base64Image, setBase64Image] = useState<string | null>(null);
  
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Convertir la imagen a WebP
    const webpImage = await convertImageToWebP(file);
    // Convertir la imagen WebP a Base64
    const base64 = await convertToBase64(webpImage);
    setBase64Image(base64);
    setFormData({ ...formData, imagen: base64 });
  };
  
  const [especialidad, setEspecialidad] = useState<number[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  
  const handleEspecialidadesChange = (values: string[]) => {
    const especialidadesNumeros = values.map(
      (value) => especialidadesMap[value]
    );
    setEspecialidad(especialidadesNumeros);
    setFormData({ ...formData, especialidades: especialidadesNumeros });
    setIsInvalid(especialidadesNumeros.length < 1);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
        <div className="text-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
            ¡Hola {formData.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete la información profesional
          </p>
        </div>
        
        <Form validationBehavior="native" onSubmit={handleSubmit}>
          {/* Layout Mobile - Columna vertical */}
          <div className="flex flex-col gap-8 md:hidden">
            {/* Foto en mobile */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white text-base mb-4">Foto de perfil</h3>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary rounded-xl h-48 w-full flex justify-center items-center cursor-pointer overflow-hidden bg-white dark:bg-gray-700 transition-all duration-200 shadow-sm">
                {base64Image ? (
                  <Image
                    src={formData.imagen}
                    alt="Imagen seleccionada"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Plus className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">Haga clic para subir foto</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Formato JPG, PNG o WebP</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    try {
                      await handleImageUpload(e);
                    } catch (error) {
                      console.error("Error processing image:", error);
                      toast.error("Error processing image. Please try again.", {
                        position: "top-center",
                        autoClose: 1300,
                      });
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Introducción en mobile */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <Textarea
                isRequired
                value={formData.introduccion ?? ""}
                minLength={100}
                maxLength={350}
                classNames={{
                  label: "text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base",
                  inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm",
                  input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3",
                  innerWrapper: "min-h-[120px]",
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    introduccion: value,
                  });
                }}
                label="Introducción profesional"
                labelPlacement="outside"
                placeholder="Describe tu experiencia y enfoque profesional..."
                variant="bordered"
                radius="lg"
                description={`${
                  formData.introduccion?.length || 0
                }/350 caracteres (mínimo 100)`}
              />
            </div>
            
            {/* Experiencia en mobile */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <Input
                label="Años de experiencia"
                isRequired
                min={0}
                placeholder="Ingrese los años de experiencia"
                labelPlacement="outside"
                radius="lg"
                value={formData.experiencia.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experiencia: parseInt(e.target.value) || 0,
                  })
                }
                classNames={{
                  label: "text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base",
                  inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm",
                  input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3",
                }}
                type="number"
                variant="bordered"
              />
            </div>
            
            {/* Especialidades en mobile */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <CheckboxGroup
                isRequired
                orientation="vertical"
                description="Seleccione las especialidades que domina"
                isInvalid={isInvalid}
                label="Especialidades"
                classNames={{
                  label: "text-gray-800 dark:text-gray-200 font-semibold text-base mb-2",
                  description: "text-gray-600 dark:text-gray-400 mb-4",
                }}
                onValueChange={handleEspecialidadesChange}
                defaultValue={[Object.keys(especialidadesMap)[0]]}
              >
                <div className="grid grid-cols-1 gap-3 w-full mt-3">
                  {Object.keys(especialidadesMap).map((clave) => (
                    <div key={clave} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <Checkbox
                        color="primary"
                        classNames={{
                          label: "text-gray-900 dark:text-white font-medium capitalize",
                          wrapper: "before:border-gray-300 dark:before:border-gray-600",
                        }}
                        value={clave}
                      >
                        {clave.replace(/-/g, ' ')}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </CheckboxGroup>
            </div>
          </div>

          {/* Layout Desktop - Grid mejorado */}
          <div className="hidden md:grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white text-base mb-4">Foto de perfil</h3>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary rounded-xl h-56 w-full flex justify-center items-center cursor-pointer overflow-hidden bg-white dark:bg-gray-700 transition-all duration-200 shadow-sm">
                  {base64Image ? (
                    <Image
                      src={formData.imagen}
                      alt="Imagen seleccionada"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Plus className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-base text-gray-600 dark:text-gray-400 font-medium">Haga clic para subir foto</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Formato JPG, PNG o WebP</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      try {
                        await handleImageUpload(e);
                      } catch (error) {
                        console.error("Error processing image:", error);
                        toast.error("Error processing image. Please try again.", {
                          position: "top-center",
                          autoClose: 1300,
                        });
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <Input
                  label="Años de experiencia"
                  isRequired
                  min={0}
                  placeholder="Ingrese los años de experiencia"
                  labelPlacement="outside"
                  radius="lg"
                  value={formData.experiencia.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experiencia: parseInt(e.target.value) || 0,
                    })
                  }
                  classNames={{
                    label: "text-gray-800 dark:text-gray-200 font-medium mb-1 pl-1",
                    inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-colors",
                    input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  }}
                  type="number"
                  variant="bordered"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Textarea
                  isRequired
                  value={formData.introduccion ?? ""}
                  minLength={100}
                  maxLength={350}
                  classNames={{
                    label: "text-gray-800 dark:text-gray-200 font-medium mb-1 pl-1",
                    inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-colors",
                    input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    innerWrapper: "min-h-[100px]",
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      introduccion: value,
                    });
                  }}
                  label="Introducción profesional"
                  labelPlacement="outside"
                  placeholder="Describe tu experiencia y enfoque profesional..."
                  variant="bordered"
                  radius="lg"
                  description={`${
                    formData.introduccion?.length || 0
                  }/350 caracteres (mínimo 100)`}
                />
              </div>
              
              <div>
                <CheckboxGroup
                  isRequired
                  orientation="vertical"
                  description="Seleccione las especialidades que domina"
                  isInvalid={isInvalid}
                  label="Especialidades"
                  classNames={{
                    label: "text-gray-800 dark:text-gray-200 font-medium text-base pl-1",
                    description: "text-gray-600 dark:text-gray-400 pl-1",
                  }}
                  onValueChange={handleEspecialidadesChange}
                  defaultValue={[Object.keys(especialidadesMap)[0]]}
                >
                  <div className="grid grid-cols-1 gap-3 w-full mt-3">
                    {Object.keys(especialidadesMap).map((clave) => (
                      <div key={clave} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <Checkbox
                          color="primary"
                          classNames={{
                            label: "text-gray-900 dark:text-white font-medium capitalize",
                            wrapper: "before:border-gray-300 dark:before:border-gray-600",
                          }}
                          value={clave}
                        >
                          {clave.replace(/-/g, ' ')}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </CheckboxGroup>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-6 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            <Button
              radius="lg"
              variant="bordered"
              size="lg"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all duration-200"
              onPress={onBack}
            >
              Volver Atrás
            </Button>
            <Button
              radius="lg"
              type="submit"
              size="lg"
              className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Registrar Psicólogo
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
