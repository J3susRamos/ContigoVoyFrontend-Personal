"use client";
import { BlogPreviewData } from "@/interface";
import { Image, User } from "@heroui/react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { createSlug } from "@/utils/slugUtils";
import { extractFormattedExcerpt, getReadingTime } from "@/utils/contentUtils";

export default function BlogPreview({ 
  Data,
}: { 
  Data: BlogPreviewData;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <article className="group transition-all duration-500 hover:scale-[1.02] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
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

          {/* Title - Now as a Link */}
          <Link href={`/blog/ver?blog=${encodeURIComponent(createSlug(Data.tema))}`} prefetch={false}>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#634AE2] dark:group-hover:text-[#8b7cf6] transition-colors duration-300 cursor-pointer break-words">
              {Data.tema}
            </h2>
          </Link>

          {/* Excerpt */}
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg overflow-hidden">
            <div 
              className="line-clamp-3"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.5',
                maxHeight: 'calc(1.5em * 3)', // 3 líneas
                wordBreak: 'break-word'
              }}
              dangerouslySetInnerHTML={{
                __html: extractFormattedExcerpt(Data.contenido, 200)
                  .replace(/\n/g, '<br>')
                  .replace(/\r/g, '')
              }}
            />
          </div>

          {/* Read More Button - Now as a Link */}
          <div className="flex items-center justify-between pt-4">
            <Link href={`/blog/ver?blog=${encodeURIComponent(createSlug(Data.tema))}`} prefetch={false}>
              <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#634AE2]/25 transition-all duration-300 group/btn">
                Leer artículo completo
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>        
        
        {/* Image Section - SOLUCIÓN AL PROBLEMA */}
        <div className="lg:col-span-1 flex justify-center">
          <Link href={`/blog/ver?blog=${encodeURIComponent(createSlug(Data.tema))}`} prefetch={false}>
            <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-2xl group-hover:shadow-2xl transition-all duration-500 border border-[#634AE2]/10 cursor-pointer">
              <Image
                src={Data.imagenes?.[0] || Data.imagen}
                alt={`Imagen ilustrativa del artículo: ${Data.tema}`}
                title={`${Data.tema} - Por ${Data.psicologo} ${Data.psicologApellido}`}
                classNames={{
                  wrapper: "w-full h-full",
                  img: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                }}
                width={400}
                height={400}
                radius="none"
              />
              
              {/* Indicador de múltiples imágenes */}
              {Data.imagenes && Data.imagenes.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  +{Data.imagenes.length - 1} fotos
                </div>
              )}
              
              {/* Gradiente mejorado que cubre toda la imagen */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-sm font-medium bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full inline-block text-center w-full">
                  Ver artículo completo
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mt-8 pt-8 border-t border-gradient-to-r from-transparent via-[#634AE2]/20 to-transparent">
        <div className="h-px bg-gradient-to-r from-transparent via-[#634AE2]/30 to-transparent" />
      </div>
    </article>
  );
}