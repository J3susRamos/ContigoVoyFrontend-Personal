import React from "react";

export default function CustomMonthHeader({ label }: {
  label: string
}) {

  const initialLabel = label[0].toUpperCase();
  return (
    <>
      <span className="block md:hidden">{initialLabel}</span>
      <span className="hidden md:block">{label}</span>
    </>
  );
}