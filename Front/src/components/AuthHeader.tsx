import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

const AuthHeader = ({ title, subtitle, linkText, linkTo }: AuthHeaderProps) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <CheckSquare className="w-12 h-12" style={{ color: '#6b9ac3' }} />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#e5e7eb' }}>
        {title}
      </h2>
      <p className="mt-2 text-center text-sm" style={{ color: '#b0b2b8' }}>
        O{' '}
        <Link
          to={linkTo}
          className="font-medium transition-colors"
          style={{ color: '#6b9ac3' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#7a9db8'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b9ac3'}
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthHeader;
