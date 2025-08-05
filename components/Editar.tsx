import { actualizarPsicologo, GetEspecialidadesPsicologos } from '@/app/apiRoutes';
import { UsuarioLocalStorageUpdate } from '@/interface';
import { convertImageToWebP, convertToBase64 } from '@/utils/convertir64';
import { Button, Modal, ModalBody, ModalContent } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import showToast from './ToastStyle';
import Image from "next/image";
import { Plus, X } from "lucide-react";

type Especialidad = { idEspecialidad: number; nombre: string };

function Editar({ isEditOpen, setIsEditOpen }: { isEditOpen: boolean; setIsEditOpen: (open: boolean) => void }) {

  const [user, setUser] = useState<UsuarioLocalStorageUpdate | null>(null);

  // Modal y formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [imagen, setImagen] = useState<string>("");
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
        setImagen(parsed.imagen || "");
        setEspecialidades(parsed.especialidades || []);
      }
    }
  }, []);

  // Cargar todas las especialidades
  useEffect(() => {
    const fetchAllEspecialidades = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/especialidades`);
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
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const body = {
        nombre: nombre,
        apellido: apellido,
        imagen: imagen,
        especialidades: especialidades,
      };
      await actualizarPsicologo(id as number, body);
      showToast("success", "Psicólogo actualizado correctamente");
      setIsEditOpen(false);

      // Actualiza el estado user y el localStorage
      const updatedUser: UsuarioLocalStorageUpdate = {
        ...user,
        nombre,
        apellido,
        imagen,
        especialidades,
        id: user?.id ?? 0,
        idpsicologo: user?.idpsicologo ?? 0,
        email: user?.email ?? "",
        rol: user?.rol ?? "",
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Recarga especialidades del psicólogo desde el backend
      if (id) {
        const especialidadesPsicologo = await GetEspecialidadesPsicologos(id as number);
        let nombres: string[] = [];
        if (Array.isArray(especialidadesPsicologo)) {
          nombres = especialidadesPsicologo.map((esp: string | { nombre: string }) =>
            typeof esp === "string" ? esp : esp.nombre
          );
        }
        setEspecialidades(nombres);
      }
    } catch (err) {
      showToast("error", "Error al actualizar el psicólogo");
      console.error("Error al actualizar el psicólogo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (

      <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen} className=" border-2 border-[#634AE2] rounded-lg">
        <ModalContent>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4 p-2">
              <div>
                <label className="block font-bold text-base text-[#634AE2] mb-2">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-full border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#634AE2] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-base text-[#634AE2] mb-2">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full rounded-full border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#634AE2] focus:border-transparent"
                  required
                />
              </div>
              {/* Imagen */}
              <h1 className="block font-bold text-base text-[#634AE2] mb-2 text-center">Imagen</h1>
              <div className="w-full flex flex-col gap-2 m-auto items-center ">
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
                      <Plus width={40} height={40} strokeWidth={2} className="text-card-foreground dark:text-card-foreground" />
                      <span className="text-sm mt-2">
                        Subir foto del paciente
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
                    onClick={() => setImagen('')}
                    aria-label="Eliminar imagen"
                  >
                    <X className="w-5 h-5 text-primary dark:bg-text-primary" />
                  </button>
                </div>
              </div>
              {/* Especialidades */}
              <div className="mt-6">
                <label className="block font-bold text-base text-[#634AE2] mb-2">
                  Especialidades
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allEspecialidades.map((esp) => (
                    <label key={esp.idEspecialidad} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={esp.nombre}
                        checked={Array.isArray(especialidades) && especialidades.includes(esp.nombre)}
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
              <div className="flex justify-end gap-2 mt-4">
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
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
  )
}

export default Editar