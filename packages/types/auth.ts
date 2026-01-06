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

export interface RefreshToken {
    id: number;
    userId: number;
    tokenHash: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: Date;
    expiresAt: Date;
    revokedAt?: Date | null;
}
