import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import {UltimaAtencion} from "@/interface";
import showToast from "@/components/ToastStyle";
import {parseCookies} from "nookies";

type DetallesPacienteProps = {
    ultimaAtencion: UltimaAtencion | null;
};

function DropzoneWithoutKeyboard() {
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
        noKeyboard: true,
    });

    const files = acceptedFiles.map((file) => (
        <li key={file.name} className="text-sm text-foreground dark:text-foreground p-2 bg-muted/30 dark:bg-muted/30 rounded-lg mb-2">
            📄 {file.name}
        </li>
    ));

    return (
        <div className="border-2 border-dashed border-primary/30 dark:border-primary/30 rounded-xl p-6 text-center hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
            <div {...getRootProps({className: "cursor-pointer"})}>
                <input {...getInputProps()} />
                <div className="text-primary dark:text-primary text-6xl mb-2">📁</div>
                <p className="text-muted-foreground dark:text-muted-foreground mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    Documentos adicionales del paciente
                </p>
            </div>
            {files.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground dark:text-foreground mb-2">Archivos seleccionados:</h4>
                    <ul>{files}</ul>
                </div>
            )}
        </div>
    );
}

export const DetallesPaciente: React.FC<DetallesPacienteProps> = ({
                                                                      ultimaAtencion,
                                                                  }) => {
    const [diagnostico, setDiagnostico] = useState(ultimaAtencion?.diagnostico || "");
    const [tratamiento, setTratamiento] = useState(ultimaAtencion?.tratamiento || "");
    const [observacion, setObservacion] = useState(ultimaAtencion?.observacion || "");
    const [ultimosObjetivos, setUltimosObjetivos] = useState(ultimaAtencion?.ultimosObjetivos || "");

    const handleActualizar = async () => {
        if (!ultimaAtencion?.idAtencion) return;

        try {
            const cookies = parseCookies();
            const token = cookies["session"];
            const url = `${process.env.NEXT_PUBLIC_API_URL}api/atenciones/${ultimaAtencion.idAtencion}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    diagnostico,
                    tratamiento,
                    observacion,
                    ultimosObjetivos,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast("success", "Atención actualizada correctamente");
            } else {
                showToast("error", data.message || "Error al actualizar atención");
            }
        } catch {
            showToast("error", "Error de conexión al actualizar atención");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-card dark:bg-card rounded-xl shadow-lg border border-border dark:border-border">
                {/* Header */}
                <div className="p-6 border-b border-border dark:border-border">
                    <h2 className="text-2xl font-bold text-foreground dark:text-foreground text-center flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-primary dark:bg-primary rounded-full status-indicator"></div>
                        Historial Clínico Detallado
                    </h2>
                    <p className="text-muted-foreground dark:text-muted-foreground text-center mt-2">
                        Información completa de la atención del paciente
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Diagnóstico */}
                        <div className="patient-info-item">
                            <label className="text-sm font-semibold text-foreground dark:text-foreground mb-2 flex items-center gap-2">
                                🩺 Diagnóstico
                            </label>
                            <textarea
                                className="w-full bg-muted/30 dark:bg-muted/30 border border-border dark:border-border rounded-lg p-4 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                                rows={4}
                                placeholder="Ingrese el diagnóstico del paciente..."
                                value={diagnostico}
                                onChange={(e) => setDiagnostico(e.target.value)}
                            />
                        </div>

                        {/* Tratamiento */}
                        <div className="patient-info-item">
                            <label className="text-sm font-semibold text-foreground dark:text-foreground mb-2 flex items-center gap-2">
                                💊 Tratamiento
                            </label>
                            <textarea
                                className="w-full bg-muted/30 dark:bg-muted/30 border border-border dark:border-border rounded-lg p-4 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                                rows={4}
                                placeholder="Indique el tratamiento recomendado..."
                                value={tratamiento}
                                onChange={(e) => setTratamiento(e.target.value)}
                            />
                        </div>

                        {/* Observación */}
                        <div className="patient-info-item">
                            <label className="text-sm font-semibold text-foreground dark:text-foreground mb-2 flex items-center gap-2">
                                👁️ Observación
                            </label>
                            <textarea
                                className="w-full bg-muted/30 dark:bg-muted/30 border border-border dark:border-border rounded-lg p-4 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                                rows={4}
                                placeholder="Observaciones sobre la sesión..."
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                            />
                        </div>

                        {/* Objetivos */}
                        <div className="patient-info-item">
                            <label className="text-sm font-semibold text-foreground dark:text-foreground mb-2 flex items-center gap-2">
                                🎯 Objetivos Alcanzados
                            </label>
                            <textarea
                                className="w-full bg-muted/30 dark:bg-muted/30 border border-border dark:border-border rounded-lg p-4 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                                rows={4}
                                placeholder="Objetivos logrados en esta sesión..."
                                value={ultimosObjetivos}
                                onChange={(e) => setUltimosObjetivos(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Documentos adicionales */}
                    <div className="patient-info-item">
                        <label className="text-sm font-semibold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                            📎 Documentos Adicionales
                        </label>
                        <DropzoneWithoutKeyboard/>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border dark:border-border bg-muted/20 dark:bg-muted/20 rounded-b-xl">
                    <div className="flex justify-center">
                        <button
                            className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-lg py-3 px-8 font-medium hover:bg-primary/90 dark:hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex items-center gap-2"
                            onClick={handleActualizar}
                        >
                            💾 Actualizar Historial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallesPaciente;
