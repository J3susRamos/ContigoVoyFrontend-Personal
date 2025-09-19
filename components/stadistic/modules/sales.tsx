import React, {useEffect, useState} from "react";
import {
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
} from "recharts";
import {CustomTooltip} from "../custom/CustomTooltipComponent";
import {GetPsicologoDashboard} from "@/app/apiRoutes";
import {DashboardResult} from "@/interface";
import PieChartGrafic from "../grafics/PieChartGrafic";

const COLORS = ["#BABAFF", "#58A6FF", "#9494F3", "#B158FF", "#197a50", "#b9cd38"];

// Datos para el LineChart
const data = [
    {name: "01", uv: 4000, pv: 2400},
    {name: "02", uv: 3000, pv: 1398},
    {name: "03", uv: 2000, pv: 9800},
    {name: "04", uv: 2780, pv: 3908},
    {name: "05", uv: 1890, pv: 4800},
    {name: "06", uv: 2390, pv: 3800},
];

export default function Sales() {

    const [citasPsicologo, setCitasPsicologo] = useState<DashboardResult>({
        total_citas: 0,
        citas_sin_pagar: 0,
        citas_realizadas: 0,
        citas_pendientes: 0,
        citas_canceladas: 0,
        citas_reprogramadas: 0,
        total_minutos_reservados: 0,
        total_pacientes: 0,
        nuevos_pacientes: 0,
        citas_ausentes: 0
    });
    //Estado de carga para
    const [loading, setLoading] = useState<boolean>(true);
    // Datos para el gráfico de pastel
    const estados = [
        {name: "Citas realizadas"},
        {name: "Citas canceladas"},
        {name: "Citas pendientes"},
        { name: "Citas sin pagar"},
        { name: "Citas Reprogramadas"},
        {name: "Ausencias"},
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GetPsicologoDashboard();
                const result = response.result;
                setCitasPsicologo({
                    total_citas: result?.total_citas ?? 0,
                    citas_sin_pagar: result?.citas_sin_pagar ?? 0,
                    citas_realizadas: result?.citas_realizadas ?? 0,
                    citas_pendientes: result?.citas_pendientes ?? 0,
                    citas_canceladas: result?.citas_canceladas ?? 0,
                    citas_ausentes: result?.citas_ausentes ?? 0,
                    citas_reprogramadas: result?.citas_reprogramadas ?? 0,
                    total_minutos_reservados: result?.total_minutos_reservados ?? 0,
                    total_pacientes: result?.total_pacientes ?? 0,
                    nuevos_pacientes: result?.nuevos_pacientes ?? 0
                });
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData().catch((error) => {
            console.error("Error in loadData:", error);
            setLoading(false);
        });
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

            {/* Layout responsivo - Grid que se adapta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Gráfico de Ingresos - LineChart (ocupa 2 columnas en desktop) */}
                <div className="lg:col-span-2 w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
                    <div
                        className="rounded-r-full w-full max-w-[350px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
                        <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
                            Ingresos del período seleccionado
                        </p>
                    </div>

                    <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{top: 20, right: 20, left: 10, bottom: 40}}
                            >
                                <XAxis
                                    dataKey="name"
                                    tickLine={{stroke: "hsl(var(--primary))"}}
                                    axisLine={{stroke: "hsl(var(--primary))"}}
                                    tick={({x, y, payload}) => {
                                        return (
                                            <text
                                                x={x}
                                                y={y + 15}
                                                fill="hsl(var(--primary))"
                                                textAnchor="middle"
                                                fontSize={10}
                                                fontWeight="500"
                                            >
                                                <tspan x={x} dy="0">
                                                    feb,
                                                </tspan>
                                                {" "}
                                                <tspan x={x} dy="12">
                                                    {payload.value}
                                                </tspan>
                                            </text>
                                        );
                                    }}
                                />
                                <YAxis
                                    tickFormatter={(value: number) => Math.round(value / 1250).toString()}
                                    tick={{fill: "hsl(var(--primary))", fontSize: 10}}
                                    axisLine={{stroke: "hsl(var(--primary))"}}
                                    tickLine={{stroke: "hsl(var(--primary))"}}
                                />
                                <Tooltip content={<CustomTooltip/>}/>
                                <Line
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    activeDot={{r: 6, fill: "hsl(var(--primary))"}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Estado de Citas - PieChart */}
                <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
                    <div
                        className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
                        <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
                            Estado de citas
                        </p>
                    </div>

                    <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
                        {/* Esqueleto de carga */}
                        {loading && (
                            <div
                                className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] rounded-full bg-muted animate-pulse relative">
                                <div
                                    className="absolute top-0 left-0 w-full h-full border-[4px] border-primary/20 rounded-full animate-spin-slow"></div>
                                <div
                                    className="absolute top-[25%] left-[25%] w-[75px] md:w-[100px] h-[75px] md:h-[100px] bg-background rounded-full"></div>
                            </div>
                        )}
                        {/* Gráfico circular */}
                        {!loading && <PieChartGrafic data={citasPsicologo}/>}
                    </div>

                    {/* Leyenda del PieChart */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                        {estados.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{backgroundColor: COLORS[index]}}
                                ></div>
                                <span
                                    className="text-primary dark:text-primary-foreground font-normal text-xs md:text-sm truncate">
                  {entry.name}
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabla de Resumen Financiero - Full width en mobile, full grid en desktop */}
                <div className="lg:col-span-3 w-full bg-card dark:bg-card rounded-2xl overflow-hidden">

                    {/* Header responsive */}
                    <div className="w-full bg-primary dark:bg-primary p-4">
                        <div className="hidden md:grid md:grid-cols-5 gap-4 text-center">
                            <div
                                className="text-primary-foreground dark:text-primary-foreground font-medium text-sm lg:text-base">
                                Cliente
                            </div>
                            <div
                                className="text-primary-foreground dark:text-primary-foreground font-medium text-sm lg:text-base">
                                Ingresos
                            </div>
                            <div
                                className="text-primary-foreground dark:text-primary-foreground font-medium text-sm lg:text-base">
                                Pagos Pendientes
                            </div>
                            <div
                                className="text-primary-foreground dark:text-primary-foreground font-medium text-sm lg:text-base">
                                Cancelaciones
                            </div>
                            <div
                                className="text-primary-foreground dark:text-primary-foreground font-medium text-sm lg:text-base">
                                Ausencias
                            </div>
                        </div>

                        {/* Título para móviles */}
                        <div className="md:hidden text-center">
                            <h3 className="text-primary-foreground dark:text-primary-foreground font-medium text-lg">
                                Resumen Financiero
                            </h3>
                        </div>
                    </div>

                    {/* Contenido de la tabla */}
                    <div className="p-4 min-h-[120px] flex items-center justify-center">
                        <p className="text-muted-foreground text-sm md:text-base text-center">
                            Los datos de resumen financiero se mostrarán aquí cuando estén disponibles
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
