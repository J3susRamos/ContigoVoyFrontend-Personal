"use client";
import React, { useState, useEffect } from "react";
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
import { Plus, X } from "lucide-react";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPaciente } from "./getPacienteData";

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
  const [prefix, setPrefix] = useState("+51");

  const countryPrefixes = [
  { name: "Afganistán", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Alemania", code: "+49" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Argentina", code: "+54" },
  { name: "Arabia Saudita", code: "+966" },
  { name: "Argelia", code: "+213" },
  { name: "Armenia", code: "+374" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaiyán", code: "+994" },
  { name: "Bahamas", code: "+1-242" },
  { name: "Bangladés", code: "+880" },
  { name: "Barbados", code: "+1-246" },
  { name: "Bélgica", code: "+32" },
  { name: "Belice", code: "+501" },
  { name: "Benín", code: "+229" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia y Herzegovina", code: "+387" },
  { name: "Botsuana", code: "+267" },
  { name: "Brasil", code: "+55" },
  { name: "Brunéi", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Bután", code: "+975" },
  { name: "Cabo Verde", code: "+238" },
  { name: "Camboya", code: "+855" },
  { name: "Camerún", code: "+237" },
  { name: "Canadá", code: "+1" },
  { name: "Catar", code: "+974" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Chipre", code: "+357" },
  { name: "Colombia", code: "+57" },
  { name: "Comoras", code: "+269" },
  { name: "Corea del Norte", code: "+850" },
  { name: "Corea del Sur", code: "+82" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croacia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Dinamarca", code: "+45" },
  { name: "Ecuador", code: "+593" },
  { name: "Egipto", code: "+20" },
  { name: "El Salvador", code: "+503" },
  { name: "Emiratos Árabes Unidos", code: "+971" },
  { name: "Eslovaquia", code: "+421" },
  { name: "Eslovenia", code: "+386" },
  { name: "España", code: "+34" },
  { name: "Estados Unidos", code: "+1" },
  { name: "Estonia", code: "+372" },
  { name: "Etiopía", code: "+251" },
  { name: "Filipinas", code: "+63" },
  { name: "Finlandia", code: "+358" },
  { name: "Francia", code: "+33" },
  { name: "Georgia", code: "+995" },
  { name: "Ghana", code: "+233" },
  { name: "Grecia", code: "+30" },
  { name: "Guatemala", code: "+502" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bisáu", code: "+245" },
  { name: "Haití", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hungría", code: "+36" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Irán", code: "+98" },
  { name: "Irak", code: "+964" },
  { name: "Irlanda", code: "+353" },
  { name: "Islandia", code: "+354" },
  { name: "Israel", code: "+972" },
  { name: "Italia", code: "+39" },
  { name: "Jamaica", code: "+1-876" },
  { name: "Japón", code: "+81" },
  { name: "Jordania", code: "+962" },
  { name: "Kazajistán", code: "+7" },
  { name: "Kenia", code: "+254" },
  { name: "Kuwait", code: "+965" },
  { name: "Laos", code: "+856" },
  { name: "Letonia", code: "+371" },
  { name: "Líbano", code: "+961" },
  { name: "Liberia", code: "+231" },
  { name: "Libia", code: "+218" },
  { name: "Lituania", code: "+370" },
  { name: "Luxemburgo", code: "+352" },
  { name: "Madagascar", code: "+261" },
  { name: "Malasia", code: "+60" },
  { name: "Malaui", code: "+265" },
  { name: "Maldivas", code: "+960" },
  { name: "Malí", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Marruecos", code: "+212" },
  { name: "México", code: "+52" },
  { name: "Moldavia", code: "+373" },
  { name: "Mónaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Mozambique", code: "+258" },
  { name: "Nicaragua", code: "+505" },
  { name: "Nigeria", code: "+234" },
  { name: "Noruega", code: "+47" },
  { name: "Nueva Zelanda", code: "+64" },
  { name: "Omán", code: "+968" },
  { name: "Países Bajos", code: "+31" },
  { name: "Pakistán", code: "+92" },
  { name: "Panamá", code: "+507" },
  { name: "Papúa Nueva Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Perú", code: "+51" },
  { name: "Polonia", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Reino Unido", code: "+44" },
  { name: "República Checa", code: "+420" },
  { name: "República Dominicana", code: "+1-809" },
  { name: "Rumanía", code: "+40" },
  { name: "Rusia", code: "+7" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Singapur", code: "+65" },
  { name: "Siria", code: "+963" },
  { name: "Somalia", code: "+252" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudáfrica", code: "+27" },
  { name: "Sudán", code: "+249" },
  { name: "Suecia", code: "+46" },
  { name: "Suiza", code: "+41" },
  { name: "Tailandia", code: "+66" },
  { name: "Taiwán", code: "+886" },
  { name: "Tanzania", code: "+255" },
  { name: "Tayikistán", code: "+992" },
  { name: "Túnez", code: "+216" },
  { name: "Turquía", code: "+90" },
  { name: "Ucrania", code: "+380" },
  { name: "Uganda", code: "+256" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistán", code: "+998" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabue", code: "+263" }
];

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
             apellidoPaterno: `${formData.apellidoPaterno}`,
            apellidoMaterno: `${formData.apellidoMaterno}`,
             email: formData.email,
             celular: `${prefix}${formData.celular}`,
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
      const urlApi = `${apiUrl}api/pacientes/${id}`;
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

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getPaciente(Number(id));
      if (res.success && res.data) {
        const paciente = res.data;
        let fechaFormateada = "";
        if (paciente.fecha_nacimiento) {
          const fecha = new Date(paciente.fecha_nacimiento);
          fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(fecha.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${fecha.getFullYear()}`;
        }
        setFormData({
          nombre: paciente.nombre || "",
          apellidoPaterno: paciente.apellido?.split(" ")[0] || " ",
          apellidoMaterno: paciente.apellido?.split(" ")[1] || " ",
          DNI: paciente.DNI || "",
          email: paciente.email || "",
          celular: paciente.celular || "",
          imagen: paciente.imagen || "",
          fecha_nacimiento: fechaFormateada,
          genero: paciente.genero || "",
          estadoCivil: paciente.estadoCivil || "",
          ocupacion: paciente.ocupacion || "",
          direccion: paciente.direccion || "",
          departamento: paciente.departamento || "",
          pais: paciente.pais || "",
          antecedentesMedicos: paciente.antecedentesMedicos || "",
          medicamentosPrescritos: paciente.medicamentosPrescritos || "",
        });
        setBase64Image(paciente.imagen || "");
        setCountry(paciente.pais ? { id: 0, name: paciente.pais } : null);
        setCurrentState(paciente.departamento ? { id: 0, name: paciente.departamento } : null);
      }
    })();
  }, [id]);

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
            <div className="flex gap-2 mt-2 items-center justify-center">
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="text-sm h-9 rounded-full  border border-border bg-input text-foreground px-2 dark:border-border dark:bg-input dark:text-foreground"
            >
              {countryPrefixes.map((country, index) => (
                <option key={index} value={country.code}>
                {country.name} ({country.code})
                </option>
              ))}
            </select>
            <input
              type="text"
              maxLength={30}
              minLength={3}
              value={formData.celular}
              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
              placeholder="Ejemplo 999999999"
              className="pl-4 pr-3 text-sm max-w-[400px] h-9 outline-none focus:ring-2 focus:ring-primary w-full rounded-full border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground"
              />
            </div>
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
                  value={country?.id ?? ""}
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
                  value={currentState?.id ?? ""}
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
        <Link
          href="/user/pacientes/DetallePaciente/"
          className="grid place-items-center text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
        >
          Volver
        </Link>
        <button
          onClick={HandleUpdatePaciente}
          className="text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-32 h-10 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200 font-semibold"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}