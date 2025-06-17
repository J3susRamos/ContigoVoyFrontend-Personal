"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import ReactCountryFlag from "react-country-flag";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import { PrePaciente, PsicologoPreviewData } from "@/interface";
import React, { useState } from "react";
import HorarioPsicologo from "./horariosPsicologo/horarioPsicologo";
import Image from "next/image";

export default function ReservarPsiPreview({
  psicologo,
}: {
  psicologo: PsicologoPreviewData;
}) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  // Estados para los campos del formulario
  const [error, setError] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<PrePaciente>({
    nombre: "",
    celular: "",
    correo: "",
    fecha_cita: "",
    hora_cita: "",
    idPsicologo: psicologo.idPsicologo,
  });

  const handleSelectHorario = (hora: string, fecha: string) => {
    setHoraSeleccionada(hora);
    setFechaSeleccionada(fecha);

    setFormData((prevData) => ({
      ...prevData,
      fecha,
      hora,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formDataEntries = new FormData(e.currentTarget);
    const data = Object.fromEntries(formDataEntries) as unknown as PrePaciente;

    data.fecha_cita = fechaSeleccionada;
    data.hora_cita = horaSeleccionada;
    data.idPsicologo = psicologo.idPsicologo;

    if (!data.nombre || !data.celular || !data.correo) {
      setError("Por favor, completa todos los campos del formulario.");
      setLoading(false);
      return;
    }

    // Validación de número
    const telefonoRegex = /^[0-9]{9,}$/;
    if (!telefonoRegex.test(data.celular)) {
      setError(
        "El número de celular debe contener solo números y tener al menos 9 dígitos."
      );
      setLoading(false);
      return;
    }

    // Validación de correo electrónico
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(data.correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (data.celular) {
      data.celular = String(data.celular);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/pre-pacientes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result: { message?: string } = await response.json();
      if (!response.ok) {
        setError(result.message || "Error al enviar el formulario");
        setLoading(false);
        return;
      }

      // Continuar con el flujo
      setFormData({
        nombre: "",
        celular: "",
        correo: "",
        fecha_cita: "",
        hora_cita: "",
        idPsicologo: psicologo.idPsicologo,
      });
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "No se pudo enviar el formulario.");
      } else {
        setError("No se pudo enviar el formulario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col w-full bg-background py-4 px-6 rounded-3xl border-[#9494F3] min-h-[255px]">
        <div>
          <div className="w-full flex gap-10">
            <div className="col-span-1 flex sm:justify-start">
              <div className="flex items-center relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={psicologo.imagen} />
                </Avatar>
                <div className="absolute -bottom-[2px] -right-2 w-8 h-8 sm:w-10 sm:h-10">
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "100%",
                    }}
                    countryCode={psicologo.pais}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 text-[#634AE2] flex flex-col justify-center">
              <CardDescription className="text-[#634AE2] font-light">
                {psicologo.titulo}
              </CardDescription>
              <CardTitle className="text-[#634AE2] text-xl sm:text-2xl">
                {psicologo.nombre} <br />
                {psicologo.apellido}
              </CardTitle>
            </div>
          </div>
          <hr className="my-2.5 border-t border-[#9494F3] w-[100%]" />
          </div>
     
        <p className="text-[#634AE2] pb-3 text-sm sm:text-base">
          {psicologo.introduccion.slice(0, 50)}...
        </p>

        <CardFooter className="flex justify-center gap-2 sm:flex sm:space-x-8 text-xs p-3 pb-0 mt-auto">
          <Button
            onPress={() => setIsScheduleOpen(true)}
            className="rounded-3xl bg-[#E7E7FF] px-6 sm:px-8 py-1 sm:py-0 text-[#634AE2] font-light h-8 text-[16px]"
          >
            Agendar
          </Button>
          <Button
            onPress={() => setIsProfileOpen(true)}
            className="rounded-3xl bg-[#fff] px-6 sm:px-8 py-1 sm:py-0 border-[#634AE2] font-light border-1 text-[#634AE2] h-8 text-[16px]"
          >
            Ver perfil
          </Button>
        </CardFooter>
      </Card>

      {/*modal de profile */}
      <Modal
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        size={"2xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 backdrop-opacity-40",
          base: "border-[#d8dceb] bg-[#ffffff] dark:bg-[#ffffff] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#d8dceb]",
          footer: "border-t-[1px] border-[#d8dceb]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalContent className="w-[695px] h-[416px] bg-background rounded-3xl  overflow-hidden  mt-8">
                <div className="grid grid-cols-[0.8fr_1.6fr] items-center">
                  <div className="h-full w-full flex ">
                    <Avatar className="w-[208px] h-[416px] rounded-2xl overflow-hidden">
                      <AvatarImage
                        src={psicologo.imagen}
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                  </div>

                  <div className="text-[#634AE2] text-start ">
                    <div className="space-y-1 px-1">
                      <div className="text-[#634AE2] text-2xl font-semibold">
                        {psicologo.nombre} {psicologo.apellido}
                      </div>
                    </div>
                    <hr className="my-2.5 border-t border-[#9494F3] w-64" />
                    <ModalBody className="py-2 px-1 gap-0.5">
                      <p className="text-[#634AE2] font-normal text-base">
                        Especialidades:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1.5 mb-1 ">
                        {psicologo.especialidades.map((item, index) => (
                          <span
                            key={index}
                            className="px-4 py-1 bg-[#E7E7FF] text-[#634AE2] rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <hr className="my-2.5 border-t border-[#9494F3] w-11/12" />
                      <p className="text-[#634AE2] text-sm  leading-[22px] content-normal mr-1">
                        {psicologo.introduccion}
                      </p>
                    </ModalBody>
                  </div>
                </div>
              </ModalContent>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Horarios */}
      <Modal
        isOpen={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        size={"5xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 backdrop-opacity-40",
          base: "border-[#d8dceb] bg-[#ffffff] dark:bg-[#ffffff] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#d8dceb]",
          footer: "border-t-[1px] border-[#d8dceb]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-[#634AE2] text-2xl font-bold">
                Agendar cita
              </h1>
              <HorarioPsicologo
                idPsicologo={psicologo.idPsicologo}
                horario={psicologo.horario}
                onClose={() => setIsScheduleOpen(false)}
                onOpenConfirm={() => setIsConfirmOpen(true)}
                onSelectHorario={handleSelectHorario}
              />
              <div className="w-full flex justify-center">
                <Button
                  onPress={() => setIsScheduleOpen(false)}
                  className="rounded-3xl bg-[#E7E7FF] px-6 sm:px-8 py-1 sm:py-0 text-[#634AE2] font-light"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de confirmación */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        size={"2xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 backdrop-opacity-40",
          base: "border-[#d8dceb] bg-[#ffffff] dark:bg-[#ffffff] text-[#a8b0d3]",
        }}
      >
        <ModalContent>
          <ModalBody>
            <h2 className="text-xl font-bold text-center text-[#634AE2]">
              ¡Bríndanos tus datos para agendar la cita!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[#634AE2] text-sm mb-1">
                  Nombres y apellidos
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#634AE2]"
                  placeholder="Nombres y apellidos"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[#634AE2] text-sm mb-1">
                  Número de celular
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#634AE2]"
                  placeholder="Número de celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[#634AE2] text-sm mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#634AE2]"
                  placeholder="Correo electrónico"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-center text-[#634AE2] mt-2">
                Has seleccionado: <strong>{fechaSeleccionada}</strong> a las{" "}
                <strong>{horaSeleccionada}</strong>
              </p>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="rounded-3xl bg-[#634AE2] text-white px-6 py-1 font-light"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Reservar"}
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        size={"2xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 backdrop-opacity-40",
          base: "bg-[#634AE2] text-white rounded-3xl",
          header: "border-b-[1px] border-[#d8dceb]",
          footer: "border-t-[1px] border-[#d8dceb]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalBody className="text-center">
            <Image
              src="/send-mail.svg"
              alt="Icono de correo enviado"
              width={128}
              height={128}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold mb-4">
              ¡LISTO! Tu cita ha sido reservada
            </h2>
            <p className="mb-6">
              En unos minutos te enviaremos un correo de confirmación.
            </p>
            <div className="flex justify-center mb-4"></div>
            <Button
              onPress={() => setIsSuccessOpen(false)}
              className="inline-block rounded-3xl bg-[#E7E7FF] px-6 sm:px-8 py-1 sm:py-0 text-[#634AE2] font-light"
            >
              Cerrar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
