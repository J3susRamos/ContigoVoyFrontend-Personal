import { Authors, Categoria } from "@/interface";
import { Avatar, Button } from "@heroui/react";

export default function BlogAside({
  Categories,
  Authors,
  onCategoryClick,
  onAuthorClick,
  activeCategory,
  activeAuthor
}: {
  Categories: Categoria[];
  Authors: Authors[];
  onCategoryClick: (categoryId: number) => void;
  onAuthorClick: (authorId: number) => void;
  activeCategory: number | null;
  activeAuthor: number | null;
}) {
  const authorsArray = Array.isArray(Authors) ? Authors : [];

  return (
    <div className="w-[400px] p-4">
      <p className="text-lg font-normal text-[#634AE2] mb-6">Categorías</p>
      <div className="grid grid-cols-2 gap-2">
        {Categories?.map((item) => (
          <Button
            radius="full"
            className={`${
              activeCategory === item.idCategoria
                ? "bg-[#634AE2] text-white"
                : "bg-[#EAEAFF] text-[#634AE2]"
            } text-base hover:bg-[#C7B9FF] transition-all whitespace-nowrap ${
              item.nombre.length > 15 ? "col-span-2" : ""
            }`}
            key={item.idCategoria}
            style={{ maxWidth: "27vh" }}
            onPress={() => onCategoryClick(item.idCategoria)}
          >
            {item.nombre}
          </Button>
        ))}
      </div>

      <p className="text-base font-normal pt-7 m-4 text-[#634AE2]">Por autor</p>
      {authorsArray.length > 0 ? (
        authorsArray.map((item) => (
          <Button
            radius="full"
            className={`${
              activeAuthor === item.id
                ? "bg-[#634AE2] text-white"
                : "bg-[#EAEAFF] text-[#634AE2]"
            } pl-0.5 text-base hover:bg-[#C7B9FF] transition-all mb-2`}
            key={item.id}
            onPress={() => onAuthorClick(item.id)}
          >
            <Avatar className="" src={item.photo} />
            {item.name} {item.lastname}
          </Button>
        ))
      ) : (
        <p className="text-sm text-gray-500">No hay autores disponibles</p>
      )}
    </div>
  );
}