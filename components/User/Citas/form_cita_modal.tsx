"use client";

import React, {useEffect, useState} from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea
} from "@heroui/react";
import {parseCookies} from "nookies";
import showToast from "@/components/ToastStyle";
import { Citas } from "@/interface";

interface FormCitaProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onCitaCreatedAction: () => void;
    editingCita?: Citas | null;
}

interface Paciente {
    idPaciente: number;
    nombre: string;
    codigo: string;
}

interface FormData {
    idPaciente: string;
    fecha_cita: string;
    hora_cita: string;
    duracion: string;
    motivo_Consulta: string;
    estado_Cita: string;
}

// Constants
const INITIAL_FORM_DATA: FormData = {
    idPaciente: "",
    fecha_cita: "",
    hora_cita: "",
    duracion: "60",
    motivo_Consulta: "",
    estado_Cita: "Pendiente"
};

const APPOINTMENT_STATES = [
    {key: "Pendiente", label: "Pendiente"},
    {key: "Confirmada", label: "Confirmada"},
    {key: "Completada", label: "Completada"},
    {key: "Cancelada", label: "Cancelada"}
];

const DURATION_LIMITS = {
    MIN: 1,
    MAX: 480
};

// Custom hooks
const usePacientes = (isOpen: boolean) => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

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

    return pacientes;
};

const useFormValidation = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (formData: FormData, isEditing: boolean = false) => {
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

        // For new appointments, validate that they're not in the past
        // For editing, we might allow past appointments to be modified
        if (!isEditing && formData.fecha_cita && formData.hora_cita) {
            const appointmentDateTime = new Date(`${formData.fecha_cita}T${formData.hora_cita}`);
            const now = new Date();
            if (appointmentDateTime <= now) {
                newErrors.fecha_cita = "La fecha y hora de la cita no puede ser en el pasado";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearFieldError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ""}));
        }
    };

    const clearAllErrors = () => setErrors({});

    return {errors, validateForm, clearFieldError, clearAllErrors};
};

const useApiRequest = () => {
    const [loading, setLoading] = useState(false);

    const makeRequest = async (url: string, options: RequestInit) => {
        setLoading(true);
        try {
            const cookies = parseCookies();
            const token = cookies["session"];

            return await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    ...options.headers,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return {loading, makeRequest};
};

// Utility functions
const formatTimeForApi = (time: string): string => {
    return time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
};

const formatTimeForInput = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toTimeString().slice(0, 5); // HH:MM format
};

const formatDateForInput = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

const prepareRequestData = (formData: FormData) => ({
    ...formData,
    idPaciente: parseInt(formData.idPaciente),
    duracion: parseInt(formData.duracion),
    hora_cita: formatTimeForApi(formData.hora_cita)
});

const mapCitaToFormData = (cita: Citas): FormData => ({
    idPaciente: cita.idPaciente.toString(),
    fecha_cita: formatDateForInput(cita.fecha_inicio),
    hora_cita: formatTimeForInput(cita.fecha_inicio),
    duracion: cita.duracion.replace(' minutos', '').replace(' min', '').trim(),
    motivo_Consulta: cita.motivo,
    estado_Cita: cita.estado
});

export const FormCita: React.FC<FormCitaProps> = ({
                                                      isOpen,
                                                      onCloseAction,
                                                      onCitaCreatedAction,
                                                      editingCita = null
                                                  }) => {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const pacientes = usePacientes(isOpen);
    const {errors, validateForm, clearFieldError, clearAllErrors} = useFormValidation();
    const {loading, makeRequest} = useApiRequest();
    const isEditing = !!editingCita;

    // Effect to populate form when editing
    useEffect(() => {
        if (editingCita && isOpen) {
            const mappedData = mapCitaToFormData(editingCita);
            setFormData(mappedData);
        } else if (!editingCita && isOpen) {
            setFormData(INITIAL_FORM_DATA);
        }
    }, [editingCita, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(formData, isEditing)) {
            return;
        }

        try {
            const requestBody = prepareRequestData(formData);
            console.log("Sending request body:", requestBody);

            const url = isEditing 
                ? `${process.env.NEXT_PUBLIC_API_URL}api/citas/${editingCita.idCita}`
                : `${process.env.NEXT_PUBLIC_API_URL}api/citas`;
            
            const method = isEditing ? "PUT" : "POST";

            const response = await makeRequest(url, {
                method,
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const successMessage = isEditing ? "Cita actualizada exitosamente" : "Cita creada exitosamente";
                showToast("success", successMessage);
                onCitaCreatedAction();
                handleClose();
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                const errorMessage = isEditing ? "Error al actualizar la cita" : "Error al crear la cita";
                showToast("error", errorData.message || errorMessage);
            }
        } catch (error) {
            console.error("Error submitting cita:", error);
            const errorMessage = isEditing ? "Error al actualizar la cita" : "Error al crear la cita";
            showToast("error", errorMessage);
        }
    };

    const handleClose = () => {
        setFormData(INITIAL_FORM_DATA);
        clearAllErrors();
        onCloseAction();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        clearFieldError(field);
    };

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
            className="border border-[#634AE2]"
            closeButton
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#634AE2]">
                            {isEditing ? "Editar Cita" : "Agregar Nueva Cita"}
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
                                        isDisabled={isEditing} // Disable patient selection when editing
                                    >
                                        
                                        {pacientes.map((paciente) => (
                                            <SelectItem
                                            className="bg-[#634AE2] text-white"
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
                                            min={!isEditing ? getTodayDate() : undefined}
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
                                        min={DURATION_LIMITS.MIN.toString()}
                                        max={DURATION_LIMITS.MAX.toString()}
                                    />
                                    <Select
                                        label="Estado"
                                        selectedKeys={[formData.estado_Cita]}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleInputChange("estado_Cita", selectedKey);
                                        }}
                                    >
                                        {APPOINTMENT_STATES.map((state) => (
                                            <SelectItem className="bg-[#634AE2] text-white" key={state.key}>
                                                {state.label}
                                            </SelectItem>
                                        ))}
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
                                    {loading 
                                        ? (isEditing ? "Actualizando..." : "Creando...") 
                                        : (isEditing ? "Actualizar Cita" : "Crear Cita")
                                    }
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
