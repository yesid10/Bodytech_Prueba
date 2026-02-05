import type { ReactNode } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import FormError from './FormError';

interface InputFieldWithIconProps {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: ReactNode;
  error?: FieldError;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
  autoComplete?: string;
}

const InputFieldWithIcon = ({
  id,
  label,
  placeholder,
  type = 'text',
  icon,
  error,
  disabled = false,
  registration,
  autoComplete,
}: InputFieldWithIconProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          {...registration}
        />
      </div>
      <FormError error={error} />
    </div>
  );
};

export default InputFieldWithIcon;
