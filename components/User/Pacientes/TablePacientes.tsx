import { Paciente } from "@/interface";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Props {
  filteredPacientes: Paciente[];
  className: string;
  onDeleteInit: (id: number) => void;
}

const TablePacientes = ({ filteredPacientes, className, onDeleteInit }: Props) => {

  const redirectToPaciente = (idPaciente: number) => {
    localStorage.setItem("idPaciente", String(idPaciente));
    window.location.href = "/user/pacientes/DetallePaciente";
  };
  return (
    <>
      {filteredPacientes.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table
              className={`max-w-screen-2xl mx-auto w-full pt-9 border-separate border-spacing-y-4 px-8 ${className}`}
            >
              <thead className="rounded-full">
                <tr className="bg-[#6265f4] dark:bg-primary text-primary-foreground dark:text-primary-foreground h-11">
                  <th className="rounded-tl-full text-xl font-normal py-3">○</th>
                  <th className="font-normal">Paciente</th>
                  <th className="font-normal">Código</th>
                  <th className="font-normal">DNI</th>
                  <th className="font-normal">Correo</th>
                  <th className="font-normal">Celular</th>
                  <th className="rounded-tr-full font-normal">Más</th>
                </tr>
              </thead>
              <tbody className="text-center bg-card dark:bg-card text-primary dark:text-primary-foreground font-normal text-[16px] leading-[20px]">
                {filteredPacientes.map((paciente) => (
                  <tr
                    key={paciente.idPaciente}
                    className="border-b hover:bg-muted dark:hover:bg-muted cursor-pointer"
                  >
                    <td
                      className="px-4 py-2 text-2xl rounded-l-[34px]"
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                    >
                      o
                    </td>
                    <td
                      className="px-2 py-2"
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                    >
                      {paciente.nombre}
                    </td>
                    <td
                      className="px-2 py-2"
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                    >
                      {paciente.codigo}
                    </td>
                    <td
                      className="px-2 py-2"
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                    >
                      {paciente.DNI}
                    </td>
                    <td
                      className="px-2 py-2"
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                    >
                      {paciente.email}
                    </td>
                    <td
                      className="py-2"
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                    >
                      {paciente.celular}
                    </td>
                    <td className="py-2 rounded-r-[34px]">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="flex flex-row items-center justify-center gap-x-4">
                          <Link
                            href="/user/pacientes/RegistroFamiliar"
                            className={cn("flex flex-col items-center")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="34px"
                              height="34px"
                              viewBox="0 0 28 25"
                              fill="none"
                              className="text-blue-400 dark:text-blue-400"
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
                            <h1 className="text-blue-400 dark:text-blue-400 font-light text-sm text-center">
                              Registro Familiar
                            </h1>
                          </Link>
                          <button
                            className="text-2xl"
                            onClick={() => redirectToPaciente(paciente.idPaciente)}
                          >
                            <Link
                              href={{
                                pathname: "/user/pacientes/DetallePaciente",
                              }}
                              className={cn("flex flex-col items-center")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="34px"
                                viewBox="0 -960 960 960"
                                width="34px"
                                fill="currentColor"
                                className="text-primary dark:text-primary-foreground"
                              >
                                <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                              </svg>
                              <h1 className="font-light text-sm text-center">
                                Editar
                              </h1>
                            </Link>
                          </button>
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => onDeleteInit(paciente.idPaciente)}
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
                              <h1 className="text-purple-500 dark:text-purple-400 font-light text-sm text-center">
                                Eliminar
                              </h1>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards View */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredPacientes.map((paciente) => (
                <div
                  key={paciente.idPaciente}
                  className="bg-white dark:bg-card rounded-lg shadow-md border border-gray-200 dark:border-border p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#6265f4] dark:bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">○</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-foreground">
                          {paciente.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground">
                          Código: {paciente.codigo}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">DNI:</span>
                      <span className="text-sm text-gray-900 dark:text-foreground">{paciente.DNI}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Email:</span>
                      <span className="text-sm text-gray-900 dark:text-foreground truncate max-w-[150px]">
                        {paciente.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Celular:</span>
                      <span className="text-sm text-gray-900 dark:text-foreground">{paciente.celular}</span>
                    </div>
                  </div>

                  <div className="flex justify-around gap-2 pt-4 border-t border-gray-200 dark:border-border">
                    <Link
                      href="/user/pacientes/RegistroFamiliar"
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
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
                      <span className="text-xs text-blue-400 mt-1">Familia</span>
                    </Link>

                    <button
                      onClick={() => redirectToPaciente(paciente.idPaciente)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="currentColor"
                        className="text-primary dark:text-primary-foreground"
                      >
                        <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                      </svg>
                      <span className="text-xs text-primary dark:text-primary-foreground mt-1">Editar</span>
                    </button>

                    <button
                      onClick={() => onDeleteInit(paciente.idPaciente)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#B158FF"
                      >
                        <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                      </svg>
                      <span className="text-xs text-purple-500 mt-1">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-border p-8 max-w-md w-full text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-primary dark:text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 dark:text-muted-foreground">
              No hay pacientes que coincidan con los filtros aplicados. Intenta
              ajustar tus criterios de búsqueda.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TablePacientes;
