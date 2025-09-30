"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { AccordionQuestProps } from "@/interface";
import React from "react";

// Definición de la interfaz para los elementos de FAQ
const AnchorIcon = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      className="stroke-black/70 dark:stroke-white"
    >
      <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

// Uso de las propiedades tipadas en el componente
const AccordionQuest: React.FC<AccordionQuestProps> = ({ faqs }) => {
  
  // const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <Accordion
      selectionMode="single"
      
      // selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
      // onSelectionChange={(keys) => {
      //   const selected = Array.from(keys)[0] as string;
      //   setSelectedKey((prevKey) => (prevKey === selected ? null : selected));
      // }
    >

      {faqs.map(({ Question, Answer }) => (
        <AccordionItem
          key={Question}
          aria-label={Question}
          title={<div  className=" pr-scv6 text-black/70 dark:text-white text-cv4 sm:text-cv6 font-bold">{Question}</div>}
          indicator={
            <div className="sm:mx-scv4 truncate">
              <AnchorIcon />
            </div>
          }
          className="border-b border-gray-700 dark:border-white/90  mt-scv6"
        >
          
          <div className="dark:bg-white/5 bg-white/90 p-10 backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg text-gray-600 dark:text-white/70 mb-scv5 text-cv2 sm:text-cv4 rounded-xl py-scv3 px-scv5 ">
            {Answer}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionQuest;
