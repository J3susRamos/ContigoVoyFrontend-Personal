interface ConfirmDisableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  message: string;
}

const ConfirmDisableModal: React.FC<ConfirmDisableModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">Confirmar acción</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} disabled={isProcessing}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? "Procesando..." : "Deshabilitar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDisableModal;