"use client";
import { BlogPreviewData } from "@/interface";
import { Image, User } from "@heroui/react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export default function BlogPreview({ 
  Data,
  onSelect
}: { 
  Data: BlogPreviewData 
  onSelect?: (blog: BlogPreviewData) => void
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lectura`;
  };

  return (
    <article className="group cursor-pointer transition-all duration-500 hover:scale-[1.02] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Author & Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <User
              avatarProps={{
                src: Data.psicologoImagenId,
                size: "md",
                className: "ring-2 ring-[#634AE2]/20"
              }}
              name={
                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {Data.psicologo} {Data.psicologApellido}
                </span>
              }
              className="gap-3"
            />
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(Data.fecha)}
              </span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getReadingTime(Data.contenido)}
              </span>
            </div>
          </div>

          {/* Category Tag */}
          {Data.categoria && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#634AE2]" />
              <span className="inline-block px-3 py-1 text-sm font-medium bg-gradient-to-r from-[#634AE2]/10 to-[#8b7cf6]/10 text-[#634AE2] dark:text-[#8b7cf6] rounded-full border border-[#634AE2]/20">
                {Data.categoria}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 
            className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#634AE2] dark:group-hover:text-[#8b7cf6] transition-colors duration-300 line-clamp-2 cursor-pointer"
            onClick={() => onSelect && onSelect(Data)}
          >
            {Data.tema}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 text-lg">
            {Data.contenido.replace(/<[^>]+>/g, "").slice(0, 200)}...
          </p>

          {/* Read More Button */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => onSelect && onSelect(Data)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#634AE2]/25 transition-all duration-300 group/btn"
            >
              Leer artículo completo
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden rounded-2xl group-hover:shadow-2xl transition-all duration-500 border border-[#634AE2]/10">
            <Image
              src={Data.imagen}
              alt={`Imagen de ${Data.tema}`}
              title={Data.tema}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              width={400}
              height={300}
              radius="none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                Ver más
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mt-8 pt-8 border-t border-gradient-to-r from-transparent via-[#634AE2]/20 to-transparent">
        <div className="h-px bg-gradient-to-r from-transparent via-[#634AE2]/30 to-transparent" />
      </div>
    </article>
  );
}
