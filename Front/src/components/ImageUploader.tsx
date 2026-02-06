import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImageDirect, isCloudinaryConfigured } from '../services/cloudinary';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  isLoading?: boolean;
}

const ImageUploader = ({
  currentImage,
  onImageChange,
  isLoading = false,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    // Mostrar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary
    if (!isCloudinaryConfigured()) {
      toast.error('Cloudinary no está configurado');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImageDirect(file);
      onImageChange(imageUrl);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4"
              style={{ borderColor: '#6b9ac3' }}
            />
            {!uploading && !isLoading && (
              <button
                onClick={handleClear}
                className="absolute top-0 right-0 p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: '#a17171',
                  color: '#fff',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#b48282')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#a17171')
                }
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-dashed transition-colors"
            style={{ borderColor: '#6b9ac3', backgroundColor: '#252b38' }}
          >
            <Upload className="w-8 h-8" style={{ color: '#6b9ac3' }} />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isLoading}
          className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
          style={{
            backgroundColor: '#6b9ac3',
            color: '#0f1419',
          }}
          onMouseEnter={(e) =>
            !uploading &&
            !isLoading &&
            (e.currentTarget.style.backgroundColor = '#7a9db8')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#6b9ac3')
          }
        >
          {uploading || isLoading ? 'Subiendo...' : 'Cambiar imagen'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || isLoading}
      />

      <p className="text-xs text-center" style={{ color: '#b0b2b8' }}>
        Máximo 5MB • Formatos: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};

export default ImageUploader;
