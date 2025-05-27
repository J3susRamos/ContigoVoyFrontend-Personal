"use client";
import BlogAside from "./blogaside";
import { ScrollShadow } from "@heroui/react";
import BlogPreview from "./blogpreview";
import { Authors, BlogPreviewData, Categoria } from "@/interface";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function BlogPageComponent({
  Datos,
  Categories,
  Authors
}: {
  Datos: BlogPreviewData[];
  Categories: Categoria[];
  Authors: Authors[];
}) {
  const [filteredData, setFilteredData] = useState<BlogPreviewData[]>(Datos);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeAuthor, setActiveAuthor] = useState<number | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPreviewData | null>(null);

  const handleCategoryFilter = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setFilteredData(
        activeAuthor
          ? Datos.filter(blog => blog.psicologo?.includes(Authors.find(a => a.id === activeAuthor)?.name || ''))
          : Datos
      );
    } else {
      setActiveCategory(categoryId);
      const categoryName = Categories.find(cat => cat.idCategoria === categoryId)?.nombre;
      const filtered = Datos.filter(blog => blog.categoria === categoryName);
      setFilteredData(
        activeAuthor
          ? filtered.filter(blog => blog.psicologo?.includes(Authors.find(a => a.id === activeAuthor)?.name || ''))
          : filtered
      );
    }
  };

  const handleAuthorFilter = (authorId: number) => {
    if (activeAuthor === authorId) {
      setActiveAuthor(null);
      setFilteredData(
        activeCategory
          ? Datos.filter(blog => blog.categoria === Categories.find(cat => cat.idCategoria === activeCategory)?.nombre)
          : Datos
      );
    } else {
      setActiveAuthor(authorId);
      const author = Authors.find(a => a.id === authorId);
      const filtered = Datos.filter(blog =>
        blog.psicologo?.includes(author?.name || '')
      );
      setFilteredData(
        activeCategory
          ? filtered.filter(blog => blog.categoria === Categories.find(cat => cat.idCategoria === activeCategory)?.nombre)
          : filtered
      );
    }
  };

  const handleSelectBlog = (blog: BlogPreviewData) => {
    setSelectedBlog(blog);
  };

  return (
    <div className="flex justify-center text-[#634AE2]">
      <div className="w-full max-w-7xl px-4">
        <h1 className="text-start py-5 md:text-3xl text-2xl leading-10 font-bold">
          Blog
        </h1>
        <div className="flex justify-center pb-20">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedBlog ? (
              <div className="col-span-1 md:col-span-3">
                <div className="w-full mb-12">
                  <button
                    className="flex items-center gap-2 mb-6"
                    onClick={() => setSelectedBlog(null)}
                  >
                    <ArrowLeft color="#634AE2" />
                    <span className="text-[#634AE2]">Volver</span>
                  </button>
                  <div className="bg-background bg-[#EAEAFF] rounded-lg p-4 md:p-8">
                    <h2 className="font-semibold md:text-[64px] text-2xl md:leading-[80px] mt-4 break-words">
                      {selectedBlog.tema}
                    </h2>
                    <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                      <Image
                        src={selectedBlog.psicologoImagenId}
                        alt={selectedBlog.psicologo || "Avatar"}
                        width={48}  // 12 * 4 = 48 px (w-12 in Tailwind)
                        height={48} // 12 * 4 = 48 px (h-12 in Tailwind)
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-normal md:text-base">
                          {selectedBlog.psicologo} {selectedBlog.psicologApellido}
                        </p>
                        <p className="text-[#634AE2] text-[14px] leading-[20px] font-extralight">
                          Publicado el {new Date(selectedBlog.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Image
                      className="pt-9 rounded-none mx-auto w-full max-w-4xl"
                      src={selectedBlog.imagen}
                      alt="blogfondo"
                      width={1200}
                      height={600}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        objectFit: "cover"
                      }}
                    />
                    <div className="max-w-4xl w-full mx-auto px-2 md:px-4">
                      <p
                        className="md:text-2xl text-sm my-8 text-[#634AE2]"
                        dangerouslySetInnerHTML={{ __html: selectedBlog.contenido }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="col-span-2">
                  <ScrollShadow className="h-[870px]" hideScrollBar>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <BlogPreview key={item.idBlog} Data={item} onSelect={handleSelectBlog} />
                      ))
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-lg">No se encontraron blogs que coincidan con los filtros seleccionados.</p>
                      </div>
                    )}
                  </ScrollShadow>
                </div>
                <div className="col-span-1">
                  <div className="my-2 md:my-4 md:border-l-[0.5px] border-[#634AE2]">
                    <BlogAside
                      Categories={Categories}
                      Authors={Authors}
                      onCategoryClick={handleCategoryFilter}
                      onAuthorClick={handleAuthorFilter}
                      activeCategory={activeCategory}
                      activeAuthor={activeAuthor}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}