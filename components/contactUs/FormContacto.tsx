"use client";
import { Contact } from "@/interface";
import { Button, Input } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es requerido"),
  apellido: yup.string().required("El apellido es requerido"),
  celular: yup.string().required("El celular es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  comentario: yup.string().required("El comentario es requerido"),
});

export default function FormContacto() {
  const [action, setAction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Contact>({
    resolver: yupResolver(schema),
  });

  const formValues = watch();

  const onSubmit = async (data: Contact) => {
    setLoading(true);

    if (data.celular) {
      data.celular = String(data.celular);
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
        throw new Error(result.message || "Error al enviar el formulario");
      }

      setAction("¡Mensaje enviado! Nuestro equipo se pondrá en contacto contigo lo antes posible.");
      reset();

      setTimeout(() => {
        setAction(null);
      }, 6000);
    } catch (err: unknown) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto md:mr-10 relative z-0"
    >
      {/* Fondo con efecto glassmorphism y degradado más moderno */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-indigo-100/40 dark:from-purple-900/80 dark:via-indigo-900/70 dark:to-purple-800/80 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-purple-700/50 shadow-2xl md:shadow-3xl transition-colors duration-300"></div>

      <form
        className="relative z-10 px-4 sm:px-8 pt-8 pb-6 rounded-3xl md:px-16 md:py-12 lg:px-24 lg:py-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Header del formulario */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white dark:text-white mb-2" style={{textShadow: "2px 3px 8px rgba(0,0,0,0.5)"}}>
            Escríbenos
          </h3>
          <p className="text-white/90 dark:text-gray-200 text-sm md:text-base" style={{textShadow: "1px 2px 4px rgba(0,0,0,0.3)"}}>
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
        )}

        {/* Grid para campos en desktop, stack en móvil */}
        <div className="w-full relative grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
          {/* Columna izquierda: Nombre y Apellido */}
          <div className="space-y-5">            {/* Campo Nombre */}
            <div className="relative group">
              <Input
                size="lg"
                placeholder="Nombres"
                type="text"
                value={formValues?.nombre || ""}
                {...register("nombre")}
                startContent={
                  <div className="text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                }
                classNames={{
                  input: "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  inputWrapper: "bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
                }}
                isInvalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
              />
            </div>            {/* Campo Apellido */}
            <div className="relative group">
              <Input
                size="lg"
                placeholder="Apellidos"
                type="text"
                value={formValues?.apellido || ""}
                {...register("apellido")}
                startContent={
                  <div className="text-indigo-600 dark:text-indigo-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                }
                classNames={{
                  input: "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  inputWrapper: "bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
                }}
                isInvalid={!!errors.apellido}
                errorMessage={errors.apellido?.message}
              />
            </div>
          </div>
          {/* Columna derecha: Celular y Email */}
          <div className="space-y-5">            {/* Campo Celular */}
            <div className="relative group">
              <Input
                size="lg"
                placeholder="Celular"
                type="tel"
                value={formValues?.celular || ""}
                {...register("celular")}
                startContent={
                  <div className="text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                }
                classNames={{
                  input: "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  inputWrapper: "bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
                }}
                isInvalid={!!errors.celular}
                errorMessage={errors.celular?.message}
              />
            </div>            {/* Campo Email */}
            <div className="relative group">
              <Input
                size="lg"
                placeholder="Correo electrónico"
                type="email"
                value={formValues?.email || ""}
                {...register("email")}
                startContent={
                  <div className="text-red-500 dark:text-red-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                    </svg>
                  </div>
                }
                classNames={{
                  input: "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  inputWrapper: "bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]",
                }}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>
          </div>          {/* Campo Comentario: ocupa ambas columnas */}
          <div className="md:col-span-2">
            <div className="relative group">
              <textarea
                rows={5}
                placeholder="Cuéntanos tu situación o consulta..."
                value={formValues?.comentario || ""}
                {...register("comentario")}
                className="w-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 min-h-[120px] rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01] p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                disabled={loading}
              />
              {errors.comentario && (
                <span className="text-red-500 text-xs mt-1 block">{errors.comentario.message}</span>
              )}
            </div>
          </div>          {/* Botón de envío: ocupa ambas columnas */}
          <div className="md:col-span-2 w-full flex justify-center pt-6">
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-700 dark:to-indigo-800 dark:hover:from-purple-800 dark:hover:to-indigo-900 text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base md:text-lg lg:text-xl"
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
        </div>
      </form>
    </div>
  );
}