"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { AccordionQuestProps } from "@/interface";

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
      stroke="white"
    >
      <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

// Uso de las propiedades tipadas en el componente
const AccordionQuest: React.FC<AccordionQuestProps> = ({ faqs }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <Accordion
      selectionMode="single"
      selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setSelectedKey((prevKey) => (prevKey === selected ? null : selected));
      }}
    >
      {faqs.map(({ Question, Answer }) => (
        <AccordionItem
          key={Question}
          aria-label={Question}
          title={<div className=" text-white text-base lg:text-lg lg:w-full w-[280px]">{Question}</div>}
          indicator={
            <div className="lg:mx-9  truncate">
              <AnchorIcon />
            </div>
          }
          className="border-b border-white "
        >
          
          <div className="text-[#fff] mx-2 rounded-xl p-4 border border-[#fff]">
            {Answer}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionQuest;
