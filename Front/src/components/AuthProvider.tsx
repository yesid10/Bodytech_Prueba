import { createContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser } from '../services/authUtils';
import { type AuthContextType } from '../types/auth';
import type { User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const AuthProviderComponent = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const { user } = await getCurrentUser(token);
                    setUser(user);
                } catch (error) {
                    console.error("Failed to load user", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export { AuthProviderComponent as AuthProvider };