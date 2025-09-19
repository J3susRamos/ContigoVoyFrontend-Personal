import { string } from "zod";

// Función para verificar si una URL es base64
export const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image/');
};

// Función para convertir base64 a File
export const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Función para subir imagen a Cloudinary usando unsigned upload
export const uploadImageToCloudinary = async (
  imageData: string,
  options: {
    folder?: string;
    public_id?: string;
  } = {}
): Promise<{
  url: string;
  public_id: string;
  width: number;
  height: number;
}> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing');
  }

  try {
    const formData = new FormData();
    const file = base64ToFile(imageData, `image-${Date.now()}.jpg`);
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    if (options.folder) formData.append('folder', options.folder);
    if (options.public_id) formData.append('public_id', options.public_id);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error uploading image');
    }

    const data = await response.json();

    // Aplica transformaciones en la URL (no en el upload)
    return {
      url: `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_800,h_600,q_auto,f_auto/${data.public_id}`,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Función para procesar múltiples imágenes
export const processImages = async (
  imageUrls: string[],
  folder: string = 'email-marketing'
): Promise<string[]> => {
  const processedUrls: string[] = [];

  for (const url of imageUrls) {
    if (isBase64Image(url)) {
      try {
        const result = await uploadImageToCloudinary(url, { folder });
        processedUrls.push(result.url);
      } catch (error) {
        console.error('Error processing image:', error);
        processedUrls.push(url); // Mantener URL original si falla
      }
    } else {
      processedUrls.push(url); // Ya es URL de Cloudinary o externa
    }
  }

  return processedUrls;
};

// Función para procesar bloques de email
export const processEmailBlocks = async (
  blocks: any[],
  folder: string = 'email-marketing',
  onProgress?: (current: number, total: number) => void
): Promise<any[]> => {
  const processedBlocks = [];
  let processedCount = 0;

  // Contar total de imágenes a procesar
  const totalImages = blocks.reduce((count, block) => {
    if (block.type === 'image' && block.imageUrl && isBase64Image(block.imageUrl)) {
      return count + 1;
    }
    if (block.type === 'columns' && block.imageUrls) {
      return count + block.imageUrls.filter((url: string) => url && isBase64Image(url)).length;
    }
    return count;
  }, 0);

  for (const block of blocks) {
    if (block.type === 'image' && block.imageUrl) {
      const processedBlock = { ...block };
      if (isBase64Image(block.imageUrl)) {
        try {
          const result = await uploadImageToCloudinary(block.imageUrl, { folder });
          processedBlock.imageUrl = result.url;
          processedCount++;
          onProgress?.(processedCount, totalImages);
        } catch (error) {
          console.error('Error processing image block:', error);
          // Mantener la URL original si falla
        }
      }
      processedBlocks.push(processedBlock);
    } else if (block.type === 'columns' && block.imageUrls) {
      const processedBlock = { ...block };
      const processedImageUrls = [];

      for (const url of block.imageUrls) {
        if (url && isBase64Image(url)) {
          try {
            const result = await uploadImageToCloudinary(url, { folder });
            processedImageUrls.push(result.url);
            processedCount++;
            onProgress?.(processedCount, totalImages);
          } catch (error) {
            console.error('Error processing column image:', error);
            processedImageUrls.push(url); // Mantener URL original si falla
          }
        } else {
          processedImageUrls.push(url);
        }
      }

      processedBlock.imageUrls = processedImageUrls;
      processedBlocks.push(processedBlock);
    } else {
      processedBlocks.push(block);
    }
  }

  return processedBlocks;
};

// Función para extraer public_id de URL de Cloudinary
export const getPublicIdFromCloudinaryUrl = (url: string): string | null => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\./;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

// Función para eliminar imagen de Cloudinary (requiere signed request)
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      console.warn('Cloudinary configuration incomplete for delete operation');
      return false;
    }

    // Nota: Para eliminar imágenes necesitas hacer una signed request
    // Esto requiere el API secret que no debe estar en el cliente
    // Considera implementar esta funcionalidad en tu backend
    console.warn('Delete operation requires server-side implementation');
    return false;

  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Función para obtener información de una imagen de Cloudinary
export const getImageInfo = async (publicId: string): Promise<any> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      throw new Error('Cloudinary cloud name is missing');
    }

    const response = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.json`
    );

    if (!response.ok) {
      throw new Error('Failed to get image info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting image info:', error);
    throw error;
  }
};

// Función para generar URL de Cloudinary con transformaciones
export const generateCloudinaryUrl = (
  publicId: string,
  transformations: string[] = []
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is missing');
  }

  const transformationString = transformations.length > 0
    ? `/${transformations.join(',')}`
    : '';

  return `https://res.cloudinary.com/${cloudName}/image/upload${transformationString}/${publicId}`;
};