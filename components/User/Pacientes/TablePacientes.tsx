import DataCard from "@/components/ui/DataCard";
import DataTable from "@/components/ui/Table/DataTable";
import Row from "@/components/ui/Table/Row";
import { Paciente } from "@/interface";
import React from "react";

interface Props {
  filteredPacientes: Paciente[];
  onDeleteInit: (id: number) => void;
}

const headers = ["Paciente", "Código", "DNI", "Correo", "Celular", "Más"];

const TablePacientes = ({ filteredPacientes, onDeleteInit }: Props) => {

  const redirectToPaciente = (idPaciente: number) => {
    localStorage.setItem("idPaciente", String(idPaciente));
    window.location.href = "/user/pacientes/DetallePaciente";
  };

  const redirectToEdit = (idPaciente: number) => {
    localStorage.setItem("idPaciente", String(idPaciente));
    window.location.href = "/user/pacientes/DetallePaciente";
  };
  
  return (
    <DataTable
      headers={headers}
      data={filteredPacientes}
      renderRow={(p) => (
        <Row
          values={[p.nombre, p.codigo, p.DNI, p.email, p.celular]}
          onClick={() => redirectToPaciente(p.idPaciente)}
          onDelete={() => onDeleteInit(p.idPaciente)}
          onEdit={() => redirectToEdit(p.idPaciente)}
        >
          <FamiliaButton idPaciente={p.idPaciente}/>
        </Row>
      )}
      renderCard={(p) => (
        <DataCard
          paciente={{ nombre: p.nombre, codigo: p.codigo }}
          info={[
            { label: "DNI", value: p.DNI },
            { label: "Correo", value: p.email },
            { label: "Celular", value: p.celular },
          ]}
          onClick={() => redirectToPaciente(p.idPaciente)}
          onDelete={() => onDeleteInit(p.idPaciente)}
          onEdit={() => redirectToPaciente(p.idPaciente)}
        >
          <FamiliaButton idPaciente={p.idPaciente}/>
        </DataCard>
      )}
    />
  );
};

export default TablePacientes;

export const FamiliaButton = ({ idPaciente }: { idPaciente: number}) => {

  const redirectToFamily = (idPaciente: number) => {
    localStorage.setItem("idPaciente", String(idPaciente));
    window.location.href = `/user/pacientes/RegistroFamiliar?id=${idPaciente}`;
  }

  return (
    <button
      onClick={() => redirectToFamily(idPaciente)}
      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30px"
        height="30px"
        viewBox="0 0 28 25"
        fill="none"
        className="text-blue-400"
      >
        <path
          d="M9.60884 19.2184C9.60884 19.2184 8.23615 19.2184 8.23615 17.8457C8.23615 16.473 9.60884 12.3549 15.0996 12.3549C20.5904 12.3549 21.9631 16.473 21.9631 17.8457C21.9631 19.2184 20.5904 19.2184 20.5904 19.2184H9.60884ZM15.0996 10.9822C16.1918 10.9822 17.2392 10.5484 18.0115 9.77609C18.7838 9.0038 19.2177 7.95635 19.2177 6.86417C19.2177 5.77199 18.7838 4.72454 18.0115 3.95225C17.2392 3.17996 16.1918 2.74609 15.0996 2.74609C14.0074 2.74609 12.96 3.17996 12.1877 3.95225C11.4154 4.72454 10.9815 5.77199 10.9815 6.86417C10.9815 7.95635 11.4154 9.0038 12.1877 9.77609C12.96 10.5484 14.0074 10.9822 15.0996 10.9822ZM7.15996 19.2184C6.95656 18.7898 6.85508 18.32 6.86346 17.8457C6.86346 15.9857 7.79689 14.0708 9.52099 12.7393C8.66056 12.4736 7.76391 12.3439 6.86346 12.3549C1.37269 12.3549 0 16.473 0 17.8457C0 19.2184 1.37269 19.2184 1.37269 19.2184H7.15996ZM6.17711 10.9822C7.08727 10.9822 7.96014 10.6207 8.60371 9.97712C9.24729 9.33354 9.60884 8.46067 9.60884 7.55052C9.60884 6.64036 9.24729 5.76749 8.60371 5.12392C7.96014 4.48034 7.08727 4.11879 6.17711 4.11879C5.26696 4.11879 4.39409 4.48034 3.75051 5.12392C3.10694 5.76749 2.74538 6.64036 2.74538 7.55052C2.74538 8.46067 3.10694 9.33354 3.75051 9.97712C4.39409 10.6207 5.26696 10.9822 6.17711 10.9822Z"
          fill="#58A6FF"
        />
        <path
          d="M16.1973 19.2986V20.2986H17.1973H19.6586V22.6897V23.6897H20.6586H22.5035H23.5035V22.6897V20.2986H26.0001H27.0001V19.2986V17.7172V16.7172H26.0001H23.5035V14.2031V13.2031H22.5035H20.6586H19.6586V14.2031V16.7172H17.1973H16.1973V17.7172V19.2986Z"
          fill="white"
          stroke="#58A6FF"
        />
      </svg>
      <span className="text-xs text-blue-400 mt-1">Registro Familiar</span>
    </button>
  );
};
