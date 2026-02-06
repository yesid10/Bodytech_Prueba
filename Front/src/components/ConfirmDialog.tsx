import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-2xl max-w-md w-full border" style={{
        backgroundColor: '#1a1f2a',
        borderColor: '#5a7a9a'
      }}>
        <div className="flex items-center justify-between p-6 border-b" style={{
          borderColor: '#5a7a9a'
        }}>
          <div className="flex items-center gap-3">
            <AlertCircle size={24} style={{ color: isDangerous ? '#a17171' : '#6b9ac3' }} />
            <h2 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="transition-colors disabled:opacity-50"
            style={{ color: '#b0b2b8' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#b0b2b8'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p style={{ color: '#b0b2b8' }} className="mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
              style={{
                borderColor: '#5a7a9a',
                color: '#b0b2b8',
                backgroundColor: '#252b38'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1f2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#252b38'}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
              style={{
                color: isDangerous ? '#0f1419' : '#0f1419',
                backgroundColor: isDangerous ? '#a17171' : '#6b9ac3'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDangerous ? '#b18c8c' : '#7a9db8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDangerous ? '#a17171' : '#6b9ac3';
              }}
            >
              {isLoading ? 'Eliminando...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
