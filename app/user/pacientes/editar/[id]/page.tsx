"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { CalendarDate } from "@internationalized/date";
import "react-country-state-city/dist/react-country-state-city.css";
import { getPaciente } from "@/components/User/Pacientes/getPacienteData";
import { useRouter } from "next/navigation";

export default function EditarPaciente() {
  const params = useParams();
  const router = useRouter();
  const idPaciente = params.id as string;
  const [country, setCountry] = useState<Country | null>(null);
  const [currentState, setCurrentState] = useState<City | null>(null);
  const [, setCurrentCity] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    departamento: "",
    provincia: "",
    pais: "",
    antecedentesMedicos: "",
    medicamentosPrescritos: "",
  });

  // Load patient data when the component mounts
  useEffect(() => {
    const loadPacienteData = async () => {
      if (idPaciente) {
        setIsLoading(true);
        const result = await getPaciente(Number(idPaciente));
        if (result.success && result.data) {
          const paciente = result.data;
          
          // Parse the full name into first and last names
          const nombres = paciente.nombre?.split(" ") || [""];
          const apellidos = paciente.apellido?.split(" ") || ["", ""];
          
          // Parse address - assuming format: "direccion, pais, provincia, departamento"
          const direccionParts = paciente.direccion?.split(", ") || ["", "", "", ""];
          
          setFormData({
            nombre: nombres[0] || "",
            apellidoPaterno: apellidos[0] || "",
            apellidoMaterno: apellidos[1] || "",
            DNI: paciente.DNI || "",
            email: paciente.email || "",
            celular: paciente.celular || "",
            fecha_nacimiento: paciente.fecha_nacimiento || "",
            genero: paciente.genero || "",
            estadoCivil: paciente.estadoCivil || "",
            ocupacion: paciente.ocupacion || "",
            direccion: direccionParts[0] || "",
            departamento: direccionParts[3] || "",
            provincia: direccionParts[2] || "",
            pais: direccionParts[1] || "",
            antecedentesMedicos: "",
            medicamentosPrescritos: "",
          });
        }
        setIsLoading(false);
      }
    };
    
    loadPacienteData();
  }, [idPaciente]);

  const handleDateChange = (value: CalendarDate | null) => {
    if (value) {
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

  const handleCountryChange = (selected: Country | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof selected === "object" && "id" in selected && "name" in selected) {
      setCountry(selected);
      setFormData((prev) => ({ ...prev, pais: selected.name }));
    } else {
      setCountry(null);
      setFormData((prev) => ({ ...prev, pais: "" }));
    }
  };

  const handleStateChange = (selected: State | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof selected === "object" && "id" in selected && "name" in selected) {
      setCurrentState(selected);
      setFormData((prev) => ({ ...prev, departamento: selected.name }));
    } else {
      setCurrentState(null);
      setFormData((prev) => ({ ...prev, departamento: "" }));
    }
  };

  const handleCityChange = (selected: City | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof selected === "object" && "id" in selected && "name" in selected) {
      setCurrentCity(selected);
      setFormData((prev) => ({ ...prev, provincia: selected.name }));
    } else {
      setCurrentCity(null);
      setFormData((prev) => ({ ...prev, provincia: "" }));
    }
  };

  const HandleUpdatePaciente = async () => {
    try {
      const pacienteData: Omit<Paciente2, "idPaciente"> = {
        DNI: formData.DNI,
        nombre: formData.nombre,
        apellido: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
        email: formData.email,
        celular: formData.celular,
        fecha_nacimiento: formData.fecha_nacimiento,
        imagen: "http://algo",
        genero: formData.genero,
        ocupacion: formData.ocupacion,
        estadoCivil: formData.estadoCivil,
        direccion: `${formData.direccion}, ${formData.pais}, ${formData.provincia}, ${formData.departamento}`,
      };

      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/${idPaciente}`;
      const response = await fetch(url, {
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
        router.push(`/user/pacientes/DetallePaciente`);
      } else {
        showToast("error", data.message || "Error al actualizar el paciente");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-medium text-primary">Cargando datos del paciente...</div>
      </div>
    );
  }

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
          <h1>Editar Datos del Paciente</h1>
        </div>
      </div>
      
      <div className="flex mt-4 text-primary dark:text-primary font-bold text-normal">
        <div className="flex-1 ml-5 mr-5 bg-card dark:bg-card rounded-2xl p-4 border dark:border-border shadow-lg dark:shadow-xl">
          <div className="flex pt-6">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Nombre</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">DNI</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.DNI}
                  maxLength={8}
                  onChange={(e) =>
                    setFormData({ ...formData, DNI: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Apellido Paterno</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.apellidoPaterno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellidoPaterno: e.target.value,
                    })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Apellido Materno</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.apellidoMaterno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellidoMaterno: e.target.value,
                    })
                  }
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
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Ocupacion</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.ocupacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ocupacion: e.target.value,
                    })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Estado civil</div>
              <div className="relative w-60">
                <select
                  value={formData.estadoCivil}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoCivil: e.target.value })
                  }
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
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Genero</div>
              <div className="relative w-60">
                <select
                  value={formData.genero}
                  onChange={(e) =>
                    setFormData({ ...formData, genero: e.target.value })
                  }
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
          <div className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground">Celular</div>
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={9}
              value={formData.celular}
              onChange={(e) =>
                setFormData({ ...formData, celular: e.target.value })
              }
              placeholder="Ejemp. 999999999"
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
        </div>
        
        {/*Segunda Columna*/}
        <div className="flex-1 mr-5 ml-5 bg-card dark:bg-card rounded-2xl p-6 border dark:border-border shadow-lg dark:shadow-xl">
          <div className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground">
            Correo electrónico
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              <div className="py-1 mt-2 text-card-foreground dark:text-card-foreground">Direccion</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground">
            Antecedentes médicos
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.antecedentesMedicos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  antecedentesMedicos: e.target.value,
                })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4 text-card-foreground dark:text-card-foreground">
            Medicamentos prescritos
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.medicamentosPrescritos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  medicamentosPrescritos: e.target.value,
                })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-11/12 rounded-full border border-border dark:border-border placeholder:text-muted-foreground dark:placeholder:text-muted-foreground bg-input dark:bg-input text-foreground dark:text-foreground"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center w-full p-4">
        <button
          onClick={HandleUpdatePaciente}
          className="text-primary dark:text-primary bg-card dark:bg-card rounded-full border-2 border-primary dark:border-primary w-28 h-8 mr-12 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors duration-200"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
