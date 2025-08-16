import { DatePaciente } from "../modalComponents/DatePaciente";


const PatientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
}> = ({ isOpen, onClose, pacienteId }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white  dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 dark:bg-gray-900 text-black dark:text-white">
          <DatePaciente idPaciente={Number(pacienteId)} />
        </div>
      </div>
    </div>
  );
};

export default PatientModal;