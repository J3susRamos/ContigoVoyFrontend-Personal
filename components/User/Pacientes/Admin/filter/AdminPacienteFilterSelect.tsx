import React, { useEffect, useState } from "react";
import { GetPsicologos } from "@/app/apiRoutes";
import { PsicologoPreviewData } from "@/interface";

interface AdminPacienteFilterSelectProps {
  selectedPsicologoId: number | null;
  onPsicologoChange: (psicologoId: number | null) => void;
}

const AdminPacienteFilterSelect: React.FC<AdminPacienteFilterSelectProps> = ({ 
  selectedPsicologoId, 
  onPsicologoChange 
}) => {
  const [psicologos, setPsicologos] = useState<PsicologoPreviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPsicologos = async () => {
      try {
        setLoading(true);
        const response = await GetPsicologos();
        if (response.status_message === "OK" && response.result?.data) {
          setPsicologos(response.result.data);
        }
      } catch (error) {
        console.error("Error al obtener psicólogos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPsicologos();
  }, []);

  const handlePsicologoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      onPsicologoChange(null);
    } else {
      onPsicologoChange(parseInt(value, 10));
    }
  };

  if (loading) {
    return (
      <select
        className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-200 backdrop-blur-sm"
        disabled
      >
        <option>Cargando psicólogos...</option>
      </select>
    );
  }

  return (
    <select
      className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-200 backdrop-blur-sm"
      value={selectedPsicologoId || ""}
      onChange={handlePsicologoChange}
    >
      <option value="" className="bg-white text-gray-800 font-medium">
        Seleccionar psicólogo
      </option>
      {psicologos.map((psicologo) => (
        <option 
          key={psicologo.idPsicologo} 
          value={psicologo.idPsicologo} 
          className="bg-white text-gray-800 font-medium"
        >
          {psicologo.nombre} {psicologo.apellido}
        </option>
      ))}
    </select>
  );
};

export default AdminPacienteFilterSelect;