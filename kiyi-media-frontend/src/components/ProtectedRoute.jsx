import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredPermission }) => {
    const { user, hasPermission } = useAuth();

    // 1. Giriş yapmamışsa Login'e at
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // 2. Eğer özel bir izin gerekiyorsa ve kullanıcının bu izni yoksa
    if (requiredPermission && !hasPermission(requiredPermission)) {
        // Yetkisiz sayfasına veya Dashboard'a yönlendir
        alert("Bu sayfaya erişim yetkiniz yok!"); // İstersen bunu kaldır
        return <Navigate to="/admin/dashboard" replace />;
    }

    // 3. Her şey yolundaysa sayfayı göster
    return <Outlet />;
};

export default ProtectedRoute;