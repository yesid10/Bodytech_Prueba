import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../hooks/useRedux';
import { login } from '../store/slices/authSlice';
import { loginWithGoogleOAuth } from '../services/googleAuth';
import api from '../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckSquare, Loader2, Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';

interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<RegisterFormInputs>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const watchPassword = watch('password');

    const onSubmit = async (formData: RegisterFormInputs) => {
        try {
            const response = await api.post('/register', formData);
            const { token, user } = response.data;
            dispatch(login({ token, user }));
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            let message = 'Failed to register';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            toast.error(message);
        }
    };

    const handleGoogleRegister = async () => {
        setGoogleLoading(true);
        try {
            console.log('Starting Google OAuth registration...');
            const response = await loginWithGoogleOAuth();
            
            console.log('Google OAuth successful, logging in...');
            dispatch(login({
                token: response.token,
                user: response.user
            }));
            
            toast.success('Account created successfully with Google!');
            navigate('/');
        } catch (error) {
            let errorMessage = 'Failed to register with Google';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error('Google registration error:', error);
            toast.error(errorMessage);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <CheckSquare className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    placeholder="John Doe"
                                    type="text"
                                    autoComplete="name"
                                    disabled={isSubmitting}
                                    className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: 'Name must be no more than 50 characters'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\s]+$/,
                                            message: 'Name can only contain letters and spaces'
                                        }
                                    })}
                                />
                            </div>
                            {errors.name && (
                                <div className="mt-1 flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{errors.name.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    placeholder="john@example.com"
                                    type="email"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Please enter a valid email address'
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <div className="mt-1 flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{errors.email.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    placeholder="••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Password must be no more than 100 characters'
                                        },
                                        pattern: {
                                            value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="mt-1 flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{errors.password.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Confirmation Field */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password_confirmation"
                                    placeholder="••••••"
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                                        errors.password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                    {...register('password_confirmation', {
                                        required: 'Password confirmation is required',
                                        validate: (value) =>
                                            value === watchPassword || 'Passwords must match'
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <div className="mt-1 flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{errors.password_confirmation.message}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || googleLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Register
                            </button>
                        </div>

                        {/* Separador OR */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Botón Google */}
                        <button
                            type="button"
                            onClick={handleGoogleRegister}
                            disabled={googleLoading || isSubmitting}
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {googleLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                // Google SVG Icon
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 10.227a11.96 11.96 0 0 0-8.743-9.286c-.147-.057-.31-.068-.496-.068-.396 0-.76.09-1.07.272-.31.182-.545.506-.68.932-.208.648-.348 1.506-.348 2.664 0 .99.087 1.915.262 2.771.108.554.243 1.107.409 1.648-.14-.103-.245-.115-.409-.115-.418 0-.787.108-1.098.322-.31.215-.57.508-.769.873-.2.365-.3.855-.3 1.46 0 .604.1 1.094.3 1.459.2.365.46.658.769.873.31.214.68.322 1.098.322.418 0 .787-.108 1.098-.322.31-.215.57-.508.769-.873.2-.364.3-.854.3-1.459zm-9.69 3.876c-.278.175-.618.264-.992.264-.374 0-.713-.089-.992-.264.176.457.488.856.913 1.18.425.323.94.485 1.509.485.569 0 1.084-.162 1.509-.485.425-.324.737-.723.913-1.18zm3.76-4.008c-.31.182-.72.273-1.204.273-.484 0-.895-.091-1.204-.273-.31-.182-.548-.426-.705-.732-.157-.305-.236-.641-.236-1.007 0-.366.079-.702.236-1.007.157-.306.395-.55.705-.732.31-.182.72-.273 1.204-.273.484 0 .895.091 1.204.273.31.182.548.426.705.732.157.305.236.641.236 1.007 0 .366-.079.702-.236 1.007-.157.306-.395.55-.705.732z" />
                                </svg>
                            )}
                            {googleLoading ? 'Signing up...' : 'Sign up with Google'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;