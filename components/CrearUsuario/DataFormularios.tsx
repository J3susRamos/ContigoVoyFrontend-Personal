"use client";

import {
  CreatePersonal,
  GetIdiomas,
  GetEspecialidades,
  AddIdioma,
  addEspecialidad,
} from "@/app/apiRoutes";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/icons/iconsvg";
import { FormData, SelectItemI, Roles, Personal } from "@/interface";
import { Flags } from "@/utils/flagsPsicologos";
import {
  Button,
  DateValue,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import showToast from "../ToastStyle";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { Suceesfully } from "./SuccesFull";
import DatePickerCustom from "./DatePickerCustom";

// ======================= Helpers =======================
const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

// ======================= Datos estáticos =======================
const genders: SelectItemI[] = [
  { textValue: "femenino", showLabel: "Femenino" },
  { textValue: "masculino", showLabel: "Masculino" },
  { textValue: "otro", showLabel: "Otro" },
];

const roles: Roles[] = [
  { textValue: "ADMINISTRADOR", showLabel: "ADMINISTRADOR" },
  { textValue: "PSICOLOGO", showLabel: "PSICOLOGO" },
  { textValue: "COMUNICACION", showLabel: "COMUNICACION" },
  { textValue: "MARKETING", showLabel: "MARKETING" },
];

type Permission = { id: number; name: string };

const titles: SelectItemI[] = [
  { textValue: "Pedagogo", showLabel: "Pedagogo" },
  { textValue: "Psicoanalista", showLabel: "Psicoanalista" },
  { textValue: "Terapeuta", showLabel: "Terapeuta" },
  { textValue: "Pediatra", showLabel: "Pediatra" },
  { textValue: "Conductual", showLabel: "Conductual" },
];

export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  valor: string;
}
export interface Idiomas {
  idIdioma: number;
  nombre: string;
  valor: string;
}

