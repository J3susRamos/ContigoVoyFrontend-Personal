import { Citas } from "@/interface";
import dayjs from "dayjs";
import { Clock, MapPin, User, X } from "lucide-react";

function CalendarModal({
  cita,
  isOpen,
  onClose
}: {
  cita: Citas | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !cita) return null;

  const fechaInicio = dayjs(cita.fecha_inicio);
  const duracion = Number(cita.duracion) || 60;
  const fechaFin = fechaInicio.add(duracion, "minute");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detalles de la Cita
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-4">
          {/* Información del paciente */}
          <div className="flex items-center space-x-3">
            <User className="text-blue-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Paciente</p>
              <p className="font-medium text-gray-900 dark:text-white">{cita.paciente}</p>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="flex items-center space-x-3">
            <Clock className="text-green-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fecha y hora</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {fechaInicio.format('dddd, DD [de] MMMM [de] YYYY')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {fechaInicio.format('HH:mm')} - {fechaFin.format('HH:mm')}
                <span className="ml-1">({duracion} min)</span>
              </p>
            </div>
          </div>

          {/* Dirección (si existe) */}
          {cita.genero && (
            <div className="flex items-center space-x-3">
              <MapPin className="text-orange-500" size={20} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Genero</p>
                <p className="font-medium text-gray-900 dark:text-white">{cita.genero}</p>
              </div>
            </div>
          )}


          {/* Notas (si existen) */}
          {cita.motivo && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Motivo</p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-gray-900 dark:text-white text-sm">{cita.motivo}</p>
              </div>
            </div>
          )}

          {/* Estado de la cita (si existe) */}
          {cita.estado && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${cita.estado === 'confirmada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    cita.estado === 'cancelada' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Footer del modal */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;