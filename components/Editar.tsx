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

// --- INICIO: AGREGADO TIPO PARA IDIOMAS ---
type Idioma = { codigo: string; nombre: string };
// --- FIN: AGREGADO TIPO PARA IDIOMAS ---

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
  
  // --- INICIO: AGREGADO ESTADOS PARA IDIOMAS ---
  const [idiomas, setIdiomas] = useState<string[]>([]);
  const [allIdiomas, setAllIdiomas] = useState<Idioma[]>([]);
  // --- FIN: AGREGADO ESTADOS PARA IDIOMAS ---
  
  const [loading, setLoading] = useState(false);

  // --- INICIO: AGREGADO PARA FUNCIONALIDAD "OTRAS" ESPECIALIDADES ---
  const [showOtrasEspecialidades, setShowOtrasEspecialidades] = useState(false);
  const [otrasEspecialidadesInput, setOtrasEspecialidadesInput] = useState("");
  // --- FIN: AGREGADO PARA FUNCIONALIDAD "OTRAS" ESPECIALIDADES ---

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
        
        // --- INICIO: AGREGADO CARGAR IDIOMAS DEL USUARIO ---
        if ((parsed as any).idioma) {
          const idiomasArray = typeof (parsed as any).idioma === 'string' 
            ? (parsed as any).idioma.split(',').filter(Boolean)
            : Array.isArray((parsed as any).idioma) 
              ? (parsed as any).idioma 
              : [];
          setIdiomas(idiomasArray);
        }
        // --- FIN: AGREGADO CARGAR IDIOMAS DEL USUARIO ---
        
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
        
        // --- INICIO: AGREGADO CARGAR IDIOMAS DEL PSICÓLOGO ---
        if (psicologoData.idioma) {
          const idiomasArray = typeof psicologoData.idioma === 'string' 
            ? psicologoData.idioma.split(',').filter(Boolean)
            : Array.isArray(psicologoData.idioma) 
              ? psicologoData.idioma 
              : [];
          setIdiomas(idiomasArray);
        }
        // --- FIN: AGREGADO CARGAR IDIOMAS DEL PSICÓLOGO ---
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

