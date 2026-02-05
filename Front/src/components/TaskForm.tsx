import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import FormError from './FormError';

interface CreateTaskFormInputs {
  title: string;
  description: string;
}

interface TaskFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onSubmit: (data: CreateTaskFormInputs) => void;
  onClose: () => void;
}

const TaskForm = ({ isOpen, isSubmitting, onSubmit, onClose }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormInputs>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateTaskFormInputs) => {
    await onSubmit(data);
    reset();
  };

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
          <h2 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Nueva Tarea</h2>
          <button
            onClick={handleClose}
            className="transition-colors"
            style={{ color: '#b0b2b8' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#b0b2b8'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: '#b0b2b8' }}>
              Título *
            </label>
            <input
              type="text"
              id="title"
              placeholder="¿Qué necesita hacerse?"
              disabled={isSubmitting}
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: '#252b38',
                borderColor: errors.title ? '#a17171' : '#5a7a9a',
                color: '#e5e7eb',
                borderWidth: '1px'
              }}
              {...register('title', {
                required: 'El título es requerido',
                minLength: {
                  value: 3,
                  message: 'El título debe tener al menos 3 caracteres',
                },
                maxLength: {
                  value: 255,
                  message: 'El título no debe exceder 255 caracteres',
                },
              })}
            />
            <FormError error={errors.title} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: '#b0b2b8' }}>
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Agregar algunos detalles..."
              disabled={isSubmitting}
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 resize-none transition-all"
              style={{
                backgroundColor: '#252b38',
                borderColor: errors.description ? '#a17171' : '#5a7a9a',
                color: '#e5e7eb',
                borderWidth: '1px'
              }}
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'La descripción no debe exceder 1000 caracteres',
                },
              })}
            />
            <FormError error={errors.description} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
              style={{
                borderColor: '#5a7a9a',
                color: '#b0b2b8',
                backgroundColor: '#252b38'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1f2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#252b38'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                color: '#0f1419',
                backgroundColor: '#6b9ac3'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a9db8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b9ac3'}
            >
              {isSubmitting ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
