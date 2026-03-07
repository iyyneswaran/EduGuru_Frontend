import React, { createContext, useContext, useState, useEffect } from 'react';

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE = `${API_ROOT}/api/users`;
const TOKEN_STORAGE_KEY = 'eduguru_token';

interface User {
    id: string;
    name: string;
    email: string;
}

interface ApiResponse {
    success?: boolean;
    message?: string;
    token?: string;
    data?: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setIsLoading(false);
        }
    }, []);

    async function readJson(response: Response): Promise<ApiResponse | null> {
        try {
            return (await response.json()) as ApiResponse;
        } catch {
            return null;
        }
    }

    async function fetchProfile() {
        try {
            const res = await fetch(`${API_BASE}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await readJson(res);
            if (res.ok && data?.success && data.data) {
                setUser(data.data);
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await readJson(res);

        if (!res.ok || !data?.success || !data.token) {
            throw new Error(data?.message || 'Invalid credentials');
        }

        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        setToken(data.token);

        try {
            // Fetch user profile after login
            const profileRes = await fetch(`${API_BASE}/profile`, {
                headers: { Authorization: `Bearer ${data.token}` },
            });
            const profileData = await readJson(profileRes);
            if (profileRes.ok && profileData?.success && profileData.data) {
                setUser(profileData.data);
                return;
            }
            throw new Error(profileData?.message || 'Failed to load profile');
        } catch (error) {
            logout();
            throw error;
        }
    }

    async function signup(name: string, email: string, password: string) {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await readJson(res);

        if (!res.ok || !data?.success) {
            throw new Error(data?.message || 'Registration failed');
        }

        // Auto-login after signup
        await login(email, password);
    }

    function logout() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
