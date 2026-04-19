// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box,
    InputAdornment, IconButton, Alert, CircularProgress, Fade, Grow,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const AdminLogin = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- MASKOT ANIMASYON STATE'LERİ ---
    // 0: Normal (Idle)
    // 1: E-posta odaklı (Gözler yazı yazıyor gibi)
    // 2: Şifre odaklı (Gözler kapalı/ellerle kapalı)
    // 3: Şifre Göster (Eller aşağıda, gözler açık/şaşkın)
    const [mascotState, setMascotState] = useState(0);
    const [eyePosition, setEyePosition] = useState(0); // E-posta uzunluğuna göre göz hareketi

    useEffect(() => {
        // E-posta yazarken göz bebekleri hareket etsin, ama çok gitmesin
        const limit = 15;
        const pos = Math.min(email.length, limit) - (limit / 2);
        setEyePosition(pos);
    }, [email]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Giriş başarısız! E-posta veya şifre hatalı.';
            setError(errorMsg);
            setLoading(false);
        }
    };

    // --- STİL & RENKLER ---
    const colors = {
        primary: '#3B82F6',
        cardBg: '#FFFFFF',
        glassBorder: 'rgba(0, 0, 0, 0.08)',
        textMain: '#0F172A',
        textSec: '#64748B',
        yetiSkin: '#e2e8f0',
        yetiDark: '#cbd5e1',
        bgDark: '#F8FAFC'
    };

    // --- SVG MASKOT BİLEŞENİ (YETİ) ---
    const YetiMascot = () => (
        <svg width="200" height="180" viewBox="0 0 200 180" style={{ overflow: 'visible', marginBottom: '-10px' }}>
            <defs>
                <clipPath id="face-clip"><rect x="0" y="0" width="200" height="180" /></clipPath>
            </defs>

            <g transform="translate(0, 10)">
                {/* VÜCUT/KAFA (Yeti Shape) */}
                <path
                    d="M40 180 L160 180 L160 140 C160 50 140 10 100 10 C60 10 40 50 40 140 Z"
                    fill={colors.yetiSkin}
                />

                {/* KULAKLAR */}
                <path d="M30 60 C10 40 10 90 40 80" fill={colors.yetiSkin} />
                <path d="M170 60 C190 40 190 90 160 80" fill={colors.yetiSkin} />

                {/* YÜZ BÖLGESİ (açık renk) */}
                <ellipse cx="100" cy="95" rx="45" ry="35" fill="white" opacity="0.8" />

                {/* AĞIZ */}
                <g transform={mascotState === 3 ? "translate(0, 5)" : "translate(0,0)"}>
                    <path
                        d={mascotState === 3 ? "M90 115 Q100 125 110 115" : "M92 115 Q100 120 108 115"}
                        stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round"
                    />
                </g>

                {/* BURUN */}
                <ellipse cx="100" cy="105" rx="6" ry="4" fill="#334155" />

                {/* GÖZLER GRUBU */}
                <g
                    style={{
                        transition: 'all 0.2s ease',
                        opacity: mascotState === 2 && !showPassword ? 0 : 1 // Şifre modunda eller kapatacağı için gizle
                    }}
                >
                    {/* Sol Göz */}
                    <circle cx="82" cy="85" r="10" fill="white" stroke="#334155" strokeWidth="2" />
                    {/* Sağ Göz */}
                    <circle cx="118" cy="85" r="10" fill="white" stroke="#334155" strokeWidth="2" />

                    {/* Göz Bebekleri (Hareketli) */}
                    <g transform={`translate(${mascotState === 1 ? eyePosition : 0}, ${mascotState === 1 ? 2 : 0})`}>
                        <circle cx="82" cy="85" r="4" fill="#334155" />
                        <circle cx="118" cy="85" r="4" fill="#334155" />
                    </g>

                    {/* Şaşkınlık Efekti (Gözler Büyür) */}
                    {mascotState === 3 && (
                        <g>
                            <circle cx="82" cy="85" r="12" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
                            <circle cx="118" cy="85" r="12" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
                        </g>
                    )}
                </g>

                {/* ELLER (Password Gizleme İçin) */}
                {/* Sol El */}
                <path
                    d="M40 180 C30 140 60 80 82 80 C95 80 100 95 85 110 C70 125 50 160 40 180"
                    fill={colors.yetiSkin} stroke="#cbd5e1" strokeWidth="2"
                    style={{
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transformOrigin: '40px 180px',
                        transform: (mascotState === 2 || mascotState === 3) && !showPassword
                            ? 'translate(10px, -5px) rotate(-10deg)' // Kapatıyor
                            : 'translate(-40px, 150px) rotate(-45deg)', // Aşağıda
                        opacity: mascotState === 2 && !showPassword ? 1 : 0
                    }}
                />

                {/* Sağ El */}
                <path
                    d="M160 180 C170 140 140 80 118 80 C105 80 100 95 115 110 C130 125 150 160 160 180"
                    fill={colors.yetiSkin} stroke="#cbd5e1" strokeWidth="2"
                    style={{
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transformOrigin: '160px 180px',
                        transform: (mascotState === 2 || mascotState === 3) && !showPassword
                            ? 'translate(-10px, -5px) rotate(10deg)' // Kapatıyor
                            : 'translate(40px, 150px) rotate(45deg)', // Aşağıda
                        opacity: mascotState === 2 && !showPassword ? 1 : 0
                    }}
                />
            </g>
        </svg>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif"
            }}
        >
            {/* GLOBAL BACKGROUND */}
            <div className="aurora-bg" />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>

                {/* MASKOT ALANI */}
                <Box sx={{
                    height: 150,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    mb: -3,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <YetiMascot />
                </Box>

                {/* LOGIN KARTI */}
                <Grow in={true} timeout={600}>
                    <Paper
                        className="glass-panel"
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 5 },
                            borderRadius: 5,
                            bgcolor: colors.cardBg,
                            border: `1px solid ${colors.glassBorder}`,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Dekoratif Işık */}
                        <Box sx={{
                            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)',
                            animation: 'pulse 5s infinite',
                            pointerEvents: 'none'
                        }} />

                        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
                            <Typography variant="h4" fontWeight="800" sx={{ color: '#0F172A', letterSpacing: '-0.5px' }}>
                                Admin Girişi
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSec, mt: 1 }}>
                                Hoşgeldin, seni görmek güzel!
                            </Typography>
                        </Box>

                        {error && (
                            <Fade in={true}>
                                <Alert
                                    severity="error"
                                    variant="filled"
                                    sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(239, 68, 68, 0.9)', color: 'white' }}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 2 }}>

                            {/* EMAIL INPUT */}
                            <TextField
                                fullWidth
                                label="E-Posta Adresi"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setMascotState(1)}
                                onBlur={() => setMascotState(0)}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#0F172A',
                                        bgcolor: '#F8FAFC',
                                        borderRadius: 3,
                                        '& fieldset': { borderColor: 'rgba(0,0,0,0.12)', transition: '0.3s' },
                                        '&:hover fieldset': { borderColor: colors.primary },
                                        '&.Mui-focused fieldset': { borderColor: colors.primary, borderWidth: 2 }
                                    },
                                    '& .MuiInputLabel-root': { color: colors.textSec },
                                    '& .MuiInputLabel-root.Mui-focused': { color: colors.primary }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: mascotState === 1 ? colors.primary : colors.textSec }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* PASSWORD INPUT */}
                            <TextField
                                fullWidth
                                label="Şifre"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setMascotState(showPassword ? 3 : 2)}
                                onBlur={() => setMascotState(0)}
                                sx={{
                                    mb: 4,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#0F172A',
                                        bgcolor: '#F8FAFC',
                                        borderRadius: 3,
                                        '& fieldset': { borderColor: 'rgba(0,0,0,0.12)', transition: '0.3s' },
                                        '&:hover fieldset': { borderColor: colors.primary },
                                        '&.Mui-focused fieldset': { borderColor: colors.primary, borderWidth: 2 }
                                    },
                                    '& .MuiInputLabel-root': { color: colors.textSec },
                                    '& .MuiInputLabel-root.Mui-focused': { color: colors.primary }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon sx={{ color: (mascotState === 2 || mascotState === 3) ? colors.primary : colors.textSec }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    const newShow = !showPassword;
                                                    setShowPassword(newShow);
                                                    if (password.length > 0 || mascotState === 2) {
                                                        setMascotState(newShow ? 3 : 2);
                                                    }
                                                }}
                                                edge="end"
                                                sx={{ color: colors.textSec }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    bgcolor: colors.primary,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    py: 2,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        bgcolor: '#2563eb',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 12px 30px rgba(59, 130, 246, 0.6)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={26} color="inherit" /> : 'Giriş Yap'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 4, textAlign: 'center', opacity: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                © {new Date().getFullYear()} Kıyı Medya Yönetim Paneli
                            </Typography>
                        </Box>

                    </Paper>
                </Grow>
            </Container>
        </Box>
    );
};

export default AdminLogin;