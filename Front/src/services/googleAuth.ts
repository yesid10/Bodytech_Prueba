import api from './api';
import { loginWithGoogle as firebaseLoginWithGoogle } from './firebase';
import type { User } from '../types';

/**
 * Interface para la respuesta del backend
 */
interface GoogleLoginResponse {
    message: string;
    token: string;
    user: User;
}

/**
 * Flujo completo de login con Google:
 * 1. Abre popup de Google con Firebase SDK
 * 2. Usuario se autentica
 * 3. Obtiene ID Token de Firebase
 * 4. Envía token al backend
 * 5. Backend verifica, crea/actualiza usuario
 * 6. Backend retorna JWT token + datos usuario
 * 7. Retorna JWT token para mantener sesión
 * 
 * @returns {Promise<GoogleLoginResponse>} Token JWT y datos del usuario
 * @throws {Error} Si hay error en algún paso
 */
export const loginWithGoogleOAuth = async (): Promise<GoogleLoginResponse> => {
    try {
        // 1. Abrir popup de Google y obtener Firebase ID token
        console.log('Opening Google OAuth popup...');
        const googleIdToken = await firebaseLoginWithGoogle();
        console.log('Google authentication successful');

        // 2. Enviar token a nuestro backend
        console.log('Sending token to backend...');
        const response = await api.post<GoogleLoginResponse>('/login-google', {
            google_token: googleIdToken,
        });

        console.log('Backend authentication successful');
        
        // 3. Retornar JWT token + user data del backend
        return response.data;

    } catch (error) {
        console.error('Error during Google OAuth login:', error);
        
        // Extraer mensaje de error más específico
        if (error instanceof Error) {
            throw new Error(`Google login failed: ${error.message}`);
        }
        
        throw new Error('Google login failed');
    }
};
