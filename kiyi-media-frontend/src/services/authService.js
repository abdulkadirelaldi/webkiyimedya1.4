import axios from 'axios';
import { SERVER_URL } from '../config';

const API_URL = `${SERVER_URL}/api/auth/`;

// Axios Global Ayarı
axios.defaults.withCredentials = true;

// --- GİRİŞ İŞLEMİ ---
const login = async (email, password) => {
  try {
      const response = await axios.post(API_URL + 'login', { email, password });
      
      if (response.data.success && response.data.token) {
          
          // Backend'den gelen user objesinin içinde artık 'permissions' da var
          const userData = {
              token: response.data.token,
              _id: response.data.user._id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role,
              permissions: response.data.user.permissions || [] // İzinleri garantile
          };

          // 1. LocalStorage'a kaydet
          localStorage.setItem('user', JSON.stringify(userData));
          
          // 2. Axios header güncelle
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          console.log("✅ Giriş Başarılı. Yetkiler:", userData.permissions);
          return response.data;
      } else {
          throw new Error("Sunucudan token alınamadı.");
      }
  } catch (error) {
      console.error("🔴 Giriş Hatası:", error.response ? error.response.data : error.message);
      throw error;
  }
};

// --- ÇIKIŞ İŞLEMİ ---
const logout = async () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  try { await axios.get(API_URL + 'logout'); } catch (e) {}
  window.location.href = '/admin/login';
};

// --- KULLANICIYI GETİR ---
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

// --- YENİ: YETKİ KONTROL FONKSİYONU (Service Seviyesinde) ---
const hasRole = (requiredRole) => {
    const user = getCurrentUser();
    return user && user.role === requiredRole;
};

const authService = { login, logout, getCurrentUser, hasRole };

export default authService;