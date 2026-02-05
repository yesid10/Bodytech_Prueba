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
        <CheckSquare className="w-12 h-12 text-indigo-600" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        O{' '}
        <Link
          to={linkTo}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthHeader;
