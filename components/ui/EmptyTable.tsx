import React from "react";

export type GenericFilters = Record<string, string[]>;

interface Props {
  filters: boolean;
  messages: {
    noResultsTitle?: string;
    noResultsDescription?: string;
    emptyTitle?: string;
    emptyDescription?: string;
  };
}

const EmptyTable = ({
  filters,
  messages: {
    noResultsTitle = "No se encontraron resultados.",
    noResultsDescription = "No hay registros que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.",
    emptyTitle = "No hay registros.",
    emptyDescription = "Aún no hay registros en el sistema.",
  },
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-border p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
          {filters ? (
            <svg
              className="w-8 h-8 text-primary dark:text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-primary dark:text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line
                x1="15"
                y1="9"
                x2="9"
                y2="15"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="9"
                x2="15"
                y2="15"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
          {filters
            ? noResultsTitle
            : emptyTitle}
        </h3>

        <p className="text-gray-600 dark:text-muted-foreground">
          {filters
            ? noResultsDescription
            : emptyDescription}
        </p>
      </div>
    </div>
  );
};

export default EmptyTable;
