import { EyeFilledIcon, EyeSlashFilledIcon } from "@/icons/iconsvg";
import { FormData, SelectItemI } from "@/interface";
import { Flags } from "@/utils/flagsPsicologos";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  DateValue,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import React from "react";


// Obtener estos datos de manera dinamica
const genders: SelectItemI[] = [
  {
    textValue: "femenino",
    showLabel: "Femenino",
  },
  {
    textValue: "masculino",
    showLabel: "Masculino",
  },
  {
    textValue: "otro",
    showLabel: "Otro",
  },
];

// Obtener estos datos de manera dinamica
const titles: SelectItemI[] = [
  {
    textValue: "Pedagogo",
    showLabel: "Pedagogo",
  },
  {
    textValue: "Psicoanalista",
    showLabel: "Psicoanalista",
  },
  {
    textValue: "Terapeuta",
    showLabel: "Terapeuta",
  },
  {
    textValue: "Pediatra",
    showLabel: "Pediatra",
  },
  {
    textValue: "Conductual",
    showLabel: "Conductual",
  },
];

export const PersonalForm = ({
  onNext,
  initialFormData,
}: {
  onNext: (data: FormData) => void;
  initialFormData: FormData;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };
  const handleDateChange = (date: DateValue | null) => {
    if (!date) return;
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: `${String(date.day).padStart(2, "0")}/${String(
        date.month
      ).padStart(2, "0")}/${String(date.year)}`,
    }));
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          <div className="text-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
              Datos del Psicólogo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete la información del nuevo miembro del personal
            </p>
          </div>
          
          <div className="w-full flex justify-center">
            <div className="w-full max-w-5xl flex justify-center">
              <Form validationBehavior="native" onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                <div className="w-full max-w-4xl flex justify-center">
                  <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 place-items-center justify-items-center">
                      <div className="w-full max-w-sm flex flex-col space-y-8 mx-auto">
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
                              inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            placeholder="Ingrese el nombre completo"
                            type="text"
                            isRequired
                            value={formData.name}
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        
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
                                <DatePicker
                                  aria-label="Fecha de nacimiento"
                                  labelPlacement="outside"
                                  isRequired
                                  variant="bordered"
                                  maxValue={today(getLocalTimeZone())}
                                  showMonthAndYearPickers
                                  radius="lg"
                                  classNames={{
                                    inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                                    input: "text-gray-900 dark:text-white px-4 py-3 text-center w-full",
                                  }}
                                  onChange={handleDateChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

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
                              trigger: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                              value: "text-gray-900 dark:text-white text-center",
                              listboxWrapper: "dark:bg-gray-800",
                              popoverContent: "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                            }}
                            placeholder="Seleccione el género"
                            onChange={(e) =>
                              setFormData({ ...formData, genero: e.target.value })
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
                              inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            placeholder="ejemplo@correo.com"
                            type="email"
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="w-full max-w-sm flex flex-col space-y-8 mx-auto">
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
                              inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            isRequired
                            placeholder="Ingrese el apellido completo"
                            type="text"
                            onChange={(e) =>
                              setFormData({ ...formData, apellido: e.target.value })
                            }
                          />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-gray-800 dark:text-gray-200 font-semibold text-base">País</span>
                              <span className="text-danger">*</span>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="w-full">
                                <Autocomplete
                                  aria-label="País"
                                  defaultSelectedKey={formData.pais}
                                  onSelectionChange={(key) =>
                                    setFormData({ ...formData, pais: key as string })
                                  }
                                  classNames={{
                                    popoverContent: "border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-xl",
                                    base: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary rounded-lg transition-all duration-200 shadow-sm w-full",
                                    listboxWrapper: "dark:bg-gray-800",
                                  }}
                                  placeholder="Seleccione el país de residencia"
                                  isRequired
                                  radius="lg"
                                  variant="bordered"
                                >
                                  {Flags.map((item) => (
                                    <AutocompleteItem key={item.value} textValue={item.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                      {item.label}
                                    </AutocompleteItem>
                                  ))}
                                </Autocomplete>
                              </div>
                            </div>
                          </div>
                        </div>

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
                            value={formData.password}
                            placeholder="Mínimo 8 caracteres"
                            classNames={{
                              inputWrapper: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input: "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            endContent={
                              <button
                                aria-label="toggle password visibility"
                                className="focus:outline-none mr-2"
                                type="button"
                                onClick={toggleVisibility}
                              >
                                {isVisible ? (
                                  <EyeSlashFilledIcon className="text-2xl text-gray-400 dark:text-gray-500 pointer-events-none" />
                                ) : (
                                  <EyeFilledIcon className="text-2xl text-gray-400 dark:text-gray-500 pointer-events-none" />
                                )}
                              </button>
                            }
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({ ...formData, password: e.target.value })
                            }
                          />
                        </div>
                        
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
                            onChange={(e) =>
                              setFormData({ ...formData, titulo: e.target.value })
                            }
                            placeholder="Seleccione el título profesional"
                            variant="bordered"
                            selectedKeys={[formData.titulo]}
                            classNames={{
                              trigger: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                              value: "text-gray-900 dark:text-white text-center",
                              listboxWrapper: "dark:bg-gray-800",
                              popoverContent: "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                            }}
                          >
                            {titles.map((title) => (
                              <SelectItem
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                textValue={title.textValue}
                                key={title.textValue}
                              >
                                {title.showLabel}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
                  <Button
                    radius="lg"
                    type="submit"
                    size="lg"
                    className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continuar al Siguiente Paso
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
