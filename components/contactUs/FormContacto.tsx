"use client";
import { Contact } from "@/interface";
import { Button, Form, Input } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  apellido: yup.string().required("El apellido es obligatorio"),
  celular: yup.string().required("El celular es obligatorio"),
  email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
  comentario: yup.string().required("El comentario es obligatorio"),
});

export default function FormContacto() {
  const [action, setAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Contact>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: Contact) => {
    setError(null);
    setLoading(true);
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
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Error al enviar el formulario");
        setLoading(false);
        return;
      }
      setAction("¡Mensaje enviado! Nuestro equipo se pondrá en contacto contigo lo antes posible.");
      reset();
      setTimeout(() => setAction(null), 6000);
    } catch {
      setError("No se pudo enviar el formulario.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Form
          className="w-full max-w-scv12 sm:max-w-scv13 bg-[#B8B8FF] opacity-75 rounded-2xl px-scv4 pt-scv6 pb-scv4 md:mr-10  relative z-0"
          validationBehavior="native"
          onSubmit={handleSubmit(onSubmit)}
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
              {...register("nombre")}
              isRequired
              size="lg"
              name="nombre"
              placeholder="Nombres"
              type="text"
          />
          {errors.nombre && <span className="text-red-500">"el nombre debe ser caracteres"</span>}

          <Input
              {...register("apellido")}
              isRequired
              size="lg"
              name="apellido"
              placeholder="Apellidos"
              type="text"
          />
          {errors.apellido && <span className="text-red-500">{errors.apellido.message}</span>}

          <Input
              {...register("celular")}
              isRequired
              size="lg"
              name="celular"
              placeholder="Celular"
              type="tel"
          />
          {errors.celular && <span className="text-red-500">{errors.celular.message}</span>}

          <Input
              {...register("email")}
              isRequired
              size="lg"
              name="email"
              placeholder="Correo"
              type="email"
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}

          <Input
              {...register("comentario")}
              name="comentario"
              size="lg"
              placeholder="Comentario"
              type="textarea"
          />
          {errors.comentario && <span className="text-red-500">{errors.comentario.message}</span>}

          <div className="w-full flex justify-center pt-4">
            <Button
                style={{ backgroundColor: "#634AE3", color: "white", borderRadius: "28PX", fontWeight: "700" }}
                className="py-[8px] px-[36px] sm:px-[54px] sm:text-cv4"
                type="submit"
                disabled={loading || isSubmitting}
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </div>

          {error && <div className="text-red-500">{error}</div>}
        </div>
      </Form>
  );
}