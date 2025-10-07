"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ModalEliminarPsicologoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

const ModalEliminarPsicologo: React.FC<ModalEliminarPsicologoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-gray-800">
            Confirmar eliminación
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-gray-600 mt-2">
          ¿Estás seguro de que deseas eliminar a este psicólogo? Esta acción no se puede deshacer.
        </p>

        <DialogFooter className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEliminarPsicologo;
