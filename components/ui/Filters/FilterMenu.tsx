import React, { Dispatch, SetStateAction } from "react";

interface MenuItem<T extends Record<string, boolean>> {
    text: string;
    key: keyof T; 
  }


interface MenuProps<T extends Record<string, boolean>> {
  maxHeight: string;
  menuItems: MenuItem<T>[];
  setSubmenus: Dispatch<SetStateAction<T>>;
}

export const FilterMenu = <T extends Record<string, boolean>>({
  maxHeight,
  menuItems,
  setSubmenus,
}: MenuProps<T>) => {

    const toggleSubmenu = (keyToToggle: keyof T): void => {
        setSubmenus((prev) => ({
          ...Object.fromEntries(Object.keys(prev).map(key => [key, false])),
          [keyToToggle]: !prev[keyToToggle]
        } as T));
    };


  return (
    <div
      className={`flex flex-col w-[17rem] bg-white shadow-lg rounded-xl grow-0 py-1 max-h-[${maxHeight}]`}
    >
      {menuItems.map((item, index) => (
        <button
          className="group flex justify-between items-center px-4 py-1 hover:bg-[#9494F3] hover:text-white rounded-xl mx-1 cursor-pointer text-left"
          onClick={() => toggleSubmenu(item.key as keyof T)}
          key={index}
        >
          {item.text}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-[#6C4DFF] group-hover:stroke-white"
          >
            <path
              d="M9 6L15 12L9 18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

// interface MenuItemProps {
//   text: string;
//   onClick?: () => void;
// }
// const MenuItem = ({ text, onClick }: MenuItemProps) => {
//   return (
//     <button
//       className="group flex justify-between items-center px-4 py-1 hover:bg-[#9494F3] hover:text-white rounded-xl mx-1 cursor-pointer text-left"
//       onClick={onClick}
//     >
//       {text}
//       <svg
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         className="stroke-[#6C4DFF] group-hover:stroke-white"
//       >
//         <path
//           d="M9 6L15 12L9 18"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </button>
//   );
// };
