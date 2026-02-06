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
  toggleButton?: ReactNode;
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
  toggleButton,
}: InputFieldWithIconProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: '#b0b2b8' }}>
        {label}
      </label>
      <div className="mt-1 relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          className="appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors"
          style={{
            borderColor: error ? '#a17171' : '#5a7a9a',
            backgroundColor: '#252b38',
            color: '#e5e7eb'
          }}
          {...registration}
        />
        {toggleButton && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {toggleButton}
          </div>
        )}
      </div>
      <FormError error={error} />
    </div>
  );
};

export default InputFieldWithIcon;
