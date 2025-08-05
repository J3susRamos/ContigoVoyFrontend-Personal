export type UserRole = "ADMIN" | "PSICOLOGO" | "USER";
export type ViewKey = "clientes" | "citas" | "ventas" | "rendimiento";

export interface ButtonConfig {
  name: string;
  key: ViewKey;
  icon?: string;
}

export interface User {
  rol: UserRole;
}

export interface SectionProps {
  dateRange: [Date | null, Date | null];
}

export const BUTTON_CONFIGS: ButtonConfig[] = [
  { name: "Clientes", key: "clientes" },
  { name: "Citas", key: "citas" },
  { name: "Ventas", key: "ventas" },
  { name: "Rendimiento", key: "rendimiento" },
];

export const ROLE_PERMISSIONS: Record<UserRole, ViewKey[]> = {
  ADMIN: ["clientes", "citas", "ventas", "rendimiento"],
  PSICOLOGO: ["clientes", "citas", "ventas"],
  USER: ["clientes"],
};