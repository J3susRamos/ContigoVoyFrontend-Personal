"use client";
import { QuienesSomos } from "@/interface";
import { Accordion, AccordionItem } from "@heroui/react";

const AnchorIcon = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="white"
    >
      <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

export default function SobreNosotrosStructure({ qs }: { qs: QuienesSomos[] }) {
  

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `linear-gradient(to right, #3616D87A 0%, #3616D870 30%, #7863E37A 70%, #7863E370 100%)`,
        backgroundColor: "#fff",
      }}
    >
      {/* Muestra para pantallas grandes */}
      <div className="lg:block hidden">
        {qs.map((item, index) => (
          <div key={index} className="text-center">
            <div className="pt-8 text-[#fff]">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <section>
                    <h2 className="text-5xl font-bold mb-3">¿Quiénes Somos?</h2>
                    <p
                      className="font-extralight text-lg pt-3"
                      dangerouslySetInnerHTML={{ __html: item.quienesSomos }}
                    />
                  </section>

                  <section className="pt-7">
                    <h3 className="font-semibold text-2xl">Misión</h3>
                    <p
                      className="font-extralight text-lg pt-2"
                      dangerouslySetInnerHTML={{ __html: item.mision }}
                    />
                  </section>

                  <section className="pt-7">
                    <h3 className="font-semibold text-2xl">Visión</h3>
                    <p
                      className="font-extralight text-lg pt-2"
                      dangerouslySetInnerHTML={{ __html: item.vision }}
                    />
                  </section>
                </div>
                <div className="col-span-1 flex items-start ">
                  <div
                    className="w-[450px] mask-fade-bottom flex items-end h-[550px] bg-white bg-contain md:bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `linear-gradient(to right, #7863E37A 0%, #7863E37A 30%, #7863E37A 70%, #7863E370 100%),url('/AboutUs/psicologaAbout.webp')`,
                      backgroundSize: "cover",
                    }}
                  />
                </div>
              </div>
              <div
                className="h-80 sm:h-[800px] bg-white bg-contain md:bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(to right, #3616D87A 0%, #3616D870 30%, #7863E37A 70%, #7863E370 100%),url('/AboutUs/nosotros-centro-psicologico-contigovoy-Manos-apoyándose.webp')`,
                }}
              />

              <section className="pt-20">
                <h3 className="font-medium text-3xl">Valores de Marca</h3>
                <div className="pt-7">
                  <h4 className="font-semibold text-2xl">Empatía</h4>
                  <p
                    className="font-extralight text-lg pt-2"
                    dangerouslySetInnerHTML={{ __html: item.valor1 }}
                  />
                </div>
                <div className="pt-7">
                  <h4 className="font-semibold text-2xl">Confianza</h4>
                  <p
                    className="font-extralight text-lg pt-2"
                    dangerouslySetInnerHTML={{ __html: item.valor2 }}
                  />
                </div>
                <div className="pt-7">
                  <h4 className="font-semibold text-2xl">Profesionalismo</h4>
                  <p
                    className="font-extralight text-lg pt-2"
                    dangerouslySetInnerHTML={{ __html: item.valor3 }}
                  />
                </div>
              </section>
            </div>
            <div
              className="h-96 md:h-[890px] bg-white bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(to right, #3616D87A 0%, #3616D870 30%, #7863E37A 70%, #7863E370 100%),url('/AboutUs/terapeutas-especializados-familia-feliz.webp')`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Muestra para pantallas pequeñas */}
      <div className="block lg:hidden w-full">
        {qs.map((item, index) => (
          <div key={index} className="text-center">
            <div className="pt-8 text-[#fff]">
              <Accordion selectionMode="single">
                <AccordionItem
                  key="quienes-somos"
                  aria-label="¿Quiénes Somos?"
                  title={
                    <h2 className="text-3xl font-bold text-[#fff] text-center">
                      ¿Quiénes Somos?
                    </h2>
                  }
                  indicator={
                    <div className="flex items-center justify-center">
                      <AnchorIcon />
                    </div>
                  }
                >
                  <section>
                    <p
                      className="font-extralight text-sm pt-3 mx-5"
                      dangerouslySetInnerHTML={{ __html: item.quienesSomos }}
                    />
                  </section>
                  <section className="pt-7">
                    <h3 className="font-semibold text-xl">Misión</h3>
                    <p
                      className="font-extralight text-sm pt-2 mx-5"
                      dangerouslySetInnerHTML={{ __html: item.mision }}
                    />
                  </section>
                  <section className="pt-7">
                    <h3 className="font-semibold text-xl">Visión</h3>
                    <p
                      className="font-extralight text-sm pt-2 mx-5"
                      dangerouslySetInnerHTML={{ __html: item.vision }}
                    />
                  </section>
                </AccordionItem>
              </Accordion>

              <div
                className="h-80 sm:h-[800px] bg-white bg-contain md:bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(to right, #3616D87A 0%, #3616D870 30%, #7863E37A 70%, #7863E370 100%),url('/AboutUs/nosotros-centro-psicologico-contigovoy-Manos-apoyándose.webp')`,
                }}
              ></div>

              <Accordion selectionMode="single">
                <AccordionItem
                  key="valores-marca"
                  aria-label="Valores de Marca"
                  title={
                    <h2 className="text-xl font-bold text-[#fff] text-center">
                      Valores de la marca
                    </h2>
                  }
                  indicator={
                    <div className="flex items-center justify-center">
                      <AnchorIcon />
                    </div>
                  }
                >
                  <section className="pt-0">
                    <h4 className="font-semibold text-xl">Empatía</h4>
                    <p
                      className="font-extralight text-sm pt-2 mx-5"
                      dangerouslySetInnerHTML={{ __html: item.valor1 }}
                    />
                  </section>
                  <section className="pt-7">
                    <h4 className="font-semibold text-xl">Confianza</h4>
                    <p
                      className="font-extralight text-sm pt-2 mx-5"
                      dangerouslySetInnerHTML={{ __html: item.valor2 }}
                    />
                  </section>
                  <section className="pt-7">
                    <h4 className="font-semibold text-xl">Profesionalismo</h4>
                    <p
                      className="font-extralight text-sm pt-2 mx-5"
                      dangerouslySetInnerHTML={{ __html: item.valor3 }}
                    />
                  </section>
                </AccordionItem>
              </Accordion>
            </div>
            <div
              className="h-96 md:h-[890px] bg-white bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(to right, #3616D87A 0%, #3616D870 30%, #7863E37A 70%, #7863E370 100%),url('/AboutUs/terapeutas-especializados-familia-feliz.webp')`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
