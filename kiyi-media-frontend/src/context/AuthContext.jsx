import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sayfa yenilenince kullanıcıyı hatırla
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            // Axios header'ı set etmeyi unutma
            axios.defaults.headers.common['Authorization'] = `Bearer ${currentUser.token}`;
        }
        setLoading(false);
    }, []);

    // --- LOGIC: YETKİ KONTROLÜ ---
    // Bu fonksiyonu tüm componentlerde kullanacağız
    const hasPermission = (requiredPermission) => {
        if (!user) return false;
        
        // Admin her şeye yetkilidir (Backend'de zaten var ama UI için ek güvenlik)
        if (user.role === 'admin') return true;

        // İzin listesinde var mı?
        return user.permissions?.includes(requiredPermission);
    };

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        // Login sonrası user state'ini güncelle (Permissions burada geliyor)
        setUser({
            token: data.token,
            ...data.user
        });
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom Hook (Kullanımı kolaylaştırmak için)
export const useAuth = () => useContext(AuthContext);