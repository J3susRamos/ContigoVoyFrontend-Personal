"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Type, Columns, Hash, Share2, Square, Image as ImageIcon, AlignLeft, Bold, Italic } from "lucide-react";
import { EmailBlock, UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";
import Image from "next/image";
import { defaultImagenTexto } from "./PlantillasConfig";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";

const EmailMarketingEditor = () => {
  const PLANTILLA_TYPE = "imagen-texto";
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedPlantilla = localStorage.getItem("emailBlocks");
      if (storedPlantilla) {
        try {
          const parsed = JSON.parse(storedPlantilla);
          if (parsed.type === PLANTILLA_TYPE && Array.isArray(parsed.blocks)) {
            setEmailBlocks(parsed.blocks);
          }
        } catch (e) {
          console.error(e)
          // Si hay error, ignora y no carga nada
        }
      } else {
        setEmailBlocks(defaultImagenTexto.blocks);
      }

    }
  }, []);

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const router = useRouter();

  const MAX_BLOCKS = 10;

  const addBlock = () => {
    if (emailBlocks.length >= MAX_BLOCKS) {
      showAlert(`Solo puedes agregar hasta ${MAX_BLOCKS} bloques de texto.`);
      return;
    }
    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Nuevo bloque de texto',
      styles: {
        bold: false,
        italic: false,
        color: '#ffffff'
      }
    };
    setEmailBlocks([...emailBlocks, newBlock]);
    setSelectedBlock(newBlock.id);
    showAlert(`Se agregó un nuevo bloque de texto.`);
  };

  const addHeaderBlock = () => {
    const hasHeader = emailBlocks.some(b => b.type === 'header');
    if (hasHeader) {
      showAlert("Solo puede haber un encabezado.");
      return;
    }
    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type: 'header',
      content: 'Título del encabezado',
      styles: {
        bold: true,
        italic: false,
        color: '#ffffff'
      }
    };
    setEmailBlocks([newBlock, ...emailBlocks]);
    setSelectedBlock(newBlock.id);
    showAlert(`Se agregó un nuevo encabezado.`);
  };

  const addDividerBlock = () => {
    if (emailBlocks.length >= MAX_BLOCKS) {
      showAlert(`Solo puedes agregar hasta ${MAX_BLOCKS} bloques.`);
      return;
    }
    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type: 'divider',
      content: '',
      styles: {
        bold: false,
        italic: false,
        color: '#ffffff'
      }
    };
    setEmailBlocks([...emailBlocks, newBlock]);
    setSelectedBlock(null);
    showAlert(`Se agregó un bloque de espaciado.`);
  };

  const addImageBlock = () => {
    const hasImage = emailBlocks.some(b => b.type === 'image');
    if (hasImage) {
      showAlert("Solo puede haber una imagen en la parte superior.");
      return;
    }

    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type: 'image',
      content: '',
      styles: {
        bold: false,
        italic: false,
        color: '#ffffff'
      },
      imageUrl: ''
    };

    setEmailBlocks([newBlock, ...emailBlocks]);
    setSelectedBlock(newBlock.id);
    showAlert("Se agregó la imagen en la parte superior.");
  };



  const showFeatureNotAvailable = (feature: string) => {
    showAlert(`La opción "${feature}" aún no está disponible.`);
  };

  const updateBlockContent = (id: string, content: string) => {
    setEmailBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const updateBlockStyle = (id: string, style: keyof EmailBlock['styles'], value: boolean | string) => {
    setEmailBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, styles: { ...block.styles, [style]: value } } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setEmailBlocks(blocks => blocks.filter(block => block.id !== id));
    setSelectedBlock(null);
    showAlert(`Se eliminó el bloque con ID: ${id}`);
  };

  const handleContinuar = () => {
    if (emailBlocks.length === 0) {
      showAlert("Agrega al menos un bloque para continuar.");
      return;
    }

    const plantillaData = {
      type: PLANTILLA_TYPE,
      blocks: emailBlocks,
    };
    const plantillaString = JSON.stringify(plantillaData);
    const maxSizeBytes = 5000 * 1024;

    if (new Blob([plantillaString]).size > maxSizeBytes) {
      showAlert("¡Has excedido el límite de almacenamiento local! Reduce el tamaño de tu contenido o usa imagenes menos pesadas antes de continuar.");
      return;
    }

    try {
      localStorage.setItem("emailBlocks", plantillaString);
      router.push("/user/marketing/detalle");
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
      showAlert("¡Error al guardar! Es posible que hayas superado el límite del navegador.");
    }
  };

  if (!user) return <div className="text-gray-600">Cargando...</div>;

  const featureButtons = [
    { icon: ImageIcon, label: "Imagen", action: addImageBlock }, // ✅ Aquí corregido
    { icon: Columns, label: "Columnas", action: () => showFeatureNotAvailable("Columnas") },
    { icon: AlignLeft, label: "Espaciado", action: addDividerBlock },
    { icon: Share2, label: "Redes", action: () => showFeatureNotAvailable("Redes") },
    { icon: Square, label: "Botones", action: () => showFeatureNotAvailable("Botones") }
  ];

  const handleRetroClean = () => {
    // limpiamos el localStorage
    localStorage.removeItem("emailBlocks");
    router.push("/user/marketing/crear");
  };



  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Email marketing</h1>
        <div className="mt-2 sm:mt-0">
          <CerrarSesion />
        </div>
      </div>

      {/* Título */}
      <div className="flex gap-4 text-center py-6 items-center max-w-[600px] pl-4">
        <ArrowLeft
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
          onClick={() => handleRetroClean()}
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">Edita el email</h2>
      </div>


      {alertMessage && (
        <div className="mx-6 mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
          {alertMessage}
        </div>
      )}

      {/* Botones */}
      <div className="bg-primary text-white dark:bg-purple-700 px-4 sm:px-6 py-3 sm:py-4 mb-4">
        <div className="flex justify-center items-center gap-3 sm:gap-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-all duration-300 bg-[#8338ea] dark:bg-purple-500 hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 dark:hover:shadow-purple-600/30"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Pre visualización</span>
          </button>
        </div>
      </div>

      {/* Preview - Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Área principal del editor */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="bg-gray-800 rounded-lg min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] p-3 sm:p-4 lg:p-6 relative">
            {showPreview ? (
              <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 w-full">
                {emailBlocks.map(block => (
                  <div key={block.id} className="mb-4">
                    {block.type === 'divider' ? (
                      <hr className="border-t border-gray-300 my-4 sm:my-6" />
                    ) : block.type === 'image' && block.imageUrl ? (
                      <Image
                        width={800}
                        height={200}
                        src={block.imageUrl}
                        alt="Imagen de la plantilla"
                        className="w-full h-auto max-h-[200px] sm:max-h-[300px] object-cover rounded mb-4"
                      />
                    ) : (
                      <p
                        className={`leading-relaxed ${block.type === 'header'
                            ? 'text-xl sm:text-2xl font-bold'
                            : 'text-sm sm:text-base'
                          } text-black break-words`}
                        style={{
                          fontWeight: block.styles.bold ? 'bold' : 'normal',
                          fontStyle: block.styles.italic ? 'italic' : 'normal',
                        }}
                      >
                        {block.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {emailBlocks.map(block => (
                  <div
                    key={block.id}
                    className={`relative bg-gray-700 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${selectedBlock === block.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-600'
                      }`}
                    onClick={() => setSelectedBlock(block.id)}
                  >
                    {block.type === 'divider' ? (
                      <div className="h-6 border-t border-dashed border-gray-500 opacity-30" />
                    ) : block.type === 'image' ? (
                      <div className="flex flex-col gap-2 w-full">
                        <input
                          type="text"
                          placeholder="URL de la imagen"
                          value={block.imageUrl || ''}
                          onChange={(e) =>
                            setEmailBlocks(prev =>
                              prev.map(b =>
                                b.id === block.id ? { ...b, imageUrl: e.target.value } : b
                              )
                            )
                          }
                          className="bg-gray-600 text-white p-2 rounded w-full text-sm"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                // Convertir la imagen a WebP
                                const webpBlob = await convertImageToWebP(file);
                                // Convertir el blob WebP a base64
                                const base64 = await convertToBase64(webpBlob);
                                // Actualizar el estado con la imagen convertida
                                setEmailBlocks(prev =>
                                  prev.map(b =>
                                    b.id === block.id ? { ...b, imageUrl: base64 } : b
                                  )
                                );
                              } catch (error) {
                                console.error("Error al procesar la imagen:", error);
                                // Opcional: mostrar un mensaje de error al usuario
                                // toast.error("Error al procesar la imagen");
                              }
                            }
                          }}
                          className="bg-gray-600 text-white p-2 rounded w-full text-sm"
                        />
                        {block.imageUrl && (
                          <Image
                            width={500}
                            height={200}
                            src={block.imageUrl}
                            alt="Imagen de la plantilla"
                            className="max-w-full h-auto max-h-[200px] sm:max-h-[300px] object-cover rounded mb-4"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          className="bg-gray-600 text-white p-2 rounded w-full resize-none text-sm"
                          placeholder={block.type === 'header' ? 'Escribe un encabezado' : 'Escribe tu texto'}
                          rows={block.type === 'header' ? 2 : 3}
                        />
                        {selectedBlock === block.id && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => updateBlockStyle(block.id, 'bold', !block.styles.bold)}
                              className={`px-2 py-1 rounded text-white ${block.styles.bold ? 'bg-blue-500' : 'bg-gray-600'}`}
                            >
                              <Bold className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateBlockStyle(block.id, 'italic', !block.styles.italic)}
                              className={`px-2 py-1 rounded text-white ${block.styles.italic ? 'bg-blue-500' : 'bg-gray-600'}`}
                            >
                              <Italic className="w-4 h-4" />
                            </button>
                            <input
                              type="color"
                              value={block.styles.color}
                              onChange={(e) => updateBlockStyle(block.id, 'color', e.target.value)}
                              className="w-8 h-8 p-0 border-none cursor-pointer rounded"
                              title="Color del texto"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className="ml-auto text-red-400 hover:text-red-300 text-xl"
                              title="Eliminar bloque"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral - Responsive */}
        <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">

          {/* Botones de creación - Grid responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={addBlock}
              disabled={emailBlocks.length >= MAX_BLOCKS}
              className={`flex flex-col items-center p-3 sm:p-4 rounded-lg shadow border text-xs sm:text-sm
          ${emailBlocks.length >= MAX_BLOCKS ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-700 hover:shadow-md'}
        `}
            >
              <Type className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-300 mb-1 sm:mb-2" />
              <span>Texto</span>
            </button>

            <button
              onClick={addHeaderBlock}
              disabled={emailBlocks.some(b => b.type === 'header') || emailBlocks.length >= MAX_BLOCKS}
              className={`flex flex-col items-center p-3 sm:p-4 rounded-lg shadow border text-xs sm:text-sm
          ${emailBlocks.some(b => b.type === 'header') || emailBlocks.length >= MAX_BLOCKS ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-700 hover:shadow-md'}
        `}
            >
              <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-300 mb-1 sm:mb-2" />
              <span>Encabezado</span>
            </button>

            {featureButtons.map(({ icon: Icon, label, action }, index) => (
              <button
                key={index}
                onClick={action}
                className="flex flex-col items-center p-3 sm:p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md border text-xs sm:text-sm"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-300 mb-1 sm:mb-2" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Propiedades del bloque seleccionado */}
          {selectedBlock && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 border">
              <h3 className="font-medium mb-3 text-gray-800 dark:text-white text-sm sm:text-base">Propiedades</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de bloque</label>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {emailBlocks.find(b => b.id === selectedBlock)?.type}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID</label>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{selectedBlock}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botón Continuar */}
          <div className="flex justify-center">
            <button
              onClick={handleContinuar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default EmailMarketingEditor;
