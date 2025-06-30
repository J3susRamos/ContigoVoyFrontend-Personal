import React from "react";

export default function CustomDayHeader({ date }: { date: Date }) {
  return (
    <div className="text-center text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-primary px-2">
      <span className="block md:hidden">
        {date.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
      <span className="hidden md:block">
        {date.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  );
}