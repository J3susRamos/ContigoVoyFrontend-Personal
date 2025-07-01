"use client";
import React from "react";
import {Citas} from "@/interface";
import DataTable from "@/components/ui/Table/DataTable";
import {Icons} from "@/icons";
import Row from "@/components/ui/Table/Row";
import DataCard from "@/components/ui/DataCard";

interface TableProps {
    filteredCitas: Citas[];
    onDeleteInitAction: (id: number) => void; // Renamed to end with "Action"
}

export const TableCitas: React.FC<TableProps> = ({
                                                     filteredCitas,
                                                     onDeleteInitAction, // Updated parameter name
                                                 }) => {
    const headers = [
        "Paciente",
        "Código",
        "Motivo",
        "Estado",
        "Fecha de Inicio",
        "Duración",
        "Más",
    ];



    return (
        <DataTable
            headers={headers}
            data={filteredCitas}
            renderRow={(c) => (
                <Row
                    values={[
                    c.paciente,
                    c.codigo,
                    c.motivo,
            c.estado,
            c.fecha_inicio,
            c.duracion,
          ]}
          onDelete={() => onDeleteInit(Number(c.idCita))}
        >
         <AtencionButton idCita={Number(c.idCita)}/>
        </Row>
      )}
      renderCard={(c) => (
        <DataCard
          paciente={{ nombre: c.paciente, codigo: c.codigo }}
          info={[
                    { label: "Estado", value: c.estado },
            { label: "Motivo", value: c.motivo },
            {
              label: "Fecha",
              value: new Date(c.fecha_inicio).toLocaleDateString(),
            },
            {
              label: "Hora",
                    value: new Date(c.fecha_inicio).toLocaleTimeString(),
                    },
            { label: "Duración", value: c.duracion },
          ]}
        >
          <AtencionButton idCita={Number(c.idCita)}/>
                    </DataCard>
                        )}
                            />
  );
};



                {/* Eliminar */}
                <button
                  onClick={() => onDeleteInit(Number(cita.idCita))}
                  className="flex flex-col items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="34px"
                    fill="#B158FF"
                    className="text-purple-500 dark:text-purple-400"
                  >
                    <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                  </svg>
                  <span className="text-purple-500 dark:text-purple-400 font-light text-sm">
                    Eliminar
                  </span>
                </button>
                <AtencionButton idCita={Number(cita.idCita)} />
};
