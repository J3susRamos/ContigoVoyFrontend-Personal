import { useState, useEffect, useCallback, useRef } from "react";
import { BlogPreviewData } from "@/interface";

export const useImageCarousel = (selectedBlog: BlogPreviewData | null) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  // Refs para cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const keyboardListenerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  // Reset states cuando cambia el blog (solo si el blog es nullable)
  useEffect(() => {
    if (selectedBlog === null) {
      setCurrentImageIndex(0);
      setModalImageIndex(0);
      setShowImageModal(false);
      setIsCarouselPlaying(true);
    }
  }, [selectedBlog?.idBlog, selectedBlog]);

  // Carousel auto-play effect con cleanup mejorado
  useEffect(() => {
    if (!selectedBlog?.imagenes || selectedBlog.imagenes.length <= 1 || !isCarouselPlaying || showImageModal) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedBlog?.imagenes, isCarouselPlaying, showImageModal, selectedBlog?.idBlog]);

  // Keyboard event listener con cleanup mejorado
  useEffect(() => {
    if (!showImageModal) {
      if (keyboardListenerRef.current) {
        window.removeEventListener('keydown', keyboardListenerRef.current);
        keyboardListenerRef.current = null;
      }
      return;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
        setIsCarouselPlaying(true);
      } else if (e.key === 'ArrowLeft' && selectedBlog?.imagenes) {
        setModalImageIndex((prev) => 
          prev === 0 ? selectedBlog.imagenes!.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight' && selectedBlog?.imagenes) {
        setModalImageIndex((prev) => 
          prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
        );
      }
    };

    keyboardListenerRef.current = handleKeyPress;
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      if (keyboardListenerRef.current) {
        window.removeEventListener('keydown', keyboardListenerRef.current);
        keyboardListenerRef.current = null;
      }
    };
  }, [showImageModal, selectedBlog?.imagenes]);

  // Cleanup general al desmontar componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (keyboardListenerRef.current) {
        window.removeEventListener('keydown', keyboardListenerRef.current);
      }
    };
  }, []);

  const nextImage = useCallback(() => {
    if (!selectedBlog?.imagenes) return;
    setCurrentImageIndex((prev) => 
      prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
    );
  }, [selectedBlog?.imagenes]);

  const prevImage = useCallback(() => {
    if (!selectedBlog?.imagenes) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedBlog.imagenes!.length - 1 : prev - 1
    );
  }, [selectedBlog?.imagenes]);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const toggleCarousel = useCallback(() => {
    setIsCarouselPlaying(!isCarouselPlaying);
  }, [isCarouselPlaying]);

  const openImageModal = useCallback((index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
    setIsCarouselPlaying(false);
  }, []);

  const closeImageModal = useCallback(() => {
    setShowImageModal(false);
    setIsCarouselPlaying(true);
  }, []);

  const nextModalImage = useCallback(() => {
    if (!selectedBlog?.imagenes) return;
    setModalImageIndex((prev) => 
      prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
    );
  }, [selectedBlog?.imagenes]);

  const prevModalImage = useCallback(() => {
    if (!selectedBlog?.imagenes) return;
    setModalImageIndex((prev) => 
      prev === 0 ? selectedBlog.imagenes!.length - 1 : prev - 1
    );
  }, [selectedBlog?.imagenes]);

  return {
    currentImageIndex,
    isCarouselPlaying,
    showImageModal,
    modalImageIndex,
    nextImage,
    prevImage,
    goToImage,
    toggleCarousel,
    openImageModal,
    closeImageModal,
    nextModalImage,
    prevModalImage,
    setModalImageIndex
  };
}; 