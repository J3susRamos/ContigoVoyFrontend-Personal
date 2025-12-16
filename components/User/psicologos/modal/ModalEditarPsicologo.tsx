"use client";
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
} from "@heroui/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useModalEditar } from "../hooks/useModalEditar";

interface ModalEditarPsicologoProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
  refreshData: () => void;
}

const ModalEditarPsicologo: React.FC<ModalEditarPsicologoProps> = ({
  isOpen,
  onClose,
  selectedId,
  refreshData,
}) => {
  const {
    formData,
    handleImageUpload,
    handleChanges,
    handlePaisChange,
    handleEspecialidadesChange,
    handleUpdate,
    handleEdit,
    resetForm,
  } = useModalEditar(refreshData);

  useEffect(() => {
    if (isOpen && selectedId) {
      handleEdit(selectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedId]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSave = async () => {
    const success = await handleUpdate(selectedId);
    if (success) {
      onClose();
    }
  };

  return (
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
                value={formData?.nombre || ""}
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
                value={formData?.apellido || ""}
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
                value={formData?.fecha_nacimiento || ""}
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
                value={formData?.correo || ""}
                variant="faded"
                onChange={handleChanges}
                name="correo"
              />

              {/*  Celular */}
              <Input
                label="Celular"
                labelPlacement="outside"
                radius="full"
                classNames={{
                  base: "!text-[#634AE2]",
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "placeholder:!text-[#634AE2] w-full",
                }}
                placeholder="Ej: 999888777"
                type="tel"
                value={formData?.celular || ""}
                variant="faded"
                onChange={handleChanges}
                name="celular"
              />

              <Input
                label="Google Meet Link"
                labelPlacement="outside"
                radius="full"
                classNames={{
                  base: "!text-[#634AE2]",
                  label: "!text-[#634AE2]",
                  inputWrapper: "border-2 border-[#634AE2]",
                  input: "placeholder:!text-[#634AE2] w-full",
                }}
                placeholder="Ingresar Link de Google Meet"
                isRequired
                value={formData?.meet_link || ""}
                variant="faded"
                onChange={handleChanges}
                name="meet_link"
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
                <SelectItem className="text-[#634AE2]" key="femenino" textValue="femenino">
                  Femenino
                </SelectItem>
                <SelectItem className="text-[#634AE2]" key="masculino" textValue="masculino">
                  Masculino
                </SelectItem>
                <SelectItem className="text-[#634AE2]" key="otros" textValue="otros">
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
                value={formData?.titulo || ""}
                variant="faded"
                onChange={handleChanges}
                name="titulo"
              />

              <Autocomplete
                label="País"
                labelPlacement="outside"
                aria-label="País"
                defaultSelectedKey={formData?.pais}
                onSelectionChange={(key) => handlePaisChange(key as string)}
                classNames={{ base: "!mt-0.5 text-[#634AE2]" }}
                placeholder="Ingrese su país"
                isRequired
                radius="full"
                variant="faded"
              >
                {Flags.map((item) => (
                  <AutocompleteItem
                    key={item.value}
                    textValue={item.value}
                    classNames={{ base: "!text-[#634AE2]" }}
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
              value={formData?.introduccion || ""}
              minLength={100}
              name="introduccion"
              maxLength={350}
              classNames={{
                base: "!text-[#634AE2]",
                label: "!text-[#634AE2] font-bold text-base",
                inputWrapper: "border-2 border-[#634AE2] bg-white w-full h-full",
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
              classNames={{ label: "!text-[#634AE2] font-bold text-base" }}
              defaultValue={formData?.especialidades}
              onChange={handleEspecialidadesChange}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Checkbox color="secondary" classNames={{ label: "text-[#634AE2]" }} value="Cognitivo-conductual">
                    Cognitivo-conductual
                  </Checkbox>
                  <Checkbox color="secondary" classNames={{ label: "text-[#634AE2]" }} value="Neuropsicología">
                    Neuropsicología
                  </Checkbox>
                  <Checkbox color="secondary" classNames={{ label: "text-[#634AE2]" }} value="Psicoanálisis">
                    Psicoanálisis
                  </Checkbox>
                </div>
                <div className="flex flex-col">
                  <Checkbox color="secondary" classNames={{ label: "text-[#634AE2]" }} value="Psicopedagogía">
                    Psicopedagogía
                  </Checkbox>
                  <Checkbox color="secondary" classNames={{ label: "text-[#634AE2]" }} value="Gestalt humanista">
                    Gestalt humanista
                  </Checkbox>
                  <Checkbox
                    color="secondary"
                    classNames={{ label: "text-[#634AE2]" }}
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
          <Button color="primary" onPress={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEditarPsicologo;
