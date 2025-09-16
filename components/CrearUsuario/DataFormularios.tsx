import { CreatePersonal } from "@/app/apiRoutes";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/icons/iconsvg";
import { FormData, SelectItemI, Roles, Permissions, Personal } from "@/interface";
import { Flags } from "@/utils/flagsPsicologos";
import {
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
import showToast from "../ToastStyle";

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

//Roles
const roles: Roles[] = [
  {
    textValue: "ADMINISTRADOR",
    showLabel: "ADMINISTRADOR",
  },
  {
    textValue: "PSICOLOGO",
    showLabel: "PSICOLOGO",
  },
  {
    textValue: "COMUNICACION",
    showLabel: "COMUNICACION",
  },
  {
    textValue: "MARKETING",
    showLabel: "MARKETING",
  },
];

// Permisos para ver secciones del sidebar
const permissionsnav: Permissions[] = [
  {
    textValue: "Citas Sin Pagar", //Sandro ahora es de Citas sin pagar, pero adapta para Citas -> Citas sin pagar y Citas pagadas
    showLabel: "Citas sin Pagar",
  },
  {
    textValue: "Registro de personal", //Queda como tal
    showLabel: "Registro de personal",
  },
  {
    textValue: "Pacientes", //Queda como tal
    showLabel: "Pacientes", 
  },
  {
    textValue: "Psicólogos", //Esto debe estar en AdministraciónAministradores -> Administradores, Psicologos, Marketing y Comunicaciones
    showLabel: "Psicólogos",
  },
  {
    textValue: "Calendario", //Esto queda como tal
    showLabel: "Calendario",
  },
  {
    textValue: "Estadísticas", //Debe modificarse para que tenga sentido -> Un admin debe ver otros tipo de graficos
    showLabel: "Estadísticas",
  },
  {
    textValue: "Blog",
    showLabel: "Blog",
  },
  {
    textValue: "Marketing",
    showLabel: "Marketing",
  },
  {
    textValue: "Politicas y privacidad",
    showLabel: "Politicas y privacidad",
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
  const [rol, setRol] = React.useState("PSICOLOGO");
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleSubmit = (e: React.FormEvent) => {
    console.log(formData);
    e.preventDefault();
    onNext(formData);
  };
 const handleSubmitCreatePersonal = async () => {
  try {
    const updatedFormData = {
      ...formData,
      permissions: permissions,
      imagen: null
    };
    const personalData: Personal = {
      apellido: updatedFormData.apellido,
      email: updatedFormData.email,
      fecha_nacimiento: updatedFormData.fecha_nacimiento,
      name: updatedFormData.name,
      password: updatedFormData.password,
      permissions: updatedFormData.permissions,
      rol: rol,
      imagen: null
    };
    const response = await CreatePersonal(personalData);
    showToast('success', 'Personal creado exitosamente')
    console.log("Personal creado exitosamente:", response);

  } catch (error: unknown) {

   if (typeof error === "object" && error !== null) {
    const err = error as { message?: string; errors?: { email?: string[] } };
    showToast(
      "error",
      err.errors?.email?.[0] || err.message || "Error desconocido"
    );
    console.error("Error al crear personal:", err);
  } else {
    showToast("error", "Error inesperado");
    console.error("Error desconocido:", error);
  }
  }
  
};

  const handleChangeRol = (value: string) => {
    setRol(value);
    setFormData((prev) => ({ ...prev, rol: value }));
  };

const handleDateChange = React.useCallback((date: DateValue | null) => {
  if (!date) return;
  setFormData((prev) => ({
    ...prev,
    fecha_nacimiento: `${String(date.day).padStart(2, "0")}/${String(
      date.month
    ).padStart(2, "0")}/${String(date.year)}`,
  }));
}, []);

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
                                  label="Fecha de nacimiento"
                                  labelPlacement="outside"
                                  isRequired
                                  variant="bordered"
                                  maxValue={today(getLocalTimeZone())}
                                  showMonthAndYearPickers
                                  radius="lg"
                                  classNames={{
                                    inputWrapper:
                                      "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                                    input:
                                      "text-gray-900 dark:text-white px-4 py-3 text-center w-full",
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
                            label="Género"
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

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Rol
                            </label>
                          </div>
                          <Select
                            label="Rol"
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
                                label="País"
                                labelPlacement="outside"
                                isRequired
                                radius="lg"
                                variant="bordered"
                                selectedKeys={formData.pais ? [formData.pais] : []}
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
                                    textValue={item.value}
                                    key={item.value}
                                  >
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </Select>
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
                        {rol === "PSICOLOGO" ?
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Título Profesional
                            </label>
                          </div>
                          <Select
                            label="Título Profesional"
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
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                textValue={title.textValue}
                                key={title.textValue}
                              >
                                {title.showLabel}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>:null}

                        {rol !== "PSICOLOGO" ? (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                            <div className="text-center">
                              <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                Asignar permiso
                              </label>
                            </div>
                            <Select
                              label="Permisos"
                              name="permissions"
                              isRequired
                              radius="lg"
                              labelPlacement="outside"
                              selectionMode="single"
                              aria-label="Seleccionar permisos"
                              placeholder="Seleccione el permiso del personal."
                              variant="bordered"
                              selectedKeys={
                                permissions.length > 0
                                  ? new Set([permissions[permissions.length - 1]])
                                  : new Set()
                              }
                              onSelectionChange={(keys) => {
                                const selectedValue = String([...keys][0]);
                                const newPermissions = permissions.includes(
                                  selectedValue
                                )
                                  ? permissions
                                  : [...permissions, selectedValue];

                                setPermissions(newPermissions);
                                setFormData((prev) => ({
                                  ...prev,
                                  permissions: newPermissions,
                                }));
                              }}
                            >
                              {permissionsnav.map((perm) => (
                                <SelectItem
                                  key={perm.textValue}
                                  textValue={perm.textValue}
                                >
                                  {perm.showLabel}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {permissions.length > 0 && rol !== "PSICOLOGO" && (
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {permissions.map((perm, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium border border-primary/30"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {rol === "PSICOLOGO" ? (
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
                ) : (
                  <div className="flex justify-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
                    <Button
                      radius="lg"
                      size="lg"
                      type="button"
                      onPress={handleSubmitCreatePersonal}
                      className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Crear Personal
                    </Button>
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
