import { EmailBlock } from "@/interface";

export const defaultDosColumnasTemplate: {
  type: string;
  blocks: EmailBlock[];
} = {
  "type": "dos-columnas",
  "blocks": [
    {
      id: "image-1",
      type: 'image',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      },
      imageUrl: "https://via.placeholder.com/600x200?text=Imagen+Superior"
    },
    {
      id: "header-1",
      type: 'header',
      content: "¡Bienvenido a nuestro boletín!",
      styles: {
        bold: true,
        italic: false,
        color: "#000000"
      }
    },
    {
      id: "columns-1",
      type: 'columns',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
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
        color: "#000000"
      }
    }
  ],
} as const;


export const defaultImagenTexto: {
  type: string;
  blocks: EmailBlock[];
} = {
  "type": "imagen-texto",
  "blocks": [
    {
      id: "image-1",
      type: 'image',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      },
      imageUrl: "https://via.placeholder.com/600x200?text=Imagen+Superior"
    },
    {
      id: "header-1",
      type: 'header',
      content: "¡Bienvenido a nuestro boletín!",
      styles: {
        bold: true,
        italic: false,
        color: "#000000"
      }
    },
    {
      id: "text-1",
      type: 'text',
      content: "Aquí puedes escribir el contenido principal de tu email.",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      }
    }
  ],
} as const;

export const defaultSoloTexto: {
  type: string;
  blocks: EmailBlock[];
} = {
  "type": "solo-texto",
  "blocks": [
    {
      id: "header-1",
      type: 'header',
      content: "¡Bienvenido a nuestro boletín!",
      styles: {
        bold: true,
        italic: false,
        color: "#000000"
      }
    },
    {
      id: "text-1",
      type: 'text',
      content: "Aquí puedes escribir el contenido principal de tu email.",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      }
    }
  ],
} as const;

export const defaultTextoImagen: {
  type: string;
  blocks: EmailBlock[];
} = {
  "type": "texto-imagen",
  "blocks": [
    {
      id: "header-1",
      type: 'header',
      content: "¡Bienvenido a nuestro boletín!",
      styles: {
        bold: true,
        italic: false,
        color: "#000000"
      }
    },
    {
      id: "text-1",
      type: 'text',
      content: "Aquí puedes escribir el contenido principal de tu email.",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      }
    },
    {
      id: "image-1",
      type: 'image',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      },
      imageUrl: "https://via.placeholder.com/600x200?text=Imagen+Superior"
    }
  ],
} as const;

export const defaultUnaColumna: {
  type: string;
  blocks: EmailBlock[];
} = {
  "type": "una-columna",
  "blocks": [
    {
      id: "image-1",
      type: 'image',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      },
      imageUrl: "https://via.placeholder.com/600x200?text=Imagen+Superior"
    },
    {
      id: "header-1",
      type: 'header',
      content: "¡Bienvenido a nuestro boletín!",
      styles: {
        bold: true,
        italic: false,
        color: "#000000"
      }
    },
    {
      id: "image-2",
      type: 'image',
      content: "",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      },
      imageUrl: "https://via.placeholder.com/600x200?text=Imagen+Superior"
    },
    {
      id: "text-1",
      type: 'text',
      content: "Aquí puedes escribir el contenido principal de tu email.",
      styles: {
        bold: false,
        italic: false,
        color: "#000000"
      }
    },
  ],
} as const;