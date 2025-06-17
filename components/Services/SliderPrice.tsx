"use client";
import { Card } from "@heroui/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const cardservices = [
  {
    id: 1,
    title: "Terapia para adolescentes",
    preciounit: "s/69",
    cents: ".00",
    regularprice: "Precio regular: s/90.00",
    list: [
      {
        id: 1,
        text: "Sesiones online de 40 a 50 minutos.",
      },
      {
        id: 2,
        text: "Desarrollo de herramientas comunicativas.",
      },
      {
        id: 3,
        text: "Desarrollo emocional y social.",
      },
      { id: 4, text: "Psicólogos especializados en juventud." },
    ],
  },
  {
    id: 2,
    title: "Terapia para niños",
    preciounit: "s/69",
    cents: ".00",
    regularprice: "Precio regular: s/90.00",
    list: [
      {
        id: 1,
        text: "Sesiones online de 40 a 50 minutos.",
      },
      {
        id: 2,
        text: "Evaluación de habilidades cognitivas.",
      },
      {
        id: 3,
        text: "Juegos terapéuticos adaptados para niños.",
      },
      { id: 4, text: "Psicólogos expertos en desarrollo infantil." },
    ],
  },
  {
    id: 3,
    title: "Terapia para adultos",
    preciounit: "s/69",
    cents: ".00",
    regularprice: "Precio regular: s/90.00",
    list: [
      {
        id: 1,
        text: "Sesiones online de 40 a 50 minutos.",
      },
      {
        id: 2,
        text: "Desarrollo de estrategias para manejar momentos difíciles.",
      },
      {
        id: 3,
        text: "Espacio seguro para hablar y crecer.",
      },
      { id: 4, text: "Psicólogos certificados con amplia experiencia." },
    ],
  },
  {
    id: 4,
    title: "Terapia de pareja",
    preciounit: "s/129",
    cents: ".00",
    regularprice: "Precio regular: s/90.00",
    list: [
      {
        id: 1,
        text: "Sesiones online de 40 a 50 minutos.",
      },
      {
        id: 2,
        text: "Fortalece la comunicación y conexión emocional.",
      },
      {
        id: 3,
        text: "Técnicas para resolver conflictos de forma constructiva.",
      },
      { id: 4, text: "Psicólogos especializados en relaciones de pareja." },
    ],
  },
  {
    id: 5,
    title: "Terapia familiar",
    preciounit: "s/129",
    cents: ".00",
    regularprice: "Precio regular: s/139.00",
    list: [
      {
        id: 1,
        text: "Sesiones online de 40 a 50 minutos.",
      },
      {
        id: 2,
        text: "Estrategias para resolver conflictos.",
      },
      {
        id: 3,
        text: "Unión familiar y entendimiento mutuo.",
      },
      { id: 4, text: "Psicólogos expertos en dinámicas familiares." },
    ],
  },
];

export default function SliderPrice() {
  return (
    <div className="h-[650px] w-full items-center bg-[#D4D4FF]">
      <h1 className="text-center p-10 text-4xl text-[#634AE2] font-semibold  ">
        Promociones
      </h1>
      <div className="flex justify-center">
        <div className="block md:hidden w-96">
          <Carousel
            opts={{
              loop: true,
              align: "start",
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}>
            <CarouselContent>
              {cardservices.map((item, index) => (
                <CarouselItem key={index} className="w-[322px] flex justify-center">
                  <div className="">
                    <Card className="h-[480px] w-[322px] mx-auto border-0 shadow-none bg-background rounded-3xl">
                      <CardContent className="px-0 py-6 h-full pr-scv2">
                        <div className="h-16 mr-scv8 rounded-r-[34px] bg-[#634AE2]">
                          <h1 className="text-white w-32 ml-14 pt-1 text-cv4 font-bold">
                            {item.title}
                          </h1>
                        </div>
                        <h1 className="text-center  text-cv10 font-semibold text-title">
                          {item.preciounit}
                          <small>{item.cents}</small>
                        </h1>
                        <p className="text-center text-cv2 font-bold text-title">
                          {item.regularprice}
                        </p>
                        <div className="ml-5 mt-5 h-40">
                          <ul className="list-none font-light text-[15px] text-title">
                            {item.list.map((item, index) => (
                              <li
                                className="flex mt-scv2 "
                                key={index}
                              >
                                <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mt-scv1 mr-2 flex-shrink-0 w-4 h-4"
                                >
                                  <path
                                    d="M12.6111 4.45557L5.675 11.3917L2.52222 8.23891"
                                    stroke="#634AE2"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="justify-center bottom-0 pt-9  flex  ">
                          <Link href="/ReservarCita">
                            <button className="text-cv3 w-48 border-0 bottom-0 shadow-none bg-[#634AE2] items-center  text-white rounded-[34px] h-10 font-semibold text-center">
                              Obtener una Cita
                            </button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant="ghost"
              className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none hidden min-[490px]:block "
              defaultIcon = {false}
            >
              <ArrowLeft  strokeWidth={4} className="!w-scv6 !h-scv6"/>
            </CarouselPrevious>
            <CarouselNext
              variant="ghost"
              defaultIcon = {false}
              className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none hidden min-[490px]:block  "
            > 
              <ArrowRight  strokeWidth={4} className="!w-scv6 !h-scv6"/>
            </CarouselNext>
          </Carousel>
        </div>
      </div>
      {/* Tamaño grande */}
      <div className="hidden md:block">
        <div className="max-w-[1200px] mx-auto ">
          <Carousel
            opts={{
              loop: true,
              align: "start",
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full "
          >
            <CarouselContent>
              {cardservices.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 flex justify-center"
                >
                  <div className="p-1">
                    <Card className="h-[480px] w-[322px] mx-auto border-0 shadow-none bg-background rounded-3xl">
                      <CardContent className=" py-6  h-full pl-0">
                        <div className="h-16 w-60 rounded-r-[34px] bg-[#634AE2]">
                          <h1 className="text-white w-32 ml-14 pt-1 text-lg">
                            {item.title}
                          </h1>
                        </div>
                        <h1 className="text-center  m-5 text-6xl font-semibold text-title">
                          {item.preciounit}
                          <small>{item.cents}</small>
                        </h1>
                        <p className="text-center text-xs font-bold text-title">
                          {item.regularprice}
                        </p>
                        <div className="ml-5 mt-5 h-40">
                          <ul className="list-none font-light text-[14px] text-title">
                            {item.list.map((item, index) => (
                              <li
                                className="flex items-center mt-1 max-w-[270px]"
                                key={index}
                              >
                                <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 flex-shrink-0 w-4 h-4"
                                >
                                  <path
                                    d="M12.6111 4.45557L5.675 11.3917L2.52222 8.23891"
                                    stroke="#634AE2"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="justify-center bottom-0 pt-9  flex  ">
                          <Link href="/ReservarCita">
                            <button className="w-48 border-0 bottom-0 shadow-none bg-[#634AE2] items-center  text-white rounded-[34px] h-10 font-semibold text-center">
                              Obtener una Cita
                            </button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant="ghost"
              className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none"
            />{" "}
            <CarouselNext
              variant="ghost"
              className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none "
            />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
