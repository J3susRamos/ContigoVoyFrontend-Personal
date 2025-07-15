import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavItem  } from "./types/navBar.types";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DropdownSection,
} from "@heroui/react";

export const HoverDropBox = ({
  navItem,
}: {
  navItem: NavItem;
}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen} placement="bottom-start" className="rounded-sm text-cv3">
        <DropdownTrigger>
          <div className=" !text-cv3 !hover:opacity-1  px-4 py-2 rounded-sm text-title items-center flex gap-x-scv1 hover:bg-[#634AE2] hover:text-white font-normal">
            {navItem.name}
            <ChevronDown size={20} fill="white" className={`transition-all duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
          </div>
        </DropdownTrigger>
        <DropdownMenu items={navItem.dropList} className="rounded-sm">
          {(item) => (
            <DropdownSection key={item.link} showDivider className="rounded-sm" >
              <DropdownItem
                key={item.link}
                href={item.link}
                className="rounded-sm"
              >
                {item.name}
              </DropdownItem>
            </DropdownSection>
            
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

