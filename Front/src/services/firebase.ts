import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    type User
} from 'firebase/auth';

/**
 * Configuración de Firebase
 * Valores obtenidos desde Firebase Console
 * https://console.firebase.google.com/
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar proveedor de Google
const googleProvider = new GoogleAuthProvider();

/**
 * Login con Google usando popup
 * Abre popup de Google para autenticación
 * Retorna el ID Token que se envía al backend
 * 
 * @returns {Promise<string>} ID Token para enviar al backend
 */
export const loginWithGoogle = async (): Promise<string> => {
    try {
        // Hacer popup de Google
        const result = await signInWithPopup(auth, googleProvider);
        
        // Obtener ID Token para enviar al backend
        const token = await result.user.getIdToken();
        
        return token;
    } catch (error) {
        console.error('Error logging in with Google:', error);
        throw error;
    }
};

/**
 * Logout del usuario
 */
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

/**
 * Obtener datos del usuario actualmente autenticado en Firebase
 * (OPCIONAL - Firebase puede ser solo para Google OAuth)
 * 
 * @returns {User | null} Usuario actual o null
 */
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

/**
 * Listener para cambios de estado de autenticación
 * Se ejecuta cuando usuario hace login/logout en Firebase
 * 
 * @param {function} callback Función que se ejecuta con el usuario
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};
