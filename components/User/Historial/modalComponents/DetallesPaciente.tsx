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
        <li key={file.name}>{file.name}</li>
    ));

    return (
        <section className="container border-1 border-[#634AE2] rounded-2xl">
            <div {...getRootProps({className: "dropzone"})}>
                <input {...getInputProps()} />
                <p className="text-[#634AE2] text-center text-9xl">+</p>
            </div>
            <aside>
                <ul>{files}</ul>
            </aside>
        </section>
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
        <div className="max-w-[480px]">
            <div className="bg-[#fff] h-max text-[#634AE2] rounded-3xl">
                <div className="text-center text-[#634AE2] font-bold text-2xl pb-1">
                    Detalles del historial del paciente
                </div>
                <hr className="border-[#9494F3] pb-1"/>
                <div className="text-[#634AE2] text-xl text-center font-bold">
                    <div className="pb-1">Diagnóstico</div>
                    <textarea
                        className="bg-[#F3F3F3] w-full h-20 border-1 font-light text-[#634AE2] p-3 rounded-3xl"
                        placeholder="Aun no hay comentarios"
                        defaultValue={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                    />
                    <div className="pb-1">Tratamiento</div>
                    <textarea
                        className="bg-[#F3F3F3] w-full h-20 border-1 font-light text-[#634AE2] p-3 rounded-3xl"
                        placeholder="Aun no hay comentarios"
                        defaultValue={tratamiento}
                        onChange={(e) => setTratamiento(e.target.value)}
                    />
                    <div className="pb-1">Observación</div>
                    <textarea
                        className="bg-[#F3F3F3] w-full h-20 border-1 font-light text-[#634AE2] p-3 rounded-3xl"
                        placeholder="Aun no hay comentarios"
                        defaultValue={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                    />
                    <div className="pb-1">Objetivos alcanzados</div>
                    <textarea
                        className="bg-[#F3F3F3] w-full h-20 border-1 font-light text-[#634AE2] p-3 rounded-3xl"
                        placeholder="Aun no hay comentarios"
                        value={ultimosObjetivos}
                        onChange={(e) => setUltimosObjetivos(e.target.value)}
                    />
                    <div className="pb-1">Documentos adicionales</div>
                </div>

                <DropzoneWithoutKeyboard/>

                <div className="flex justify-center items-center pt-3">
                    <button
                        className="rounded-full border-2 border-[#634AE2] pl-4 pr-4 h-8"
                        onClick={handleActualizar}
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetallesPaciente;
