"use client";
import React, { useState, useRef, useCallback } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Maximize2 } from 'lucide-react';

export const ImageComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const startSize = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { src, alt, title, width, height } = node.attrs;
  const savedX = node.attrs.positionX || 0;
  const savedY = node.attrs.positionY || 0;
  
  // Inicializar posición desde atributos guardados
  React.useEffect(() => {
    setPosition({ x: savedX, y: savedY });
  }, [savedX, savedY]);

  // Funciones para manejar el arrastre de posición
  const handleImageMouseDown = useCallback((e: React.MouseEvent) => {
    // Evitar arrastre si se está clickeando en un botón de control
    const target = e.target as HTMLElement;
    if (target.closest('.resize-handle')) {
      return;
    }
    
    // Permitir arrastre cuando la imagen está seleccionada
    if (selected) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      e.preventDefault();
      e.stopPropagation();
    }
  }, [selected, position]);

  const handleImageMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      
      // Limitar el movimiento dentro del editor
      const boundedX = Math.max(-50, Math.min(window.innerWidth - 100, newX));
      const boundedY = Math.max(-50, Math.min(window.innerHeight - 100, newY));
      
      // Actualizar posición inmediatamente
      setPosition({ x: boundedX, y: boundedY });
      
      // Actualizar atributos para persistir la posición (sin bloquear)
      requestAnimationFrame(() => {
        updateAttributes({ 
          positionX: boundedX, 
          positionY: boundedY 
        });
      });
    }
  }, [isDragging, updateAttributes]);

  const handleImageMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners para el arrastre
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleImageMouseMove);
      document.addEventListener('mouseup', handleImageMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleImageMouseMove);
        document.removeEventListener('mouseup', handleImageMouseUp);
      };
    }
  }, [isDragging, handleImageMouseMove, handleImageMouseUp]);

  // Función para cambiar tamaño
  const handleResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    startSize.current = {
      width: rect.width,
      height: rect.height,
    };
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;
      
      // Calcular nuevo ancho basado en el delta mayor
      const delta = Math.max(deltaX, deltaY);
      const newWidth = Math.max(50, Math.min(800, startSize.current.width + delta));
      
      // Mantener aspect ratio
      const aspectRatio = startSize.current.height / startSize.current.width;
      const newHeight = newWidth * aspectRatio;

      updateAttributes({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes]);

  const getImageStyle = () => {
    const baseStyle: React.CSSProperties = {
      borderRadius: '8px',
      transition: isDragging ? 'none' : 'all 0.2s ease',
      userSelect: 'none',
      display: 'block',
      maxWidth: isDragging ? 'none' : '100%',
      height: 'auto',
      cursor: isDragging ? 'grabbing' : (selected ? 'grab' : 'pointer'),
      border: selected ? '2px solid #634AE2' : '1px solid transparent',
      boxShadow: selected ? '0 0 0 1px rgba(99, 74, 226, 0.2)' : 'none',
      pointerEvents: 'auto',
      // Forzar la visibilidad durante el arrastre
      visibility: 'visible',
      opacity: isDragging ? 0.8 : 1,
      position: 'relative', // Mantener relative para que esté en el flujo normal
    };

    // Aplicar dimensiones específicas si están definidas
    if (width && height) {
      baseStyle.width = `${width}px`;
      baseStyle.height = `${height}px`;
    }

    return baseStyle;
  };

  const getWrapperStyle = (): React.CSSProperties => {
    return {
      position: 'relative',
      display: 'inline-block',
      width: '100%',
      minHeight: '100px',
      overflow: 'visible',
      zIndex: isDragging ? 1000 : 'auto',
    };
  };

  return (
    <NodeViewWrapper 
      className={`image-component ${isDragging ? 'dragging' : ''}`}
      style={getWrapperStyle()}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={`relative group w-fit max-w-full ${isDragging ? 'dragging' : ''}`} style={{ 
        minHeight: '50px',
        position: 'relative',
        overflow: 'visible',
        // Aplicar el mismo transform al contenedor para que todos los elementos se muevan juntos
        transform: (isDragging || (position.x !== 0 || position.y !== 0)) 
          ? `translate(${position.x}px, ${position.y}px) translateZ(0)`
          : 'none',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        zIndex: (isDragging || (position.x !== 0 || position.y !== 0)) ? 1001 : 'auto',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={src}
          alt={alt || 'Imagen del blog'}
          title={title}
          style={getImageStyle()}
          className="transition-all duration-200"
          draggable={false}
          onMouseDown={handleImageMouseDown}
        />

        {/* Handle de redimensionamiento simple */}
        {(selected || showControls) && (
          <div
            className="resize-handle absolute bottom-1 right-1 w-6 h-6 bg-[#634AE2] rounded-tl-lg cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-[#5a3bc4]"
            onMouseDown={handleResize}
            title="Arrastrar para redimensionar"
          >
            <Maximize2 size={14} className="text-white" />
          </div>
        )}

        {/* Información básica de tamaño */}
        {selected && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {width ? `${width}×${height}px` : 'Tamaño original'}
            {(position.x !== 0 || position.y !== 0) && ` | Pos: ${Math.round(position.x)}, ${Math.round(position.y)}`}
          </div>
        )}

        {/* Indicador simple de arrastre */}
        {isDragging && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#634AE2] text-white text-sm px-3 py-1 rounded-lg shadow-lg z-50">
            Moviendo imagen...
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ImageComponent;