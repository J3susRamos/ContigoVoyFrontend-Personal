"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {ArrowLeft, Eye, Type, Columns, Hash, Share2, Square, Image, AlignLeft, Bold, Italic} from "lucide-react";
import { UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";

interface EmailBlock {
  id: string;
  type: 'text' | 'header' | 'divider'  | 'image';
  content: string;
  styles: {
    bold: boolean;
    italic: boolean;
    color: string;
  };
  imageUrl?: string; 
}

const EmailMarketingEditor = () => {
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([ ]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
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
      showAlert("Solo puede haber una imagen y se ubicará automáticamente en la parte inferior.");
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
    showAlert("Se agregó la imagen en la parte inferior.");
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

  const updateBlockStyle = (id: string, style: keyof EmailBlock['styles'], value: any) => {
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
  
    localStorage.setItem("emailBlocks", JSON.stringify(emailBlocks));
    router.push("/user/marketing/detalle");
  };

  if (!user) return <div className="text-gray-600">Cargando...</div>;

  const featureButtons = [
    { icon: Image, label: "Imagen", action: addImageBlock }, // ✅ Aquí corregido
    { icon: Columns, label: "Columnas", action: () => showFeatureNotAvailable("Columnas") },
    { icon: AlignLeft, label: "Espaciado", action: addDividerBlock },
    { icon: Share2, label: "Redes", action: () => showFeatureNotAvailable("Redes") },
    { icon: Square, label: "Botones", action: () => showFeatureNotAvailable("Botones") }
  ];
  
  
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Email marketing
          </h1>
        </div>
        <CerrarSesion />
      </div>

      <div className="flex text-center py-6 items-center max-w-[600px]">
      <ArrowLeft
        className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
        onClick={() => router.push("/user/marketing/crear")}
      />
      <h2 className="text-3xl font-bold text-purple-400">Edita el email</h2>
      </div>


      {alertMessage && (
        <div className="mx-6 mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
          {alertMessage}
        </div>
      )}

      <div className="bg-primary text-white px-6 py-4">
        <div className="flex justify-center items-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 bg-primary px-4 py-2 rounded hover:bg-primary transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Pre visualización</span>
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 p-6">
          <div className="bg-gray-800 rounded-lg min-h-[500px] p-6 relative">
            {showPreview ? (
              <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
                {[
  ...emailBlocks.filter(b => b.type !== 'image'),
  ...emailBlocks.filter(b => b.type === 'image')
].map(block => (
                  <div key={block.id} className="mb-4">
                    {block.type === 'divider' ? (
                      <hr className="border-t border-gray-300 my-6" />
                    ) : block.type === 'image' && block.imageUrl ? (
                      <img
                        src={block.imageUrl}
                        alt="Imagen"
                        className="w-full h-auto max-h-[300px] object-cover rounded mb-4"
                      />
                    ) : (
                      <p
                        className={`leading-relaxed ${
                          block.type === 'header' ? 'text-2xl font-bold' : 'text-base'
                        }`}
                        style={{
                          fontWeight: block.styles.bold ? 'bold' : 'normal',
                          fontStyle: block.styles.italic ? 'italic' : 'normal',
                          color: block.styles.color
                        }}
                      >
                        {block.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  ...emailBlocks.filter(block => block.type !== 'image'),
                  ...emailBlocks.filter(block => block.type === 'image')
                ].map(block => (
          <div
            key={block.id}
            className={`relative bg-gray-700 rounded-lg p-4 cursor-pointer transition-all ${
              selectedBlock === block.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-600'
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
                  className="bg-gray-600 text-white p-2 rounded w-full"
                />
                <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result as string;
                    setEmailBlocks(prev =>
                      prev.map(b =>
                        b.id === block.id ? { ...b, imageUrl: base64 } : b
                      )
                    );
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="bg-gray-600 text-white p-2 rounded w-full"
            />
            
                {block.imageUrl && (
                  <img
                    src={block.imageUrl}
                    alt="Imagen superior"
                    className="w-full h-auto max-h-[300px] object-cover rounded mb-4"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="bg-gray-600 text-white p-2 rounded w-full resize-none"
                  placeholder={block.type === 'header' ? 'Escribe un encabezado' : 'Escribe tu texto'}
                  rows={block.type === 'header' ? 2 : 3}
                />
                {selectedBlock === block.id && (
                  <div className="flex items-center gap-2">
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
                      className="w-8 h-8 p-0 border-none cursor-pointer"
                      title="Color del texto"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                      className="ml-auto text-red-400 hover:text-red-300"
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

                <div className="w-80 bg-gray-50 dark:bg-gray-800 p-4 border-l border-gray-200 dark:border-gray-700">
          {/* Botones de creación */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={addBlock}
              disabled={emailBlocks.length >= MAX_BLOCKS}
              className={`flex flex-col items-center p-4 rounded-lg shadow border
                ${emailBlocks.length >= MAX_BLOCKS ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-700 hover:shadow-md'}
              `}
            >
              <Type className="w-8 h-8 text-gray-600 dark:text-gray-300 mb-2" />
              <span className="text-sm">Texto</span>
            </button>

            <button
              onClick={addHeaderBlock}
              disabled={emailBlocks.some(b => b.type === 'header') || emailBlocks.length >= MAX_BLOCKS}
              className={`flex flex-col items-center p-4 rounded-lg shadow border
                ${emailBlocks.some(b => b.type === 'header') || emailBlocks.length >= MAX_BLOCKS ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-700 hover:shadow-md'}
              `}
            >
              <Hash className="w-8 h-8 text-gray-600 dark:text-gray-300 mb-2" />
              <span className="text-sm">Encabezado</span>
            </button>

            {featureButtons.map(({ icon: Icon, label, action }, index) => (
          <button
            key={index}
            onClick={action}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md border"
          >
            <Icon className="w-8 h-8 text-gray-600 dark:text-gray-300 mb-2" />
            <span className="text-sm">{label}</span>
          </button>
        ))}

          </div>

          {/* Propiedades del bloque seleccionado */}
          {selectedBlock && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4 border">
              <h3 className="font-medium mb-3 text-gray-800 dark:text-white">Propiedades</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de bloque</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {emailBlocks.find(b => b.id === selectedBlock)?.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{selectedBlock}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleContinuar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
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
