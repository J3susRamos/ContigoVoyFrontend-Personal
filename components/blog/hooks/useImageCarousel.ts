import { useState, useEffect, useCallback } from "react";
import { BlogPreviewData } from "@/interface";

export const useImageCarousel = (selectedBlog: BlogPreviewData | null) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    if (!selectedBlog?.imagenes || selectedBlog.imagenes.length <= 1 || !isCarouselPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, [selectedBlog, isCarouselPlaying]);

  useEffect(() => {
    if (!showImageModal) return;

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

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, selectedBlog]);

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