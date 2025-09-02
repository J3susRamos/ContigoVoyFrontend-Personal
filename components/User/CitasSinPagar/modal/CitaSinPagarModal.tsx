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
import { X, AlertTriangle } from "lucide-react";
import { CitaSinPagar } from "@/interface";
import { toast } from "react-toastify";

interface CitaSinPagarModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: CitaSinPagar | null;
  imagen?: string;
  onAceptar: (
    codigo: string,
    idCita: string,
    comentario: string,
    numero: string,
  ) => void;
  onRechazar: (
    idBoucher: number,
    idCita: string,
    comentario: string,
    numero: string,
  ) => void;
}

export const CitaSinPagarModal: React.FC<CitaSinPagarModalProps> = ({
  isOpen,
  onClose,
  cita,
  imagen = "",
  onAceptar,
  onRechazar,
}) => {
  const [comentario, setComentario] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder para cuando no hay imagen
  const imagenPlaceholder =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2luIGNvbXByb2JhbnRlczwvdGV4dD48L3N2Zz4=";

  const handleClose = () => {
    setComentario("");
    onClose();
  };

  const handleAceptar = async () => {
    if (!cita) return;

    // Verificar que tengamos la información del boucher
    if (!cita.boucher?.codigo) {
      toast.error("No se encontró información del boucher para aceptar");
      return;
    }

    // Verificar que el boucher esté en estado pendiente
    if (cita.boucher.estado !== "pendiente") {
      toast.error(
        `El boucher debe estar en estado pendiente. Estado actual: ${cita.boucher.estado}`,
      );
      return;
    }

    setIsLoading(true);
    try {
      await onAceptar(
        cita.boucher.codigo,
        cita.idCita,
        comentario,
        cita.paciente.numero,
      );
      handleClose();
    } catch (error) {
      console.error("Error al aceptar la cita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!cita) return;

    // Verificar que tengamos la información del boucher
    if (!cita.boucher?.idBoucher) {
      toast.error("No se encontró información del boucher para rechazar");
      return;
    }

    // Verificar que el boucher esté en estado pendiente
    if (cita.boucher.estado !== "pendiente") {
      toast.error(
        `Solo se pueden rechazar bouchers pendientes. Estado actual: ${cita.boucher.estado}`,
      );
      return;
    }

    setIsLoading(true);
    try {
      await onRechazar(
        cita.boucher.idBoucher,
        cita.idCita,
        comentario,
        cita.paciente.numero,
      );
      handleClose();
    } catch (error) {
      console.error("Error al rechazar la cita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cita) return null;

  // Verificar si hay problemas con la información del boucher
  const boucherProblems = [];
  if (!cita.boucher) {
    boucherProblems.push("No se encontró información del boucher");
  } else {
    if (!cita.boucher.codigo) boucherProblems.push("Falta código del boucher");
    if (!cita.boucher.idBoucher) boucherProblems.push("Falta ID del boucher");
    if (cita.boucher.estado !== "pendiente") {
      boucherProblems.push(
        `El boucher no está pendiente (Estado: ${cita.boucher.estado})`,
      );
    }
  }

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
          {/* Alertas de problemas con el boucher */}
          {boucherProblems.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-800 mb-2">
                      Advertencias sobre el Boucher
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                      {boucherProblems.map((problem, index) => (
                        <li key={index}>{problem}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                    Código Paciente
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

          {/* Información del Boucher */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-gray-600 mb-3 block">
                Información del Boucher
              </Label>
              {cita.boucher ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Código Boucher
                    </Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {cita.boucher.codigo || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      ID Boucher
                    </Label>
                    <p className="text-lg font-semibold">
                      {cita.boucher.idBoucher || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Estado
                    </Label>
                    <p
                      className={`text-lg font-semibold ${
                        cita.boucher.estado === "pendiente"
                          ? "text-yellow-600"
                          : cita.boucher.estado === "aceptado"
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {cita.boucher.estado?.charAt(0).toUpperCase() +
                        cita.boucher.estado?.slice(1) || "Desconocido"}
                    </p>
                  </div>
                  {cita.boucher.monto && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Monto
                      </Label>
                      <p className="text-lg font-semibold text-green-600">
                        ${cita.boucher.monto}
                      </p>
                    </div>
                  )}
                  {cita.boucher.fecha_creacion && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Fecha Creación
                      </Label>
                      <p className="text-lg">
                        {new Date(
                          cita.boucher.fecha_creacion,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-orange-400" />
                  <p className="text-lg font-medium">
                    No hay información del boucher
                  </p>
                  <p className="text-sm">
                    No se puede procesar esta cita sin la información del
                    boucher
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comprobante de Pago */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-gray-600 mb-3 block">
                Comprobante de Pago
              </Label>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagen || imagenPlaceholder}
                  alt={imagen ? "Comprobante de pago" : "Sin comprobante"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = imagenPlaceholder;
                  }}
                />
              </div>

              {!imagen && (
                <p className="text-center text-gray-500 text-sm mt-2">
                  No se ha proporcionado comprobante de pago
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
              disabled={isLoading || boucherProblems.length > 0}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400"
            >
              {isLoading ? "Procesando..." : "Rechazar Cita"}
            </Button>
            <Button
              onClick={handleAceptar}
              disabled={isLoading || boucherProblems.length > 0}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
            >
              {isLoading ? "Procesando..." : "Aceptar Cita"}
            </Button>
          </div>

          {boucherProblems.length > 0 && (
            <p className="text-sm text-center text-gray-500">
              Los botones están deshabilitados debido a problemas con la
              información del boucher
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
