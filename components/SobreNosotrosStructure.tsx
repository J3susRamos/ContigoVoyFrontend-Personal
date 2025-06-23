"use client";
import { QuienesSomos } from "@/interface";
import { Accordion, AccordionItem } from "@heroui/react";
import { ReactNode } from "react";
import Image from "next/image";

const AnchorIcon = () => {
  return (
    <svg
      style={{filter: 'drop-shadow(4px 5px 16px rgba(0,0,0,0.35)) drop-shadow(2px 2px 3px rgba(0,0,0,0.45))'}}
      aria-hidden="true"
      focusable="false"
      height="40"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="white"
    >
      <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

const TextItem = ({information} : {information : string}) =>{
  return (
    <p
      style={{textShadow: '2px 2px 3px rgba(0,0,0,0.45)'}}
      className="text-cv4 sm:text-cv5 leading-7 px-scv6"
    >{information} 
    </p>
  )
}

const SubHeader = ({children} : {children: ReactNode}) =>{
  return (
    <h3
      style={{textShadow: '2px 3px 8px rgba(0,0,0,0.25), 1px 2px 3px rgba(0,0,0,0.32)'}} 
      className="font-semibold text-cv6 sm:text-cv7 mt-8 mb-6"
    >{children} 
    </h3>
  )
}

export default function SobreNosotrosStructure({ qs }: { qs: QuienesSomos[] }) {

  return (
    <div className="flex  z-10 max-w-scv18 mx-auto min-h-screen">
      {qs.map((item, index) => (
        <div key={index} className=" flex-1 flex flex-col items-center justify-between text-center pt-[36px] sm:pt-scv8 text-[#fff]">
       
          <Accordion 
              selectionMode="single" 
              itemClasses={{
                titleWrapper: 'flex-initial',
                trigger: 'flex justify-center px-scv4',
                base: 'md:px-scv9 lg:px-scv11'
              }}
          >
            <AccordionItem
              key="quienes-somos"
              aria-label="¿Quiénes Somos?"
              className="relative"
              title={
                <h2 style={{textShadow: "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)"}} 
                  className="text-cv8 font-bold text-[#fff] text-center leading-10 mb-scv1">
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
                <TextItem information={item.quienesSomos}/>
              </section>
              <section>
                <SubHeader>Misión</SubHeader>
                <TextItem information={item.mision}/>
              </section>
              <section>
                <SubHeader>Visión</SubHeader>
                <TextItem information={item.vision}/>
              </section>
            </AccordionItem>
          </Accordion>
          <div className="w-full h-[340px] lg:h-[540px] overflow-hidden relative">
            <Image
              src='/AboutUs/nosotros-centro-psicologico-contigovoy-Manos-apoyándose.webp'
              alt="nosotros-centro-psicologico-contigovoy-Manos-apoyándose"
              fill
              className="mix-blend-soft-light object-cover object-center mask-horizontal-fade "    
            />
          </div>
          <Accordion 
            selectionMode="single" 
            style={{position: 'relative'}}
            itemClasses={{
              titleWrapper: 'flex-initial',
              trigger: 'flex justify-center px-scv4 pt-scv7',
              base: 'md:px-scv9 lg:px-scv11'
            }}
          >
            <AccordionItem
              key="valores-marca"
              aria-label="Valores de Marca"
              
              title={
                <h2 style={{textShadow: "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)"}} 
                  className="text-cv8 font-bold text-[#fff] text-center leading-10 ">
                  Valores de la marca
                </h2>
              }
              indicator={
                <div>
                  <AnchorIcon />
                </div>
              }
            >
              <section>
                <SubHeader>Empatía</SubHeader>
                <TextItem information={item.valor1}/>
              </section>
              <section>
                <SubHeader>Confianza</SubHeader>
                <TextItem information={item.valor2}/>
              </section>
              <section>
                <SubHeader>Profesionalismo</SubHeader>
                <TextItem information={item.valor3}/>
              </section>
            </AccordionItem>
          </Accordion>
          <div className="w-full h-[340px] lg:h-[770px] overflow-hidden relative mt-scv5 ">
            <Image
              src='/AboutUs/terapeutas-especializados-familia-feliz.webp'
              alt="terapeutas-especializados-familia-feliz"
              fill
              className="mix-blend-soft-light object-cover object-center  mask-horizontal-fade"    
            />
          </div>
        </div>

      ))}
    </div>
  );
}
