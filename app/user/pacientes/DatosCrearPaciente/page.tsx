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
  CitySelect,
} from "react-country-state-city";
import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date"
import "react-country-state-city/dist/react-country-state-city.css"
import Image from "next/image";
import { Plus } from "lucide-react";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";

export default function App() {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [currentState, setCurrentState] = useState<City | null>(null);
  const [currentCity, setCurrentCity] = useState<State | null>(null);
  const [formData, setFormData] = useState<FormPaciente>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    DNI: "",
    email: "",
    celular: "",
    fecha_nacimiento: "",
    genero: "",
    estadoCivil: "",
    ocupacion: "",
    direccion: "",
    departamento: currentState?.name || "",
    provincia: currentCity?.name || "",
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
      setUrl(""); // Clear URL input when uploading an image
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

  const handleCityChange = (
    selected: City | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      typeof selected === "object" &&
      "id" in selected &&
      "name" in selected
    ) {
      setCurrentCity(selected);
      setFormData((prev) => ({ ...prev, provincia: selected.name }));
    } else {
      setCurrentCity(null);
      setFormData((prev) => ({ ...prev, provincia: "" }));
    }
  };

  const HandlePostPaciente = async () => {
    try {
      const pacienteData: Omit<Paciente2, "idPaciente"> = {
        DNI: formData.DNI,
        nombre: formData.nombre,
        apellido: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
        email: formData.email,
        celular: formData.celular,
        fecha_nacimiento: formData.fecha_nacimiento,
        imagen: base64Image || url || "http://algo",
        genero: formData.genero,
        ocupacion: formData.ocupacion,
        estadoCivil: formData.estadoCivil,
        direccion: `${formData.direccion}, ${formData.pais}, ${formData.provincia}, ${formData.departamento}`,
      };

      const cookies = parseCookies();
      const token = cookies["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const urlApi = apiUrl ? `${apiUrl}api/pacientes` : "/api/pacientes";
      const response = await fetch(urlApi, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "Paciente creado correctamente");
        setFormData({
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          DNI: "",
          email: "",
          celular: "",
          fecha_nacimiento: "",
          genero: "",
          estadoCivil: "",
          ocupacion: "",
          direccion: "",
          departamento: "",
          provincia: "",
          pais: "",
          antecedentesMedicos: "",
          medicamentosPrescritos: "",
        });
        setBase64Image(null);
        setUrl("");
      } else {
        showToast("error", data.message || "Error al crear el paciente");
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
        <div className="pl-12 text-4xl items-center justify-items-center font-bold text-primary dark:text-primary">
          <h1>Datos del Paciente</h1>
        </div>
      </div>
      <div className="flex mt-4 text-primary dark:text-primary font-bold text-normal">
        <div className="flex-1 ml-5 mr-5 bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl">
          <div className="flex pt-6">
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="nombre" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Nombre</label>
              <div className="relative">
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  aria-label="Nombre del paciente"
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="dni" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">DNI</label>
              <div className="relative">
                <input
                  id="dni"
                  type="text"
                  value={formData.DNI}
                  maxLength={8}
                  onChange={(e) =>
                    setFormData({ ...formData, DNI: e.target.value })
                  }
                  aria-label="Documento Nacional de Identidad"
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="apellidoPaterno" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Apellido Paterno</label>
              <div className="relative">
                <input
                  id="apellidoPaterno"
                  type="text"
                  value={formData.apellidoPaterno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellidoPaterno: e.target.value,
                    })
                  }
                  aria-label="Apellido paterno del paciente"
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="apellidoMaterno" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Apellido Materno</label>
              <div className="relative">
                <input
                  id="apellidoMaterno"
                  type="text"
                  value={formData.apellidoMaterno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellidoMaterno: e.target.value,
                    })
                  }
                  aria-label="Apellido materno del paciente"
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Fecha de nacimiento</div>
              <div className="relative">
                <DatePicker
                  showMonthAndYearPickers
                  selectorButtonPlacement="start"
                  aria-label="Fecha de nacimiento del paciente"
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
                        "data-[range-start=true]:before:rounded-l-small font-bold text-foreground dark:text-foreground",
                        "data-[selection-start=true]:before:rounded-l-small font-bold text-foreground dark:text-foreground",
                        "data-[range-end=true]:before:rounded-r-small font-bold text-foreground dark:text-foreground",
                        "data-[selection-end=true]:before:rounded-r-small font-bold text-foreground dark:text-foreground",
                        "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small font-bold text-foreground dark:text-foreground",
                        "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small font-bold text-foreground dark:text-foreground",
                      ],
                    },
                  }}
                  onChange={handleDateChange}
                  value={parseDateString(formData.fecha_nacimiento)}
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="ocupacion" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Ocupacion</label>
              <div className="relative">
                <input
                  id="ocupacion"
                  type="text"
                  value={formData.ocupacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ocupacion: e.target.value,
                    })
                  }
                  aria-label="Ocupación del paciente"
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="estadoCivil" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Estado civil</label>
              <div className="relative w-60">
                <select
                  id="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoCivil: e.target.value })
                  }
                  aria-label="Estado civil del paciente"
                  className="font-normal pl-12 pr-3 text-base h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
                >
                  <option value="" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Seleccionar</option>
                  <option value="Soltero" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Soltero</option>
                  <option value="Casado" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Casado</option>
                  <option value="Divorciado" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Divorciado</option>
                  <option value="Otro" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Otro</option>
                </select>
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="genero" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Genero</label>
              <div className="relative w-60">
                <select
                  id="genero"
                  value={formData.genero}
                  onChange={(e) =>
                    setFormData({ ...formData, genero: e.target.value })
                  }
                  aria-label="Género del paciente"
                  className="text-base font-normal pl-12 pr-3 h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
                >
                  <option value="" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Seleccionar</option>
                  <option value="Masculino" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Masculino</option>
                  <option value="Femenino" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Femenino</option>
                  <option value="Otro" className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground">Otro</option>
                </select>
              </div>
            </div>
          </div>
          <label htmlFor="celular" className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground block">Celular</label>
          <div className="flex justify-center">
            <input
              id="celular"
              type="text"
              maxLength={9}
              value={formData.celular}
              onChange={(e) =>
                setFormData({ ...formData, celular: e.target.value })
              }
              placeholder="Ejemp. 999999999"
              aria-label="Número de celular del paciente"
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          {/* Imagen */}
          <h1 className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground">
            Imagen
          </h1>

          {/* Seccion de subida de imagen */}
          <div className="w-full flex flex-col gap-2">
            {/* Boton de subir imagen */}
            <div className="relative border-2 border-[#634AE2] rounded-lg h-32 w-full flex justify-center items-center cursor-pointer overflow-hidden">
              {base64Image ? (
                <Image
                  src={base64Image}
                  alt="Imagen seleccionada"
                  width={300}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Plus
                    width={40}
                    height={40}
                    strokeWidth={2}
                    className="text-[#634AE2]"
                  />
                  <span className="text-[#634AE2] text-sm mt-2">
                    Subir foto del paciente
                  </span>
                </div>
              )}

              <input
                id="imagenPaciente"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                aria-label="Subir foto del paciente"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/*Segunda Columna*/}
        <div className="flex-1 mr-5 ml-5 bg-card dark:bg-card rounded-2xl p-6 border dark:border-border shadow-lg dark:shadow-xl">
          <label htmlFor="email" className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground block">
            Correo electrónico
          </label>
          <div className="flex justify-center">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              aria-label="Correo electrónico del paciente"
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Pais</div>
              <div className="relative">
                <CountrySelect
                  containerClassName="mt-2 [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-input [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-3 text-sm h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-foreground dark:text-foreground"
                  onChange={handleCountryChange}
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-foreground dark:text-foreground transition-colors absolute right-3 top-1/2  pt-1 transform -translate-y-1/2"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Departamento</div>
              <div className="relative">
                <StateSelect
                  countryid={country?.id ?? 0}
                  containerClassName="mt-2 [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-input [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-3 text-sm h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-foreground dark:text-foreground"
                  onChange={handleStateChange}
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-foreground dark:text-foreground transition-colors absolute right-3 top-1/2  pt-1 transform -translate-y-1/2"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Provincia</div>
              <div className="relative">
                <CitySelect
                  countryid={country?.id ?? 0}
                  stateid={currentState?.id ?? 0}
                  onChange={handleCityChange}
                  containerClassName="mt-2 [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-input [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-3 text-sm h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-foreground dark:text-foreground"
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-foreground dark:text-foreground transition-colors absolute right-3 top-1/2 pt-1 transform -translate-y-1/2"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <label htmlFor="direccion" className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Direccion</label>
              <div className="relative">
                <input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  aria-label="Dirección del paciente"
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <label htmlFor="antecedentesMedicos" className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground block">
            Antecedentes médicos
          </label>
          <div className="flex justify-center">
            <input
              id="antecedentesMedicos"
              type="text"
              value={formData.antecedentesMedicos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  antecedentesMedicos: e.target.value,
                })
              }
              aria-label="Antecedentes médicos del paciente"
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          <label htmlFor="medicamentosPrescritos" className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground block">
            Medicamentos prescritos
          </label>
          <div className="flex justify-center">
            <input
              id="medicamentosPrescritos"
              type="text"
              value={formData.medicamentosPrescritos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  medicamentosPrescritos: e.target.value,
                })
              }
              aria-label="Medicamentos prescritos al paciente"
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full p-4">
        <button
          onClick={HandlePostPaciente}
          aria-label="Registrar nuevo paciente"
          className="text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-28 h-8 mr-12 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}