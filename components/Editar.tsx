import {
  actualizarPsicologo,
  actualizarPerfilCompletoPsicologo,
  GetEspecialidadesPsicologos,
} from "@/app/apiRoutes";
import { UsuarioLocalStorageUpdate } from "@/interface";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import showToast from "./ToastStyle";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Flags } from "@/utils/flagsPsicologos";

type Especialidad = { idEspecialidad: number; nombre: string };
type Idioma = { idIdioma: number; nombre: string };

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
  const [celular, setCelular] = useState<string>(""); // NUEVO

  // Datos profesionales
  const [titulo, setTitulo] = useState("");
  const [introduccion, setIntroduccion] = useState("");
  const [pais, setPais] = useState("");
  const [genero, setGenero] = useState("");
  const [experiencia, setExperiencia] = useState<number>(0);

  // Especialidades
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [allEspecialidades, setAllEspecialidades] = useState<Especialidad[]>([]);

  // Idiomas
  const [allIdiomas, setAllIdiomas] = useState<Idioma[]>([]);
  const [idiomasSeleccionados, setIdiomasSeleccionados] = useState<
    Set<string>
  >(new Set());
  const [showOtroIdioma, setShowOtroIdioma] = useState(false);
  const [nuevoIdioma, setNuevoIdioma] = useState("");

  const [loading, setLoading] = useState(false);

  // Otras especialidades
  const [showOtrasEspecialidades, setShowOtrasEspecialidades] =
    useState(false);
  const [otrasEspecialidadesInput, setOtrasEspecialidadesInput] =
    useState("");

  const norm = (s: string) =>
    s.trim().toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser) as UsuarioLocalStorageUpdate;
    setUser(parsed);
    setNombre(parsed.nombre || "");
    setApellido(parsed.apellido || "");
    setEmail(parsed.email || "");
    setImagen(parsed.imagen || "");
    setEspecialidades(parsed.especialidades || []);
    setCelular(parsed.celular || ""); // 👈 si en LS viene el celular

    // catálogo especialidades
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/especialidades`
        );
        const data = await res.json();
        if (Array.isArray(data.result)) setAllEspecialidades(data.result);
      } catch {
        setAllEspecialidades([]);
      }
    })();

    // catálogo idiomas (GET público)
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/idiomas`
        );
        const data = await res.json();
        if (Array.isArray(data.result))
          setAllIdiomas(data.result as Idioma[]);
      } catch {
        setAllIdiomas([]);
      }
    })();

    // si es psicólogo, prefill completo (incluye idiomas/especialidades)
    if (parsed.rol === "PSICOLOGO" && parsed.idpsicologo) {
      fetchPsicologoData(parsed.idpsicologo);
    }
  }, []);

  const fetchPsicologoData = async (idPsicologo: number) => {
    try {
      // Ruta correcta en tu back:
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${idPsicologo}`
      );
      if (!response.ok) return;
      const data = await response.json();
      const ps = data.result;

      setTitulo(ps.titulo || "");
      setIntroduccion(ps.introduccion || "");
      setPais(ps.pais || "");
      setGenero(ps.genero || "");
      setExperiencia(ps.experiencia || 0);
      setFechaNacimiento(ps.fecha_nacimiento || "");
      setCelular(ps.celular || ""); //  viene del back

      // Idiomas guardados (array de nombres)
      if (Array.isArray(ps.idiomas)) {
        // completar catálogo si faltan
        const cat = new Set(allIdiomas.map((i) => i.nombre));
        const faltantes = ps.idiomas.filter((n: string) => !cat.has(n));
        if (faltantes.length) {
          setAllIdiomas((prev) => [
            ...prev,
            ...faltantes.map((n: any) => ({ idIdioma: 0, nombre: n })),
          ]);
        }
        setIdiomasSeleccionados(new Set(ps.idiomas));
      }

      // Especialidades guardadas
      if (Array.isArray(ps.especialidades) && ps.especialidades.length) {
        setEspecialidades(ps.especialidades);
      }
    } catch (e) {
      console.error("Error fetching psicólogo data:", e);
    }
  };

  // Al abrir modal, refrescar especialidades
  useEffect(() => {
    const fetchEspecialidadesPsicologo = async () => {
      try {
        const id = user?.idpsicologo || user?.id;
        if (id && isEditOpen) {
          const response = await GetEspecialidadesPsicologos(id as number);
          if (response && Array.isArray(response.result)) {
            setEspecialidades(response.result);
          }
        }
      } catch {
        /* noop */
      }
    };
    fetchEspecialidadesPsicologo();
  }, [isEditOpen, user]);

  // Imagen
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const webpImage = await convertImageToWebP(file);
      const base64 = await convertToBase64(webpImage);
      setImagen(base64);
    } catch {
      showToast("error", "Error al procesar la imagen");
    }
  };

  // ===== Idiomas: "Otro" sin POST (se creará al guardar) =====
  const handleAgregarIdiomaLocal = () => {
    const nombre = norm(nuevoIdioma || "");
    if (!nombre) {
      showToast("error", "Escribe un idioma válido.");
      return;
    }
    if (idiomasSeleccionados.has(nombre)) {
      showToast("error", "Ese idioma ya está seleccionado.");
      return;
    }

    // añadir al catálogo si no existe para que aparezca en el Select
    if (!allIdiomas.some((i) => i.nombre === nombre)) {
      setAllIdiomas((prev) => [...prev, { idIdioma: 0, nombre }]);
    }
    // preseleccionar
    setIdiomasSeleccionados((prev) => new Set([...Array.from(prev), nombre]));
    setNuevoIdioma("");
    setShowOtroIdioma(false);
    showToast(
      "success",
      "Idioma agregado a la selección. Se creará al guardar."
    );
  };

  // Otras especialidades
  const handleOtrasEspecialidades = () => {
    if (!otrasEspecialidadesInput.trim()) {
      showToast("error", "Por favor ingresa al menos una especialidad");
      return;
    }
    const nuevas = otrasEspecialidadesInput
      .split(",")
      .map((esp) => esp.trim())
      .filter((esp) => esp.length > 0);

    if (!nuevas.length) {
      showToast("error", "Por favor ingresa especialidades válidas");
      return;
    }
    setEspecialidades((prev) => [
      ...prev.filter((e) => e !== "Otras"),
      ...nuevas,
    ]);
    setOtrasEspecialidadesInput("");
    setShowOtrasEspecialidades(false);
    showToast("success", "Especialidades agregadas correctamente");
  };

  // Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = user?.idpsicologo || user?.id;

      if (user?.rol === "PSICOLOGO") {
        const dataCompleta = {
          nombre,
          apellido,
          email: user.email, // no editable
          fecha_nacimiento: fechaNacimiento,
          imagen,
          titulo,
          introduccion,
          pais,
          genero,
          experiencia,
          especialidades,
          idiomas: Array.from(idiomasSeleccionados),
          celular, //  enviar celular al back
        };
        await actualizarPerfilCompletoPsicologo(id as number, dataCompleta);
      } else {
        const body = {
          nombre,
          apellido,
          imagen,
          especialidades,
          idiomas: Array.from(idiomasSeleccionados),
          celular, // por si luego lo usas también para otros roles
        };
        await actualizarPsicologo(id as number, body);
      }

      showToast("success", "Perfil actualizado correctamente");
      setIsEditOpen(false);

      // Actualiza storage
      const updatedUser: UsuarioLocalStorageUpdate = {
        ...user!,
        nombre,
        apellido,
        email: user?.email || email,
        imagen,
        especialidades,
        celular,
        id: user?.id ?? 0,
        idpsicologo: user?.idpsicologo ?? 0,
        rol: user?.rol ?? "",
        permisos: user?.permisos ?? [],
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);

      // refrescar especialidades
      if (id) {
        const espRes = await GetEspecialidadesPsicologos(id as number);
        if (espRes && Array.isArray(espRes.result))
          setEspecialidades(espRes.result);
      }
    } catch (err) {
      showToast("error", "Error al actualizar el perfil");
      console.error(err);
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
      <ModalContent className="bg-[#E7E7FF] dark:bg-[#19191a] rounded-xl border border-white/20">
        <ModalBody className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 grid xl:grid-cols-2 max-xl:grid-cols-1 gap-6"
          >
            {/* Columna 1: Datos personales */}
            <div>
              <div>
                <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] py-2 mt-2">
                  Nombre
                </label>
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-full"
                  classNames={{
                    input:
                      "focus:outline-none dark:bg-[#232324] dark:text-white",
                    inputWrapper:
                      "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                  }}
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                  Apellido
                </label>
                <Input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full rounded-full"
                  classNames={{
                    input:
                      "focus:outline-none dark:bg-[#232324] dark:text-white",
                    inputWrapper:
                      "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                  }}
                  required
                />
              </div>

              {user?.rol === "PSICOLOGO" && (
                <>
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full"
                      classNames={{
                        input:
                          "focus:outline-none dark:bg-[#232324] dark:text-gray-300",
                        inputWrapper:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20",
                      }}
                      isDisabled
                      description="El email no puede ser modificado por seguridad"
                    />
                  </div>

                  {/* CELULAR */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Celular
                    </label>
                    <Input
                      type="tel"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      placeholder="Ej: +51 999 999 999"
                      className="w-full rounded-full"
                      classNames={{
                        input:
                          "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Fecha de Nacimiento
                    </label>
                    <Input
                      type="date"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="w-full rounded-full"
                      classNames={{
                        input:
                          "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                      }}
                    />
                  </div>
                </>
              )}

              {/* Imagen */}
              <h1 className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2 text-center mt-4">
                Imagen de Perfil
              </h1>
              <div className="w-full flex flex-col gap-2 m-auto items-center">
                <div className="relative border-2 border-[#634AE2] dark:border-[#634AE2] rounded-lg h-[220px] w-[220px] bg-[#F3F3F3] dark:bg-[#232324] flex justify-center items-center cursor-pointer overflow-hidden">
                  {imagen ? (
                    <Image
                      src={imagen}
                      alt="Imagen seleccionada"
                      width={220}
                      height={220}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                      <Plus width={40} height={40} strokeWidth={2} />
                      <span className="text-sm mt-2">Subir foto de perfil</span>
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
                    className="absolute top-2 right-2 bg-white/80 dark:bg-[#2e2e2f]/80 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    onClick={() => setImagen("")}
                    aria-label="Eliminar imagen"
                  >
                    <X className="w-5 h-5 text-[#634AE2] dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Columna 2: Datos profesionales */}
            <div className="min-w-[400px] pt-1 flex flex-col justify-between">
              {user?.rol === "PSICOLOGO" ? (
                <>
                  {/* Título */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Título Profesional
                    </label>
                    <Input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej: Psicólogo Clínico"
                      className="w-full rounded-full"
                      classNames={{
                        input:
                          "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                      }}
                    />
                  </div>

                  {/* Introducción */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Introducción Profesional
                    </label>
                    <Textarea
                      value={introduccion}
                      onChange={(e) => setIntroduccion(e.target.value)}
                      placeholder="Describe tu experiencia y enfoque profesional..."
                      maxRows={4}
                      className="w-full"
                      classNames={{
                        input:
                          "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                      }}
                    />
                  </div>

                  {/* País */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      País
                    </label>
                    <Select
                      selectedKeys={pais ? [pais] : []}
                      onSelectionChange={(keys) =>
                        setPais(Array.from(keys)[0] as string)
                      }
                      placeholder="Selecciona tu país"
                      className="w-full"
                      classNames={{
                        trigger:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:text-white",
                        popoverContent:
                          "dark:bg-[#232324] dark:border-white/20",
                        listbox: "dark:bg-[#232324]",
                      }}
                    >
                      {Flags.map((flag) => (
                        <SelectItem
                          key={flag.value}
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          {flag.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Género */}
                    <div>
                      <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                        Género
                      </label>
                      <Select
                        selectedKeys={genero ? [genero] : []}
                        onSelectionChange={(keys) =>
                          setGenero(Array.from(keys)[0] as string)
                        }
                        placeholder="Selecciona"
                        className="w-full"
                        classNames={{
                          trigger:
                            "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:text-white",
                          popoverContent:
                            "dark:bg-[#232324] dark:border-white/20",
                          listbox: "dark:bg-[#232324]",
                        }}
                      >
                        <SelectItem
                          key="Masculino"
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          Masculino
                        </SelectItem>
                        <SelectItem
                          key="Femenino"
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          Femenino
                        </SelectItem>
                        <SelectItem
                          key="Otro"
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          Otro
                        </SelectItem>
                      </Select>
                    </div>

                    {/* Experiencia */}
                    <div>
                      <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                        Experiencia (años)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={experiencia.toString()}
                        onChange={(e) =>
                          setExperiencia(parseInt(e.target.value) || 0)
                        }
                        className="w-full rounded-full"
                        classNames={{
                          input:
                            "focus:outline-none dark:bg-[#232324] dark:text-white",
                          inputWrapper:
                            "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]",
                        }}
                      />
                    </div>
                  </div>

                  {/* ===== Idiomas ===== */}
                  <div className="mt-2">
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Idiomas que domina
                    </label>

                    <Select
                      selectionMode="multiple"
                      selectedKeys={idiomasSeleccionados}
                      onSelectionChange={(keys) => {
                        if (keys === "all") return;
                        setIdiomasSeleccionados(keys as Set<string>);
                      }}
                      placeholder="Selecciona uno o más idiomas"
                      className="w-full"
                      classNames={{
                        trigger:
                          "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:text-white",
                        popoverContent:
                          "dark:bg-[#232324] dark:border-white/20",
                        listbox: "dark:bg-[#232324]",
                      }}
                      items={allIdiomas}
                    >
                      {(idi) => (
                        <SelectItem
                          key={idi.nombre}
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          {idi.nombre}
                        </SelectItem>
                      )}
                    </Select>

                    <div className="mt-3">
                      <Button
                        type="button"
                        onPress={() => setShowOtroIdioma((s) => !s)}
                        className="text-sm bg-[#634AE2] text-white rounded-full px-3 py-1"
                        size="sm"
                      >
                        {showOtroIdioma ? "Cancelar" : "Otro"}
                      </Button>
                    </div>

                    {showOtroIdioma && (
                      <div className="mt-4 p-4 bg-white/50 dark:bg-[#232324]/50 rounded-lg border border-[#634AE2]/30">
                        <label className="block text-sm font-medium text-[#634AE2] dark:text-gray-300 mb-2">
                          Agregar nuevo idioma
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={nuevoIdioma}
                            onChange={(e) => setNuevoIdioma(e.target.value)}
                            placeholder="Ej: Quechua"
                            className="flex-1"
                            classNames={{
                              input:
                                "focus:outline-none dark:bg-[#232324] dark:text-white",
                              inputWrapper:
                                "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20",
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAgregarIdiomaLocal();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onPress={handleAgregarIdiomaLocal}
                            className="bg-[#634AE2] text-white rounded-full"
                            size="sm"
                          >
                            Agregar
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          Se creará al guardar tu perfil (no requiere
                          autenticación extra).
                        </p>
                      </div>
                    )}
                  </div>
                  {/* ===== Fin Idiomas ===== */}

                  {/* Especialidades */}
                  <div className="mt-4">
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Especialidades
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {allEspecialidades.map((esp) => (
                        <label
                          key={esp.idEspecialidad}
                          className="flex items-center gap-2 dark:text-gray-300"
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
                                setEspecialidades((prev) => [
                                  ...prev,
                                  esp.nombre,
                                ]);
                              } else {
                                setEspecialidades((prev) =>
                                  prev.filter(
                                    (item) => item !== esp.nombre
                                  )
                                );
                              }
                            }}
                            className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                          />
                          <span className="text-sm text-[#634AE2] dark:text-gray-300">
                            {esp.nombre}
                          </span>
                        </label>
                      ))}

                      <label className="flex items-center gap-2 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={showOtrasEspecialidades}
                          onChange={(e) => {
                            setShowOtrasEspecialidades(e.target.checked);
                            if (!e.target.checked)
                              setOtrasEspecialidadesInput("");
                          }}
                          className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                        />
                        <span className="text-sm text-[#634AE2] dark:text-gray-300">
                          Otras
                        </span>
                      </label>
                    </div>

                    {showOtrasEspecialidades && (
                      <div className="mt-4 p-4 bg-white/50 dark:bg-[#232324]/50 rounded-lg border border-[#634AE2]/30">
                        <label className="block text-sm font-medium text-[#634AE2] dark:text-gray-300 mb-2">
                          Especifica otras especialidades (separadas por
                          coma)
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={otrasEspecialidadesInput}
                            onChange={(e) =>
                              setOtrasEspecialidadesInput(e.target.value)
                            }
                            placeholder="Ej: Terapia familiar, Psicología deportiva, etc."
                            className="flex-1"
                            classNames={{
                              input:
                                "focus:outline-none dark:bg-[#232324] dark:text-white",
                              inputWrapper:
                                "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20",
                            }}
                          />
                          <Button
                            type="button"
                            onPress={handleOtrasEspecialidades}
                            className="bg-[#634AE2] text-white rounded-full"
                            size="sm"
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      {especialidades.map((esp) => (
                        <span
                          key={esp}
                          className="bg-[#634AE2] dark:bg-[#634AE2] text-white px-3 py-1 rounded-full text-xs"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Otros roles: solo especialidades (puedes también mostrar celular si quieres)
                <div>
                  <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                    Especialidades
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allEspecialidades.map((esp) => (
                      <label
                        key={esp.idEspecialidad}
                        className="flex items-center gap-2 dark:text-gray-300"
                      >
                        <input
                          type="checkbox"
                          value={esp.nombre}
                          checked={
                            Array.isArray(especialidades) &&
                            especialidades.includes(esp.nombre)
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setEspecialidades((prev) => [
                                ...prev,
                                esp.nombre,
                              ]);
                            else
                              setEspecialidades((prev) =>
                                prev.filter(
                                  (item) => item !== esp.nombre
                                )
                              );
                          }}
                          className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                        />
                        <span className="text-[#634AE2] dark:text-gray-300">
                          {esp.nombre}
                        </span>
                      </label>
                    ))}

                    <label className="flex items-center gap-2 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={showOtrasEspecialidades}
                        onChange={(e) => {
                          setShowOtrasEspecialidades(e.target.checked);
                          if (!e.target.checked)
                            setOtrasEspecialidadesInput("");
                        }}
                        className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                      />
                      <span className="text-[#634AE2] dark:text-gray-300">
                        Otras
                      </span>
                    </label>
                  </div>

                  {showOtrasEspecialidades && (
                    <div className="mt-4 p-4 bg-white/50 dark:bg-[#232324]/50 rounded-lg border border-[#634AE2]/30">
                      <label className="block text-sm font-medium text-[#634AE2] dark:text-gray-300 mb-2">
                        Especifica otras especialidades (separadas por
                        coma)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={otrasEspecialidadesInput}
                          onChange={(e) =>
                            setOtrasEspecialidadesInput(e.target.value)
                          }
                          placeholder="Ej: Terapia familiar, Psicología deportiva, etc."
                          className="flex-1"
                          classNames={{
                            input:
                              "focus:outline-none dark:bg-[#232324] dark:text-white",
                            inputWrapper:
                              "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20",
                          }}
                        />
                        <Button
                          type="button"
                          onPress={handleOtrasEspecialidades}
                          className="bg-[#634AE2] text-white rounded-full"
                          size="sm"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    {especialidades.map((esp) => (
                      <span
                        key={esp}
                        className="bg-[#634AE2] dark:bg-[#634AE2] text-white px-3 py-1 rounded-full text-xs"
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
                  className="rounded-full dark:bg-[#2e2e2f] dark:text-white dark:hover:bg-[#3a3a3b] dark:border dark:border-white/20"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="rounded-full bg-[#634AE2] dark:bg-[#634AE2] dark:text-white dark:hover:bg-[#7560e6]"
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
