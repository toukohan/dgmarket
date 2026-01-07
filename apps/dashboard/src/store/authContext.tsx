import React, { createContext, useState, use } from "react";

import { api } from "@dgmarket/api-client";

import type { AuthUser } from "@dgmarket/types";

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = use(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within a provider");
    }

    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useProvideAuth();
    return <AuthContext value={auth}>{children}</AuthContext>;
};

const useProvideAuth = (): AuthContextType => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setLoading(true);
        const response = await api.post("/auth/login", { email, password });
        if (response.status === 200) {
            setUser(response.data.user);
        }
        setLoading(false);
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
        });

        if (response.status === 201) {
            setUser(response.data.user);
        }
        setLoading(false);
    };

    const logout = async () => {
        setLoading(true);
        const response = await api.post("/auth/logout");
        if (response.status === 204) {
            setUser(null);
        }
        setLoading(false);
    };

    return {
        user,
        login,
        logout,
        register,
        loading,
    };
};
