import { BlogPreviewData } from "@/interface";
import { Button, Divider, Form } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const comentarios = [
  {
    id: 1,
    usuario: "Natalia Merino",
    comentario:
      "Muy buen y detallado articulo acerca de cómo mejorar nuesta autoestima. Un tema sumamente importante sin importar la edad de la persona. ¡Pondré todos estos tips en práctica!",
  },
  {
    id: 2,
    usuario: "Juan Flores",
    comentario:
      "Creo que es uno de los mejores artículos que he leído en relación al tema. Es claro, conciso y bastante fácil de seguir y entender la lectura. Gracias por la información.",
  },
];

const articulo = [
  {
    id: 1,
    imagen: "/CarruselInferiormain/Azul.webp",
    titulo: "Estrategias Efectivas para Mejorar la Autoestima",
    descripcion:
      "La autoestima es un aspecto crucial de nuestro bienestar mental y emocional.",
    fecha: "Publicado el 17/07/2024",
  },
  {
    id: 2,
    imagen: "/CarruselInferiorMain/abuela.webp",
    titulo: "Causas de la depresión en la adolescencia",
    descripcion: "La adolescencia es una etapa de grandes cambios y desafíos.",
    fecha: "Publicado el 17/07/2024",
  },
];

export default function BlogComplete({ data }: { data: BlogPreviewData }) {
  return (
    <>
      <div className="max-w-7xl w-full flex flex-col items-center mx-auto px-4">
        <div className="w-full flex flex-col items-start">
          <div className="flex items-center gap-2 pb-12 pt-6">
            <Link href="/blog">
              <ArrowLeft color="#634AE2" />
            </Link>
            <h1 className="text-[#634AE2] md:text-4xl text-2xl font-semibold">
              Blog
            </h1>
          </div>
          <Button
            radius="full"
            className="bg-[#EAEAFF] md:m-2 text-base text-[#634AE2]"
          >
            {data?.categoria}
          </Button>
        </div>

        <div className="text-[#634AE2] w-full">
          <p className="font-semibold md:text-[64px] text-2xl md:leading-[80px] mt-4">
            {data?.tema}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Image
              src={data?.psicologoImagenId || '/placeholder-avatar.jpg'}
              alt={data?.psicologo || "Avatar"}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-normal md:text-base">
                {data?.psicologo} {data?.psicologApellido}
              </p>
              <p className="text-[#634AE2] text-[14px] leading-[20px] font-extralight md:block hidden">
                Publicado el {data?.fecha}
              </p>
            </div>
          </div>
          <Divider className="max-w-7xl mt-8" />
        </div>
      </div>

      <div className="w-full">
        <Image
          className="pt-9 rounded-none mx-auto max-w-7xl"
          src={data?.imagen || '/placeholder-image.jpg'}
          alt="blogfondo"
          width={1400}
          height={600}
          priority
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="max-w-7xl  w-full mx-auto px-4">
        <p
          className="md:text-2xl text-sm my-8 text-[#634AE2]"
          dangerouslySetInnerHTML={{ __html: data?.contenido }}
        />

        <Divider className="max-w-7xl" />
        <h1 className="text-[#634AE2] my-8 text-[24px] leading-[36px] font-semibold">
          Comentarios(12)
        </h1>
        <Form>
          <div className="relative w-full">
            <input
              className="bg-[#EAEAFF] h-14 w-full border-none rounded-full px-6 pr-[110px] text-[rgb(99,74,226)] placeholder-[#634AE2] placeholder:text-start outline-none focus:ring-0 focus:outline-none"
              placeholder="Cuéntanos tu opinión..."
            />
            <Button className="absolute right-6 text-[16px] leading-[36px] w-[157px] top-1/2 py-1 transform -translate-y-1/2 bg-[#634AE2] text-white font-medium rounded-full">
              Comentar
            </Button>
          </div>
        </Form>
        {comentarios.map((item, index) => (
          <div key={index} className="text-[#634AE2] py-10">
            <h1 className="font-semibold text-xl">{item.usuario}</h1>
            <p className="pb-1 text-lg">{item.comentario}</p>
            <a href="/contacto" className="underline">
              Responder
            </a>
          </div>
        ))}
        <Button className="rounded-full text-[16px] bg-white text-[#634AE2] h-10 px-7 border border-[#634AE2] leading-9">
          Ver todas las respuestas
        </Button>
      </div>

      <div className="h-auto w-full mt-16 bg-[#EAEAFF] text-[#634AE2] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-2xl text-center md:text-left">
            Artículos relacionados
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 mt-8">
            {articulo.map((item, index) => (
              <div key={index} className="flex flex-col w-full md:w-[470px]">
                <Image
                  src={item.imagen}
                  width={470}
                  height={300}
                  className="rounded-xl w-full h-auto"
                  alt={item.titulo}
                />
                <p className="font-semibold text-2xl mt-4">{item.titulo}</p>
                <p className="text-base mt-2">{item.descripcion}</p>
                <p className="text-xs mt-2">{item.fecha}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}