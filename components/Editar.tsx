import {
  actualizarPsicologo,
  actualizarPerfilCompletoPsicologo,
  GetEspecialidadesPsicologos,
} from "@/app/apiRoutes";
import { UsuarioLocalStorageUpdate } from "@/interface";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { Button, Modal, ModalBody, ModalContent, Input, Textarea, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import showToast from "./ToastStyle";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Flags } from "@/utils/flagsPsicologos";

type Especialidad = { idEspecialidad: number; nombre: string };

function Editar({
  isEditOpen,
  setIsEditOpen,
  onUpdateUser,
}: {
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  onUpdateUser: (user: UsuarioLocalStorageUpdate) => void;
}) {
  const [user, setUser] = useState<UsuarioLocalStorageUpdate | null>(null);

  // Datos personales
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [imagen, setImagen] = useState<string>("");
  
  // Datos profesionales del psicólogo
  const [titulo, setTitulo] = useState("");
  const [introduccion, setIntroduccion] = useState("");
  const [pais, setPais] = useState("");
  const [genero, setGenero] = useState("");
  const [experiencia, setExperiencia] = useState<number>(0);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [allEspecialidades, setAllEspecialidades] = useState<Especialidad[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as UsuarioLocalStorageUpdate;
        setUser(parsed);
        setNombre(parsed.nombre || "");
        setApellido(parsed.apellido || "");
        setEmail(parsed.email || "");
        setImagen(parsed.imagen || "");
        setEspecialidades(parsed.especialidades || []);
        
        // Fetch additional psicólogo data if it's a psychologist
        if (parsed.rol === 'PSICOLOGO' && parsed.idpsicologo) {
          fetchPsicologoData(parsed.idpsicologo);
        }
      }
    }
  }, []);

  const fetchPsicologoData = async (idPsicologo: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/psicologos/show/${idPsicologo}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('session') || '""')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const psicologoData = data.result;
        
        setTitulo(psicologoData.titulo || "");
        setIntroduccion(psicologoData.introduccion || "");
        setPais(psicologoData.pais || "");
        setGenero(psicologoData.genero || "");
        setExperiencia(psicologoData.experiencia || 0);
        setFechaNacimiento(psicologoData.fecha_nacimiento || "");
      }
    } catch (error) {
      console.error("Error fetching psicólogo data:", error);
    }
  };

  // Cargar todas las especialidades
  useEffect(() => {
    const fetchAllEspecialidades = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/especialidades`
        );
        const data = await res.json();
        if (Array.isArray(data.result)) {
          setAllEspecialidades(data.result);
        }
      } catch (e) {
        console.log(e);
        setAllEspecialidades([]);
      }
    };
    fetchAllEspecialidades();
  }, []);

  useEffect(() => {
    const fetchEspecialidadesPsicologo = async () => {
      try {
        const id = user?.idpsicologo || user?.id;
        if (id && isEditOpen) {
          const response = await GetEspecialidadesPsicologos(id as number);
          if (response && Array.isArray(response.result)) {
            setEspecialidades(response.result);
          } else {
            setEspecialidades([]);
          }
        }
      } catch (e) {
        console.log(e);
        setEspecialidades([]);
      }
    };
    fetchEspecialidadesPsicologo();
  }, [isEditOpen, user]);

  // Manejo de imagen (WebP y base64)
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const webpImage = await convertImageToWebP(file);
      const base64 = await convertToBase64(webpImage);
      setImagen(base64);
    } catch (error) {
      showToast("error", "Error al procesar la imagen");
      console.log(error);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = user?.idpsicologo || user?.id;
      
      if (user?.rol === 'PSICOLOGO') {
        // For psychologists, use the comprehensive update
        const dataCompleta = {
          nombre,
          apellido,
          email: user.email, // Mantener el email original, no permitir cambios
          fecha_nacimiento: fechaNacimiento,
          imagen,
          titulo,
          introduccion,
          pais,
          genero,
          experiencia,
          especialidades,
        };

        await actualizarPerfilCompletoPsicologo(id as number, dataCompleta);
        showToast("success", "Perfil actualizado correctamente");
      } else {
        // For other roles, use the existing simple update
        const body = {
          nombre: nombre,
          apellido: apellido,
          imagen: imagen,
          especialidades: especialidades,
        };
        await actualizarPsicologo(id as number, body);
        showToast("success", "Perfil actualizado correctamente");
      }
      
      setIsEditOpen(false);

      // Actualiza el estado user y el localStorage en el componente padre
      const updatedUser: UsuarioLocalStorageUpdate = {
        ...user,
        nombre,
        apellido,
        email: user?.email || email, // Mantener el email original
        imagen,
        especialidades,
        id: user?.id ?? 0,
        idpsicologo: user?.idpsicologo ?? 0,
        rol: user?.rol ?? "",
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);

      // Recarga especialidades del psicólogo desde el backend
      if (id) {
        const especialidadesPsicologo = await GetEspecialidadesPsicologos(id as number);
        if (especialidadesPsicologo && Array.isArray(especialidadesPsicologo.result)) {
          setEspecialidades(especialidadesPsicologo.result);
        }
      }
    } catch (err) {
      showToast("error", "Error al actualizar el perfil");
      console.error("Error al actualizar el perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isEditOpen}
      onOpenChange={setIsEditOpen}
      className="border-2 border-[#634AE2] rounded-lg xl:min-w-[900px] max-md:flex max-md:flex-col"
    >
      <ModalContent>
        <ModalBody>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-2 grid xl:grid-cols-2 max-xl:grid-cols-1 gap-4"
          >
            {/* Primera columna - Datos personales e imagen */}
            <div>
              {/* Datos personales básicos */}
              <div>
                <label className="block font-bold text-base text-[#634AE2] py-2 mt-2">
                  Nombre
                </label>
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-full"
                  classNames={{
                    input: "focus:outline-none",
                    inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                  }}
                  required
                />
              </div>
              
              <div>
                <label className="block font-bold text-base text-[#634AE2] mb-2">
                  Apellido
                </label>
                <Input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full rounded-full"
                  classNames={{
                    input: "focus:outline-none",
                    inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                  }}
                  required
                />
              </div>

              {user?.rol === 'PSICOLOGO' && (
                <>
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full"
                      classNames={{
                        input: "focus:outline-none",
                        inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                      }}
                      isDisabled
                      description="El email no puede ser modificado por seguridad"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-base text-[#634AE2] mb-2">
                      Fecha de Nacimiento
                    </label>
                    <Input
                      type="date"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="w-full rounded-full"
                      classNames={{
                        input: "focus:outline-none",
                        inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                      }}
                    />
                  </div>
                </>
              )}

              {/* Imagen */}
              <h1 className="block font-bold text-base text-[#634AE2] mb-2 text-center mt-4">
                Imagen de Perfil
              </h1>
              <div className="w-full flex flex-col gap-2 m-auto items-center">
                <div className="relative border-2 border-[#634AE2] rounded-lg h-[220px] w-[220px] bg-[#F3F3F3] dark:bg-input flex justify-center items-center cursor-pointer overflow-hidden">
                  {imagen ? (
                    <Image
                      src={imagen}
                      alt="Imagen seleccionada"
                      width={220}
                      height={220}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Plus
                        width={40}
                        height={40}
                        strokeWidth={2}
                        className="text-card-foreground dark:text-card-foreground"
                      />
                      <span className="text-sm mt-2">
                        Subir foto de perfil
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white/80 dark:bg-white/80 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-100 transition-colors"
                    onClick={() => setImagen("")}
                    aria-label="Eliminar imagen"
                  >
                    <X className="w-5 h-5 text-primary dark:bg-text-primary" />
                  </button>
                </div>
              </div>
            </div>

            {/* Segunda columna - Datos profesionales */}
            <div className="min-w-[400px] pt-1 flex flex-col justify-between">
              {user?.rol === 'PSICOLOGO' ? (
                <>
                  {/* Título profesional */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] mb-2">
                      Título Profesional
                    </label>
                    <Input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej: Psicólogo Clínico"
                      className="w-full rounded-full"
                      classNames={{
                        input: "focus:outline-none",
                        inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                      }}
                    />
                  </div>

                  {/* Introducción */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] mb-2">
                      Introducción Profesional
                    </label>
                    <Textarea
                      value={introduccion}
                      onChange={(e) => setIntroduccion(e.target.value)}
                      placeholder="Describe tu experiencia y enfoque profesional..."
                      maxRows={4}
                      className="w-full"
                      classNames={{
                        input: "focus:outline-none",
                        inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                      }}
                    />
                  </div>

                  {/* País */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] mb-2">
                      País
                    </label>
                    <Select
                      selectedKeys={pais ? [pais] : []}
                      onSelectionChange={(keys) => setPais(Array.from(keys)[0] as string)}
                      placeholder="Selecciona tu país"
                      className="w-full"
                      classNames={{
                        trigger: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                      }}
                    >
                      {Flags.map((flag) => (
                        <SelectItem key={flag.value}>
                          {flag.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Género */}
                    <div>
                      <label className="block font-bold text-base text-[#634AE2] mb-2">
                        Género
                      </label>
                      <Select
                        selectedKeys={genero ? [genero] : []}
                        onSelectionChange={(keys) => setGenero(Array.from(keys)[0] as string)}
                        placeholder="Selecciona"
                        className="w-full"
                        classNames={{
                          trigger: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                        }}
                      >
                        <SelectItem key="Masculino">Masculino</SelectItem>
                        <SelectItem key="Femenino">Femenino</SelectItem>
                        <SelectItem key="Otro">Otro</SelectItem>
                      </Select>
                    </div>

                    {/* Experiencia */}
                    <div>
                      <label className="block font-bold text-base text-[#634AE2] mb-2">
                        Experiencia (años)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={experiencia.toString()}
                        onChange={(e) => setExperiencia(parseInt(e.target.value) || 0)}
                        className="w-full rounded-full"
                        classNames={{
                          input: "focus:outline-none",
                          inputWrapper: "border focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2]"
                        }}
                      />
                    </div>
                  </div>

                  {/* Especialidades */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] mb-2">
                      Especialidades
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {allEspecialidades.map((esp) => (
                        <label
                          key={esp.idEspecialidad}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            value={esp.nombre}
                            checked={
                              Array.isArray(especialidades) &&
                              especialidades.includes(esp.nombre)
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEspecialidades((prev) => [...prev, esp.nombre]);
                              } else {
                                setEspecialidades((prev) =>
                                  prev.filter((item) => item !== esp.nombre)
                                );
                              }
                            }}
                            className="accent-[#634AE2] min-w-4 min-h-4"
                          />
                          <span className="text-[#634AE2] text-sm">{esp.nombre}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {especialidades.map((esp) => (
                        <span
                          key={esp}
                          className="bg-[#634AE2] text-white px-3 py-1 rounded-full text-xs"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Para otros roles, mostrar solo especialidades */
                <div>
                  <label className="block font-bold text-base text-[#634AE2] mb-2">
                    Especialidades
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allEspecialidades.map((esp) => (
                      <label
                        key={esp.idEspecialidad}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={esp.nombre}
                          checked={
                            Array.isArray(especialidades) &&
                            especialidades.includes(esp.nombre)
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEspecialidades((prev) => [...prev, esp.nombre]);
                            } else {
                              setEspecialidades((prev) =>
                                prev.filter((item) => item !== esp.nombre)
                              );
                            }
                          }}
                          className="accent-[#634AE2] min-w-4 min-h-4"
                        />
                        <span className="text-[#634AE2]">{esp.nombre}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {especialidades.map((esp) => (
                      <span
                        key={esp}
                        className="bg-[#634AE2] text-white px-3 py-1 rounded-full text-xs"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-2 mt-4">
                <Button
                  type="button"
                  variant="light"
                  onPress={() => setIsEditOpen(false)}
                  className="rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="rounded-full"
                  color="primary"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default Editar;
