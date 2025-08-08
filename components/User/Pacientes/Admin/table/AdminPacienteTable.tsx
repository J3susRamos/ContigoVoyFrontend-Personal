import React from "react";
import DataTable from "@/components/ui/Table/DataTable";
import DataCard from "@/components/ui/DataCard";
import Row from "@/components/ui/Table/Row";
import { PacienteDisabled } from "@/interface";

interface AdminPacienteTableProps {
  data: PacienteDisabled[];
  onDisable: (id: number) => void;
}

const headers = ["Nombre", "Celular", "Género", "Correo", "ID", "Más"];

const AdminPacienteTable: React.FC<AdminPacienteTableProps> = ({ data, onDisable }) => {
  return (
    <DataTable
      headers={headers}
      data={data}
      renderRow={(paciente) => (
        <Row
          values={[
            paciente.nombre,
            paciente.celular,
            paciente.genero,
            paciente.email,
            paciente.idPaciente.toString(),
          ]}
          onDisable={() => onDisable(paciente.idPaciente)}
          llave={true}
        />
      )}
      renderCard={(paciente) => (
        <DataCard
          paciente={{
            nombre: `Sr. ${paciente.nombre}`,
            codigo: `ID: ${paciente.idPaciente}`
          }}
          info={[
            { label: "DNI", value: paciente.DNI },
            { label: "Correo", value: paciente.email },
            { label: "Email", value: paciente.email },
            { label: "Celular", value: paciente.celular },
          ]}
          onDisable={() => onDisable(paciente.idPaciente)}
          llave={true}
        />
      )}
    />
  );
};

export default AdminPacienteTable;