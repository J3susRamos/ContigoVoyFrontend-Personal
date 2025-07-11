"use client";
import { Card } from "@heroui/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { PromotionCardProps } from "@/interface";
import { CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function SliderPrice({
  promotions = [],
}: {
  promotions?: PromotionCardProps[];
}) {
  useEffect(() => {
    console.log(promotions.length);
  }, [promotions.length]);

  return (
    <>
      {promotions.length > 0 && (
        <div className="h-[680px] w-full items-center bg-large-gradient">
          <h1 className="text-center p-10 text-4xl text-white font-semibold  ">
            Promociones
          </h1>
          <div className="flex justify-center">
            <div className="block max-w-scv17 lg:max-w-scv18 w-full">
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
              >
                <CarouselContent
                  className={`${
                    promotions.length <= 2 ? "justify-center" : ""
                  }`}
                >
                  {promotions.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="flex justify-center md:flex-[0_0_50%] lg:flex-[0_0_33%]"
                    >
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
                                  <li className="flex mt-scv2 " key={index}>
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
                  className="text-white hover:bg-violet-300 bg-inherit border-none hidden min-[490px]:block "
                  defaultIcon={false}
                >
                  <ArrowLeft strokeWidth={4} className="!w-scv6 !h-scv6" />
                </CarouselPrevious>
                <CarouselNext
                  variant="ghost"
                  defaultIcon={false}
                  className="text-white hover:bg-violet-300 bg-inherit border-none hidden min-[490px]:block  "
                >
                  <ArrowRight strokeWidth={4} className="!w-scv6 !h-scv6" />
                </CarouselNext>
              </Carousel>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
