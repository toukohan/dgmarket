import React, { createContext, useContext, useState, useEffect } from "react";

import { api } from "@dgmarket/api-client";

import type { PublicUser } from "@dgmarket/types";

interface AuthContextType {
    user: PublicUser | null;
    authError: string | null;
    loading: boolean;
    initializing: boolean;
    login(email: string, password: string): Promise<void>;
    register(name: string, email: string, password: string): Promise<void>;
    logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setInitializing(false);
            });
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setAuthError(null);
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setUser(data.user);
        } catch {
            setAuthError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        setAuthError(null);
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password,
            });
            setUser(data.user);
        } catch {
            setAuthError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setAuthError(null);
        try {
            await api.post("/auth/logout");
        } catch {
            // Ignore errors — logout is best-effort
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, authError, initializing, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
