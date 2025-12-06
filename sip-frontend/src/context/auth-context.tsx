"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { http } from "@/lib/http";
import { useRouter } from "next/navigation";

type UserData = {
    nama: string;
    nomor_induk: string;
    kelas: string | null;
    role: string;
};

type AuthContextType = {
    user: UserData | null;
    loading: boolean;
    login: (token: string, redirectUrl?: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setUser(null);
        router.push("/");
    }, [router]);

    const fetchProfile = useCallback(async () => {
        try {
            const response = await http.get<{ data: UserData }>("/profile");
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            logout(); // Clear invalid token
        } finally {
            setLoading(false);
        }
    }, [logout]);

    const login = async (token: string, redirectUrl?: string) => {
        if(token != ""){
            localStorage.setItem("token", token);
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
            await fetchProfile();
        }
        
        if (redirectUrl) {
            try {
                const url = new URL(redirectUrl);
                router.push(url.pathname + url.search);
            } catch {
                router.push(redirectUrl);
            }
        } else {
            router.push("/dashboard");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [fetchProfile]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
