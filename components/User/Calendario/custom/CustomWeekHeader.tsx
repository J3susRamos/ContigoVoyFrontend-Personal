import React from "react";

export default function CustomWeekHeader({ label }: { label: string }) {
  // Solo la las dos primeras letras

  const shortLabel = label.slice(0, 2).toUpperCase();
  return (
    <>
      <span className="block md:hidden">{shortLabel}</span>
      <span className="hidden md:block">{label}</span>
    </>
  );
}