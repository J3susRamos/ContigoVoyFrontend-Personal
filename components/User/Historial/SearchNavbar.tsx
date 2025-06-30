import React from "react";
import {
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import {Icons} from "@/icons";

interface NavbarProps {
    filterValue: string;
    onSearchChange: (value?: string) => void;
    onClear: () => void;
    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;
    columns: { name: string; uid: string; sortable?: boolean }[];
    onSortByDate: () => void;
    onSortByName: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
                                                  filterValue,
                                                  onSearchChange,
                                                  onClear,
                                                  onSortByDate,
                                                  onSortByName,
                                              }) => {
    return (
        <div>
            <div className="flex w-full mt-8">
                <div className="bg-[#6364F4] w-full h-[8vh] flex flex-row justify-start items-center">
                    <div className="flex flex-row gap-4 w-full items-center pl-8">
                        {/* Icono de lupa */}
                        <span
                            className="text-[#fff] transition-colors pl-3"
                            dangerouslySetInnerHTML={{
                                __html: Icons.loup.replace(
                                    /<svg /,
                                    '<svg fill="currentColor" '
                                ),
                            }}
                            style={{
                                width: "1.2em",
                                height: "1.2em",
                            }}
                        />

                        {/* Input de búsqueda */}
                        <Input
                            type="text"
                            placeholder="Buscar paciente"
                            isClearable
                            size="sm"
                            radius="full"
                            variant="bordered"
                            className="rounded-full bg-[#EAEAFF] ml-4 w-48"
                            classNames={{
                                input: "placeholder:text-[#9494F3]",
                            }}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                        {/* Botón que abre el desplegable */}
                        <Dropdown
                            classNames={{
                                base: "bg-none",
                            }}
                        >
                            <DropdownTrigger
                                className="bg-[#EAEAFF] rounded-full h-8 text-[#634AE2] text-base font-normal">
                                <Button variant="bordered">
                                    Ordenar por{" "}
                                    <span
                                        className="pl-3"
                                        dangerouslySetInnerHTML={{
                                            __html: Icons.arrow.replace(
                                                /<svg /,
                                                '<svg fill="#634AE2"'
                                            ),
                                        }}
                                    />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Ordenar por">
                                <DropdownItem
                                    key="nombre"
                                    classNames={{
                                        base: "rounded-2x1 text-base font-normal h-6 text-[#634AE2] data-[hover=true]:bg-[#9494F3] data-[hover=true]:text-white inline-flex items-center",
                                    }}
                                    onPress={onSortByName}
                                >
                                    Nombre
                                    <span
                                        className="inline-flex items-center ml-10"
                                        dangerouslySetInnerHTML={{
                                            __html: Icons.alpharrow.replace(
                                                /<svg /,
                                                '<svg fill="#634AE2"'
                                            ),
                                        }}
                                    />
                                </DropdownItem>
                                <DropdownItem
                                    key="fecha"
                                    classNames={{
                                        base: "rounded-2x1 text-base font-normal h-6 text-[#634AE2] data-[hover=true]:bg-[#9494F3] data-[hover=true]:text-white",
                                    }}
                                    onPress={onSortByDate}
                                >
                                    Fecha <span
                                    className="inline-flex items-center ml-12"
                                    dangerouslySetInnerHTML={{
                                        __html: Icons.alpharrow.replace(
                                            /<svg /,
                                            '<svg fill="#634AE2"'
                                        ),
                                    }}
                                />
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};
