"use client";
import React, { useState } from "react";
import { Icons } from "@/icons";
import CerrarSesion from "@/components/CerrarSesion";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import { City, Country, FormPaciente, Paciente2, State } from "@/interface";
import {
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date"
import "react-country-state-city/dist/react-country-state-city.css"
import Image from "next/image";
import { Plus } from "lucide-react";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditarPaciente({ id }: { id: string | null }) {
  const router = useRouter();
 const [base64Image, setBase64Image] = useState<string | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [currentState, setCurrentState] = useState<City | null>(null);
  const [formData, setFormData] = useState<Omit<FormPaciente, "provincia">>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    DNI: "",
    email: "",
    celular: "",
    imagen: "",
    fecha_nacimiento: "",
    genero: "",
    estadoCivil: "",
    ocupacion: "",
    direccion: "",
    departamento: currentState?.name || "",
    pais: country?.name || "",
    antecedentesMedicos: "",
    medicamentosPrescritos: "",
  });
  // Corrige el tipo de currentState y currentCity en el formData
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      // Convertir la imagen a WebP
      const webpImage = await convertImageToWebP(file);
      // Convertir la imagen WebP a Base64
      const base64 = await convertToBase64(webpImage);
      setBase64Image(base64);
    } catch (error) {
      console.error("Error processing image:", error);
      showToast("error", "Error al procesar la imagen. Intenta nuevamente.");
    }
  };

  const handleDateChange = (value: CalendarDate | null) => {
    if (value) {
      // Formatear directamente como DD/MM/YYYY
      const formattedDate = `${value.day.toString().padStart(2, '0')}/${value.month.toString().padStart(2, '0')}/${value.year}`;
      setFormData({ ...formData, fecha_nacimiento: formattedDate });
    } else {
      setFormData({ ...formData, fecha_nacimiento: "" });
    }
  };

  const parseDateString = (dateString: string): CalendarDate | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new CalendarDate(year, month, day);
  };

  const handleCountryChange = (
    selected: Country | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      typeof selected === "object" &&
      "id" in selected &&
      "name" in selected
    ) {
      setCountry(selected);
      setFormData((prev) => ({ ...prev, pais: selected.name }));
    } else {
      setCountry(null);
      setFormData((prev) => ({ ...prev, pais: "" }));
    }
  };

  const handleStateChange = (
    selected: State | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      typeof selected === "object" &&
      "id" in selected &&
      "name" in selected
    ) {
      setCurrentState(selected);
      setFormData((prev) => ({ ...prev, departamento: selected.name }));
    } else {
      setCurrentState(null);
      setFormData((prev) => ({ ...prev, departamento: "" }));
    }
  };

  const HandleUpdatePaciente = async () => {
     try {
           const pacienteData: Omit<Paciente2, "idPaciente" | "provincia"> = {
             DNI: formData.DNI,
             nombre: formData.nombre,
             apellido: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
             email: formData.email,
             celular: formData.celular,
             fecha_nacimiento: formData.fecha_nacimiento,
             imagen: base64Image || '',
             genero: formData.genero,
             ocupacion: formData.ocupacion,
             estadoCivil: formData.estadoCivil,
             direccion: formData.direccion,
             pais: formData.pais,
             departamento: formData.departamento,
           };


      const cookies = parseCookies();
      const token = cookies["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const urlApi = apiUrl ? `${apiUrl}api/pacientes/${id}` : `/api/pacientes/${id}`;
      const response = await fetch(urlApi, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "Paciente actualizado correctamente");
        router.push('/user/pacientes/DetallePaciente/');
      } else {
        showToast("error", data.message || "Error al actualizar el paciente");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-4 bg-[#f8f8ff] dark:bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-1 bg-[#f8f8ff] dark:bg-background w-full z-30">
        <div>
          <nav className="bg-[#f8f8ff] dark:bg-background rounded-2xl flex items-center w-[calc(95vw-270px)] p-4">
            <div className="bg-[#f8f8ff] dark:bg-background flex items-end justify-end w-full">
              <div className="flex gap-x-5">
                <CerrarSesion />
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div>
        <div className="pl-0 md:pl-12 text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-6 text-center md:text-left">
          <h1>Datos del Paciente</h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 text-primary dark:text-primary font-bold text-normal">
        {/* Primera columna */}
        <div className="flex-1 bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              />
            </div>
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">DNI</label>
              <input
                type="text"
                value={formData.DNI}
                maxLength={8}
                onChange={(e) => setFormData({ ...formData, DNI: e.target.value })}
                className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Apellido Paterno</label>
              <input
                type="text"
                value={formData.apellidoPaterno}
                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                className="pl-4 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              />
            </div>
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Apellido Materno</label>
              <input
                type="text"
                value={formData.apellidoMaterno}
                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                className="pl-4 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Fecha de nacimiento</label>
              <DatePicker
                showMonthAndYearPickers
                selectorButtonPlacement="start"
                classNames={{
                  inputWrapper: "bg-input dark:bg-input rounded-full border border-border dark:border-border",
                  segment: "!text-foreground dark:!text-foreground",
                }}
                calendarProps={{
                  classNames: {
                    pickerMonthList: "bg-popover dark:bg-popover",
                    pickerYearList: "bg-popover dark:bg-popover",
                    pickerItem: "!text-popover-foreground dark:!text-popover-foreground",
                    base: "bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground",
                    headerWrapper: "pt-4 bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground",
                    prevButton: "border-1 border-border dark:border-border rounded-small bg-popover dark:bg-popover text-xl text-popover-foreground dark:text-popover-foreground",
                    nextButton: "border-1 border-border dark:border-border rounded-small bg-popover dark:bg-popover text-xl text-popover-foreground dark:text-popover-foreground",
                    gridHeader: "bg-popover dark:bg-popover shadow-none border-b-1 border-border dark:border-border text-popover-foreground dark:text-popover-foreground",
                    cellButton: [
                      "data-[today=true]:bg-accent dark:data-[today=true]:bg-accent data-[selected=true] text-foreground dark:text-foreground:bg-accent dark:bg-accent rounded-full",
                      "data-[selected=true]:!bg-primary dark:data-[selected=true]:!bg-primary data-[selected=true]:!text-primary-foreground dark:data-[selected=true]:!text-primary-foreground rounded-full",
                    ],
                  },
                }}
                onChange={handleDateChange}
                value={parseDateString(formData.fecha_nacimiento)}
              />
            </div>
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Ocupación</label>
              <input
                type="text"
                value={formData.ocupacion}
                onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })}
                className="pl-4 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Estado civil</label>
              <select
                value={formData.estadoCivil}
                onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value })}
                className="font-normal pl-4 pr-3 text-base h-9 mt-1 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              >
                <option value="">Seleccionar</option>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Género</label>
              <select
                value={formData.genero}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                className="text-base font-normal pl-4 pr-3 h-9 mt-1 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-center text-card-foreground dark:text-card-foreground">Celular</label>
            <input
              type="text"
              maxLength={30}
              minLength={3}
              value={formData.celular}
              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
              placeholder="Ejemp. +51 999999999"
              className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          {/* Imagen */}
          <h1 className="text-center pt-4 pb-2 text-card-foreground dark:text-card-foreground">
            Imagen
          </h1>
          <div className="w-full flex flex-col gap-2 m-auto items-center">
            <div className="relative border border-border dark:border-border rounded-lg h-[220px] w-[220px] bg-input flex justify-center items-center cursor-pointer overflow-hidden">
              {base64Image ? (
                <Image
                  src={base64Image}
                  alt="Imagen seleccionada"
                  width={220}
                  height={220}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Plus width={40} height={40} strokeWidth={2} className="text-card-foreground dark:text-card-foreground" />
                  <span className="text-card-foreground dark:text-card-foreground text-sm mt-2">
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
            </div>
          </div>
        </div>

        {/* Segunda columna */}
        <div className="flex-1 bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl mt-6 lg:mt-0">
          <div className="mb-4">
            <label className="block text-center text-card-foreground dark:text-card-foreground">Correo electrónico</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          <div className="flex flex-col md:flex-row pt-1 gap-4">
            {/* País */}
            <div className="flex-1 w-full">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">País</div>
              <div className="relative w-full">
                <CountrySelect
                  containerClassName="mt-2 w-full [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-input [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-10 text-sm h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-foreground dark:text-foreground"
                  onChange={handleCountryChange}
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-foreground dark:text-foreground transition-colors absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                    minWidth: "1em",
                    minHeight: "1em",
                    maxWidth: "1.5em",
                    maxHeight: "1.5em",
                  }}
                />
              </div>
            </div>
            {/* Departamento */}
            <div className="flex-1 w-full">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Departamento</div>
              <div className="relative w-full">
                <StateSelect
                  countryid={country?.id ?? 0}
                  containerClassName="mt-2 w-full [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-input [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-10 text-sm h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-foreground dark:text-foreground"
                  onChange={handleStateChange}
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-foreground dark:text-foreground transition-colors absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                    minWidth: "1em",
                    minHeight: "1em",
                    maxWidth: "1.5em",
                    maxHeight: "1.5em",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block py-1 mt-2 text-card-foreground dark:text-card-foreground">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          <div className="mt-4">
            <label className="block text-center text-card-foreground dark:text-card-foreground">Antecedentes médicos</label>
            <input
              type="text"
              value={formData.antecedentesMedicos}
              onChange={(e) => setFormData({ ...formData, antecedentesMedicos: e.target.value })}
              className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          <div className="mt-4">
            <label className="block text-center text-card-foreground dark:text-card-foreground">Medicamentos prescritos</label>
            <input
              type="text"
              value={formData.medicamentosPrescritos}
              onChange={(e) => setFormData({ ...formData, medicamentosPrescritos: e.target.value })}
              className="pl-4 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center w-full p-4 mt-6 gap-4">
        <button
          onClick={HandleUpdatePaciente}
          className="text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
        >
          Actualizar
        </button>
        <Link
          href="/user/pacientes/DetallePaciente/"
          className="grid place-items-center text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}