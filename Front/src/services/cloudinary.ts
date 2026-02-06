/**
 * Configuración de Cloudinary
 */
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

/**
 * Validar configuración de Cloudinary
 */
export const isCloudinaryConfigured = (): boolean => {
  return Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);
};

/**
 * Subir imagen a Cloudinary usando el widget
 */
export const uploadImageToCloudinary = (
  onSuccess: (url: string) => void,
  onError?: (error: string) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    interface CloudinaryWindow {
      cloudinary?: {
        createUploadWidget?: (
          config: Record<string, unknown>,
          callback: (error: unknown, result: Record<string, unknown>) => void
        ) => { open: () => void };
      };
    }
    
    const cloudinaryWindow = window as unknown as CloudinaryWindow;
    const createUploadWidget = cloudinaryWindow?.cloudinary?.createUploadWidget;
    
    if (typeof createUploadWidget !== 'function') {
      const errorMsg = 'Cloudinary no está configurado correctamente';
      onError?.(errorMsg);
      reject(new Error(errorMsg));
      return;
    }

    const widget = createUploadWidget(
      {
        cloudName: cloudinaryConfig.cloudName,
        uploadPreset: cloudinaryConfig.uploadPreset,
        folder: 'bodytech-users',
        resourceType: 'auto',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 5242880, // 5MB
      },
      (error: unknown, result: Record<string, unknown>) => {
        if (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          onError?.(errorMessage);
          reject(error);
        }
        if ((result as Record<string, unknown>)?.event === 'success') {
          const imageUrl = (result?.info as Record<string, unknown>)?.secure_url as string;
          onSuccess(imageUrl);
          resolve();
        }
      }
    );

    if (widget && typeof widget.open === 'function') {
      widget.open();
    } else {
      const errorMsg = 'No se pudo abrir el widget de Cloudinary';
      onError?.(errorMsg);
      reject(new Error(errorMsg));
    }
  });
};

/**
 * Subir imagen directamente usando la API de Cloudinary
 * (Alternativa más simple sin widget)
 */
export const uploadImageDirect = async (file: File): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary no está configurado');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', 'bodytech-users');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json() as Record<string, unknown>;
    return data?.secure_url as string;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
