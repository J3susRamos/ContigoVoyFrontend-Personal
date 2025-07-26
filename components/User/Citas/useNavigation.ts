import { useCallback } from 'react';

export const useNavigation = () => {
  const navigateToAtencion = useCallback( (idCita: number | string) => {
    // En un entorno real, usar Next.js router o React Router
    // Para este ejemplo mantenemos localStorage pero mejorado
    try {
      localStorage.setItem('idCita', String(idCita)); // Limpiar el idCita
      window.location.href = `/user/historial/AtencionPaciente`;
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  }, []);

  const navigateToPaciente = useCallback((idCita: number | string) => {
    // En un entorno real, usar Next.js router o React Router
    // Para este ejemplo mantenemos localStorage pero mejorado
    try {
      sessionStorage.setItem('idCita', String(idCita));
      window.location.href = `/user/pacientes/DatosCrearPaciente`;
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  }, []);

  return { navigateToAtencion, navigateToPaciente };

};