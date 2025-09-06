import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogPreviewData } from "@/interface";

interface BlogCarouselProps {
  blog: BlogPreviewData;
  currentImageIndex: number;
  isCarouselPlaying: boolean;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
  onToggle: () => void;
  onOpenModal: (index: number) => void;
}

export default function BlogCarousel({
  blog,
  currentImageIndex,
  isCarouselPlaying,
  onNext,
  onPrev,
  onGoTo,
  onToggle,
  onOpenModal
}: BlogCarouselProps) {
  // Función para obtener una imagen válida
  const getValidImageSrc = (imageUrl: string | undefined): string | null => {
    if (!imageUrl || imageUrl.trim() === '') return null;
    return imageUrl;
  };

  // Validar si hay imágenes válidas
  const validImages = blog.imagenes?.filter(img => getValidImageSrc(img) !== null) || [];
  const fallbackImage = getValidImageSrc(blog.imagen);
  
  // Si no hay imágenes válidas, mostrar placeholder
  if (validImages.length === 0 && !fallbackImage) {
    return (
      <div className="relative h-80 lg:h-[500px] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-lg font-medium">Sin imagen disponible</p>
        </div>
      </div>
    );
  }

  // Si solo hay una imagen válida o menos
  const imagesToShow = validImages.length > 0 ? validImages : [fallbackImage].filter(Boolean);
  
  if (imagesToShow.length <= 1) {
    const imageUrl = imagesToShow[0] || fallbackImage;
    
    if (!imageUrl) {
      return (
        <div className="relative h-80 lg:h-[500px] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-lg font-medium">Sin imagen disponible</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-80 lg:h-[500px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Imagen ilustrativa del artículo: ${blog.tema}`}
          title={`${blog.tema} - Por ${blog.psicologo} ${blog.psicologApellido}`}
          fill
          className="object-contain bg-gray-100 dark:bg-gray-800"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => onOpenModal(0)}
            className="bg-black/60 hover:bg-black/80 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            Ver completa
          </button>
        </div>
      </div>
    );
  }

  // Validar currentImageIndex
  const safeCurrentIndex = Math.min(currentImageIndex, imagesToShow.length - 1);
  const currentImageUrl = imagesToShow[safeCurrentIndex];

  if (!currentImageUrl) {
    return (
      <div className="relative h-80 lg:h-[500px] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-lg font-medium">Error al cargar imagen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-80 lg:h-[500px] overflow-hidden">
      <div className="relative h-full">
        <Image
          src={currentImageUrl}
          alt={`Imagen ${safeCurrentIndex + 1} del artículo: ${blog.tema}`}
          title={`${blog.tema} - Imagen ${safeCurrentIndex + 1} de ${imagesToShow.length}`}
          fill
          className="object-contain bg-gray-100 dark:bg-gray-800 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={safeCurrentIndex === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={onPrev}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        
        <button
          onClick={onNext}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {imagesToShow.map((_, index) => (
          <button
            key={index}
            onClick={() => onGoTo(index)}
            className={`transition-all duration-300 ${
              index === safeCurrentIndex 
                ? 'w-4 h-4 bg-white scale-110 shadow-lg' 
                : 'w-3 h-3 bg-white/60 hover:bg-white/90 hover:scale-105'
            } rounded-full backdrop-blur-sm`}
          />
        ))}
      </div>

      <div className="absolute top-6 right-6">
        <button
          onClick={onToggle}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110"
          title={isCarouselPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
        >
          {isCarouselPlaying ? (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-1.5 h-4 bg-white mr-1"></div>
              <div className="w-1.5 h-4 bg-white"></div>
            </div>
          ) : (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </div>
          )}
        </button>
      </div>

      <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg">
        {safeCurrentIndex + 1} de {imagesToShow.length}
      </div>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => onOpenModal(safeCurrentIndex)}
          className="bg-black/60 hover:bg-black/80 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
        >
          Ver completa
        </button>
      </div>
    </div>
  );
}