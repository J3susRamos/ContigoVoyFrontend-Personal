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
    <div className="w-full max-w-scv12 sm:max-w-scv13 md:mr-10 relative z-0">
      {/* Fondo con efecto glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl"></div>
      
      <Form
        className="relative z-10 px-8 pt-8 pb-6 rounded-3xl"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        {/* Header del formulario */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{textShadow: "2px 3px 8px rgba(0,0,0,0.5)"}}>
            Escríbenos
          </h3>
          <p className="text-white/90 text-sm" style={{textShadow: "1px 2px 4px rgba(0,0,0,0.3)"}}>
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </div>

        {/* Mensaje de éxito */}
        {action && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500/95 to-emerald-600/95 backdrop-blur-sm rounded-3xl z-20 border border-green-400/30">
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-medium text-lg leading-relaxed">
                {action}
              </p>
            </div>
          </div>
        )}        <div className="space-y-5 w-full relative">
          {/* Campo Nombre */}
          <div className="relative group">
            <Input
              isRequired
              size="lg"
              name="nombre"
              placeholder="Nombres"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              startContent={
                <div className="text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              }
              classNames={{
                input: "bg-white/90 text-gray-800 placeholder:text-gray-500",
                inputWrapper: "bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
              }}
            />
          </div>

          {/* Campo Apellido */}
          <div className="relative group">
            <Input
              isRequired
              size="lg"
              name="apellido"
              placeholder="Apellidos"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              startContent={
                <div className="text-indigo-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              }
              classNames={{
                input: "bg-white/90 text-gray-800 placeholder:text-gray-500",
                inputWrapper: "bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
              }}
            />
          </div>

          {/* Campo Celular */}
          <div className="relative group">
            <Input
              isRequired
              size="lg"
              name="celular"
              placeholder="Celular"
              type="tel"
              value={formData.celular}
              onChange={handleChange}
              startContent={
                <div className="text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
              }
              classNames={{
                input: "bg-white/90 text-gray-800 placeholder:text-gray-500",
                inputWrapper: "bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
              }}
            />
          </div>

          {/* Campo Email */}
          <div className="relative group">
            <Input
              isRequired
              size="lg"
              name="email"
              placeholder="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange}
              startContent={
                <div className="text-red-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                  </svg>
                </div>
              }
              classNames={{
                input: "bg-white/90 text-gray-800 placeholder:text-gray-500",
                inputWrapper: "bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
              }}
            />
          </div>

          {/* Campo Comentario */}
          <div className="relative group">
            <Input
              name="comentario"
              size="lg"
              placeholder="Algun comentario o consulta?"
              type="textarea"
              value={formData.comentario}
              onChange={handleChange}
              classNames={{
                input: "bg-white/90 text-gray-800 placeholder:text-gray-500 min-h-[120px]",
                inputWrapper: "bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01]",
              }}
            />
          </div>

          {/* Botón de envío */}
          <div className="w-full flex justify-center pt-6">
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Enviar mensaje</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              )}
            </Button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-xl border border-red-400/30 shadow-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}