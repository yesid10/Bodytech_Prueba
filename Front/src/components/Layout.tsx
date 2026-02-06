import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../store/slices/authSlice';
import { LogOut, CheckSquare } from 'lucide-react';

const Layout = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: '#0f1419', color: '#e5e7eb' }}>
            <nav className="shadow-sm" style={{ backgroundColor: '#1a1f2a', borderBottom: '1px solid #5a7a9a' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="shrink-0 flex items-center gap-2 font-bold text-xl transition-colors" style={{ color: '#6b9ac3' }} onMouseEnter={(e) => e.currentTarget.style.color = '#7a9db8'} onMouseLeave={(e) => e.currentTarget.style.color = '#6b9ac3'}>
                                <CheckSquare className="w-6 h-6" />
                                <span>TaskManager</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm hidden sm:block" style={{ color: '#b0b2b8' }}>Bienvenido, <span className="font-semibold" style={{ color: '#e5e7eb' }}>{user?.name}</span></span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex cursor-pointer items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: '#252b38',
                                    borderColor: '#5a7a9a',
                                    color: '#b0b2b8'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1a1f2a';
                                    e.currentTarget.style.borderColor = '#6b9ac3';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#252b38';
                                    e.currentTarget.style.borderColor = '#5a7a9a';
                                }}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
