// src/App.js
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from './config';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';

// Context & Guard
import { AuthProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Servisler
import authService from './services/authService';

// Bileşenler
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import PageTransition from './components/PageTransition';

// Sayfalar
import Home from './pages/Home';
import NotFound from './pages/NotFound'; // TEMP_NotFound yerine normal NotFound
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Settings from './pages/Settings';

// ============================================================
// 1. TEMA YAPILANDIRMASI (KURUMSAL AÇIK TEMA)
// ============================================================
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#1D3557',
      light: '#457B9D',
      dark: '#0F172A',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: 'rgba(0,0,0,0.08)',
    action: {
      hover: 'rgba(59, 130, 246, 0.06)',
    }
  },
  typography: {
    fontFamily: "'Outfit', 'Inter', sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
        },
      },
    },
  },
});

// ============================================================
// 2. GLOBAL AYARLAR
// ============================================================

// AXIOS AYARLARI
axios.defaults.withCredentials = true;

// Socket Bağlantısı
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  reconnection: true,
});

// --- Animated Routes Wrapper ---
const AnimatedRoutes = ({ onlineUsers }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- HALKA AÇIK SAYFALAR --- */}
        <Route path="/" element={<PageTransition><Home onlineUsers={onlineUsers} /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/gizlilik-politikasi" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/kullanim-sartlari" element={<PageTransition><TermsOfUse /></PageTransition>} />

        {/* --- YÖNETİM SAYFALARI --- */}
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard onlineUsers={onlineUsers} /></PageTransition>} />
          <Route path="/admin/settings" element={<PageTransition><Settings /></PageTransition>} />
        </Route>

        {/* 404 Sayfası */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const ADMIN_PATHS = ['/admin/dashboard', '/admin/settings'];

const AppLayout = ({ onlineUsers }) => {
  const location = useLocation();
  const isAdminPage = ADMIN_PATHS.some(p => location.pathname.startsWith(p));

  if (isAdminPage) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <AnimatedRoutes onlineUsers={onlineUsers} />
      </Box>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <AnimatedRoutes onlineUsers={onlineUsers} />
      </Box>
      <Footer onlineUsers={onlineUsers} />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
};

function App() {
  const [onlineUsers, setOnlineUsers] = useState(1);

  // ============================================================
  // 3. SOCKET VE INTERCEPTOR MANTIĞI
  // ============================================================
  useEffect(() => {
    // A) 401 Hatası Yakalayıcı
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.data.code === 'EBADCSRFTOKEN')) {
          authService.logout();
          if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // B) Socket.io
    socket.on("onlineCount", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      axios.interceptors.response.eject(interceptor);
      socket.off("onlineCount");
    };
  }, []);

  return (
    <ThemeContextProvider>
      <AuthProvider>
        {/* Özel "Cyber Navy" Temasını Uyguluyoruz */}
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Global CSS Reset (Arka plan rengini oturtur) */}

          <Router>
            <ScrollToTop />
            <AppLayout onlineUsers={onlineUsers} />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;