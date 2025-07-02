import { Icons } from "@/icons";
import { FormFamilia } from "@/interface";
import { parseCookies } from "nookies";
import React, { useCallback, useEffect, useState }  from "react";
import HeaderUser from "../HeaderUser";

const RegistroFamiliar = ({ id }: { id: string | null }) => {
const [formData, setFormData] = useState<FormFamilia>({
        nombre_madre: "",
        estado_madre: "",
        nombre_padre: "",
        estado_padre: "",
        nombre_apoderado: "",
        estado_apoderado: "",
        cantidad_hijos: "",
        cantidad_hermanos: "",
        integracion_familiar: "",
        historial_familiar: "",
        paciente: {
            idPaciente: "",
            nombre: "",
            apellido: "",
            codigo: "",
        } 
 });

  const handleGetFamilia = useCallback(async () => {
    try{
        const cookies = parseCookies();
        const token = cookies["session"];
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const urlApi = `${apiUrl}api/registros/${id}`;
        const response = await fetch(urlApi, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });
        const data = await response.json();
        
        if (data && data.result){
            setFormData({
                nombre_madre: data.result.nombre_madre || "",
                estado_madre: data.result.estado_madre || "",
                nombre_padre: data.result.nombre_padre || "",
                estado_padre: data.result.estado_padre || "",
                nombre_apoderado: data.result.nombre_apoderado || "",
                estado_apoderado: data.result.estado_apoderado || "",
                cantidad_hijos: data.result.cantidad_hijos || "",
                cantidad_hermanos: data.result.cantidad_hermanos || "",
                integracion_familiar: data.result.integracion_familiar || "",
                historial_familiar: data.result.historial_familiar || "",
                paciente: {
                    nombre: data.result.paciente.nombre || "",
                    codigo: data.result.paciente.codigo || "",
                    apellido: data.result.paciente.apellido || "",
                    idPaciente: data.result.paciente.idPaciente || ""
                }
         })
        }
    } catch (error) {
        console.error("Error al obtener a los familiares:", error)
    }
   
  }, [id]);

  useEffect(() => {
    if (id) {
      handleGetFamilia();
    }
  }, [id, handleGetFamilia]);

  return (
    <div className="p-4 dark:bg-[#2e3033] h-[100vh]">
      {/* Header */}
      <HeaderUser title="Registro Familiar"/>
      <div className="flex mt-4 text-[#634AE2] font-bold text-normal dark:text-white ">
        <div className="flex-1 ml-5 mr-5 bg-[#fff] dark:bg-[#272726] rounded-2xl p-4">
          <div className="flex pt-6">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Codigo del Paciente*</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.paciente?.codigo}
                  disabled
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
                />
                <span
                  className="text-[#634AE2] transition-colors absolute right-3 top-1/2 transform -translate-y-1/2"
                  dangerouslySetInnerHTML={{
                    __html: Icons.loup.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Nombre del Paciente</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.paciente?.nombre + " " + formData.paciente?.apellido}
                  disabled
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
                />
                <span
                  className="text-[#634AE2] transition-colors absolute right-3 top-1/2 transform -translate-y-1/2"
                  dangerouslySetInnerHTML={{
                    __html: Icons.loup.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Nombre de la madre
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.nombre_madre}
              onChange={(e) =>
                setFormData({ ...formData, nombre_madre: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Estado de la madre
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.estado_madre}
              onChange={(e) =>
                setFormData({ ...formData, estado_madre: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Nombre del padre
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.nombre_padre}
              onChange={(e) =>
                setFormData({ ...formData, nombre_padre: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Estado del padre
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.estado_padre}
              onChange={(e) =>
                setFormData({ ...formData, estado_padre: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
            />
          </div>
        </div>
        {/*Segunda Columna*/}
        <div className="flex-1 mr-5 ml-5 bg-[#fff] dark:bg-[#272726] rounded-2xl p-6">
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Nombre del apoderado
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.nombre_apoderado}
              onChange={(e) =>
                setFormData({ ...formData, nombre_apoderado: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Estado del apoderado
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={formData.estado_apoderado}
              onChange={(e) =>
                setFormData({ ...formData, estado_apoderado: e.target.value })
              }
              className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-11/12 rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
            />
          </div>
          <div className="flex pt-1">
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Cantidad de hijos</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.cantidad_hijos}
                  onChange={(e) =>
                    setFormData({ ...formData, cantidad_hijos: e.target.value })
                  }
                  className="pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] placeholder:text-base placeholder:font-normal bg-[#F3F3F3] dark:bg-[#1e1e23]"
                />
              </div>
            </div>
            <div className="flex-1 items-center justify-items-center">
              <div className="py-1 mt-2">Cantidad de hermanos</div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.cantidad_hermanos}
                  onChange={(e) =>
                    setFormData({ ...formData, cantidad_hermanos: e.target.value })
                  }
                  className="placeholder:text-base placeholder:font-normal pl-12 pr-3 text-sm h-9 mt-2 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23]"
                />
              </div>
            </div>
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Integracion familiar
          </div>
          <div className="flex justify-center">
            <textarea
              placeholder="Integracion familiar"
              value={formData.integracion_familiar}
              onChange={(e) =>
                setFormData({ ...formData, integracion_familiar: e.target.value })
              }
              className="bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-white w-11/12 h-20 border-1 font-light text-[#634AE2] p-3 rounded-3xl placeholder:text-[#634AE2] text-base"
            />
          </div>
          <div className="text-center pt-1 pb-1 py-1 mt-4">
            Historial familiar
          </div>
          <div className="flex justify-center">
            <textarea
              placeholder="Historial familiar"
              value={formData.historial_familiar}
              onChange={(e) =>
                setFormData({ ...formData, historial_familiar: e.target.value })
              }
              className="bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-white w-11/12 h-20 border-1 font-light text-[#634AE2] p-3 rounded-3xl placeholder:text-[#634AE2] text-base"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full p-4 ">
        <button className="text-[#634AE2] bg-[#fff] dark:bg-[#1e1e23] rounded-full border-2 border-[#634AE2] dark:border-white dark:text-white w-28 h-8 mr-12">
          Registrar
        </button>
      </div>
    </div>
  );
};

export default RegistroFamiliar;
