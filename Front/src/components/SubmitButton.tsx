import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  disabled?: boolean;
  loading?: boolean;
  children: string;
}

const SubmitButton = ({
  disabled = false,
  loading = false,
  children,
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: '#6b9ac3',
        color: '#0f1419'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a9db8'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b9ac3'}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default SubmitButton;
