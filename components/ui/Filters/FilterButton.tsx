import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

interface Props {
  children: ReactNode;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
}

const FilterButton = ({ children, setMenuOpen, menuOpen }: Props) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, [menuRef, setMenuOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Button
        variant="bordered"
        className="border-none text-primary-foreground dark:text-primary-foreground font-light text-xl"
        onPress={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span
          className="text-primary-foreground dark:text-primary-foreground transition-colors"
          dangerouslySetInnerHTML={{
            __html: Icons.filter.replace(/<svg /, '<svg fill="currentColor" '),
          }}
          style={{
            width: "1.2em",
            height: "1.2em",
          }}
        />
        Filtrar
      </Button>
      {menuOpen && (
        <div className="absolute z-50 flex w-max p-2 text-[#634AE2] text-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
