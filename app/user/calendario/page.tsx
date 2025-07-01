"use client";

import CalendarioMain from "@/components/User/Calendario/CalendarioMain";
import { useCitas } from "@/components/User/Calendario/hooks/useCitas";

export default function Calendario() {
  const { citas, error, isLoading, isAuthorized } = useCitas();

  if (isAuthorized === null || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Cargando citas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-destructive dark:text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <CalendarioMain citas={citas} />
  );
}