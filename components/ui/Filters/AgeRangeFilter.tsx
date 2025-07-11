import { useState } from "react";
import { Icons } from "@/icons";

export function AgeRangeFilter({
  ageRange,
  setAgeRange,
}: {
  ageRange: [number | null, number | null];
  setAgeRange: (range: [number | null, number | null]) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    setAgeRange([null, null]);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button
        className="p-2 rounded-full bg-white dark:bg-background border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        onClick={() => setOpen((o) => !o)}
        title="Filtrar por rango de edad"
        type="button"
      >
        <span
          dangerouslySetInnerHTML={{
            __html: Icons.calendario,
          }}
          style={{ width: 20, height: 20 }}
        />
      </button>
      {ageRange[0] !== null && ageRange[1] !== null && (
        <span className="text-primary text-sm font-medium">
          {ageRange[0]} - {ageRange[1]} años
        </span>
      )}
      {open && (
        <div className="absolute top-10 right-0 bg-white dark:bg-background border rounded shadow p-4 z-50 flex flex-col gap-3 min-w-[200px]">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-primary">Filtrar por edad</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-primary">Edad mínima</label>
            <input
              type="number"
              min="0"
              max="100"
              value={ageRange[0] || ""}
              onChange={e =>
                setAgeRange([
                  e.target.value ? parseInt(e.target.value) : null,
                  ageRange[1],
                ])
              }
              className="border rounded px-2 py-1 text-sm"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-primary">Edad máxima</label>
            <input
              type="number"
              min="0"
              max="100"
              value={ageRange[1] || ""}
              onChange={e =>
                setAgeRange([
                  ageRange[0],
                  e.target.value ? parseInt(e.target.value) : null,
                ])
              }
              className="border rounded px-2 py-1 text-sm"
              placeholder="100"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
