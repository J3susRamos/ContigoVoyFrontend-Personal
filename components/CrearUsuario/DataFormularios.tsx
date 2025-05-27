import { EyeFilledIcon, EyeSlashFilledIcon } from "@/icons/iconsvg";
import { FormData } from "@/interface";
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
    <div className="text-[#634AE2] h-auto p-10 items-center bg-background rounded-3xl ">
      <h1 className="font-semibold text-center mb-5 text-4xl">
        Ingrese sus datos
      </h1>
      <Form validationBehavior="native" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 w-auto lg:w-[700px]   gap-10">
          <div className="flex flex-col space-y-10">
            <Input
              label="Nombre"
              labelPlacement="outside"
              radius="full"
              classNames={{
                label: "!text-[#BABAFF]",
                inputWrapper: "border-2 border-[#BABAFF]",
                input: "placeholder:!text-[#BABAFF] w-full",
              }}
              placeholder="ingrese su nombre"
              type="text"
              isRequired
              value={formData.name}
              variant="faded"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div className="flex items-center gap-2 !mt-4 !pt-0">
              <span className="text-[#BABAFF] text-sm">
                Fecha de nacimiento
              </span>
              <span className="text-danger">*</span>
            </div>

            <DatePicker
              aria-label="Fecha de nacimiento"
              labelPlacement="outside"
              isRequired
              variant="faded"
              maxValue={today(getLocalTimeZone())}
              showMonthAndYearPickers
              radius="full"
              classNames={{
                label: "!text-[#BABAFF]",
                base: "!mt-0.5",
              }}
              onChange={handleDateChange}
            />

            <Select
              label="Género"
              labelPlacement="outside"
              isRequired
              radius="full"
              variant="faded"
              selectedKeys={[formData.genero]}
              classNames={{
                label: "!text-[#BABAFF]",
                trigger: "border-2 border-[#BABAFF]",
                value: "!text-[#BABAFF]",
              }}
              placeholder="Seleccione su género"
              onChange={(e) =>
                setFormData({ ...formData, genero: e.target.value })
              }
            >
              <SelectItem
                className="text-[#BABAFF]"
                key="femenino"
                textValue="femenino"
              >
                Femenino
              </SelectItem>
              <SelectItem
                className="text-[#BABAFF]"
                key="masculino"
                textValue="masculino"
              >
                Masculino
              </SelectItem>
              <SelectItem
                className="text-[#BABAFF]"
                key="otros"
                textValue="otros"
              >
                Otros
              </SelectItem>
            </Select>
            <Input
              label="E-mail"
              labelPlacement="outside"
              isRequired
              radius="full"
              value={formData.email}
              classNames={{
                label: "!text-[#BABAFF]",
                inputWrapper: "border-2 border-[#BABAFF]", // Solo controla el borde
                input: "placeholder:!text-[#BABAFF]", // Aquí es donde controlas el color del placeholder
              }}
              placeholder="ingrese su email"
              type="email"
              variant="faded"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col space-y-10">
            <Input
              label="Apellido"
              labelPlacement="outside"
              radius="full"
              variant="faded"
              value={formData.apellido}
              classNames={{
                label: "!text-[#BABAFF]",
                inputWrapper: "border-2 border-[#BABAFF]",
                input: "placeholder:!text-[#BABAFF]",
              }}
              className="w-full   text-[#BABAFF]"
              isRequired
              placeholder="ingrese su apellido"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, apellido: e.target.value })
              }
            />

            <div className="flex items-center gap-2 !mt-4 !pt-0">
              <span className="text-[#BABAFF] text-sm">Pais</span>
              <span className="text-danger">*</span>
            </div>
            <Autocomplete
              aria-label="País"
              defaultSelectedKey={formData.pais}
              onSelectionChange={(key) =>
                setFormData({ ...formData, pais: key as string })
              }
              classNames={{
                popoverContent: "border-2 border-[#BABAFF]",
                base: "!mt-0.5",
                listbox: "placeholder:!text-[#BABAFF]",
              }}
              placeholder="Ingrese su país"
              isRequired
              radius="full"
              variant="faded"
            >
              {Flags.map((item) => (
                <AutocompleteItem key={item.value} textValue={item.value}>
                  {item.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Input
              name="password"
              isRequired
              radius="full"
              label="Contraseña"
              minLength={8}
              labelPlacement="outside"
              value={formData.password}
              placeholder="ingrese su contraseña"
              classNames={{
                label: "!text-[#BABAFF]",
                inputWrapper: "border-2 border-[#BABAFF]",
                input: "placeholder:!text-[#BABAFF]",
              }}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              variant="faded"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Input
              name="titulo"
              isRequired
              radius="full"
              label="Título"
              minLength={3}
              labelPlacement="outside"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              placeholder="ingrese su título"
              classNames={{
                label: "!text-[#BABAFF]",
                inputWrapper: "border-2 border-[#BABAFF]",
                input: "placeholder:!text-[#BABAFF]",
              }}
            />
            
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Button
            radius="full"
            type="submit"
            className="max-w-44 w-full mt-10 bg-[#634AE2] text-white"
          >
            Siguiente
          </Button>
        </div>
      </Form>
    </div>
  );
};