// --- INICIO: AGREGADO CARGAR IDIOMAS DISPONIBLES ---
useEffect(() => {
  const fetchAllIdiomas = async () => {
    try {
      console.log("🔍 Iniciando carga de idiomas desde API pública...");

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/';
      const url = `${API_URL}api/psicologos/idiomas/disponibles`;
      
      console.log("🌐 URL de la API:", url);

      // Como la ruta es pública, no necesitamos token
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Respuesta COMPLETA de la API:", data);
        
        // Verificar la estructura según el método del backend
        // El método devuelve: { result: array_de_idiomas }
        if (data && data.result && Array.isArray(data.result)) {
          console.log("🎯 Idiomas encontrados en data.result:", data.result);
          console.log("📊 Cantidad de idiomas:", data.result.length);
          setAllIdiomas(data.result);
        } else {
          console.warn("⚠️ Estructura de respuesta inesperada, usando fallback");
          // Fallback con datos básicos
          const fallbackIdiomas = [
            { codigo: 'es', nombre: 'Español' },
            { codigo: 'en', nombre: 'Inglés' }
          ];
          setAllIdiomas(fallbackIdiomas);
        }
      } else {
        console.error("❌ Error HTTP:", response.status, response.statusText);
        
        // Intentar obtener más detalles del error
        try {
          const errorText = await response.text();
          console.error("📄 Detalles del error:", errorText);
        } catch (e) {
          console.error("📄 No se pudieron obtener detalles del error");
        }
        
        // Fallback con datos básicos en caso de error
        const fallbackIdiomas = [
          { codigo: 'es', nombre: 'Español' },
          { codigo: 'en', nombre: 'Inglés' },
          { codigo: 'fr', nombre: 'Francés' },
          { codigo: 'pt', nombre: 'Portugués' }
        ];
        setAllIdiomas(fallbackIdiomas);
      }
    } catch (error) {
      console.error("💥 Error de conexión:", error);
      // Fallback en caso de error de red
      const fallbackIdiomas = [
        { codigo: 'es', nombre: 'Español' },
        { codigo: 'en', nombre: 'Inglés' }
      ];
      setAllIdiomas(fallbackIdiomas);
    }
  };

  if (isEditOpen && user?.rol === 'PSICOLOGO') {
    console.log("🎬 Condiciones cumplidas - ejecutando fetchAllIdiomas");
    console.log("👤 Usuario actual:", user?.rol);
    fetchAllIdiomas();
  } else {
    console.log("⏸️ Condiciones no cumplidas:", {
      isEditOpen,
      userRol: user?.rol,
      esPsicologo: user?.rol === 'PSICOLOGO'
    });
  }
}, [isEditOpen, user?.rol]);
// --- FIN: AGREGADO CARGAR IDIOMAS DISPONIBLES ---



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

  // Manejo de imagen (WebP and base64)
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

  // --- INICIO: AGREGADO PARA FUNCIONALIDAD "OTRAS" ESPECIALIDADES ---
  // Función simplificada para manejar especialidades personalizadas
  const handleOtrasEspecialidades = () => {
    if (!otrasEspecialidadesInput.trim()) {
      showToast("error", "Por favor ingresa al menos una especialidad");
      return;
    }

    const nuevasEspecialidades = otrasEspecialidadesInput
      .split(',')
      .map(esp => esp.trim())
      .filter(esp => esp.length > 0);

    if (nuevasEspecialidades.length === 0) {
      showToast("error", "Por favor ingresa especialidades válidas");
      return;
    }

    // Solo agregar al array local - el backend se encargará de crearlas automáticamente
    setEspecialidades(prev => [
      ...prev.filter(esp => esp !== "Otras"),
      ...nuevasEspecialidades
    ]);

    setOtrasEspecialidadesInput("");
    setShowOtrasEspecialidades(false);
    showToast("success", "Especialidades agregadas correctamente");
  };
  // --- FIN: AGREGADO PARA FUNCIONALIDAD "OTRAS" ESPECIALIDADES ---

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
          // --- INICIO: AGREGADO INCLUIR IDIOMAS EN EL PAYLOAD ---
          idioma: idiomas.join(","), // Convertir array a string separado por comas
          // --- FIN: AGREGADO INCLUIR IDIOMAS EN EL PAYLOAD ---
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
      const updatedUser: UsuarioLocalStorageUpdate & { idioma?: string } = {
        ...user,
        nombre,
        apellido,
        email: user?.email || email, // Mantener el email original
        imagen,
        especialidades,
        // --- INICIO: AGREGADO ACTUALIZAR IDIOMAS EN EL USER ---
        idioma: idiomas.join(","),
        // --- FIN: AGREGADO ACTUALIZAR IDIOMAS EN EL USER ---
        id: user?.id ?? 0,
        idpsicologo: user?.idpsicologo ?? 0,
        rol: user?.rol ?? "",
        permisos: user?.permisos ?? [],
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
      <ModalContent className="bg-[#E7E7FF] dark:bg-[#19191a] rounded-xl border border-white/20">
        <ModalBody className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 grid xl:grid-cols-2 max-xl:grid-cols-1 gap-6"
          >
            {/* Primera columna - Datos personales e imagen */}
            <div>
              {/* Datos personales básicos */}
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
                    input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                    inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]"
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
                    input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                    inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]"
                  }}
                  required
                />
              </div>

              {user?.rol === 'PSICOLOGO' && (
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
                        input: "focus:outline-none dark:bg-[#232324] dark:text-gray-300",
                        inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20"
                      }}
                      isDisabled
                      description="El email no puede ser modificado por seguridad"
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
                        input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]"
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
                      <Plus
                        width={40}
                        height={40}
                        strokeWidth={2}
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
                    className="absolute top-2 right-2 bg-white/80 dark:bg-[#2e2e2f]/80 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    onClick={() => setImagen("")}
                    aria-label="Eliminar imagen"
                  >
                    <X className="w-5 h-5 text-[#634AE2] dark:text-gray-300" />
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
                        input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]"
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
                        input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                        inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]"
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
                      onSelectionChange={(keys) => setPais(Array.from(keys)[0] as string)}
                      placeholder="Selecciona tu país"
                      className="w-full"
                      classNames={{
                        trigger: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:text-white",
                        popoverContent: "dark:bg-[#232324] dark:border-white/20",
                        listbox: "dark:bg-[#232324]",
                      }}
                    >
                      {Flags.map((flag) => (
                        <SelectItem 
                          key={flag.value} 
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:focus:bg-[#2a2a2b] dark:text-white",
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
                        onSelectionChange={(keys) => setGenero(Array.from(keys)[0] as string)}
                        placeholder="Selecciona"
                        className="w-full"
                        classNames={{
                          trigger: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:text-white",
                          popoverContent: "dark:bg-[#232324] dark:border-white/20",
                          listbox: "dark:bg-[#232324]",
                        }}
                      >
                        <SelectItem 
                          key="Masculino"
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:focus:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          Masculino
                        </SelectItem>
                        <SelectItem 
                          key="Femenino"
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:focus:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          Femenino
                        </SelectItem>
                        <SelectItem 
                          key="Otro"
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:focus:bg-[#2a2a2b] dark:text-white",
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
                        onChange={(e) => setExperiencia(parseInt(e.target.value) || 0)}
                        className="w-full rounded-full"
                        classNames={{
                          input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                          inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:hover:bg-[#2a2a2b]"
                        }}
                      />
                    </div>
                  </div>

                  {/* --- INICIO: AGREGADO SECCIÓN IDIOMAS --- */}
                  <div>
                    <label className="block font-bold text-base text-[#634AE2] dark:text-[#634AE2] mb-2">
                      Idiomas que Domina
                    </label>
                    <Select
                      selectionMode="multiple"
                      selectedKeys={new Set(idiomas)}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys) as string[];
                        setIdiomas(selected);
                      }}
                      placeholder="Selecciona los idiomas que dominas"
                      className="w-full"
                      classNames={{
                        trigger: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20 dark:text-white",
                        popoverContent: "dark:bg-[#232324] dark:border-white/20",
                        listbox: "dark:bg-[#232324]",
                      }}
                    >
                      {allIdiomas.map((idioma) => (
                        <SelectItem 
                          key={idioma.codigo}
                          classNames={{
                            base: "dark:hover:bg-[#2a2a2b] dark:focus:bg-[#2a2a2b] dark:text-white",
                          }}
                        >
                          {idioma.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {idiomas.map((idiomaCodigo) => {
                        const idiomaInfo = allIdiomas.find(idioma => idioma.codigo === idiomaCodigo);
                        return (
                          <span
                            key={idiomaCodigo}
                            className="bg-[#634AE2] dark:bg-[#634AE2] text-white px-3 py-1 rounded-full text-xs"
                          >
                            {idiomaInfo ? idiomaInfo.nombre : idiomaCodigo}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {/* --- FIN: AGREGADO SECCIÓN IDIOMAS --- */}

                  {/* Especialidades */}
                  <div>
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
                                setEspecialidades((prev) => [...prev, esp.nombre]);
                              } else {
                                setEspecialidades((prev) =>
                                  prev.filter((item) => item !== esp.nombre)
                                );
                              }
                            }}
                            className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                          />
                          <span className="text-sm text-[#634AE2] dark:text-gray-300">{esp.nombre}</span>
                        </label>
                      ))}
                      
                      {/* --- INICIO: AGREGADO CHECKBOX "OTRAS" --- */}
                      <label className="flex items-center gap-2 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={showOtrasEspecialidades}
                          onChange={(e) => {
                            setShowOtrasEspecialidades(e.target.checked);
                            if (!e.target.checked) {
                              setOtrasEspecialidadesInput("");
                            }
                          }}
                          className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                        />
                        <span className="text-sm text-[#634AE2] dark:text-gray-300">Otras</span>
                      </label>
                      {/* --- FIN: AGREGADO CHECKBOX "OTRAS" --- */}
                    </div>
                    
                    {/* --- INICIO: AGREGADO INPUT PARA OTRAS ESPECIALIDADES --- */}
                    {showOtrasEspecialidades && (
                      <div className="mt-4 p-4 bg-white/50 dark:bg-[#232324]/50 rounded-lg border border-[#634AE2]/30">
                        <label className="block text-sm font-medium text-[#634AE2] dark:text-gray-300 mb-2">
                          Especifica otras especialidades (separadas por coma)
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={otrasEspecialidadesInput}
                            onChange={(e) => setOtrasEspecialidadesInput(e.target.value)}
                            placeholder="Ej: Terapia familiar, Psicología deportiva, etc."
                            className="flex-1"
                            classNames={{
                              input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                              inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20"
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
                    {/* --- FIN: AGREGADO INPUT PARA OTRAS ESPECIALIDADES --- */}

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
                /* Para otros roles, mostrar solo especialidades */
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
                            if (e.target.checked) {
                              setEspecialidades((prev) => [...prev, esp.nombre]);
                            } else {
                              setEspecialidades((prev) =>
                                prev.filter((item) => item !== esp.nombre)
                              );
                            }
                          }}
                          className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                        />
                        <span className="text-[#634AE2] dark:text-gray-300">{esp.nombre}</span>
                      </label>
                    ))}
                    
                    {/* --- INICIO: AGREGADO CHECKBOX "OTRAS" PARA OTROS ROLES --- */}
                    <label className="flex items-center gap-2 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={showOtrasEspecialidades}
                        onChange={(e) => {
                          setShowOtrasEspecialidades(e.target.checked);
                          if (!e.target.checked) {
                            setOtrasEspecialidadesInput("");
                          }
                        }}
                        className="accent-[#634AE2] dark:accent-[#634AE2] min-w-4 min-h-4"
                      />
                      <span className="text-[#634AE2] dark:text-gray-300">Otras</span>
                    </label>
                    {/* --- FIN: AGREGADO CHECKBOX "OTRAS" PARA OTROS ROLES --- */}
                  </div>
                  
                  {/* --- INICIO: AGREGADO INPUT PARA OTRAS ESPECIALIDADES PARA OTROS ROLES --- */}
                  {showOtrasEspecialidades && (
                    <div className="mt-4 p-4 bg-white/50 dark:bg-[#232324]/50 rounded-lg border border-[#634AE2]/30">
                      <label className="block text-sm font-medium text-[#634AE2] dark:text-gray-300 mb-2">
                        Especifica otras especialidades (separadas por coma)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={otrasEspecialidadesInput}
                          onChange={(e) => setOtrasEspecialidadesInput(e.target.value)}
                          placeholder="Ej: Terapia familiar, Psicología deportiva, etc."
                          className="flex-1"
                          classNames={{
                            input: "focus:outline-none dark:bg-[#232324] dark:text-white",
                            inputWrapper: "border border-[#634AE2]/30 focus:border-[#634AE2] focus:ring-2 focus:ring-[#634AE2] dark:bg-[#232324] dark:border-white/20"
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
                  {/* --- FIN: AGREGADO INPUT PARA OTRAS ESPECIALIDADES PARA OTROS ROLES --- */}

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