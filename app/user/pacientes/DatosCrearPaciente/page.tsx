"use client";
import React, { useState } from "react";
import { Icons } from "@/icons";
import CerrarSesion from "@/components/CerrarSesion";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import { City, Country, FormPaciente, Paciente2, State } from "@/interface";
import { CountrySelect, StateSelect } from "react-country-state-city";
import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import "react-country-state-city/dist/react-country-state-city.css";
import Image from "next/image";
import { Plus } from "lucide-react";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { useForm } from "react-hook-form";
import FormFieldInput from "@/components/ui/Form/FormFieldInput";
import FormField from "@/components/ui/Form/FormField";
import FormFieldSelect from "@/components/ui/Form/FormFieldSelect";
import HeaderUser from "@/components/User/HeaderUser";

export default function App() {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [currentState, setCurrentState] = useState<City | null>(null);
  const defaultValues = {
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
  };
  const [formData, setFormData] =
    useState<Omit<FormPaciente, "provincia">>(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Omit<FormPaciente, "provincia">>({
    defaultValues,
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
      const formattedDate = `${value.day
        .toString()
        .padStart(2, "0")} / ${value.month.toString().padStart(2, "0")} / ${
        value.year
      }`;
      setFormData({ ...formData, fecha_nacimiento: formattedDate });
    } else {
      setFormData({ ...formData, fecha_nacimiento: "" });
    }
  };

  const parseDateString = (dateString: string): CalendarDate | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/").map(Number);
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

  const HandlePostPaciente = async () => {
    try {
      const pacienteData: Omit<Paciente2, "idPaciente" | "provincia"> = {
        DNI: formData.DNI,
        nombre: formData.nombre,
        apellido: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
        email: formData.email,
        celular: formData.celular,
        fecha_nacimiento: formData.fecha_nacimiento,
        imagen: base64Image || url,
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
          imagen: "",
          celular: "",
          fecha_nacimiento: "",
          genero: "",
          estadoCivil: "",
          ocupacion: "",
          direccion: "",
          departamento: "",
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
      <HeaderUser title="Datos del paciente" />
      <div className="flex flex-col lg:flex-row gap-6 text-primary dark:text-primary font-bold text-normal">
        {/* Primera columna */}
        <div className="flex-1 bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">

            <FormFieldInput
              label="Nombre"
              name="nombre"
              register={register}
              errors={errors}
            />

            <FormFieldInput
              label="DNI"
              name="DNI"
              maxLenght={8}
              register={register}
              errors={errors}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">

            <FormFieldInput
              label="Apellido Paterno"
              name="apellidoPaterno"
              register={register}
              errors={errors}
            />

            <FormFieldInput
              label="Apellido Materno"
              name="apellidoMaterno"
              register={register}
              errors={errors}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              errors={errors}
              name="fecha_nacimiento"
              label={"Fecha de nacimiento"}
            >
              <DatePicker
                showMonthAndYearPickers
                selectorButtonPlacement="start"
                classNames={{
                  inputWrapper:
                    "bg-input dark:bg-input rounded-full border border-border dark:border-border",
                  segment: "!text-foreground dark:!text-foreground",
                }}
                calendarProps={{
                  classNames: {
                    pickerMonthList: "bg-popover dark:bg-popover",
                    pickerYearList: "bg-popover dark:bg-popover",
                    pickerItem:
                      "!text-popover-foreground dark:!text-popover-foreground",
                    base: "bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground",
                    headerWrapper:
                      "pt-4 bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground",
                    prevButton:
                      "border-1 border-border dark:border-border rounded-small bg-popover dark:bg-popover text-xl text-popover-foreground dark:text-popover-foreground",
                    nextButton:
                      "border-1 border-border dark:border-border rounded-small bg-popover dark:bg-popover text-xl text-popover-foreground dark:text-popover-foreground",
                    gridHeader:
                      "bg-popover dark:bg-popover shadow-none border-b-1 border-border dark:border-border text-popover-foreground dark:text-popover-foreground",
                    cellButton: [
                      "data-[today=true]:bg-accent dark:data-[today=true]:bg-accent data-[selected=true] text-foreground dark:text-foreground:bg-accent dark:bg-accent rounded-full",
                      "data-[selected=true]:!bg-primary dark:data-[selected=true]:!bg-primary data-[selected=true]:!text-primary-foreground dark:data-[selected=true]:!text-primary-foreground rounded-full",
                    ],
                  },
                }}
                onChange={handleDateChange}
                value={parseDateString(formData.fecha_nacimiento)}
              />
            </FormField>

            <FormFieldInput
              label="Ocupación"
              name="ocupacion"
              register={register}
              errors={errors}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">

            <FormFieldSelect
              label="Estado civil"
              errors={errors}
              register={register}
              name="estadoCivil"
              placeholder="Seleccionar"
              options={[
                { label: "Soltero", value: "Soltero" },
                { label: "Casado", value: "Casado" },
                { label: "Divorciado", value: "Divorciado" },
                { label: "Otro", value: "Otro" },
              ]}
            />

            <FormFieldSelect
              label="Género"
              errors={errors}
              register={register}
              name="genero"
              placeholder="Seleccionar"
              options={[
                { label: "Masculino", value: "Masculino" },
                { label: "Femenino", value: "Femenino" },
                { label: "Otro", value: "Otro" },
              ]}
            />
          </div>

          <FormFieldInput
            label="Celular"
            name="celular"
            register={register}
            errors={errors}
            minLenght={3}
            maxLenght={30}
          />
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
                  <Plus
                    width={40}
                    height={40}
                    strokeWidth={2}
                    className="text-card-foreground dark:text-card-foreground"
                  />
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
          <FormFieldInput
            label="Correo electrónico"
            name="email"
            register={register}
            errors={errors}
          />
          <div className="flex flex-col md:flex-row pt-1 gap-4">
            <FormField label="País" name="pais" errors={errors}>
              <CountrySelect
                containerClassName="mt-2 w-full [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-input [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                inputClassName="appearance-none !border-none !outline-none pl-12 pr-10 text-sm h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-foreground dark:text-foreground"
                onChange={handleCountryChange}
                placeHolder="Seleccionar"
              />
            </FormField>
            {/* Departamento */}
            <FormField label="Departamento" name="departamento" errors={errors}>
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
            </FormField>
          </div>
          <FormFieldInput
            label="Dirección"
            name="direccion"
            register={register}
            errors={errors}
          />
          <FormFieldInput
            label="Antecedentes médicos"
            name="antecedentesMedicos"
            register={register}
            errors={errors}
          />
          <FormFieldInput
            label="Medicamentos prescritos"
            name="medicamentosPrescritos"
            register={register}
            errors={errors}
          />
        </div>
      </div>

      <div className="flex justify-center w-full p-4 mt-6">
        <button
          onClick={HandlePostPaciente}
          className="text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}
