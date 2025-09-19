import React from "react";

interface Props{
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
}
const Pagination = ({onNext, onPrevious, currentPage, totalPages}: Props) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-[#6365f5] text-white rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="px-2 text-[#664be3] dark:text-white">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-[#6365f5] text-white rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
