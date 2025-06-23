"use client";

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
  
  // const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <Accordion
      selectionMode="multiple"
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
          title={<div style={{textShadow: "2px 3px 8px rgba(0,0,0,0.25), 1px 2px 3px rgba(0,0,0,0.32)"}}  className=" pr-scv6 text-white text-cv4">{Question}</div>}
          indicator={
            <div className="sm:mx-scv4 truncate">
              <AnchorIcon />
            </div>
          }
          className="border-b border-white  mt-scv5"
        >
          
          <div style={{textShadow: "2px 2px 3px rgba(0,0,0,0.45)"}} className="text-[#fff] mb-scv5 text-cv4 sm:text-cv4 rounded-xl py-scv3 px-scv5 border border-[#fff]">
            {Answer}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionQuest;
