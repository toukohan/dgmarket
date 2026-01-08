export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    user: AuthUser;
    accessToken: string;
    expiresIn?: number;
}

export interface LoginFormData {
    name: string;
    email: string;
    password: string;
}
