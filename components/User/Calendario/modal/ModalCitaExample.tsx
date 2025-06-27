import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Textarea,
} from "@heroui/react";

interface ModalCitaExampleProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ModalCitaExample({ isOpen, onOpenChange }: ModalCitaExampleProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-background dark:bg-background">
          <ModalBody>
            <Form validationBehavior="native">
              <Input
                label="Paciente"
                labelPlacement="outside"
                placeholder="Nombre del paciente"
                classNames={{
                  label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                  input: "!text-foreground dark:!text-foreground font-light text-center",
                  errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                  mainWrapper: "flex flex-col items-center",
                }}
              />

              <Textarea
                label="Motivo de consulta"
                placeholder="Escribe aquí el motivo de tu consulta"
                labelPlacement="outside"
                classNames={{
                  label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                  input: "!text-foreground dark:!text-foreground font-light text-center",
                  errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                  mainWrapper: "flex flex-col items-center",
                }}
              />
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <Input
                    label="Estado de la cita"
                    labelPlacement="outside"
                    placeholder="Estado de la cita"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />

                  <Input
                    label="Fecha de la cita"
                    labelPlacement="outside"
                    placeholder="Fecha de la cita"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                  <Input
                    label="Tipo de cita"
                    labelPlacement="outside"
                    placeholder="Tipo de cita"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                  <Input
                    label="Canal de atracción"
                    labelPlacement="outside"
                    placeholder="Canal de atracción"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Input
                    label="Color de la cita"
                    labelPlacement="outside"
                    placeholder="Color de la cita"
                    type="color"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                  <Input
                    label="Hora de la cita"
                    labelPlacement="outside"
                    placeholder="Hora de la cita"
                    type="time"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                  <Input
                    label="Duración"
                    labelPlacement="outside"
                    placeholder="Duración"
                    type="number"
                    min={30}
                    max={60}
                    step={15}
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                  <Input
                    label="Etiqueta"
                    labelPlacement="outside"
                    placeholder="Etiqueta"
                    classNames={{
                      label: "!text-primary dark:!text-primary-foreground font-bold text-center mx-auto w-full",
                      input: "!text-foreground dark:!text-foreground font-light text-center",
                      errorMessage: "!text-destructive dark:!text-destructive font-light text-center",
                      mainWrapper: "flex flex-col items-center",
                    }}
                  />
                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter className="mx-auto">
            <Button
              radius="full"
              className="bg-transparent border border-primary dark:border-primary-foreground text-primary dark:text-primary-foreground"
            >
              Modificar
            </Button>
            <Button
              radius="full"
              className="bg-transparent border border-primary dark:border-primary-foreground text-destructive dark:text-destructive"
            >
              Borrar
            </Button>
            <Button
              radius="full"
              className="bg-primary dark:bg-primary text-primary-foreground font-light"
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}