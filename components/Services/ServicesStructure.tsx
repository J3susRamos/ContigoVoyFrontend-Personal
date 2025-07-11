"use client";
import { ServicesStructureProps } from "@/interface";
import SliderPrice from "./SliderPrice";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";

export default function ServicesStructure({
  services,
}: {
  services: ServicesStructureProps[];
}) {
  const [isSticky, setIsSticky] = useState(true);

  return (
    <div className="relative ">
      {services.map((item, index) => (
        <div className="embla__slide" key={index}>
          <div className="max-w-scv18 mx-auto flex justify-between px-scv6 lg:px-[79px] gap-x-[98px] py-scv3 sm:py-scv6 text-title items-center ">
            <p className="text-cv5 sm:text-cv6 font-semibold">{item.title}</p>
            <p className="text-cv3 sm:text-cv5 font-semibold">{item.edad}</p>
          </div>

          <div
            className="flex sm:h-[578px]  min-h-[350px] pr-scv10 lg:pr-0 relative overflow-y-hidden overflow-x-clip bg-large-gradient"
            style={{
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              textShadow:
                "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
            }}
          >            <div className="flex-1 relative max-w-scv18 mx-auto pl-8 lg:pl-[79px]">
              <div className="absolute -right-[220px] h-full w-[576px] sm:w-[1200px]">
                <Image
                  src={item.background}
                  alt={item.title + item.motto}
                  title={item.title}
                  fill
                  className="mix-blend-multiply bg-cover mask-horizontal-fade "
                />
              </div>
              
              <p className="text-cv6 sm:text-cv8 pt-scv7 pb-scv8 sm:py-0 sm:top-1/2 sm:-translate-y-1/2 relative max-w-[350px] sm:max-w-[600px] text-white text-left h-auto font-bold leading-1">
                {item.motto}
              </p>              {/* Botones de acción - posicionados a la derecha */}
              <div className="absolute right-64 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
                <Link href="/ReservarCita">
                  <Button
                    style={{
                      boxShadow:
                        "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                    }}
                    className="bg-[#634AE2] px-[25px] py-[10px] lg:p-6 text-white rounded-[30px] hover:bg-purple-700 lg:text-cv6 min-w-[160px]"
                  >
                    Reservar Cita
                  </Button>
                </Link>
                
                {item.promotionCards && item.promotionCards.length > 0 && (
                  <button
                    onClick={() => {
                      const promotionsSection = document.getElementById('service-promotions');
                      if (promotionsSection) {
                        promotionsSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }}
                    style={{
                      boxShadow:
                        "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                    }}
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/30 px-[25px] py-[10px] lg:p-6 text-white rounded-[30px] hover:bg-white/30 transition-all duration-300 lg:text-cv6 font-medium min-w-[160px]"
                  >
                    Ver Promociones
                  </button>
                )}
              </div>
              
              {/* Botones para mobile/tablet */}
              <div className="flex lg:hidden flex-col sm:flex-row gap-4 mt-6">
                <Link href="/ReservarCita">
                  <Button
                    style={{
                      boxShadow:
                        "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                    }}
                    className="bg-[#634AE2] px-[25px] py-[10px] text-white rounded-[30px] hover:bg-purple-700 w-full sm:w-auto"
                  >
                    Reservar Cita
                  </Button>
                </Link>
                
                {item.promotionCards && item.promotionCards.length > 0 && (
                  <button
                    onClick={() => {
                      const promotionsSection = document.getElementById('service-promotions');
                      if (promotionsSection) {
                        promotionsSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }}
                    style={{
                      boxShadow:
                        "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                    }}
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/30 px-[25px] py-[10px] text-white rounded-[30px] hover:bg-white/30 transition-all duration-300 font-medium w-full sm:w-auto"
                  >
                    Ver Promociones
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-scv7 px-scv6 flex justify-center">
            <p className="text-cv4 sm:text-cv5 sm:leading-[32px] lg:max-w-[829px] max-w-[550px] text-title font-normal  leading-[28px] text-center">
              {item.description}
            </p>
          </div>

          <div className="sm:hidden w-full max-w-[560px] mx-auto h-[600px] lg:h-[770px] overflow-hidden relative mt-scv3 ">
            <Image
              src={item.bgup}
              alt={item.bgdownAlt}
              title={item.bgdownTitle}
              fill
              className="object-cover object-center mask-all-fade"
            />
          </div>

          <div className="flex flex-col pt-scv8">
            <h3 className="text-cv5 sm:text-cv7 font-semibold py-6 w-full text-title  leading-[28px] text-center">
              {item.tittlecards}
            </h3>

            <div className="flex justify-center">
              <div className="flex sm:hidden max-w-[300px] sm:max-w-[360px]">
                <Carousel
                  opts={{
                    loop: true,
                    align: "start",
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                  className="w-full bg-transparent"
                >
                  <CarouselContent>
                    {item.cards?.slice(0, 5).map((card, index) => (
                      <CarouselItem key={index}>
                        <Card className="border-none bg-transparent shadow-none">
                          <CardContent className="p-0">
                            <span className="text-4xl font-semibold  ">
                              <div
                                key={card.id}
                                className="flex flex-col rounded-[34px] bg-[#634AE2] items-center  "
                              >
                                <div className="w-full md:w-[370px] h-[220px] md:h-[236px] flex flex-col rounded-lg p-4">
                                  <div className="flex justify-center items-center mt-scv4">
                                    <Image
                                      title={card.title}
                                      src={card.icon}
                                      alt={card.text}
                                      width={183}
                                      height={88}
                                      className="w-[140px] md:w-[183.27px] h-[68px] md:h-[88px] object-contain"
                                    />
                                  </div>
                                  <div className="flex-grow flex items-center justify-center px-1 pt-scv3 pb-scv5">
                                    <p className="text-center text-cv3 sm:text-cv5 text-white font-normal leading-[20px] md:leading-[24px] w-full">
                                      {card.text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    variant="ghost"
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none hidden min-[400px]:block"
                    defaultIcon={false}
                  >
                    <ChevronLeft strokeWidth={4} className="!w-scv5 !h-scv5" />
                  </CarouselPrevious>
                  <CarouselNext
                    variant="ghost"
                    defaultIcon={false}
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none hidden min-[400px]:block"
                  >
                    <ChevronRight strokeWidth={4} className="!w-scv5 !h-scv5" />
                  </CarouselNext>
                </Carousel>
              </div>
            </div>

            <div className="hidden sm:flex justify-center py-8 px-4 sm:px-8">
              {/* Oculto en móviles, visible en pantallas medianas y grandes */}
              <div className="flex justify-center flex-wrap max-w-scv18 items-center gap-x-scv6 gap-y-scv7">
                {item.cards?.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col rounded-3xl bg-[#634AE2]"
                  >
                    <div className="w-[360px] min-h-[236px] py-scv6 px-scv6 flex flex-col gap-scv4 justify-between rounded-lg p-4">
                      <div className="flex-1 relative">
                        <Image
                          title={card.title}
                          src={card.icon}
                          alt={card.text}
                          fill
                          className="w-[130px] object-contain"
                        />
                      </div>

                      <p className="text-center text-cv4 text-white font- leading-[19px] w-full">
                        {card.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex max-w-scv18 mx-auto pl-8 mt-scv8">
            <div className="flex-[1.5] pt-scv8">
              <div className="flex justify-center">
                <div className="w-full text-title font-semibold text-[24px] leading-[33px] text-center px-scv6">
                  {item.tittleIcon}
                </div>
              </div>

              <div className="flex justify-center flex-wrap gap-x-scv8 gap-y-scv7 pt-scv7 pb-scv10">
                {item.iconos?.map((icono, index) => (
                  <div
                    key={index}
                    className="w-[190px] flex flex-col items-center gap-4"
                  >
                    <div className=" rounded-full w-32 h-32 p-scv6 bg-[#634AE2] flex items-center justify-center">
                      <div className="relative w-full h-full ">
                        <Image
                          title={icono.title}
                          src={icono.iconImage}
                          alt={icono.text}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-center pt-3 text-cv3 text-title font-semibold leading-[20px] max-w-[190px]">
                      {icono.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <Image
                fill
                alt={item.bgdownAlt}
                title={item.bgdownTitle}
                src={item.bgdown}
                className="object-cover object-right mask-horizontal-fade"
              />
            </div>
          </div>

          <div className="block md:hidden mt-scv8">
            <div className="flex items-center px-10 ">
              <div className="w-full max-w-[837px] text-title font-semibold text-[20px] leading-[33px] text-center">
                {item.tittleIcon}
              </div>
            </div>

            <div className="flex justify-center py-scv7">
              <div className="block md:hidden w-64">
                <Carousel
                  opts={{
                    loop: true,
                    align: "start",
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                  className="w-full bg-transparent "
                >
                  <CarouselContent>
                    {item.iconos?.slice(0, 5).map((icono, index) => (
                      <CarouselItem key={index}>
                        <div
                          key={icono.id}
                          className="flex flex-col items-center gap-4"
                        >
                          <div className="rounded-full bg-[#9494F3] p-6">
                            <div className="w-32 h-32 flex items-center justify-center">
                              <Image
                                title={icono.title}
                                src={icono.iconImage}
                                alt={icono.text}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-contain"
                              />
                            </div>
                          </div>

                          <p className="text-center pt-3 text-[16px] text-title font-semibold leading-[20px] max-w-[200px]">
                            {icono.text}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    variant="ghost"
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none hidden min-[400px]:block"
                    defaultIcon={false}
                  >
                    <ChevronLeft strokeWidth={4} className="!w-scv5 !h-scv5" />
                  </CarouselPrevious>
                  <CarouselNext
                    variant="ghost"
                    defaultIcon={false}
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none hidden min-[400px]:block"
                  >
                    <ChevronRight strokeWidth={4} className="!w-scv5 !h-scv5" />
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          </div>

          <div id="service-promotions">
            <SliderPrice promotions={item.promotionCards} />
          </div>

          <div
            className={`${
              isSticky ? "sticky bottom-0" : "relative"
            }   left-0 right-0 w-full bg-[#DEDEFF] flex justify-center items-center z-[10]`}
          >
            <button
              onClick={() => setIsSticky(false)}
              className={`${
                !isSticky ? "hidden" : ""
              } transition-all duration-300 bg-[#DEDEFF] absolute top-0 right-0 -translate-y-[100%]  text-[#634AE2]  font-bold px-3 py-1 sm:px-10 sm:py-2 sm:text-cv4 rounded-tl-lg`}
            >
              X
            </button>
            <div className="flex flex-col lg:flex-row gap-y-scv3 items-center justify-center lg:justify-between w-full max-w-[1230px] px-6 py-scv4 space-x-0">
              <p
                className="text-[18px] w-full font-medium text-[#634AE2] lg:text-start text-center prx-16"
                dangerouslySetInnerHTML={{ __html: item.textfooter }}
              />
              <Link href="/ReservarCita">
                <button className="w-full md:w-[329px] h-10 md:h-[50px] bg-[#5A4AE8] rounded-[34px] text-white font-normal text-[18px] leading-[33px] text-center mt-2 md:mt-0 px-16 md:px-0">
                  Reserva tu cita gratuita
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
