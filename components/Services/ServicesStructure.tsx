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
    <div className="relative dark:from-gray-800 dark:to-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 ">      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 min-h-screen flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-20 right-20 w-20 h-20 bg-yellow-400/20 rounded-full blur-lg animate-bounce"></div>
            <div className="absolute bottom-32 left-16 w-28 h-28 bg-pink-400/20 rounded-full blur-lg animate-pulse delay-500"></div>
          </div>
        </div>        {/* Desktop - Background Image */}
        <div className="hidden xl:block absolute inset-0">
          <Image
            src={service.background}
            alt={service.title}
            title={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid xl:grid-cols-2 gap-12 items-center">            {/* Left content */}
            <div className="text-center xl:text-left space-y-8">
              {/* Content background container */}
              <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Service badges */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-wrap justify-center xl:justify-start gap-4 mb-6"
                >
                  <span className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium text-sm shadow-lg hover:bg-white/30 transition-all duration-300">
                    <span className="hidden sm:inline">{service.title}</span>
                    <span className="sm:hidden">{service.titleMobil}</span>
                  </span>
                  <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 rounded-full text-white font-medium text-sm shadow-lg">
                    <span className="hidden sm:inline">{service.edad}</span>
                    <span className="sm:hidden">{service.edadMobil}</span>
                  </span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-6"
                >
                  {service.motto}
                </motion.h1>

                {/* Call to action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start"
                >                  <Link href="/ReservarCita">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-[#634AE2] via-[#7B5FE8] to-[#9494F3] text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                      <span className="relative z-10">Reservar Cita</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Link>
                  
                  {service.promotionCards && service.promotionCards.length > 0 && (
                    <button
                      onClick={() => {
                        const promotionsSection = document.getElementById("service-promotions");
                        if (promotionsSection) {
                          promotionsSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                    >
                      Ver Promociones
                    </button>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Right content - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex justify-center xl:justify-end"
            >
              {/* Mobile - Circular Image */}
              <div className="relative lg:hidden">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                  {/* Outer gradient ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] via-[#f490d7] to-[#fbbf24] rounded-full p-1 animate-spin-slow">
                    <div className="w-full h-full bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] rounded-full"></div>
                  </div>
                  
                  {/* Inner image container */}
                  <div className="absolute inset-4 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full p-2 backdrop-blur-sm">
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                      <Image
                        src={service.background}
                        alt={service.title}
                        title={service.title}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-700"
                        priority
                      />
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet - Card Style Image */}
              <div className="hidden lg:block xl:hidden relative">
                <div className="relative w-[500px] h-[400px]">
                  {/* Background decorative elements */}
                  <div className="absolute -inset-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Main image container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl p-1 shadow-2xl border border-white/30">
                    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                      <Image
                        src={service.background}
                        alt={service.title}
                        title={service.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                      />
                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop - No additional image (background image covers all) */}
              <div className="hidden xl:block">
                {/* Placeholder para mantener el layout del grid */}
              </div>
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
