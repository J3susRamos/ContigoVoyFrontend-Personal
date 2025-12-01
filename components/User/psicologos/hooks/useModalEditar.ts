import { GetPsicologosById, UpdatePsicologo } from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";
import { PsicologoPreviewData } from "@/interface";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { ChangeEvent, useState } from "react";

export const useModalEditar = (refreshData: () => void) => {
  const [formData, setFormData] = useState<PsicologoPreviewData | null>(null);


  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const webpImage = await convertImageToWebP(file);
    const base64 = await convertToBase64(webpImage);
    setFormData((prev) => (prev ? { ...prev, imagen: base64 } : null));
  };

  const handleChanges = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null ));
  };

  const handlePaisChange = (pais: string) => {
    setFormData((prev) => (prev ? { ...prev, pais } : null));
  };

  const handleEspecialidadesChange = (especialidades: string[]) => {
    setFormData((prev) => (prev ? { ...prev, especialidades } : null));
  };

  const handleUpdate = async (id: number | null) => {
    if (!formData) {
      console.error("Error: formData es null");
      return;
    }
    try {
      await UpdatePsicologo(id, formData);
      showToast("success", "El psicólogo se actualizó correctamente");
      await refreshData();
      return true; // Para indicar que se cerró el modal
    } catch (error) {
      console.error("Error al actualizar el psicólogo:", error);
      return false;
    }
  };

  const handleEdit = async (id: number | null) => {
    try {
      const Data = await GetPsicologosById(id);
      if (Data.status_code !== 200) {
        showToast(Data.status_code.toString(), `Error: ${Data.status_message}`);
        return;
      }
      setFormData(Data.result);
    } catch (error) {
      showToast("error", "Error al obtener los datos del psicólogo.");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData(null);
  };

  return {
    formData,
    handleImageUpload,
    handleChanges,
    handlePaisChange,
    handleEspecialidadesChange,
    handleUpdate,
    handleEdit,
    resetForm,
  };
}; 