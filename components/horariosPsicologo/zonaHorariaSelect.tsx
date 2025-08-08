import React from "react";

const zonasHorarias = [
  { nombre: "Perú", zona: "America/Lima" },
  { nombre: "Argentina", zona: "America/Buenos_Aires" },
  { nombre: "Bolivia", zona: "America/La_Paz" },
  { nombre: "Chile", zona: "America/Santiago" },
  { nombre: "Colombia", zona: "America/Bogota" },
  { nombre: "Costa Rica", zona: "America/Costa_Rica" },
  { nombre: "Ecuador", zona: "America/Guayaquil" },
  { nombre: "México (CDMX)", zona: "America/Mexico_City" },
  { nombre: "Paraguay", zona: "America/Asuncion" },
  { nombre: "Uruguay", zona: "America/Montevideo" },
  { nombre: "Venezuela", zona: "America/Caracas" },
  { nombre: "España (Península)", zona: "Europe/Madrid" },
  { nombre: "España (Islas Canarias)", zona: "Atlantic/Canary" },
  { nombre: "EE.UU. - Este (Miami, NY)", zona: "America/New_York" },
  { nombre: "EE.UU. - Centro (Texas, Chicago)", zona: "America/Chicago" },
  { nombre: "EE.UU. - Montaña (Denver, NM)", zona: "America/Denver" },
  { nombre: "EE.UU. - Pacífico (California)", zona: "America/Los_Angeles" },
];

const obtenerOffset = (zona: string) => {
  const ahora = new Date();
  const formato = new Intl.DateTimeFormat("en-US", {
    timeZone: zona,
    timeZoneName: "shortOffset",
  }).formatToParts(ahora);

  const offsetPart = formato.find((part) => part.type === "timeZoneName");
  return offsetPart ? offsetPart.value.replace("GMT", "") : "";
};

interface ZonaHorariaSelectProps {
  onChange: (zona: string) => void;
}

const ZonaHorariaSelect: React.FC<ZonaHorariaSelectProps> = ({ onChange }) => {
  return (
    <div className="relative inline-block">
      <select
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full p-2 pr-9 text-center rounded-full text-base font-bold
             bg-[#EAEAFF] text-[#634AE2] 
             dark:bg-[#2A2A38] dark:text-[#634AE2]  
             border border-transparent dark:border-[#444] 
             appearance-none transition-colors duration-300
             focus:outline-none focus:border-[#634AE2] dark:focus:border-[#634AE2] ">
        {zonasHorarias.map((z) => (
          <option key={z.zona} value={z.zona}>
            {`(${obtenerOffset(z.zona)}:00) ${z.zona}`}
          </option>
        ))}
      </select>

      {/* Flecha */}
      <svg
        className="absolute right-4 transform -translate-y-7 pointer-events-none 
             text-[#634AE2] dark:text-[#634AE2]"
        aria-hidden="true"
        focusable="false"
        height="16"
        width="16"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
};

export default ZonaHorariaSelect;
