import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .nonempty({
      message: "El nombre es obligatorio",
    })
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El nombre no puede exceder los 50 caracteres",
    }),
  email: z
    .string()
    .nonempty({
      message: "El correo electrónico es obligatorio",
    })
    .email({
      message: "Formato de correo electrónico inválido",
    })
    .min(2, {
      message: "El correo electrónico debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El correo electrónico no puede exceder los 50 caracteres",
    }),
  password: z
    .string()
    .nonempty({
      message: "La contraseña es obligatoria",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    })
    .max(50, {
      message: "La contraseña no puede exceder los 50 caracteres",
    }),

  lastname: z
    .string()
    .nonempty({
      message: "El apellido es obligatorio",
    })
    .min(2, {
      message: "El apellido debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El apellido no puede exceder los 50 caracteres",
    }),
  phone: z
    .string()
    .nonempty({
      message: "El teléfono es obligatorio",
    })
    .min(2, {
      message: "El teléfono debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El teléfono no puede exceder los 50 caracteres",
    }),

  message: z
    .string()
    .nonempty({
      message: "El mensaje es obligatorio",
    })
    .min(2, {
      message: "El mensaje debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El mensaje no puede exceder los 50 caracteres",
    }),

  role: z
    .string()
    .nonempty({
      message: "El rol es obligatorio",
    })
    .min(2, {
      message: "El rol debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El rol no puede exceder los 50 caracteres",
    }),

  title: z
    .string()
    .nonempty({
      message: "El título es obligatorio",
    })
    .min(2, {
      message: "El título debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El título no puede exceder los 50 caracteres",
    }),

  description: z
    .string()
    .nonempty({
      message: "La descripción es obligatoria",
    })
    .min(2, {
      message: "La descripción debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "La descripción no puede exceder los 50 caracteres",
    }),
  photo: z
    .any()
    .refine((file: File | null) => file && file.size > 0, {
      message: "La foto es obligatoria",
    })
    .refine(
      (file: File | null) =>
        file && ["image/jpeg", "image/png"].includes(file.type),
      { message: "Solo se permiten archivos JPEG o PNG" }
    )
    .refine(
      (file: File | null) => file && file.size <= 5 * 1024 * 1024, // Máximo 5 MB
      { message: "La foto debe ser menor a 5MB" }
    ),
  specialty: z
    .string()
    .nonempty({
      message: "La especialidad es obligatoria",
    })
    .min(2, {
      message: "La especialidad debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "La especialidad no puede exceder los 50 caracteres",
    }),

  userSpecialty: z.string().nonempty({
    message: "La especialidad es obligatoria",
  }),
});

export const signInFormSchema = formSchema.pick({
  email: true,
});

export const contactoFormSchema = formSchema.pick({
  name: true,
  lastname: true,
  phone: true,
  email: true,
  message: true,
});

export const signUpFormSchema = formSchema.pick({
  name: true,
  lastname: true,
  email: true,
  password: true,
  role: true,
  photo: true,
  userSpecialty: true,
  phone: true,
  description: true,
});

export const serviceFormSchema = formSchema.pick({
  title: true,
  description: true,
  photo: true,
});

export const specialtyFormSchema = formSchema.pick({
  specialty: true,
});

export const taskSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  label: z.string(),
  role: z.string().optional(),
  photo: z.string(),
});

export type Task = z.infer<typeof taskSchema>;