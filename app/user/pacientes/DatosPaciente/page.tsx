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

export default function App() {
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
        imagen: "http://algo",
        genero: formData.genero,
        ocupacion: formData.ocupacion,
        estadoCivil: formData.estadoCivil,
        direccion: `${formData.direccion}, ${formData.pais}, ${formData.provincia}, ${formData.departamento}`,
      };

      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes`;
      const response = await fetch(url, {
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
        
      } else {
        showToast("error", data.message || "Error al crear el paciente");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-1 bg-[#eaeded] w-full z-30">
        <div>
          <nav className="bg-[#eaeded] rounded-2xl flex items-center w-[calc(95vw-270px)] p-4">
            <div className="bg-[#eaeded] flex items-end justify-end w-full">
              <div className="flex gap-x-5">
                <CerrarSesion />
              </div>
            </div>
          </nav>
          <div>
            <div className="pl-12 text-4xl items-center justify-items-center font-bold text-[#634AE2]">
              <h1>Datos del Paciente</h1>
            </div>
          </div>
        </div>
        {/* body */}
      </div>
      <div className="flex mt-4 text-[#634AE2] font-bold text-normal">
        <div className="flex-1 ml-5 mr-5 bg-[#fff] rounded-2xl p-4">
          <div className="flex pt-6">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Nombre</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">DNI</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.DNI}
                  maxLength={8}
                  onChange={(e) =>
                    setFormData({ ...formData, DNI: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Apellido Paterno</div>
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
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Apellido Materno</div>
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
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Fecha de nacimiento</div>
              <div className="relative">
                <DatePicker
                  showMonthAndYearPickers
                  selectorButtonPlacement="start"
                  classNames={{
                    inputWrapper: "bg-[#E7E7FF] rounded-full",
                    segment: "!text-[#634AE2]",
                  }}
                  calendarProps={{
                    classNames: {
                      pickerMonthList: "bg-[#E7E7FF]",
                      pickerYearList: "bg-[#E7E7FF]",
                      pickerItem: "!text-[#634AE2]",
                      base: "bg-background text-[#634AE2]",
                      headerWrapper: "pt-4 bg-[#E7E7FF] text-[#634AE2]",
                      prevButton:
                        "border-1 border-default-200 rounded-small bg-[#E7E7FF] text-xl text-[#634AE2]",
                      nextButton:
                        "border-1 border-default-200 rounded-small bg-[#E7E7FF] text-xl text-[#634AE2]",
                      gridHeader:
                        "bg-background shadow-none border-b-1 border-default-100 bg-[#E7E7FF] text-[#634AE2]",
                      cellButton: [
                        "data-[today=true]:bg-[#E7E7FF] data-[selected=true] text-[#634AE2]:bg-[#E7E7FF] rounded-full text-[#634AE2]",
                        "data-[selected=true]:!bg-[#E7E7FF] data-[selected=true]:!text-[#634AE2] rounded-full",
                        "data-[range-start=true]:before:rounded-l-small font-bold text-[#634AE2]",
                        "data-[selection-start=true]:before:rounded-l-small font-bold text-[#634AE2]",
                        "data-[range-end=true]:before:rounded-r-small font-bold text-[#634AE2]",
                        "data-[selection-end=true]:before:rounded-r-small font-bold text-[#634AE2]",
                        "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small font-bold text-[#634AE2]",
                        "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small font-bold text-[#634AE2]",
                      ],
                    },
                  }}
                  onChange={handleDateChange}
                  value={parseDateString(formData.fecha_nacimiento)}
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Ocupacion</div>
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
                  className="pl-12 pr-3 text-sm h-9 mt-1 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
                />
              </div>
            </div>
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Estado civil</div>
              <div className="relative w-60">
                <select
                  value={formData.estadoCivil}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoCivil: e.target.value })
                  }
                  className="font-normal pl-12 pr-3 text-base h-9 mt-1 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none bg-[#F3F3F3]"
                >
                  <option value="">Seleccionar</option>
                  <option value="Soltero">Soltero</option>
                  <option value="Casado">Casado</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Genero</div>
              <div className="relative w-60">
                <select
                  value={formData.genero}
                  onChange={(e) =>
                    setFormData({ ...formData, genero: e.target.value })
                  }
                  className="text-base font-normal pl-12 pr-3 h-9 mt-1 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none bg-[#F3F3F3]"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">Celular</div>
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={9}
              value={formData.celular}
              onChange={(e) =>
                setFormData({ ...formData, celular: e.target.value })
              }
              placeholder="Ejemp. 999999999"
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
            />
          </div>
        </div>
        {/*Segunda Columna*/}
        <div className="flex-1 mr-5 ml-5 bg-[#fff] rounded-2xl p-6">
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Correo electrónico
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
            />
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Pais</div>
              <div className="relative">
                <CountrySelect
                  containerClassName="mt-2 [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-[#F3F3F3] [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-3 text-sm h-9 w-full placeholder:text-[#634AE2] placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0"
                  onChange={handleCountryChange}
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-[#634AE2] transition-colors absolute right-3 top-1/2  pt-1 transform -translate-y-1/2"
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
              <div className="py-1 mt-2">Departamento</div>
              <div className="relative">
                <StateSelect
                  countryid={country?.id ?? 0}
                  containerClassName="mt-2 [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-[#F3F3F3] [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-3 text-sm h-9 w-full placeholder:text-[#634AE2] placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0"
                  onChange={handleStateChange}
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-[#634AE2] transition-colors absolute right-3 top-1/2  pt-1 transform -translate-y-1/2"
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
              <div className="py-1 mt-2">Provincia</div>
              <div className="relative">
                <CitySelect
                  countryid={country?.id ?? 0}
                  stateid={currentState?.id ?? 0}
                  onChange={handleCityChange}
                  containerClassName="mt-2 [&_.stdropdown-container]:!border-none [&_.stdropdown-container]:!bg-transparent [&_.stdropdown-input]:!p-0 [&_.stsearch-box]:!bg-[#F3F3F3] [&_.stsearch-box]:!rounded-full [&_.stdropdown-tools]:hidden w-full"
                  inputClassName="appearance-none !border-none !outline-none pl-12 pr-3 text-sm h-9 w-full placeholder:text-[#634AE2] placeholder:text-base placeholder:font-normal bg-transparent focus:ring-0"
                  placeHolder="Seleccionar"
                />
                <span
                  className="text-[#634AE2] transition-colors absolute right-3 top-1/2 pt-1 transform -translate-y-1/2"
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
              <div className="py-1 mt-2">Direccion</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
                />
              </div>
            </div>
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
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
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
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
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full p-4 ">
        <button
          onClick={HandlePostPaciente}
          className="text-[#634AE2] bg-[#fff] rounded-full border-2 border-[#634AE2] w-28 h-8 mr-12"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}
