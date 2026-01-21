import imageCompression from 'browser-image-compression';

export const convertToWebP = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    throw error;
  }
};

export const resizeImage = async (file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    fileType: 'image/webp',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Erro ao redimensionar imagem:', error);
    throw error;
  }
};