export const PersonalForm = ({
  onNext,
  initialFormData,
}: {
  onNext: (data: FormData) => void;
  initialFormData: FormData;
}) => {
  // ======================= Estado general =======================
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);

  const [especialidadesList, setEspecialidadesList] = useState<Especialidad[]>([]);
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState<number[]>([]);
  const [showOtrasEspecialidades, setShowOtrasEspecialidades] = useState(false);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");
  const [addEspLoading, setAddEspLoading] = useState(false);

  const [isSend, setIsSend] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rol, setRol] = useState("PSICOLOGO");
  const [permissions, setPermissions] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ======================= Form Data =======================
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    idioma: initialFormData.idioma || "", // CSV de slugs
    especialidades: Array.isArray(initialFormData.especialidades)
      ? (initialFormData.especialidades as number[])
      : [],
  });

  // ======================= Idiomas dinámicos =======================
  const [idiomasList, setIdiomasList] = useState<SelectItemI[]>([]);
  const [selectedIdiomas, setSelectedIdiomas] = useState<string[]>([]);
  const [otroIdioma, setOtroIdioma] = useState<boolean>(false);
  const [nuevoIdioma, setNuevoIdioma] = useState<string>("");
  const [addIdiomaLoading, setAddIdiomaLoading] = useState<boolean>(false);

  // ======================= Cargas iniciales =======================
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const especialidades = await GetEspecialidades(); // viene del back

        // añadimos opción "Otras" al final para mostrar el input
        const otrasOpcion: Especialidad = {
          idEspecialidad: 0,
          nombre: "Otras",
          valor: "otras",
        };

        setEspecialidadesList([...especialidades, otrasOpcion]);

        // si initialFormData ya traía especialidades -> preseleccionamos
        if (Array.isArray(initialFormData.especialidades)) {
          const ids = initialFormData.especialidades as number[];
          setEspecialidadesSeleccionadas(ids);
        }
      } catch (err) {
        console.error("Error al cargar especialidades:", err);
        setEspecialidadesList([]);
      }
    };
    fetchEspecialidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies["session"];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/urls/enlaces`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setPermissionsList(data.result);
        } else {
          console.error("Error en la solicitud:", data);
        }
      } catch (error) {
        console.error("Error al obtener permisos:", error);
      }
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    const fetchIdiomas = async () => {
      try {
        const idiomas = await GetIdiomas();
        const idiomasFormateados: SelectItemI[] = idiomas.map((idioma) => ({
          textValue: idioma.valor, // <- SLUG como key
          showLabel: idioma.nombre, // <- visible
        }));

        const otrosOpcion: SelectItemI = {
          textValue: "otros",
          showLabel: "Otros",
        };

        idiomasFormateados.push(otrosOpcion);
        setIdiomasList(idiomasFormateados);
      } catch (err) {
        console.error("Error al obtener idiomas:", err);
        setIdiomasList([]);
      }
    };

    fetchIdiomas();
  }, [rol]);

  // ======================= Utils =======================
  const resetForm = () => {
    setFormData({
      ...initialFormData,
      idioma: "",
      especialidades: [],
    });
    setRol("PSICOLOGO");
    setPermissions([]);
    setSelectedIdiomas([]);
    setEspecialidadesSeleccionadas([]);
    setOtroIdioma(false);
    setNuevoIdioma("");
    setShowOtrasEspecialidades(false);
    setNuevaEspecialidad("");
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const formatFechaNacimiento = (fecha: string | DateValue | Date): string => {
    if (!fecha) return "";
    if (typeof fecha === "string") return fecha;
    if (fecha instanceof Date) return fecha.toISOString().split("T")[0];
    return `${fecha.year}-${String(fecha.month).padStart(2, "0")}-${String(
      fecha.day
    ).padStart(2, "0")}`;
  };

  // ======================= Add Idioma (Otros) =======================
  const handleAddIdioma = async () => {
    const nombreCrudo = nuevoIdioma.trim();
    if (!nombreCrudo) {
      showToast("error", "Escribe un idioma válido.");
      return;
    }

    const nombre = titleCase(nombreCrudo); // p.ej. "Quechua"
    const valor = slugify(nombreCrudo); // p.ej. "quechua"

    // Evitar duplicados por slug o por nombre visible
    const existePorSlug = idiomasList.some((i) => i.textValue === valor);
    const existePorNombre = idiomasList.some(
      (i) => i.showLabel.toLowerCase() === nombre.toLowerCase()
    );
    if (existePorSlug || existePorNombre) {
      showToast("error", "Ese idioma ya está en la lista.");
      return;
    }

    try {
      setAddIdiomaLoading(true);

      // Crear en backend (apiRoutes)
      const creado = await AddIdioma(nombre);
      const creadoNombre = creado?.nombre ?? nombre;
      const creadoValor = creado?.valor ?? valor;

      // Nueva opción consistente (key=slug)
      const nuevaOpcion: SelectItemI = {
        textValue: creadoValor,
        showLabel: creadoNombre,
      };

      // Insertar antes de "otros"
      setIdiomasList((prev) => {
        const sinOtros = prev.filter((x) => x.textValue !== "otros");
        const otros = prev.find((x) => x.textValue === "otros");
        return otros ? [...sinOtros, nuevaOpcion, otros] : [...sinOtros, nuevaOpcion];
      });

      // Seleccionar el nuevo idioma y quitar "otros" del CSV
      setSelectedIdiomas((prev) => {
        const sinOtros = prev.filter((k) => k !== "otros");
        const next = Array.from(new Set([...sinOtros, nuevaOpcion.textValue]));
        setFormData((f) => ({ ...f, idioma: next.join(",") })); // CSV de slugs
        setOtroIdioma(false); // Ocultar input por UX
        return next;
      });

      setNuevoIdioma("");
      showToast("success", "Idioma agregado y seleccionado.");
    } catch (err: any) {
      console.error(err);
      showToast("error", err?.message || "No se pudo crear el idioma.");
    } finally {
      setAddIdiomaLoading(false);
    }
  };

  // ======================= Agregar nueva especialidad (Otras) =======================
  const handleAgregarNuevaEspecialidad = async () => {
    const texto = nuevaEspecialidad.trim();
    if (!texto) {
      showToast("error", "Por favor ingresa una especialidad.");
      return;
    }

    const nombre = titleCase(texto);

    // evitar duplicados por nombre
    const yaExiste = especialidadesList.some(
      (e) => e.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (yaExiste) {
      showToast("error", "Esa especialidad ya existe.");
      return;
    }

    try {
      setAddEspLoading(true);

      // Llamamos al backend para CREAR realmente la especialidad
      const creada = await addEspecialidad(nombre);

      const idCreado: number =
        (creada as any)?.idEspecialidad ?? (creada as any)?.id ?? -Date.now();

      const nueva: Especialidad = {
        idEspecialidad: idCreado,
        nombre: (creada as any)?.nombre ?? nombre,
        valor:
          (creada as any)?.valor ??
          nombre.toLowerCase().replace(/\s+/g, "-"),
      };

      // Agregamos al catálogo, siempre dejando "Otras" al final
      setEspecialidadesList((prev) => {
        const sinOtras = prev.filter((e) => e.idEspecialidad !== 0);
        const otras = prev.find((e) => e.idEspecialidad === 0);
        return otras ? [...sinOtras, nueva, otras] : [...sinOtras, nueva];
      });

      // Actualizamos la selección (sin el id 0)
      setEspecialidadesSeleccionadas((prev) => {
        const sinOtras = prev.filter((id) => id !== 0);
        const next = Array.from(new Set([...sinOtras, idCreado]));
        setFormData((f) => ({
          ...f,
          especialidades: next,
        }));
        return next;
      });

      setNuevaEspecialidad("");
      setShowOtrasEspecialidades(false);
      showToast("success", "Especialidad agregada correctamente.");
    } catch (err: any) {
      console.error(err);
      showToast("error", err?.message || "No se pudo crear la especialidad.");
    } finally {
      setAddEspLoading(false);
    }
  };

  // ======================= Crear Personal / Psicólogo =======================
  const handleSubmitCreatePersonal = async () => {
    try {
      setIsSend(true);
      const updatedFormData = {
        ...formData,
        permissions: permissions,
        imagen: null,
      };

      const personalData: Personal = {
        apellido: updatedFormData.apellido,
        email: updatedFormData.email,
        fecha_nacimiento: formatFechaNacimiento(
          updatedFormData.fecha_nacimiento
        ),
        name: updatedFormData.name,
        password: updatedFormData.password,
        permissions: updatedFormData.permissions,
        rol: rol,
        imagen: null,
        especialidades: null,
      };

      const response = await CreatePersonal(personalData);
      showToast("success", "Personal creado exitosamente");
      console.log("Personal creado exitosamente:", response);

      resetForm();
      setIsSend(false);
    } catch (error: any) {
      showToast(
        "error",
        error?.errors?.email?.[0] || error?.message || "Error desconocido"
      );
      console.error("Error al crear personal:", error);
      setIsSend(false);
    }
  };

  const handleChangeRol = (value: string) => {
    setRol(value);
    setFormData((prev) => ({ ...prev, rol: value }));
  };

  const handleSubmitCreatePsicologo = async () => {
    try {
      setIsSend(true);
      const cookies = parseCookies();
      const token = cookies["session"];

      const fechaNacimiento = formData.fecha_nacimiento
        ? formatFechaNacimiento(formData.fecha_nacimiento)
        : null;

      const payload = {
        ...formData,
        fecha_nacimiento: fechaNacimiento,
        especialidades: especialidadesSeleccionadas.filter((id) => id !== 0), // solo ids reales
        idiomas: selectedIdiomas.filter((k) => k !== "otros"),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/psicologos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Éxito:", data.description);
        setShowSuccessModal(true);
      } else {
        toast.warn(data.message || "Error al crear el psicólogo", {
          position: "bottom-right",
          autoClose: 2000,
        });
        console.error("❌ Error en la solicitud:", data);
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta más tarde.", {
        position: "top-center",
        autoClose: 2000,
      });
      console.error("❌ Error al enviar al backend:", error);
    } finally {
      setIsSend(false);
    }
  };

  // ======================= Fecha Nacimiento =======================
  const [errorFecha, setErrorFecha] = useState<string | null>(null);

  const handleDateChange = (date: DateValue | null) => {
    if (!date) {
      setErrorFecha("La fecha de nacimiento es obligatoria.");
      return false;
    }

    const hoy = new Date();
    const nacimiento = new Date(date.year, date.month - 1, date.day);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      setErrorFecha("Debe ser mayor de 18 años.");
      return false;
    } else {
      setErrorFecha(null);
      setFormData((prev) => ({
        ...prev,
        fecha_nacimiento: date,
      }));
      return true;
    }
  };

  // ======================= UI =======================
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          <div className="text-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
              Datos del Personal
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete la información del nuevo miembro del personal
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-5xl flex justify-center">
              <Form
                validationBehavior="native"
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full max-w-4xl flex justify-center">
                  <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 place-items-center justify-items-center">
                      {/* Columna izquierda */}
                      <div className="w-full max-w-sm flex flex-col space-y-8 mx-auto">
                        {/* Nombre */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Nombre
                            </label>
                          </div>
                          <Input
                            labelPlacement="outside"
                            radius="lg"
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            placeholder="Ingrese el nombre completo"
                            type="text"
                            isRequired
                            value={formData.name}
                            variant="bordered"
                            autoComplete="username"
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>

                        {/* Fecha de nacimiento */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-gray-800 dark:text-gray-200 font-semibold text-base">
                                Fecha de nacimiento
                              </span>
                              <span className="text-danger">*</span>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="w-full">
                                <DatePickerCustom onChange={handleDateChange} />
                                {errorFecha && (
                                  <p className="text-red-500 text-sm mt-2">
                                    {errorFecha}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Género */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Género
                            </label>
                          </div>
                          <Select
                            labelPlacement="outside"
                            isRequired
                            radius="lg"
                            variant="bordered"
                            selectedKeys={[formData.genero]}
                            classNames={{
                              trigger:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                              value:
                                "text-gray-900 dark:text-white text-center",
                              listboxWrapper: "dark:bg-gray-800",
                              popoverContent:
                                "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                            }}
                            placeholder="Seleccione el género"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                genero: e.target.value,
                              })
                            }
                          >
                            {genders.map((gender) => (
                              <SelectItem
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                textValue={gender.textValue}
                                key={gender.textValue}
                              >
                                {gender.showLabel}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        {/* Email */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              E-mail
                            </label>
                          </div>
                          <Input
                            labelPlacement="outside"
                            isRequired
                            radius="lg"
                            value={formData.email}
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            placeholder="ejemplo@correo.com"
                            type="email"
                            autoComplete="email"
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Rol */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Rol
                            </label>
                          </div>
                          <Select
                            labelPlacement="outside"
                            isRequired
                            radius="lg"
                            variant="bordered"
                            selectedKeys={[rol]}
                            aria-label="Seleccionar rol"
                            classNames={{
                              trigger:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                              value:
                                "text-gray-900 dark:text-white text-center",
                              listboxWrapper: "dark:bg-gray-800",
                              popoverContent:
                                "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                            }}
                            placeholder="Seleccione el rol"
                            onChange={(e) => handleChangeRol(e.target.value)}
                          >
                            {roles.map((rol) => (
                              <SelectItem
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                textValue={rol.textValue}
                                key={rol.textValue}
                              >
                                {rol.showLabel}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>

                      {/* Columna derecha */}
                      <div className="w-full max-w-sm flex flex-col space-y-8 mx-auto">
                        {/* Apellido */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Apellido
                            </label>
                          </div>
                          <Input
                            labelPlacement="outside"
                            radius="lg"
                            variant="bordered"
                            value={formData.apellido}
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            isRequired
                            placeholder="Ingrese el apellido completo"
                            type="text"
                            autoComplete="username"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                apellido: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* País */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-gray-800 dark:text-gray-200 font-semibold text-base">
                                País
                              </span>
                              <span className="text-danger">*</span>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="w-full">
                                <Select
                                  labelPlacement="outside"
                                  isRequired
                                  radius="lg"
                                  variant="bordered"
                                  selectedKeys={
                                    formData.pais ? [formData.pais] : []
                                  }
                                  classNames={{
                                    trigger:
                                      "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                                    value:
                                      "text-gray-900 dark:text-white text-center",
                                    listboxWrapper: "dark:bg-gray-800",
                                    popoverContent:
                                      "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                                  }}
                                  placeholder="Seleccione el país de residencia"
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      pais: e.target.value,
                                    })
                                  }
                                >
                                  {Flags.map((item) => (
                                    <SelectItem
                                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                      textValue={item.label}   // <- ahora el texto es "Bahamas"
                                      key={item.value}         // <- la key sigue siendo el código "BS"
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contraseña */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Contraseña
                            </label>
                          </div>
                          <Input
                            name="password"
                            isRequired
                            radius="lg"
                            minLength={8}
                            labelPlacement="outside"
                            autoComplete="current-password"
                            value={formData.password}
                            placeholder="Mínimo 8 caracteres"
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            endContent={
                              <button
                                aria-label={
                                  isVisible
                                    ? "Ocultar contraseña"
                                    : "Mostrar contraseña"
                                }
                                type="button"
                                className="focus:outline-none mr-2"
                                onClick={toggleVisibility}
                              >
                                {isVisible ? (
                                  <EyeSlashFilledIcon
                                    className="text-2xl text-gray-400 dark:text-gray-500 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EyeFilledIcon
                                    className="text-2xl text-gray-400 dark:text-gray-500 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            }
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Título profesional (solo psicólogo) */}
                        {rol === "PSICOLOGO" ? (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                            <div className="text-center">
                              <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                Título Profesional
                              </label>
                            </div>
                            <Select
                              name="titulo"
                              isRequired
                              radius="lg"
                              labelPlacement="outside"
                              value={formData.titulo}
                              aria-label="Seleccionar título profesional"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  titulo: e.target.value,
                                })
                              }
                              placeholder="Seleccione el título profesional"
                              variant="bordered"
                              selectedKeys={[formData.titulo]}
                              classNames={{
                                trigger:
                                  "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                                value:
                                  "text-gray-900 dark:text-white text-center",
                                listboxWrapper: "dark:bg-gray-800",
                                popoverContent:
                                  "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                              }}
                            >
                              {titles.map((title) => (
                                <SelectItem
                                  key={title.textValue}
                                  textValue={title.textValue}
                                  className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {title.showLabel}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                        ) : null}

                        {/* Idiomas (solo psicólogo) */}
                        {rol === "PSICOLOGO" ? (
                          <>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                              <div className="text-center">
                                <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                  Idiomas que domina
                                </label>
                              </div>
                              <Select
                                name="idiomas"
                                isRequired
                                radius="lg"
                                labelPlacement="outside"
                                selectionMode="multiple"
                                aria-label="Seleccionar idiomas"
                                placeholder="Seleccione los idiomas que domina"
                                variant="bordered"
                                selectedKeys={new Set(selectedIdiomas)}
                                classNames={{
                                  trigger:
                                    "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                                  value:
                                    "text-gray-900 dark:text-white text-center",
                                  listboxWrapper: "dark:bg-gray-800",
                                  popoverContent:
                                    "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                                }}
                                onSelectionChange={(keys) => {
                                  const selected = Array.from(
                                    keys
                                  ) as string[];
                                  setSelectedIdiomas(selected);

                                  const hasOtros = selected.includes("otros");
                                  setOtroIdioma(hasOtros);

                                  const soloIdiomas = selected.filter(
                                    (k) => k !== "otros"
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    idioma: soloIdiomas.join(","), // CSV de slugs
                                  }));
                                }}
                              >
                                {idiomasList.map((idioma) => (
                                  <SelectItem
                                    key={idioma.textValue}
                                    textValue={idioma.textValue}
                                    className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    {idioma.showLabel}
                                  </SelectItem>
                                ))}
                              </Select>

                              {otroIdioma && (
                                <div className="mt-4">
                                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block text-center">
                                      Agregar nuevo idioma
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                      <Input
                                        radius="lg"
                                        variant="bordered"
                                        value={nuevoIdioma}
                                        placeholder="Ej. Quechua"
                                        classNames={{
                                          inputWrapper:
                                            "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                                          input:
                                            "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                                        }}
                                        onChange={(e) =>
                                          setNuevoIdioma(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddIdioma();
                                          }
                                        }}
                                      />
                                      <Button
                                        radius="lg"
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                        isDisabled={addIdiomaLoading}
                                        onPress={handleAddIdioma}
                                      >
                                        {addIdiomaLoading
                                          ? "Agregando..."
                                          : "Agregar"}
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                      Escribe el idioma y presiona “Agregar”.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Especialidades */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full mt-6">
                              <div className="text-center">
                                <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                  Especialidades
                                </label>
                              </div>
                              <Select
                                selectionMode="multiple"
                                radius="lg"
                                variant="bordered"
                                placeholder="Seleccione una o varias especialidades"
                                selectedKeys={new Set(
                                  especialidadesSeleccionadas.map(String)
                                )}
                                onSelectionChange={(keys) => {
                                  const selectedKeys = Array.from(
                                    keys
                                  ) as string[];
                                  const ids = selectedKeys.map((k) =>
                                    Number(k)
                                  );

                                  setEspecialidadesSeleccionadas(ids);

                                  const hasOtras = ids.includes(0);
                                  setShowOtrasEspecialidades(hasOtras);

                                  const soloIds = ids.filter((id) => id !== 0);
                                  setFormData((prev) => ({
                                    ...prev,
                                    especialidades: soloIds,
                                  }));
                                }}
                                classNames={{
                                  trigger:
                                    "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                                  value:
                                    "text-gray-900 dark:text-white text-center",
                                  listboxWrapper: "dark:bg-gray-800",
                                  popoverContent:
                                    "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                                }}
                              >
                                {especialidadesList.map((esp) => (
                                  <SelectItem
                                    key={String(esp.idEspecialidad)}
                                    textValue={esp.nombre}
                                  >
                                    {esp.nombre}
                                  </SelectItem>
                                ))}
                              </Select>

                              {showOtrasEspecialidades && (
                                <div className="mt-4">
                                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block text-center">
                                      Agregar nueva especialidad
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                      <Input
                                        radius="lg"
                                        variant="bordered"
                                        value={nuevaEspecialidad}
                                        placeholder="Ej. Psicología deportiva"
                                        classNames={{
                                          inputWrapper:
                                            "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                                          input:
                                            "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                                        }}
                                        onChange={(e) =>
                                          setNuevaEspecialidad(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAgregarNuevaEspecialidad();
                                          }
                                        }}
                                      />
                                      <Button
                                        radius="lg"
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                        isDisabled={addEspLoading}
                                        onPress={handleAgregarNuevaEspecialidad}
                                      >
                                        {addEspLoading
                                          ? "Agregando..."
                                          : "Agregar"}
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                      Se registrará en la base de datos y se
                                      agregará a la lista.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : null}

                        {/* Permisos (no psicólogo) */}
                        {rol !== "PSICOLOGO" ? (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                            <div className="text-center">
                              <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                Asignar permiso
                              </label>
                            </div>
                            <Select
                              name="permissions"
                              isRequired
                              radius="lg"
                              labelPlacement="outside"
                              selectionMode="multiple"
                              aria-label="Seleccionar permisos"
                              placeholder="Seleccione el permiso del personal."
                              variant="bordered"
                              selectedKeys={new Set(
                                permissions.map((p) => String(p))
                              )}
                              onSelectionChange={(keys) => {
                                const selected = Array.from(keys).map((k) =>
                                  Number(k)
                                );
                                setPermissions(selected);
                                setFormData((prev) => ({
                                  ...prev,
                                  permissions: selected,
                                }));
                              }}
                            >
                              {permissionsList
                                .filter(
                                  (perm) =>
                                    perm.id !== undefined && perm.id !== null
                                )
                                .map((perm) => (
                                  <SelectItem
                                    key={String(perm.id)}
                                    textValue={perm.name}
                                  >
                                    {perm.name}
                                  </SelectItem>
                                ))}
                            </Select>
                          </div>
                        ) : (
                          <div />
                        )}

                        {permissions.length > 0 && rol !== "PSICOLOGO" && (
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {permissions.map((permId, idx) => {
                              const permName =
                                permissionsList.find((p) => p.id === permId)
                                  ?.name || permId;
                              return (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium border border-primary/30"
                                >
                                  {permName}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                {rol === "PSICOLOGO" ? (
                  <div className="flex justify-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
                    <Button
                      radius="lg"
                      type="button"
                      size="lg"
                      disabled={isSend}
                      onPress={handleSubmitCreatePsicologo}
                      className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSend ? "Creando..." : "Crear Psicólogo"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
                    <Button
                      radius="lg"
                      size="lg"
                      type="button"
                      disabled={isSend}
                      onPress={handleSubmitCreatePersonal}
                      className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSend ? "Creando..." : "Crear Personal"}
                    </Button>
                  </div>
                )}
              </Form>

              {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Suceesfully
                    setIsSend={() => {
                      resetForm();
                      setShowSuccessModal(false);
                      setIsSend(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
