import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from '../hooks/useRedux';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAppSelector(state => state.auth);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAppSelector(state => state.auth);
    
    if (loading) {
       return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRouter = () => {
    // Ya no necesitamos validar el token al cargar - simplemente confiamos en localStorage
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                    </Route>

                    {/* Catch all route - redirect to home or 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;
