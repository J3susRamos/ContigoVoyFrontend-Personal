"use client";

import React from 'react';
import { HandCoins, ArrowUpCircle } from 'lucide-react';
import { ActionButton } from '@/components/ui/Table/ActionButton';
import { useNavigation } from './useNavigation';

interface CitaActionButtonsProps {
  idCita: number | string;
  showPacientButton?: boolean;
  estado: string;
}

export const CitaActionButtons: React.FC<CitaActionButtonsProps> = ({
  idCita,
  showPacientButton = false,
  estado,
}) => {
  const { navigateToAtencion, navigateToPaciente } = useNavigation();

  const handleAtencionClick = () => {
    navigateToAtencion(idCita);
  };

  const handlePacienteClick = () => {
    navigateToPaciente(idCita);
  };

  if (estado === 'Pendiente') {
    return (
      <ActionButton
        icon={HandCoins}
        label="Atención"
        onClick={handleAtencionClick}
      />
    );
  } else if (estado === 'Confirmada' && showPacientButton) {
    return (
      <ActionButton
        icon={ArrowUpCircle}
        label="Paciente"
        onClick={handlePacienteClick}
      />
    );
  }
};