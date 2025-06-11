"use client";
import { BlogPreviewData } from "@/interface";
import { Image, User } from "@heroui/react";

export default function BlogPreview({ 
  Data,
  onSelect
}: { 
  Data: BlogPreviewData 
  onSelect?: (blog: BlogPreviewData) => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <User
            avatarProps={{
              src: `${Data.psicologoImagenId}`,
            }}
            name={
              <span className="text-sm md:text-base leading-tight">
                {Data.psicologo} {Data.psicologApellido}
              </span>
            }
          />
          <p className="text-xl md:text-2xl pt-2 md:pt-3 pb-1 md:pb-2 font-semibold cursor-pointer"
            onClick={() => onSelect && onSelect(Data)}
          >
            {Data.tema}
          </p>
          <p className="text-base md:text-xl leading-relaxed md:leading-7 line-clamp-3 md:h-20">
            {Data.contenido.replace(/<[^>]+>/g, "").slice(0, 100)}...
          </p>
        </div>
        <div className="md:col-span-1 flex items-center justify-center">
          <Image
            src={Data.imagen}
            isZoomed
            alt="Profile"
            className="w-full md:w-auto"
            width={178}
            height={153}
            radius="none"
          />
        </div>
        <div className="col-span-1 md:col-span-3">
          <p className="text-sm md:text-lg">Publicado el {Data.fecha}</p>
          <hr className="my-6 md:my-9 border-t-[0.5px] max-w-[785px] border-[#9494F3]" />
        </div>
      </div>
    </>
  );
}
