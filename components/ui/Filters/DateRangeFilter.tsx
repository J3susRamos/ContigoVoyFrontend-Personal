import { useState } from "react";
import { Icons } from "@/icons";
import { format } from "date-fns";

export function DateRangeFilter({
                                    dateRange,
                                    setDateRange,
                                }: {
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
}) {
    const [open, setOpen] = useState(false);

    // Puedes usar cualquier Datepicker, aquí un ejemplo simple con <input type="date">
    return (
        <div className="flex items-center gap-2 relative">
            <button
                className="p-2 rounded-full bg-white dark:bg-background border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                onClick={() => setOpen((o) => !o)}
                title="Filtrar por rango de fechas"
                type="button"
            >
        <span
            dangerouslySetInnerHTML={{
                __html: Icons.calendario,
            }}
            style={{ width: 20, height: 20 }}
        />
            </button>
            {dateRange[0] && dateRange[1] && (
                <span className="text-primary text-sm font-medium">
          {format(dateRange[0], "dd/MM/yyyy")} - {format(dateRange[1], "dd/MM/yyyy")}
        </span>
            )}
            {open && (
                <div className="absolute top-10 left-0 bg-white dark:bg-background border rounded shadow p-4 z-50 flex flex-col gap-2">
                    <label className="text-xs text-primary">Desde</label>
                    <input
                        type="date"
                        value={dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : ""}
                        onChange={e =>
                            setDateRange([
                                e.target.value ? new Date(e.target.value) : null,
                                dateRange[1],
                            ])
                        }
                        className="border rounded px-2 py-1"
                    />
                    <label className="text-xs text-primary">Hasta</label>
                    <input
                        type="date"
                        value={dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : ""}
                        onChange={e =>
                            setDateRange([
                                dateRange[0],
                                e.target.value ? new Date(e.target.value) : null,
                            ])
                        }
                        className="border rounded px-2 py-1"
                    />
                    <button
                        className="mt-2 text-xs text-primary underline"
                        onClick={() => setOpen(false)}
                        type="button"
                    >
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
}