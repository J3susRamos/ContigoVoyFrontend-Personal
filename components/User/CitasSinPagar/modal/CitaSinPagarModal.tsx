"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CitaSinPagar } from "@/interface";

interface CitaSinPagarModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: CitaSinPagar | null;
  imagenes?: string[];
  onAceptar: (citaId: string, comentario: string) => void;
  onRechazar: (citaId: string, comentario: string) => void;
}

export const CitaSinPagarModal: React.FC<CitaSinPagarModalProps> = ({
  isOpen,
  onClose,
  cita,
  imagenes = [],
  onAceptar,
  onRechazar,
}) => {
  const [comentario, setComentario] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Usar imágenes proporcionadas o mostrar placeholder si no hay
  const imagenesDisponibles =
    imagenes.length > 0
      ? imagenes
      : [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2luIGNvbXByb2JhbnRlczwvdGV4dD48L3N2Zz4=",
        ];

  const handleClose = () => {
    setComentario("");
    setCurrentImageIndex(0);
    onClose();
  };

  const handleAceptar = async () => {
    if (!cita) return;
    setIsLoading(true);
    try {
      onAceptar(cita.idCita, comentario);
      handleClose();
    } catch (error) {
      console.error("Error al aceptar la cita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!cita) return;
    setIsLoading(true);
    try {
      onRechazar(cita.idCita, comentario);
      handleClose();
    } catch (error) {
      console.error("Error al rechazar la cita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imagenesDisponibles.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagenesDisponibles.length - 1 : prev - 1,
    );
  };

  if (!cita) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Gestionar Cita Sin Pagar</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la Cita */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Paciente
                  </Label>
                  <p className="text-lg font-semibold">
                    {cita.paciente.nombre} {cita.paciente.apellido}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Código
                  </Label>
                  <p className="text-lg font-semibold">
                    {cita.paciente.idPaciente}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Fecha
                  </Label>
                  <p className="text-lg">{cita.fecha_cita}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Hora
                  </Label>
                  <p className="text-lg">{cita.hora_cita}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Motivo de Consulta
                  </Label>
                  <p className="text-lg">{cita.motivo_Consulta}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carousel de Imágenes */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-gray-600 mb-3 block">
                {imagenes.length > 0
                  ? `Comprobantes de Pago (${currentImageIndex + 1} de ${imagenesDisponibles.length})`
                  : "Comprobantes de Pago"}
              </Label>
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagenesDisponibles[currentImageIndex]}
                    alt={
                      imagenes.length > 0
                        ? `Comprobante ${currentImageIndex + 1}`
                        : "Sin comprobantes"
                    }
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXJyb3IgYWwgY2FyZ2FyIGltYWdlbjwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                </div>

                {imagenes.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Indicadores de imagen */}
              {imagenes.length > 1 && (
                <div className="flex justify-center mt-3 space-x-2">
                  {imagenesDisponibles.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-blue-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}

              {imagenes.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-2">
                  No se han proporcionado comprobantes de pago
                </p>
              )}
            </CardContent>
          </Card>

          {/* Campo de Comentario */}
          <div className="space-y-2">
            <Label htmlFor="comentario" className="text-sm font-medium">
              Comentario
            </Label>
            <Textarea
              id="comentario"
              placeholder="Agregar comentario sobre la decisión..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {comentario.length}/500 caracteres
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleRechazar}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? "Procesando..." : "Rechazar Cita"}
            </Button>
            <Button
              onClick={handleAceptar}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {isLoading ? "Procesando..." : "Aceptar Cita"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
