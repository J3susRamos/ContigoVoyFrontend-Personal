import { useState, useEffect, useCallback } from 'react';
import { Citas } from '@/interface';
import { CalendarClickEvent } from '../types/calendar.types';

export function useCalendarModal() {
  const [selectedCita, setSelectedCita] = useState<Citas | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((cita: Citas) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCita(null);
  }, []);

  const handleEventClick = useCallback((event: CalendarClickEvent) => {
    openModal(event.resource);
  }, [openModal]);

  // Manejar cierre del modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, closeModal]);

  return {
    selectedCita,
    isModalOpen,
    handleEventClick,
    closeModal,
  };
}