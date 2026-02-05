import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  loadingText: string;
  defaultText: string;
}

const GoogleAuthButton = ({
  onClick,
  loading,
  disabled,
  loadingText,
  defaultText,
}: GoogleAuthButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex justify-center items-center gap-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        // Ícono de Google
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon w-5 icon-tabler icons-tabler-filled icon-tabler-brand-google"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
        </svg>
      )}
      {loading ? loadingText : defaultText}
    </button>
  );
};

export default GoogleAuthButton;
