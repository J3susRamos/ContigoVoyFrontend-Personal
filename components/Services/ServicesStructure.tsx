"use client";
import { ServicesStructureProps } from "@/interface";
import SliderPrice from "./SliderPrice";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ServicesStructure({
  services,
}: {
  services: ServicesStructureProps[];
}) {
  return (
    <div className="relative ">
      {services.map((item, index) => (
        <div className="embla__slide" key={index}>
          <div className="flex justify-between px-scv6 gap-x-[98px] py-scv3  text-title items-center ">
            <p className="text-cv5 lg:text-xl font-semibold lg:pl-[71px]lg:pr-32">
              {item.title}
            </p>
            <p className="text-cv3 font-semibold">{item.edad}</p>
          </div>
          {/* se muestra solo en mobile*/}
          <div className="block md:hidden">
            <div
              className="flex lg:h-[578px] lg:pl-[79px] min-h-[350px] lg:pr-0 pr-scv10 pl-8 relative overflow-y-hidden overflow-x-clip"
              style={{
                backgroundImage: `linear-gradient(rgba(120, 99, 227, 0.612), rgba(120, 99, 227, 0.612))`,
                backgroundPosition: "right center",
                backgroundSize: "auto 400px",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute -right-[50px] h-full  w-[576px]">
                 <Image
                  src={item.background}
                  alt={item.title + item.motto}
                  fill
                  className="mix-blend-multiply opacity-70 bg-cover mask-horizontal-fade "
                />
              </div>
             
              <p className="text-cv6 pt-scv7 relative max-w-[350px] text-white text-left  h-auto font-bold leading-1 pb-scv8 ">
                {item.motto}
              </p>

            </div>
          </div>
          <div className="hidden md:block">
            <div
              className="lg:h-[578px] flex items-center lg:pl-[79px] lg:pr-0 h-[400px] pr-[200px] pl-8"
              style={{
                backgroundImage: `linear-gradient(270deg, rgba(99, 74, 226, 0.24) 28.05%, rgba(99, 74, 226, 1) 47.87%),url(${item.background})`,
                backgroundPosition: "right center",
                backgroundSize: "auto",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="relative w-[661px] flex items-center justify-center text-white text-left h-[230px] font-bold text-[40px] leading-[54px]">
                {item.motto}
              </div>
            </div>
          </div>

          <div className="mt-scv7 px-scv6 flex justify-center">
            <p className="text-cv4 lg:max-w-[829px] max-w-[550px] text-title font-normal  leading-[28px] text-center">
              {item.description}
            </p>
          </div>
          
          <div className="w-full max-w-[560px] mx-auto h-[600px] lg:h-[770px] overflow-hidden relative ">
            <Image
              src={item.bgup}
              alt={item.description}
              fill
              className="object-cover object-center mask-all-fade"    
            />
          </div>
  
               
          <div className="flex flex-col py-scv7">
            <h3 className="text-cv5 font-semibold py-6 w-full text-title  leading-[28px] text-center">
              {item.tittlecards}
            </h3>
          
            <div className="flex justify-center">
              <div className="flex md:hidden max-w-[300px]">
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
                  className="w-full bg-transparent"
                >
                  <CarouselContent>
                    {item.cards?.slice(0, 5).map((card, index) => (
                      <CarouselItem key={index} >
                        <Card className="border-none bg-transparent shadow-none">
                          <CardContent className="p-0">
                            <span className="text-4xl font-semibold  ">
                              <div
                                key={card.id}
                                className="flex flex-col rounded-[34px] bg-[#634AE2] items-center  "
                              >
                                <div className="w-full md:w-[370px] h-[220px] md:h-[236px] flex flex-col rounded-lg p-4">
                                  <div className="flex justify-center items-center mt-scv5">
                                    <Image
                                      src={card.icon}
                                      alt={card.text}
                                      width={183}
                                      height={88}
                                      className="w-[140px] md:w-[183.27px] h-[68px] md:h-[88px] object-contain"
                                    />
                                  </div>
                                  <div className="flex-grow flex items-center justify-center px-1 pt-scv2 pb-scv5">
                                    <p className="text-center text-[14px] md:text-[16px] text-white font-normal leading-[20px] md:leading-[24px] w-full">
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
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none "
                    defaultIcon = {false}
                  >
                   <ChevronLeft  strokeWidth={4} className="!w-scv5 !h-scv5"/>
                  </CarouselPrevious>
                  <CarouselNext
                    variant="ghost"
                    defaultIcon = {false}
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none "
                  > 
                    <ChevronRight  strokeWidth={4} className="!w-scv5 !h-scv5"/>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>

          </div>

          <div className="hidden md:flex justify-center py-8 px-4 md:px-8">
            {/* Oculto en móviles, visible en pantallas medianas y grandes */}
            <div className="flex flex-col items-center gap-y-12">
              <div className="flex flex-col xl:flex-row gap-y-8 md:gap-x-8">
                {item.cards?.slice(0, 3).map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col rounded-3xl bg-[#634AE2] items-center gap-4 p-4"
                  >
                    <div className="w-full md:w-[360px] h-auto md:h-[236px] flex flex-col rounded-lg p-4">
                      <div className="flex justify-center items-center">
                        <Image
                          src={card.icon}
                          alt={card.text}
                          width={183}
                          height={88}
                          className="w-[140px] md:w-[183.27px] h-[68px] md:h-[88px] object-contain"
                        />
                      </div>
                      <div className="flex-grow flex items-center justify-center px-4">
                        <p className="text-center text-[14px] md:text-[16px] text-white font- leading-[20px] md:leading-[24px] w-full">
                          {card.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col xl:flex-row gap-y-8 md:gap-x-8">
                {item.cards?.slice(3, 5).map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col rounded-3xl bg-[#634AE2] items-center gap-4 p-4"
                  >
                    <div className="w-full md:w-[360px] h-auto md:h-[236px] flex flex-col rounded-lg p-4">
                      <div className="flex justify-center items-center">
                        <Image
                          src={card.icon}
                          alt={card.text}
                          width={183}
                          height={88}
                          className="w-[140px] md:w-[183.27px] h-[68px] md:h-[88px] object-contain"
                        />
                      </div>
                      <div className="flex-grow flex items-center justify-center px-4">
                        <p className="text-center text-[14px] md:text-[16px] text-white font-normal leading-[20px] md:leading-[24px] w-full">
                          {card.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="hidden md:block"
            style={{
              backgroundImage: `url(${item.bgdown})`,
              backgroundPosition: "right bottom",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1280px 788px",
            }}
          >
            <div className="pt-8 md:pt-24 flex items-center px-10 md:px-0 md:pl-96">
              <div className="w-full max-w-[837px] text-title h-[74px] font-semibold text-[24px] leading-[33px] text-center">
                {item.tittleIcon}
              </div>
            </div>

            <div className="flex justify-start pl-64 pb-32 pt-8 w-full h-auto">
              <div className="flex pt-14 flex-col items-center gap-y-20">
                {/* Primera fila - 3 iconos */}
                <div className="flex flex-col md:flex-row lg:gap-y-0  gap-y-12 md:gap-y-0 md:gap-x-[229px]">
                  {item.iconos?.slice(0, 3).map((icono, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className=" rounded-full  bg-[#9494F3] p-6">
                        <div className="w-32 h-32 flex items-center justify-center">
                          <Image
                            src={icono.iconImage}
                            alt={icono.text}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                      </div>
                      <p className="text-center pt-3 text-[16px] text-title  font-semibold leading-[20px] max-w-[200px]">
                        {icono.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-y-12 md:gap-y-0 md:gap-x-[229px]">
                  {item.iconos?.slice(3, 5).map((icono) => (
                    <div
                      key={icono.id}
                      className="flex flex-col items-center "
                    >
                      <div className="rounded-full bg-[#9494F3] p-6">
                        <div className="w-32 h-32 flex items-center justify-center">
                          <Image
                            src={icono.iconImage}
                            alt={icono.text}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                      </div>

                      <p className="text-center pt-3 text-[16px] text-title font-semibold leading-[20px] max-w-[120px]">
                        {icono.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <div className="pt-8 flex items-center px-10 ">
              <div className="w-full max-w-[837px] text-title font-semibold text-[20px] leading-[33px] text-center">
                {item.tittleIcon}
              </div>
            </div>

            <div className="flex justify-center pt-8 pb-8">
              <div className="block md:hidden w-64">
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
                                src={icono.iconImage}
                                alt={icono.text}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-contain"
                              />
                            </div>
                          </div>

                          <p className="text-center pt-3 text-[16px] text-title font-semibold leading-[20px] max-w-[120px]">
                            {icono.text}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    variant="ghost"
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none "
                    defaultIcon = {false}
                  >
                   <ChevronLeft  strokeWidth={4} className="!w-scv5 !h-scv5"/>
                  </CarouselPrevious>
                  <CarouselNext
                    variant="ghost"
                    defaultIcon = {false}
                    className="text-[#634AE2] hover:bg-violet-300 bg-inherit border-none "
                  > 
                    <ChevronRight  strokeWidth={4} className="!w-scv5 !h-scv5"/>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          </div>
          <SliderPrice />
          <div className="sticky bottom-0 left-0 right-0 w-full bg-[#DEDEFF] flex justify-center items-center z-[10] h-36 md:h-32">
            <div className="lg:block hidden">
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full max-w-[1230px] px-6 space-x-0">
                <p
                  className="text-[18px] w-full font-medium text-[#634AE2] lg:text-start text-center px-16"
                  dangerouslySetInnerHTML={{ __html: item.textfooter }}
                />
                <Link href="/ReservarCita">
                  <button className="w-full md:w-[329px] h-10 md:h-[50px] bg-[#5A4AE8] rounded-[34px] text-white font-normal text-[18px] leading-[33px] text-center mt-2 md:mt-0 px-16 md:px-0">
                    Reserva tu cita gratuita
                  </button>
                </Link>
              </div>
            </div>

            <div className="block lg:hidden w-full">
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full max-w-[1230px] px-6 space-x-0">
                <p
                  className="text-[15px] w-full font-medium text-[#634AE2] lg:text-start text-center "
                  dangerouslySetInnerHTML={{ __html: item.textfootermobile }}
                />
                <Link href="/ReservarCita">
                  <button className="w-full h-10 bg-[#5A4AE8] rounded-[34px] text-white font-normal text-[15px] leading-[33px] text-center mt-2 md:mt-0 px-12 whitespace-nowrap">
                    Reserva tu cita gratuita
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}