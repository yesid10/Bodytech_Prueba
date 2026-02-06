export interface User {
    id: number;
    name: string;
    email: string;
    google_id?: string;
    google_avatar_url?: string;
    profile_image_url?: string;
    auth_provider?: 'local' | 'google';
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'done';
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    message?: string;
    user: User;
    token: string; // The token might be in 'token' or 'access_token' depending on the response, usually 'access_token' for login
    access_token?: string; // To handle both cases safely
}
