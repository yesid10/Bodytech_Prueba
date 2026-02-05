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
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default SubmitButton;
