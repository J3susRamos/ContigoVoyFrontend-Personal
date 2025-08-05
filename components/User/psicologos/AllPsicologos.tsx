"use client";
import {
  DeletePsycologo,
  GetPsicologosById,
  UpdatePsicologo,
} from "@/app/apiRoutes";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
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
import DataTable from "@/components/ui/Table/DataTable";
import DataCard from "@/components/ui/DataCard";
import Row from "@/components/ui/Table/Row";

export default function AllPsicologos({
  Data,
}: {
  Data: PsicologoPreviewData[];
}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PsicologoPreviewData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await handleDelete(deleteId);
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

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

  const headers = ["Apellido", "Nombre", "País", "Correo", "ID", "Más"];

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full h-16 bg-[#6364F4] dark:bg-primary flex items-center justify-between px-10">
          <div className="flex items-center">
            <h1 className="text-bold text-medium text-white dark:text-primary-foreground">
              Listado de Todos los Psicólogos
            </h1>
          </div>
          <select className="px-2 py-1 rounded">
            <option value="1">Activos</option>
            <option value="2">Inactivos</option>
          </select>
        </div>

        <div className="w-full mt-4">
          <DataTable
            headers={headers}
            data={Data}
            renderRow={(psicologo) => (
              <Row
                values={[
                  psicologo.apellido,
                  psicologo.nombre,                  psicologo.pais,
                  psicologo.correo,
                  psicologo.idPsicologo.toString(),
                ]}
                onEdit={() => handleEdit(psicologo.idPsicologo)}
              />
            )}            renderCard={(psicologo) => (
              <DataCard
                paciente={{ 
                  nombre: `Dr. ${psicologo.nombre} ${psicologo.apellido}`, 
                  codigo: `ID: ${psicologo.idPsicologo}` 
                }}
                info={[
                  { label: "País", value: psicologo.pais },
                  { label: "Correo", value: psicologo.correo },
                  { label: "Experiencia", value: `${psicologo.experiencia} años` },
                  { label: "Especialidades", value: psicologo.especialidades?.slice(0, 2).join(", ") || "No especificadas" },
                ]}
                onEdit={() => handleEdit(psicologo.idPsicologo)}
                onDelete={() => openDeleteModal(psicologo.idPsicologo)}
                onClick={() => handleEdit(psicologo.idPsicologo)}
              />
            )}
          />
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
                    />                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                      <Plus
                        width={40}
                        height={40}
                        strokeWidth={2}
                        className="text-[#634AE2] dark:text-primary"
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
      <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message="¿Estás seguro de eliminar este psicólogo?"
      />
    </>
  );
}