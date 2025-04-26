import { DatosPacienteProps } from "@/interface";
import React from "react";

const CitasPaciente : React.FC<DatosPacienteProps> = () => {
  
  return (
    <div style={{ position: "relative", zIndex: 100, marginTop: "-160px" }}>
      <div className="flex gap-4 rounded-t-3xl bg-background p-6 mt-2">
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">0</div>
          <div className="text-lg font-light text-center pt-2">
            Citas reservadas
          </div>
        </div>
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">0</div>
          <div className="text-lg font-light text-center pt-2">
            Citas canceladas
          </div>
        </div>
      </div>
      <div className="flex gap-4 rounded-b-3xl bg-background p-6 ">
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">3</div>
          <div className="text-lg font-light text-center pt-2">
            Citas pasadas
          </div>
        </div>
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">0</div>
          <div className="text-lg font-light text-center pt-2">
            Citas ausencias
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitasPaciente;
