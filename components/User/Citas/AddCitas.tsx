import { CreateCitaParaPaciente } from '@/app/apiRoutes';
import showToast from '@/components/ToastStyle';
import { FormCita, PacienteCita } from '@/interface';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from '@heroui/react'
import React, { useEffect, useState } from 'react'

type AddCitasProps = {
  open: (id: boolean) => void,
  dataPaciente: PacienteCita
};



function AddCitas({ open, dataPaciente }: AddCitasProps) {

    const [ viewModal, setViewModal ] = useState(true);
    const [formDataPatient, setFormDataPatient] = useState<FormCita>({
        idPaciente: "",
        fecha_cita: "",
        hora_cita: "",
        duracion: "",
        motivo_Consulta: "",
        estado_Cita: "Pendiente"
        });
    const [loading, setLoading] = useState(false);

    const handleViewModal = () =>{
        setViewModal(false);
        open(false)
    }
    useEffect(()=>{
        if (dataPaciente) {
            setFormDataPatient({
            idPaciente: dataPaciente.idPaciente.toString(),
            fecha_cita: "",
            hora_cita: "",
            duracion: "",
            motivo_Consulta: "",
            estado_Cita: "Pendiente",
            });
        }
    },[dataPaciente])

    const handleInputChange = (field: string, value: string) => {
        setFormDataPatient(prev => ({...prev, [field]: value}));
    };

    const handleCreateCita = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formDataPatient.idPaciente) {
            alert("Paciente no cargado");
            return;
        }
      setLoading(true);
      console.log("Valores enviados a la API:", formDataPatient);
      try {
        await CreateCitaParaPaciente(formDataPatient);
        setLoading(false);
        handleViewModal();
        showToast("success", "Cita creada correctamente");

      } catch (error) {
        setLoading(false);
        showToast("error", "Error al crear la cita");

      }
    };

  return (
    <div>
        <Modal
            isOpen={viewModal}
            size="2xl"
            placement="center"
            className="border border-[#634AE2]"
            onClose={handleViewModal}
            >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-[#634AE2]">
                Agregar Nueva Cita
                </ModalHeader>
                <form onSubmit={handleCreateCita}>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                    {/* Paciente */}
                    <Select
                        label="Paciente"
                        placeholder={`${dataPaciente.nombre} ${dataPaciente.apellido} (${dataPaciente.codigo})`}
                        isDisabled={true}
                        selectedKeys={[formDataPatient.idPaciente]}
                    >
                        <SelectItem className="bg-[#634AE2] text-white" key={dataPaciente.idPaciente.toString()}>
                        {`${dataPaciente.nombre} ${dataPaciente.apellido} (${dataPaciente.codigo})`}
                        </SelectItem>
                    </Select>

                    {/* Fecha y Hora */}
                    <div className="flex gap-4">
                        <Input
                        type="date"
                        required
                        label="Fecha de la cita"
                        value={formDataPatient.fecha_cita}
                        onChange={e => handleInputChange("fecha_cita", e.target.value)}
                        className="flex-1"
                        />
                        <Input
                        type="time"
                        required
                        label="Hora de la cita"
                        value={formDataPatient.hora_cita}
                        onChange={e => handleInputChange("hora_cita", e.target.value)}
                        className="flex-1"
                        />
                    </div>

                    {/* Duración */}
                    <Input
                        type="number"
                        required
                        label="Duración (minutos)"
                        value={formDataPatient.duracion}
                        onChange={e => handleInputChange("duracion", e.target.value)}
                        min="10"
                        max="180"
                    />

                    {/* Estado */}
                    <Select
                        label="Estado"
                        selectedKeys={[formDataPatient.estado_Cita]}
                        required
                        onSelectionChange={keys => {
                            const selectedKey = Array.from(keys)[0] as string;
                            handleInputChange("estado_Cita", selectedKey);
                        }}
                        >
                        <SelectItem key="Pendiente">Pendiente</SelectItem>
                        <SelectItem key="Confirmada">Confirmada</SelectItem>
                        <SelectItem key="Completada">Completada</SelectItem>
                        <SelectItem key="Cancelada">Cancelada</SelectItem>
                    </Select>

                    {/* Motivo */}
                    <Textarea
                        label="Motivo de consulta"
                        placeholder="Describa el motivo de la consulta"
                        value={formDataPatient.motivo_Consulta}
                        onChange={e => handleInputChange("motivo_Consulta", e.target.value)}
                        minRows={3}
                        required
                        maxRows={5}
                    />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={handleViewModal}>
                    Cancelar
                    </Button>
                    <Button color="primary" type="submit" isLoading={loading}>
                    Crear Cita
                    </Button>
                </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default AddCitas