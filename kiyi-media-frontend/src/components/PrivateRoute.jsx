// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
    // Context'ten kullanıcı ve yükleme durumunu al
    const { user, loading } = useAuth();

    // 1. Henüz kullanıcı verisi kontrol ediliyorsa (Sayfa yenileme anı)
    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                bgcolor: 'background.default' 
            }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // 2. Kullanıcı giriş yapmamışsa -> Login'e at
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // 3. Yetki Kontrolü (Opsiyonel)
    // Sadece Admin, Editör ve Viewer panele girebilir.
    // Standart 'user' (web sitesi üyesi) girmeye çalışırsa ana sayfaya atılır.
    const allowedRoles = ['admin', 'editor', 'viewer'];
    
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // 4. Sorun yoksa alt rotaları (Dashboard, Settings vb.) göster
    return <Outlet />;
};

export default ProtectedRoute;