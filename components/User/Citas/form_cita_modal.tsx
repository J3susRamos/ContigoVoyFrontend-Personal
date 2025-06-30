"use client";

import React, {useState, useEffect} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Textarea
} from "@heroui/react";
import {parseCookies} from "nookies";
import showToast from "@/components/ToastStyle";

interface FormCitaProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onCitaCreatedAction: () => void;
}

interface Paciente {
    idPaciente: number;
    nombre: string;
    codigo: string;
}

export const FormCita: React.FC<FormCitaProps> = ({
                                                      isOpen,
                                                      onCloseAction,
                                                      onCitaCreatedAction
                                                  }) => {
    const [formData, setFormData] = useState({
        idPaciente: "",
        fecha_cita: "",
        hora_cita: "",
        duracion: "60",
        motivo_Consulta: "",
        estado_Cita: "Pendiente"
    });
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch pacientes when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPacientes().catch((error) => {
                console.error("Error in fetchPacientes:", error);
                showToast("error", "Error al cargar pacientes");
            });
        }
    }, [isOpen]);

    const fetchPacientes = async () => {
        try {
            const cookies = parseCookies();
            const token = cookies["session"];
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pacientes`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPacientes(data.result || []);
            } else {
                console.error("Error fetching pacientes:", response.status);
                showToast("error", "Error al cargar pacientes");
            }
        } catch (error) {
            console.error("Error fetching pacientes:", error);
            showToast("error", "Error al cargar pacientes");
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.idPaciente) {
            newErrors.idPaciente = "Debe seleccionar un paciente";
        }
        if (!formData.fecha_cita) {
            newErrors.fecha_cita = "La fecha es requerida";
        }
        if (!formData.hora_cita) {
            newErrors.hora_cita = "La hora es requerida";
        }
        if (!formData.duracion || parseInt(formData.duracion) <= 0) {
            newErrors.duracion = "La duración debe ser mayor a 0";
        }

        // Validate that the appointment is not in the past
        if (formData.fecha_cita && formData.hora_cita) {
            const appointmentDateTime = new Date(`${formData.fecha_cita}T${formData.hora_cita}`);
            const now = new Date();
            if (appointmentDateTime <= now) {
                newErrors.fecha_cita = "La fecha y hora de la cita no puede ser en el pasado";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const cookies = parseCookies();
            const token = cookies["session"];

            // Convert the time format from HH:MM to HH:MM:SS for the API
            const timeWithSeconds = formData.hora_cita.includes(':') && formData.hora_cita.split(':').length === 2
                ? `${formData.hora_cita}:00`
                : formData.hora_cita;

            const requestBody = {
                ...formData,
                idPaciente: parseInt(formData.idPaciente),
                duracion: parseInt(formData.duracion),
                hora_cita: timeWithSeconds
            };

            console.log("Sending request body:", requestBody);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/citas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                showToast("success", "Cita creada exitosamente");
                onCitaCreatedAction();
                handleClose();
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                showToast("error", errorData.message || "Error al crear la cita");
            }
        } catch (error) {
            console.error("Error creating cita:", error);
            showToast("error", "Error al crear la cita");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            idPaciente: "",
            fecha_cita: "",
            hora_cita: "",
            duracion: "60",
            motivo_Consulta: "",
            estado_Cita: "Pendiente"
        });
        setErrors({});
        onCloseAction();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ""}));
        }
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            size="2xl"
            placement="center"
            closeButton
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Agregar Nueva Cita
                        </ModalHeader>
                        <form onSubmit={handleSubmit}>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Select
                                        label="Paciente"
                                        placeholder="Seleccione un paciente"
                                        selectedKeys={formData.idPaciente ? [formData.idPaciente] : []}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleInputChange("idPaciente", selectedKey);
                                        }}
                                        isInvalid={!!errors.idPaciente}
                                        errorMessage={errors.idPaciente}
                                    >
                                        {pacientes.map((paciente) => (
                                            <SelectItem
                                                key={paciente.idPaciente.toString()}
                                            >
                                                {`${paciente.nombre} (${paciente.codigo})`}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex gap-4">
                                        <Input
                                            type="date"
                                            label="Fecha de la cita"
                                            value={formData.fecha_cita}
                                            onChange={(e) => handleInputChange("fecha_cita", e.target.value)}
                                            isInvalid={!!errors.fecha_cita}
                                            errorMessage={errors.fecha_cita}
                                            className="flex-1"
                                            min={today}
                                        />
                                        <Input
                                            type="time"
                                            label="Hora de la cita"
                                            value={formData.hora_cita}
                                            onChange={(e) => handleInputChange("hora_cita", e.target.value)}
                                            isInvalid={!!errors.hora_cita}
                                            errorMessage={errors.hora_cita}
                                            className="flex-1"
                                        />
                                    </div>

                                    <Input
                                        type="number"
                                        label="Duración (minutos)"
                                        value={formData.duracion}
                                        onChange={(e) => handleInputChange("duracion", e.target.value)}
                                        isInvalid={!!errors.duracion}
                                        errorMessage={errors.duracion}
                                        min="1"
                                        max="480"
                                    />

                                    <Select
                                        label="Estado"
                                        selectedKeys={[formData.estado_Cita]}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleInputChange("estado_Cita", selectedKey);
                                        }}
                                    >
                                        <SelectItem key="Pendiente">
                                            Pendiente
                                        </SelectItem>
                                        <SelectItem key="Confirmada">
                                            Confirmada
                                        </SelectItem>
                                    </Select>

                                    <Textarea
                                        label="Motivo de consulta"
                                        placeholder="Describa el motivo de la consulta"
                                        value={formData.motivo_Consulta}
                                        onChange={(e) => handleInputChange("motivo_Consulta", e.target.value)}
                                        minRows={3}
                                        maxRows={5}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    isLoading={loading}
                                    disabled={loading}
                                >
                                    {loading ? "Creando..." : "Crear Cita"}
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
