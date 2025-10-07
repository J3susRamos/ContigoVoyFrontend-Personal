import React from "react";
import DataTable from "@/components/ui/Table/DataTable";
import DataCard from "@/components/ui/DataCard";
import Row from "@/components/ui/Table/Row";
import { PsicologoPreviewData } from "@/interface";

interface PsicologoTableProps {
  data: PsicologoPreviewData[];
  onEdit: (id: number) => void;
  onDisable: (id: number) => void;
  onDelete: (id: number) => void;
  llave?: boolean;
}

const headers = ["Apellido", "Nombre", "País", "Correo", "ID", "Más"];

const PsicologoTable: React.FC<PsicologoTableProps> = ({ data, onEdit, onDisable, onDelete, llave }) => {
  return (
    <DataTable
      headers={headers}
      data={data}
      renderRow={(psicologo) => (
        <Row
          values={[
            psicologo.apellido,
            psicologo.nombre,
            psicologo.pais,
            psicologo.correo,
            psicologo.idPsicologo.toString(),
          ]}
          onEdit={() => onEdit(psicologo.idPsicologo)}
          onDisable={() => onDisable(psicologo.idPsicologo)}
          onDelete={() => onDelete(psicologo.idPsicologo)}
          llave={llave}
        />
      )}
      renderCard={(psicologo) => (
        <DataCard
          paciente={{
            nombre: `Dr. ${psicologo.nombre} ${psicologo.apellido}`,
            codigo: `ID: ${psicologo.idPsicologo}`
          }}
          info={[
            { label: "País", value: psicologo.pais },
            { label: "Correo", value: psicologo.correo },
            { label: "Experiencia", value: `${psicologo.experiencia} años` },
            { label: "Especialidades", value: psicologo.especialidades?.slice(0, 2).join(", ") || "No especificadas" },
          ]}
          onEdit={() => onEdit(psicologo.idPsicologo)}
          onDisable={() => onDisable(psicologo.idPsicologo)}
          onDelete={() => onDelete(psicologo.idPsicologo)}
          llave={llave}
        />
      )}
    />
  );
};

export default PsicologoTable; 