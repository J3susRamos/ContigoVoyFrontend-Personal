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
import { ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { motion } from "framer-motion";

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-4xl  font-bold text-center mb-12 relative pb-4 dark:text-white text-gray-900"
  >
    {children}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
  </motion.h2>
);

export default function ServicesStructure({
  service,
}: {
  service: ServicesStructureProps;
}) {
  return (
    <div className="relative dark:from-gray-800 dark:to-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 ">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 flex justify-center sm:grid sm:grid-cols-2  gap-x-scv3 w-full"
            >
              <span className="hidden sm:inline-block w-fit sm:justify-self-end shadow-inner shadow-gray-500 dark:shadow-gray-800   px-3 py-1 text-medium font-medium bg-gradient-to-r from-slate-400/50 to-gray-100/60 text-slate-700 dark:text-gray-900  rounded-full  border border-gray-200/60">
                {service.title}
              </span>
              <span className="sm:hidden inline-block w-fit sm:justify-self-end shadow-inner shadow-gray-500 dark:shadow-gray-800 px-3 py-1 text-sm font-medium bg-gradient-to-r from-slate-400/50 to-gray-100/60 text-slate-700 dark:text-gray-900  rounded-full  border border-gray-200/60">
                {service.titleMobil}
              </span>
              <span className="hidden sm:inline-block w-fit shadow-inner shadow-gray-500 dark:shadow-gray-800 px-3 py-1 text-medium font-medium bg-gradient-to-r from-slate-400/50 to-gray-100/60 text-slate-700 dark:text-gray-900  rounded-full  border border-gray-200/60">
                {service.edad}
              </span>
              <span className="sm:hidden inline-block w-fit shadow-inner shadow-gray-500 dark:shadow-gray-800 px-3 py-1 text-sm font-medium bg-gradient-to-r from-slate-400/50 to-gray-100/60 text-slate-700 dark:text-gray-900  rounded-full  border border-gray-200/60">
                {service.edadMobil}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-8 lg:!leading-[60px]"
            >
              {service.motto}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-5 sm:mb-7 bg-gradient-to-r dark:from-blue-400 dark:to-purple-500 from-[#0EA5E9] to-[#f490d7]  w-[200px] sm:w-[280px] lg:w-[340px] aspect-square rounded-full flex justify-center items-center"
            >
              <div className="rounded-full relative aspect-square w-[180px] sm:w-[260px] lg:w-[320px] overflow-hidden drop-shadow-[2px_2px_12px_rgba(0,0,0,0.8)] shadow-inner">
                <Image
                  src={service.background}
                  alt={service.title + service.motto}
                  title={service.title}
                  fill
                  className="bg-slate-400"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row sm:items-stretch gap-scv4 items-center sm:justify-center w-[70%]"
            >
              {service.promotionCards && service.promotionCards.length > 0 && (
                <button
                  onClick={() => {
                    const promotionsSection =
                      document.getElementById("service-promotions");
                    if (promotionsSection) {
                      promotionsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  style={{
                    boxShadow:
                      "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                  }}
                  className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 px-[25px] py-[10px] lg:p-2 text-white rounded-[15px] hover:bg-white/30 transition-all duration-300 lg:text-cv5 font-medium min-w-[240px]"
                >
                  Ver Promociones
                </button>
              )}

              <Link
                href="/ReservarCita"
                className="container flex justify-center"
              >
                <button
                  style={{
                    boxShadow:
                      "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                  }}
                  className="w-full transition-all duration-300 dark:bg-large-gradient bg-small-gradient dark:hover:bg-small-gradient px-[25px] py-[10px] lg:p-2 text-white rounded-[15px] hover:bg-purple-700 lg:text-cv5 font-medium !h-full min-w-[240px]"
                >
                  Reservar Cita
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="my-scv9 px-scv3 sm:px-scv6 flex justify-center">
        <div className="bg-blue-400/20 pt-scv8  pb-scv6 px-scv4 sm:px-scv7 border-1 border-blue-600/70 rounded-xl relative">
          <p className="dark:text-gray-300 text-gray-700 text-cv4 sm:text-cv5 sm:leading-[32px] lg:max-w-[829px] max-w-[550px]  font-normal  leading-[28px] text-center">
            {service.description}
          </p>
          <div className="absolute border-[6px] border-white bg-blue-400 rounded-full px-scv3 py-4 top-0 -translate-y-[35%] right-1/2 translate-x-1/2 ">
            <Brain size={40} fill="transparent" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="sm:hidden w-full max-w-[560px] mx-auto h-[600px] lg:h-[770px] overflow-hidden relative mt-scv3 ">
        <Image
          src={service.bgup}
          alt={service.bgdownAlt}
          title={service.bgdownTitle}
          fill
          className="object-cover object-center mask-all-fade"
        />
      </div>

      <div className="flex flex-col pt-scv8 px-scv3">
        <SectionHeader>{service.tittlecards}</SectionHeader>

        <div className="flex justify-center">
          <div className="flex sm:hidden max-w-[300px] sm:max-w-[360px]">
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[
                Autoplay({
                  delay: 200000,
                }),
              ]}
              className="w-full bg-transparent"
            >
              <CarouselContent>
                {service.cards?.slice(0, 5).map((card, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-none bg-transparent shadow-none">
                      <CardContent className="p-0">
                        <span className="text-4xl font-semibold  ">
                          <div
                            key={card.id}
                            className="flex flex-col dark:bg-white/5 bg-white/90 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg items-center  "
                          >
                            <div className="w-full md:w-[370px] h-[240px] flex flex-col rounded-lg p-4">
                              <div className="flex justify-center items-center mt-scv4">
                                <Image
                                  title={card.title}
                                  src={card.icon}
                                  alt={card.text}
                                  width={183}
                                  height={88}
                                  className="w-[140px] md:w-[183.27px] h-[68px] md:h-[88px] object-contain  drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
                                />
                              </div>
                              <div className="flex-grow flex items-center justify-center px-1 pt-scv3 pb-scv6">
                                <p className="text-center text-cv3 sm:text-cv5 dark:text-gray-300 text-gray-600 leading-relaxed w-full">
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

        <div className="hidden sm:flex justify-center px-4 sm:px-8">
          {/* Oculto en móviles, visible en pantallas medianas y grandes */}
          <div className="flex justify-center flex-wrap max-w-scv18 items-center gap-x-scv6 gap-y-scv7">
            {service.cards?.map((card) => (
              <div
                key={card.id}
                className="flex flex-col dark:bg-white/5 bg-white/90 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
              >
                <div className="w-[360px] min-h-[250px] py-scv6 px-scv6 flex flex-col gap-scv4 justify-between rounded-lg p-4">
                  <div className="flex-1 relative">
                    <Image
                      title={card.title}
                      src={card.icon}
                      alt={card.text}
                      fill
                      className="w-[130px] object-contain drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  <p className="dark:text-gray-300 text-gray-600 leading-relaxed text-center text-lg">
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
              {service.tittleIcon}
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-x-scv8 gap-y-scv7 pt-scv7 pb-scv10">
            {service.iconos?.map((icono, index) => (
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
            alt={service.bgdownAlt}
            title={service.bgdownTitle}
            src={service.bgdown}
            className="object-cover object-right mask-horizontal-fade"
          />
        </div>
      </div>

      <div className="block md:hidden mt-scv8">
        <div className="flex items-center px-10 ">
          <div className="w-full max-w-[837px] text-title font-semibold text-[20px] leading-[33px] text-center">
            {service.tittleIcon}
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
                {service.iconos?.slice(0, 5).map((icono, index) => (
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
        <SliderPrice promotions={service.promotionCards} />
      </div>

      <div
        className={`sticky bottom-0 left-0 right-0 w-full bg-[#DEDEFF] flex justify-center items-center z-[10]`}
      >
        <div className="flex flex-col lg:flex-row gap-y-scv3 items-center justify-center lg:justify-between w-full max-w-[1230px] px-6 py-scv4 space-x-0">
          <p
            className="text-[18px] w-full font-medium text-[#634AE2] lg:text-start text-center prx-16"
            dangerouslySetInnerHTML={{ __html: service.textfooter }}
          />
          <Link href="/ReservarCita">
            <button className="w-full md:w-[329px] h-10 md:h-[50px] bg-[#5A4AE8] rounded-[34px] text-white font-normal text-[18px] leading-[33px] text-center mt-2 md:mt-0 px-16 md:px-0">
              Reserva tu cita gratuita
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
