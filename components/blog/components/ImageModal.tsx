import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogPreviewData } from "@/interface";

interface ImageModalProps {
  blog: BlogPreviewData;
  showModal: boolean;
  modalImageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
}

export default function ImageModal({
  blog,
  showModal,
  modalImageIndex,
  onClose,
  onNext,
  onPrev,
  onGoTo
}: ImageModalProps) {
  // Validar si hay imágenes válidas
  const validImages = blog.imagenes?.filter(img => img && img.trim() !== '') || [];
  const fallbackImage = blog.imagen && blog.imagen.trim() !== '' ? blog.imagen : null;
  
  if (!showModal) return null;
  
  // Si no hay imágenes válidas, cerrar modal
  if (validImages.length === 0 && !fallbackImage) {
    return null;
  }

  const imagesToShow = validImages.length > 0 ? validImages : [fallbackImage].filter(Boolean) as string[];
  const safeModalIndex = Math.min(modalImageIndex, imagesToShow.length - 1);
  const currentImageUrl = imagesToShow[safeModalIndex];
  const currentMeta = blog.imagenesMeta?.[safeModalIndex];

  if (!currentImageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={currentImageUrl}
            alt={currentMeta?.altText || `${blog.tema} - imagen ${safeModalIndex + 1}`}
            title={currentMeta?.title || blog.tema}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-black/60 hover:bg-red-600/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {imagesToShow.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={onNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg z-10">
              {safeModalIndex + 1} de {imagesToShow.length}
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              {imagesToShow.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onGoTo(index)}
                  className={`transition-all duration-300 ${
                    index === safeModalIndex
                      ? 'w-4 h-4 bg-white scale-110 shadow-lg' 
                      : 'w-3 h-3 bg-white/60 hover:bg-white/90 hover:scale-105'
                  } rounded-full backdrop-blur-sm`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg z-10">
          Clic fuera para cerrar
        </div>
      </div>

      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
} 