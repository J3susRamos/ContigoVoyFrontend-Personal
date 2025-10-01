"use client";
import { BlogPreviewData } from "@/interface";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import BlogCarousel from "./components/BlogCarousel";
import ImageModal from "./components/ImageModal";
import { useImageCarouselIndividual } from "./hooks/useImageCarouselIndividual";
import { formatBlogContent } from "@/utils/contentUtils";

interface BlogIndividualViewProps {
  blog: BlogPreviewData;
}

export default function BlogIndividualView({ blog }: BlogIndividualViewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useImageCarouselIndividual(blog);

  // Cleanup effect para prevenir memory leaks
  useEffect(() => {
    const currentRef = componentRef.current;
    return () => {
      // Limpiar cualquier timer o listener cuando el componente se desmonte
      if (currentRef) {
        currentRef.scrollTop = 0;
      }
    };
  }, []);

  return (
    <div 
      ref={componentRef}
      className="min-h-screen dark:bg-gray-900 bg-gray-100"
    >
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="flex items-center gap-3 mb-8 text-[#634AE2] hover:text-[#4f46e5] transition-colors group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl"
            prefetch={false}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al blog</span>
          </Link>

          <article className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Article Header */}
            <div className="bg-gradient-to-r from-[#634AE2] via-[#7c3aed] to-[#8b7cf6] p-8 lg:p-12 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <Image
                  src={blog.psicologoImagenId || "/default-avatar.png"}
                  alt={`Foto de perfil de ${blog.psicologo} ${blog.psicologApellido}`}
                  title={`${blog.psicologo} ${blog.psicologApellido} - Psicólogo especialista en ${blog.categoria}`}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white/30 shadow-lg"
                  priority
                />
                <div>
                  <p className="font-semibold text-xl mb-1">
                    {blog.psicologo} {blog.psicologApellido}
                  </p>
                  <p className="text-white/80 text-sm">
                    Publicado el{" "}
                    {new Date(blog.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <h1 className="text-2xl lg:text-5xl font-bold leading-tight break-words">
                {blog.tema}
              </h1>
            </div>

            {/* Article Image(s) - Carrusel optimizado */}
            <BlogCarousel
              blog={blog}
              currentImageIndex={currentImageIndex}
              isCarouselPlaying={isCarouselPlaying}
              onNext={nextImage}
              onPrev={prevImage}
              onGoTo={goToImage}
              onToggle={toggleCarousel}
              onOpenModal={openImageModal}
            />

            {/* Article Content */}
            <div className="p-8 lg:p-12">
              <div
                className="blog-content whitespace-pre-wrap [&_a]:text-[#6228cb] [&_a]:font-bold dark:[&_a]:text-[#3498db] prose prose-lg lg:prose-xl max-w-none text-gray-700 dark:text-gray-300 leading-relaxed [&_p]:mb-4 [&_p]:leading-7 [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:mt-4 [&_h3]:mb-2"
                style={{ 
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  lineHeight: '1.7'
                }}
                dangerouslySetInnerHTML={{ __html: formatBlogContent(blog.contenido) }}
              />
            </div>
          </article>
        </div>
      </div>

      {/* Modal de imagen optimizado */}
      <ImageModal
        blog={blog}
        showModal={showImageModal}
        modalImageIndex={modalImageIndex}
        onClose={closeImageModal}
        onNext={nextModalImage}
        onPrev={prevModalImage}
        onGoTo={setModalImageIndex}
      />
    </div>
  );
}
