"use client";
import React, { useState } from "react";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import { Country, FormPaciente, Paciente2, State } from "@/interface";
import { CountrySelect, StateSelect } from "react-country-state-city";
import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import "react-country-state-city/dist/react-country-state-city.css";
import Image from "next/image";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { Controller, useForm } from "react-hook-form";
import FormFieldInput from "@/components/ui/Form/FormFieldInput";
import FormField from "@/components/ui/Form/FormField";
import FormFieldSelect from "@/components/ui/Form/FormFieldSelect";
import HeaderUser from "@/components/User/HeaderUser";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { countryPrefixes } from "@/utils/CountryPrefixes";

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
  departamento: "",
  pais: "",
  antecedentesMedicos: "",
  medicamentosPrescritos: "",
};

export default function App() {
  const router = useRouter();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [prefix, setPrefix] = useState("+51");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormPaciente>({
    defaultValues,
  });
  
  // Corrige el tipo de currentState y currentCity en el formData
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const webpImage = await convertImageToWebP(file);
      const base64 = await convertToBase64(webpImage);
      setBase64Image(base64);
      setUrl("");
    } catch (error) {
      console.error("Error processing image:", error);
      showToast("error", "Error al procesar la imagen. Intenta nuevamente.");
    }
  };

  const handleDateChange = (value: CalendarDate | null, onChange: (value: string) => void) => {
    clearErrors("fecha_nacimiento");
    
    if (value) {
      const formattedDate = `${value.day.toString().padStart(2, "0")}/${value.month.toString().padStart(2, "0")}/${value.year}`;
      onChange(formattedDate);
      console.log(formattedDate);
    } else {
      onChange("");
    }
  };

  const parseDateString = (dateString: string): CalendarDate | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/").map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new CalendarDate(year, month, day);
  };

  const handleCountryChange = (selected: Country | React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    clearErrors("pais");
    
    if (typeof selected === "object" && "id" in selected && "name" in selected) {
      setCountry(selected);
      onChange(selected.name);
    } else {
      setCountry(null);
      onChange("");
    }
  };
  
  const handleStateChange = (selected: State | React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    clearErrors("departamento");
    
    if (typeof selected === "object" && "id" in selected && "name" in selected) {
      onChange(selected.name);
    } else {
      onChange("");
    }
  };

  const onSubmit = async (data: FormPaciente) => {
  
    try {
      const pacienteData: Omit<Paciente2, "idPaciente"> = {
        DNI: data.DNI,
        nombre: data.nombre,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        email: data.email,
        celular: `${prefix} ${data.celular}` ,
        fecha_nacimiento: data.fecha_nacimiento,
        imagen: base64Image || url,
        genero: data.genero,
        ocupacion: data.ocupacion,
        estadoCivil: data.estadoCivil,
        direccion: data.direccion,
        pais: data.pais,
        departamento: data.departamento,
        password: data.password,
      };
  
      const cookies = parseCookies();
      const token = cookies["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const citaId = sessionStorage.getItem("idCita");
      let urlApi = "";
      if (citaId) {
        urlApi = `${apiUrl}api/pacientes/${citaId}`;
      } else {
        urlApi = `${apiUrl}api/pacientes`;
      }
  
      const response = await fetch(urlApi, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteData),
      });
  
      const resData = await response.json();
  
      if (response.ok) {
        showToast("success", "Paciente creado correctamente");
        reset(defaultValues);
        setBase64Image(null);
        setUrl("");
        setCountry(null);
        // eliminar el idCita de la sesion
        sessionStorage.removeItem('idCita');
        
        router.push('/user/pacientes/');
      } else {
        showToast("error", resData.message || "Error al crear el paciente");
  
        if (resData?.errors && typeof resData.errors === "object") {
          Object.entries(resData.errors).forEach(([field, messages]) => {
            setError(field as keyof FormPaciente, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : String(messages),
            });
          });
        }
      }
    } catch (error) {
      console.error("❌ Error inesperado en onSubmit:", error);
      showToast("error", "Error inesperado en el envío del formulario.");
    }
  
  };

  const generarPassword = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setGeneratedPassword(password);
    setValue("password", password); // <-- si usas react-hook-form
  };

  return (
    <div className="p-4 bg-[#eaeded] dark:bg-background min-h-screen">
      <HeaderUser title="Datos del paciente" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-6 text-[#634AE2] font-bold text-normal">
          {/* Primera columna */}
          <div className="bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldInput label="Nombre" name="nombre" register={register} errors={errors} />
              <FormFieldInput label="DNI" name="DNI" maxLenght={8} register={register} errors={errors} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldInput label="Apellido Paterno" name="apellidoPaterno" register={register} errors={errors} />
              <FormFieldInput label="Apellido Materno" name="apellidoMaterno" register={register} errors={errors} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usar Controller para fecha_nacimiento */}
              <FormField errors={errors} name="fecha_nacimiento" label="Fecha de nacimiento">
                <Controller
                  name="fecha_nacimiento"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      showMonthAndYearPickers
                      label=""
                      selectorButtonPlacement="start"
                      classNames={{
                        inputWrapper:
                          "px-4 text-sm outline-none font-light focus:ring-0 w-full rounded-full placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-input dark:text-foreground border-2 border-[#634AE2]",
                        segment: "!text-foreground dark:!text-foreground",
                      }}
                     calendarProps={{
                      classNames: {
                        pickerMonthList: "bg-popover dark:bg-popover",
                        pickerYearList: "bg-popover dark:bg-popover",
                        pickerItem: "!text-popover-foreground dark:!text-popover-foreground",
                        base:
                          "bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground",
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
                      onChange={(dateValue) => handleDateChange(dateValue, onChange)}
                      value={parseDateString(value)}
                    />
                  )}
                />
              </FormField>

              <FormFieldInput label="Ocupación" name="ocupacion" register={register} errors={errors} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldSelect
                label="Estado civil"
                name="estadoCivil"
                register={register}
                errors={errors}
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
                name="genero"
                register={register}
                errors={errors}
                placeholder="Seleccionar"
                options={[
                  { label: "Masculino", value: "Masculino" },
                  { label: "Femenino", value: "Femenino" },
                  { label: "Otro", value: "Otro" },
                ]}
              />
            </div>
            <div className="flex gap-2 items-end justify-center">
              <select
                value={prefix}
                onChange={e => setPrefix(e.target.value)}
                className="px-4 text-sm h-9 mt-1 outline-none font-light focus:ring-0 focus:outline-none rounded-full placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-input dark:text-foreground border-2 border-[#634AE2]"
                >
                {countryPrefixes.map((item, index) => (
                  <option key={index} value={item.code}>
                    {item.name} ({item.code}) 
                  </option>
                ))}
              </select>
              <FormFieldInput label="Celular" name="celular" register={register} errors={errors} minLenght={3} maxLenght={30} />
            </div>
            <h1 className="text-center pt-4 pb-2 text-card-foreground dark:text-[#babbfe]">Imagen</h1>
            <div className="flex justify-center">
                <div className="relative border-2 border-[#634AE2] rounded-lg h-[220px] w-[220px] bg-[#F3F3F3] dark:bg-input flex justify-center items-center cursor-pointer overflow-hidden">
                {base64Image ? (
                  <Image src={base64Image} alt="Imagen seleccionada" width={220} height={220} className="w-full h-full object-cover object-center" />
                ) : (
                  <div className="flex flex-col items-center ">
                    <Plus width={40} height={40} strokeWidth={2} className="text-card-foreground dark:text-[#babbfe] " />
                    <span className="text-sm mt-2">Subir foto del paciente</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white/80 dark:bg-white/80 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-100 transition-colors"
                  onClick={() => setBase64Image('')}
                  aria-label="Eliminar imagen"
                  >
                  <X className="w-5 h-5 text-primary dark:bg-text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Segunda columna */}
          <div className="bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl flex flex-col gap-4 mt-6 lg:mt-0">
            <FormFieldInput label="Correo electrónico" name="email" register={register} errors={errors} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usar Controller para pais */}
              <FormField label="País" name="pais" errors={errors}>
                <Controller
                  name="pais"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <CountrySelect
                      containerClassName="mt-2 w-full [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-[#f2f3f2] [&_.stsearch-box]:dark:!bg-input [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                      inputClassName="appearance-none !border-none !outline-none pl-12 pr-10 h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-[#babbfe] placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-[#5d23df] dark:text-[#babbfe] placeholder:font-semibold dark:bg-[#1e1e23]"
                      onChange={(selected) => handleCountryChange(selected, onChange)}
                      placeHolder="Seleccionar"
                    />
                  )}
                />
              </FormField>

              {/* Usar Controller para departamento */}
              <FormField label="Departamento" name="departamento" errors={errors}>
                <Controller
                  name="departamento"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <StateSelect
                      countryid={country?.id ?? 0}
                      containerClassName="mt-2 w-full [&_.stdropdown-container]:!border-none  [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-[#f2f3f2] [&_.stsearch-box]:dark:!bg-[input] [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full [&_.stsearch-box]:!border [&_.stsearch-box]:!border-border [&_.stsearch-box]:dark:!border-border"
                      inputClassName="appearance-none !border-none !outline-none pl-12 pr-10 h-9 w-full placeholder:text-muted-foreground dark:placeholder:text-[#babbfe] placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0 text-[#5d23df] dark:text-[#babbfe] placeholder:font-semibold dark:bg-[#1e1e23]"
                      onChange={(selected) => handleStateChange(selected, onChange)}
                      placeHolder="Seleccionar"
                    />
                  )}
                />
              </FormField>
            </div>

            <FormFieldInput label="Dirección" name="direccion" register={register} errors={errors} />
            <FormFieldInput label="Antecedentes médicos" name="antecedentesMedicos" register={register} errors={errors} />
            <FormFieldInput label="Medicamentos prescritos" name="medicamentosPrescritos" register={register} errors={errors} />

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex flex-col space-y-2 w-full max-w-md mx-auto">
                <FormFieldInput
                  label="Contraseña"
                  name="password"
                  register={register}
                  errors={errors}
                />
                <button
                  type="button"
                  onClick={generarPassword}
                  className="self-center px-4 py-2 bg-[#634AE2] text-white rounded-lg hover:bg-[#4e3ac7] transition"
                >
                  Generar contraseña
                </button>
                {generatedPassword && (
                  <p className="text-sm text-gray-500 text-center">
                    Contraseña generada: <span className="font-mono">{generatedPassword}</span>
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-center w-full p-4 mt-6 gap-6">
          <Link
            href="/user/pacientes/"
            className="grid place-items-center text-[#634AE2] bg-card dark:bg-card rounded-full border-2 border-[#634AE2] w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
            >
            Volver
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-card dark:bg-card text-[#634AE2] rounded-full border-2 border-[#634AE2] w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
            >
            {isSubmitting ? "Enviando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}