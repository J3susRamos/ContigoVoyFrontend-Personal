"use client";
import { ListaAtencion } from "@/interface";
import ActionButton from "../buttons/ActionButton";
import HistorialCard from "../card/HistorialCard";

const CardsView: React.FC<{
  atencion: ListaAtencion[];
  onVerMas: (item: ListaAtencion) => void;
}> = ({ atencion, onVerMas }) => (
  <div className="w-full max-w-4xl mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      {atencion.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          style={{ color: "#634AE2" }}
        >
          <HistorialCard
            paciente={{
              nombre: item.nombre_completo,
              codigo: item.codigo,
            }}
            info={[
              {
                label: "Fecha de inicio",
                value: item.fecha_inicio + (item.hora_inicio ? ` ${item.hora_inicio}` : "")
              },
              { label: "Diagnóstico", value: item.diagnostico },
            ]}
          >
            <ActionButton item={item} onClick={() => onVerMas(item)} />
          </HistorialCard>
        </div>
      ))}
    </div>
  </div>
);

export default CardsView;