"use client";
import {
  DeletePsycologo,
  GetPsicologosById,
  UpdatePsicologo,
} from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";
import { PsicologoPreviewData } from "@/interface";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { Flags } from "@/utils/flagsPsicologos";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

export default function AllPsicologos({
  Data,
}: {
  Data: PsicologoPreviewData[];
}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PsicologoPreviewData | null>(null);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const webpImage = await convertImageToWebP(file);
    const base64 = await convertToBase64(webpImage);
    setFormData((prev) => (prev ? { ...prev, imagen: base64 } : null));
  };

  const handleChanges = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  const handleUpdate = async (id: number | null) => {
    if (!formData) {
      console.error("Error: formData es null");
      return;
    }

    try {
      await UpdatePsicologo(id, formData);
      showToast("success", "El psicólogo se actualizó correctamente");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el psicólogo:", error);
    }
  };
  const handleDelete = async (id: number | null) => {
    try {
      await DeletePsycologo(id);
      showToast("success", "El psicólogo se eliminó correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar el psicólogo:", error);
    }
  };

  const handleEdit = async (id: number | null) => {
    setSelectedId(id);
    try {
      const Data = await GetPsicologosById(id);
      if (Data.status_code !== 200) {
        showToast(Data.status_code.toString(), `Error: ${Data.status_message}`);
        return;
      }
      setFormData(Data.result);
      onOpen();
    } catch (error) {
      showToast("error", "Error al obtener los datos del psicólogo.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full h-16 bg-[#6364F4] items-center justify-start flex">
          <div className="ml-10 flex items-center w-full">
            <h1 className="text-bold text-medium text-white">
              Listado de Todos los Psicologos
            </h1>
          </div>
        </div>

        <div className="w-full mt-4">
          <table className="max-w-screen-2xl mx-auto w-full border-separate border-spacing-y-4 px-8">
            <thead className="rounded-full">
              <tr className="bg-[#6364F4] text-white h-11">
                <th className="rounded-tl-full text-2xl font-normal">○</th>
                <th className="font-normal">Apellido</th>
                <th className="font-normal">Nombre</th>
                <th className="font-normal">Pais</th>
                <th className="font-normal">Correo</th>
                <th className="font-normal">ID</th>
                <th className="rounded-tr-full font-normal">Más</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white text-[#634AE2] font-normal text-[16px] leading-[20px]">
              {Data.map((column, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-2xl rounded-l-[34px]">○</td>
                  <td className="px-4 py-2">{column.apellido}</td>
                  <td className="px-4 py-2">{column.nombre}</td>
                  <td className="px-4 py-2">{column.pais}</td>
                  <td className="px-4 py-2">{column.correo}</td>
                  <td className="py-2">{column.idPsicologo}</td>
                  <td className="py-2 rounded-r-[34px]">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex flex-row items-center justify-center gap-x-4">
                        <button
                          onClick={() => handleEdit(column.idPsicologo)}
                          className="flex flex-col items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="34px"
                            viewBox="0 -960 960 960"
                            width="34px"
                            fill="#634AE2"
                          >
                            <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                          </svg>
                          <h1 className="font-light text-sm text-center">
                            Editar
                          </h1>
                        </button>
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleDelete(column.idPsicologo)}
                            className="flex flex-col items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="34px"
                              viewBox="0 -960 960 960"
                              width="34px"
                              fill="#B158FF"
                            >
                              <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                            </svg>
                            <h1 className="text-[#B158FF] font-light text-sm text-center">
                              Eliminar
                            </h1>
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} size={"5xl"} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader>Editar Psicólogo ID: {selectedId}</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form validationBehavior="native" className="space-y-6">
                <label className="relative w-40 h-40 cursor-pointer">
                  {formData?.imagen ? (
                    <Image
                      src={formData.imagen}
                      alt="Imagen seleccionada"
                      width={160}
                      height={160}
                      className="w-40 h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
                      <Plus
                        width={40}
                        height={40}
                        strokeWidth={2}
                        color="#634AE2"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                </label>

                <Input
                  label="Nombre"
                  labelPlacement="outside"
                  radius="full"
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    inputWrapper: "border-2 border-[#634AE2]",
                    input: "placeholder:!text-[#634AE2] w-full",
                  }}
                  placeholder="Ingrese su nombre"
                  type="text"
                  isRequired
                  value={formData?.nombre}
                  variant="faded"
                  onChange={handleChanges}
                  name="nombre"
                />
                <Input
                  label="Apellido"
                  labelPlacement="outside"
                  radius="full"
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    inputWrapper: "border-2 border-[#634AE2]",
                    input: "placeholder:!text-[#634AE2] w-full",
                  }}
                  placeholder="Ingrese su apellido"
                  type="text"
                  isRequired
                  value={formData?.apellido}
                  variant="faded"
                  onChange={handleChanges}
                  name="apellido"
                />
                <Input
                  label="Fecha de Nacimiento"
                  labelPlacement="outside"
                  radius="full"
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    inputWrapper: "border-2 border-[#634AE2]",
                    input: "placeholder:!text-[#634AE2] w-full",
                  }}
                  placeholder="Ingrese su fecha de nacimiento"
                  type="text"
                  readOnly
                  value={formData?.fecha_nacimiento}
                  variant="faded"
                  name="fecha_nacimiento"
                />
              </Form>

              <Form validationBehavior="native" className="space-y-6">
             
               

                <Input
                  label="Correo"
                  labelPlacement="outside"
                  radius="full"
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    inputWrapper: "border-2 border-[#634AE2]",
                    input: "placeholder:!text-[#634AE2] w-full",
                  }}
                  placeholder="Ingrese su correo"
                  isRequired
                  value={formData?.correo}
                  variant="faded"
                  onChange={handleChanges}
                  name="correo"
                />
                <Input
                  label="Contraseña"
                  labelPlacement="outside"
                  radius="full"
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    inputWrapper: "border-2 border-[#634AE2]",
                    input: "placeholder:!text-[#634AE2] w-full",
                  }}
                  placeholder="Ingrese su nueva contraseña"
                  isRequired
                  variant="faded"
                  onChange={handleChanges}
                  name="contraseña"
                />
                <Select
                  label="Género"
                  labelPlacement="outside"
                  name="genero"
                  onChange={handleChanges}
                  radius="full"
                  variant="faded"
                  selectedKeys={formData?.genero ? [formData.genero] : []}
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    trigger: "border-2 border-[#634AE2]",
                    value: "!text-[#634AE2]",
                  }}
                  placeholder="Seleccione su género"
                >
                  <SelectItem
                    className="text-[#634AE2]"
                    key="femenino"
                    textValue="femenino"
                  >
                    Femenino
                  </SelectItem>
                  <SelectItem
                    className="text-[#634AE2]"
                    key="masculino"
                    textValue="masculino"
                  >
                    Masculino
                  </SelectItem>
                  <SelectItem
                    className="text-[#634AE2]"
                    key="otros"
                    textValue="otros"
                  >
                    Otros
                  </SelectItem>
                </Select>
          
                <Input
                  label="Título"
                  labelPlacement="outside"
                  radius="full"
                  classNames={{
                    base: "!text-[#634AE2]",
                    label: "!text-[#634AE2]",
                    inputWrapper: "border-2 border-[#634AE2]",
                    input: "placeholder:!text-[#634AE2] w-full",
                  }}
                  placeholder="Ingrese su título"
                  isRequired
                  value={formData?.titulo}
                  variant="faded"
                  onChange={handleChanges}
                  name="titulo"
                />
                 <Autocomplete
                  label="País"
                  labelPlacement="outside"
                  aria-label="País"
                  defaultSelectedKey={formData?.pais}
                  onSelectionChange={(key) =>
                    setFormData((prev) =>
                      prev ? { ...prev, pais: key as string } : null
                    )
                  }
                  classNames={{
                    
                    base: "!mt-0.5 text-[#634AE2]  ",
                  }}
                  placeholder="Ingrese su país"
                  isRequired
                  radius="full"
                  variant="faded"
                >
                  {Flags.map((item) => (
                    <AutocompleteItem
                      key={item.value}
                      textValue={item.value}
                      classNames={{
                        base: "!text-[#634AE2]",
                        
                      }}
                    >
                      {item.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </Form>
            </div>

            <div className="mt-6">
              <Textarea
                isRequired
                value={formData?.introduccion}
                minLength={100}
                name="introduccion"
                maxLength={350}
                classNames={{
                  base: "!text-[#634AE2]",
                  label: "!text-[#634AE2] font-bold text-base",
                  inputWrapper:
                    "border-2 border-[#634AE2] bg-white w-full h-full",
                  innerWrapper: "min-h-[120px]",
                }}
                variant="faded"
                label="Introducción"
                labelPlacement="outside"
                onChange={handleChanges}
              />
            </div>

            <div className="mt-6">
              <CheckboxGroup
                isRequired
                orientation="vertical"
                description="Selecciona las especialidades que domina"
                label="Especialidades"
                classNames={{
                  label: "!text-[#634AE2] font-bold text-base",
                }}
                defaultValue={formData?.especialidades}
                onChange={(values) =>
                  setFormData((prev) =>
                    prev ? { ...prev, especialidades: values } : null
                  )
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Checkbox
                      color="secondary"
                      classNames={{
                        label: "text-[#634AE2]",
                      }}
                      value="Cognitivo-conductual"
                    >
                      Cognitivo-conductual
                    </Checkbox>
                    <Checkbox
                      color="secondary"
                      classNames={{
                        label: "text-[#634AE2]",
                      }}
                      value="Neuropsicología"
                    >
                      Neuropsicología
                    </Checkbox>
                    <Checkbox
                      color="secondary"
                      classNames={{
                        label: "text-[#634AE2]",
                      }}
                      value="Psicoanálisis"
                    >
                      Psicoanálisis
                    </Checkbox>
                  </div>
                  <div className="flex flex-col">
                    <Checkbox
                      color="secondary"
                      classNames={{
                        label: "text-[#634AE2]",
                      }}
                      value="Psicopedagogía"
                    >
                      Psicopedagogía
                    </Checkbox>
                    <Checkbox
                      color="secondary"
                      classNames={{
                        label: "text-[#634AE2]",
                      }}
                      value="Gestalt humanista"
                    >
                      Gestalt humanista
                    </Checkbox>
                    <Checkbox
                      color="secondary"
                      classNames={{
                        label: "text-[#634AE2]",
                      }}
                      value="Racional-emotivo-conductual"
                    >
                      Racional-emotivo-conductual
                    </Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cerrar
            </Button>
            <Button color="primary" onPress={() => handleUpdate(selectedId)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}