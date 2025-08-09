"use client";
import { ListaAtencion } from "@/interface";

const ButtonVerMas: React.FC<{
  item: ListaAtencion;
  onClick: () => void;
}> = ({ item, onClick }) => (
  <button
    className={`
      h-10 px-6 rounded-full font-medium text-sm transition-all duration-200 
      ${!item.idPaciente
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#7367F0] text-white hover:bg-[#634AE2] hover:shadow-lg transform hover:scale-105 active:scale-95"
      }
    `}
    onClick={onClick}
    disabled={!item.idPaciente}
  >
    Ver más
  </button>
);

export default ButtonVerMas;