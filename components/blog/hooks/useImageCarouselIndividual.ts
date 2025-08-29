import { useState, useEffect, useCallback, useRef } from "react";
import { BlogPreviewData } from "@/interface";

export const useImageCarouselIndividual = (blog: BlogPreviewData) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  // Refs para cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const keyboardListenerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  // Obtener imágenes válidas
  const validImages = blog.imagenes?.filter(img => img && img.trim() !== '') || [];
  const hasValidImages = validImages.length > 0;

  // Carousel auto-play effect con cleanup mejorado
  useEffect(() => {
    if (!hasValidImages || validImages.length <= 1 || !isCarouselPlaying || showImageModal) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === validImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasValidImages, validImages.length, isCarouselPlaying, showImageModal, blog.idBlog]);

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
      } else if (e.key === 'ArrowLeft' && hasValidImages) {
        setModalImageIndex((prev) => 
          prev === 0 ? validImages.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight' && hasValidImages) {
        setModalImageIndex((prev) => 
          prev === validImages.length - 1 ? 0 : prev + 1
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
  }, [showImageModal, hasValidImages, validImages.length]);

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
    if (!hasValidImages) return;
    setCurrentImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }, [hasValidImages, validImages.length]);

  const prevImage = useCallback(() => {
    if (!hasValidImages) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [hasValidImages, validImages.length]);

  const goToImage = useCallback((index: number) => {
    if (hasValidImages && index >= 0 && index < validImages.length) {
      setCurrentImageIndex(index);
    }
  }, [hasValidImages, validImages.length]);

  const toggleCarousel = useCallback(() => {
    setIsCarouselPlaying(!isCarouselPlaying);
  }, [isCarouselPlaying]);

  const openImageModal = useCallback((index: number) => {
    if (hasValidImages && index >= 0 && index < validImages.length) {
      setModalImageIndex(index);
      setShowImageModal(true);
      setIsCarouselPlaying(false);
    }
  }, [hasValidImages, validImages.length]);

  const closeImageModal = useCallback(() => {
    setShowImageModal(false);
    setIsCarouselPlaying(true);
  }, []);

  const nextModalImage = useCallback(() => {
    if (!hasValidImages) return;
    setModalImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }, [hasValidImages, validImages.length]);

  const prevModalImage = useCallback(() => {
    if (!hasValidImages) return;
    setModalImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [hasValidImages, validImages.length]);

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
    setModalImageIndex,
  };
};
