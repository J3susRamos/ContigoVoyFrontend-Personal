import { EmailBlock } from "@/interface";

export const defaultDosColumnasTemplate: {
  type: string;
  blocks: EmailBlock[];
} = {
  "type": "dos-columnas",
  "blocks": [
    {
      id: "header-1",
      type: 'header',
      content: "¡Bienvenido a nuestro boletín!",
      styles: {
        bold: true,
        italic: false,
        color: "#ffffff"
      }
    },
    {
      id: "image-1",
      type: 'image',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#ffffff"
      },
      imageUrl: "https://via.placeholder.com/600x200?text=Imagen+Superior"
    },
    {
      id: "columns-1",
      type: 'columns',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#ffffff"
      },
      imageUrls: [
        "https://via.placeholder.com/250x250?text=Columna+1",
        "https://via.placeholder.com/250x250?text=Columna+2"
      ]
    },
    {
      id: "text-1",
      type: 'text',
      content: "Aquí puedes escribir el contenido principal de tu email.",
      styles: {
        bold: false,
        italic: false,
        color: "#ffffff"
      }
    }
  ],
} as const;