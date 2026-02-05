import type { FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  error?: FieldError;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;

  return (
    <div className="mt-1 flex items-center gap-2 text-red-600">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">{error.message}</span>
    </div>
  );
};

export default FormError;
