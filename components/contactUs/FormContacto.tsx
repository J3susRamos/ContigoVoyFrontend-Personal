"use client";
import { Contact } from "@/interface";
import { Button, Form, Input } from "@heroui/react";
import React, { useState } from "react";

export default function FormContacto() {
  const [action, setAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Contact>({
    nombre: "",
    apellido: "",
    celular: "",
    email: "",
    comentario: "",
  });

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
    const data = Object.fromEntries(formDataEntries) as unknown as Contact;

    // Asegúrate de que todas las propiedades necesarias estén presentes
    if (!data.nombre || !data.apellido || !data.celular || !data.email || !data.comentario) {
      setError("Por favor, completa todos los campos del formulario.");
      setLoading(false);
      return;
    }

    if (data.celular) {
      data.celular = String(data.celular); // Asegúrate de que celular sea un string
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/contactos/create`,
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

      setAction("¡Mensaje enviado! Nuestro equipo se pondrá en contacto contigo lo antes posible.");
      setFormData({
        nombre: "",
        apellido: "",
        celular: "",
        email: "",
        comentario: "",
      });

      setTimeout(() => {
        setAction(null);
      }, 6000);
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
    <Form
      className="w-full max-w-scv12 sm:max-w-scv13 bg-[#B8B8FF] opacity-75 rounded-2xl px-scv4 pt-scv6 pb-scv4 md:mr-10  relative z-0"
      validationBehavior="native"
      onSubmit={handleSubmit}
    >
      {action && (
        <div className="absolute top-0 left-0 w-full h-[90px] flex items-center justify-center bg-[#9494F3]  rounded-2xl z-10 mt-[190px]">
          <div className="m-8 text-start">
            <p className="text-white font-light text-base">
              {action}
            </p>
          </div>
        </div>
      )}
      <div className="space-y-3 w-full relative">
        <Input
          isRequired
          size="lg"
          name="nombre"
          placeholder="Nombres"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
        />
        <Input
          isRequired
          size="lg"
          name="apellido"
          placeholder="Apellidos"
          type="text"
          value={formData.apellido}
          onChange={handleChange}
        />
        <Input
          isRequired
          size="lg"
          name="celular"
          placeholder="Celular"
          type="tel"
          value={formData.celular}
          onChange={handleChange}
        />
        <Input
          isRequired
          size="lg"
          name="email"
          placeholder="Correo"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="comentario"
          size="lg"
          placeholder="Comentario"
          type="textarea"
          value={formData.comentario}
          onChange={handleChange}
        />

        <div className="w-full flex justify-center pt-4">
          <Button
            style={{ backgroundColor: "#634AE3", color: "white", borderRadius: "28PX", fontWeight: "700" }}
            className="py-[8px] px-[36px] sm:px-[54px] sm:text-cv4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>

        {error && <div className="text-red-500">{error}</div>}
      </div>
    </Form>
  );
}