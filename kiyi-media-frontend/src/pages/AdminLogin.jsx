// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Alert, CircularProgress, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        '& fieldset': { borderColor: 'rgba(255,255,255,0.12)', transition: '0.3s' },
        '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#60A5FA' },
    '& input': { color: '#fff' },
};

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'E-posta veya şifre hatalı.');
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            bgcolor: '#060C1A',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Arka plan glow'ları */}
            <Box sx={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* SOL PANEL — sadece desktop */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                px: 8,
                pt: 8,
                borderRight: '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
                zIndex: 1,
            }}>
                <Typography variant="h3" fontWeight={900} color="white" sx={{ mb: 2, lineHeight: 1.15, fontSize: '2.8rem' }}>
                    Yönetim<br />
                    <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Paneline Hoş Geldiniz</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, maxWidth: 380, mb: 6 }}>
                    Kıyı Medya içerik, portföy ve müşteri yönetim sistemi. Yetkili personel girişi.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['Portföy ve içerik yönetimi', 'Müşteri ve proje takibi', 'Analitik ve raporlama'].map((text, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: '#3B82F6', fontSize: 18 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{text}</Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 'auto', pt: 6 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', letterSpacing: 0.5 }}>
                        © {new Date().getFullYear()} Kıyı Medya · Tüm hakları saklıdır
                    </Typography>
                </Box>
            </Box>

            {/* SAĞ PANEL — form */}
            <Box sx={{
                width: { xs: '100%', md: '480px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                px: { xs: 3, sm: 6 },
                pt: { xs: 6, md: 10 },
                pb: 6,
                position: 'relative',
                zIndex: 1,
            }}>
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.7, mb: 3, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <ShieldIcon sx={{ fontSize: 14, color: '#60A5FA' }} />
                        <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>GÜVENLİ GİRİŞ</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={900} color="white" sx={{ mb: 1, letterSpacing: '-0.02em' }}>Giriş Yapın</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>Yetkili hesabınızla devam edin</Typography>
                </Box>

                {error && (
                    <Fade in>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5', '& .MuiAlert-icon': { color: '#F87171' } }}>
                            {error}
                        </Alert>
                    </Fade>
                )}

                <form onSubmit={handleLogin}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            fullWidth label="E-Posta Adresi" variant="outlined"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required type="email" sx={inputStyle}
                            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }}
                        />
                        <TextField
                            fullWidth label="Şifre" variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required sx={inputStyle}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#60A5FA' } }}>
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit" fullWidth variant="contained" size="large"
                            disabled={loading}
                            sx={{
                                mt: 1,
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                color: 'white', py: 1.8, borderRadius: 2,
                                fontWeight: 700, fontSize: '1rem', textTransform: 'none',
                                boxShadow: '0 8px 30px rgba(59,130,246,0.35)',
                                '&:hover': { opacity: 0.92, transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(59,130,246,0.5)' },
                                transition: 'all 0.3s',
                            }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Giriş Yap'}
                        </Button>
                    </Box>
                </form>

                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.15)', textAlign: 'center', mt: 6, display: 'block' }}>
                    © {new Date().getFullYear()} Kıyı Medya Yönetim Sistemi
                </Typography>
            </Box>
        </Box>
    );
};

export default AdminLogin;
