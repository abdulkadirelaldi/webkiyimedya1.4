// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box,
    Avatar, Grid, Alert, Tabs, Tab, Stack, Divider, InputAdornment, IconButton, Tooltip,
    useTheme
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { SERVER_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const adminTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#3B82F6' },
        background: { default: '#F8FAFC', paper: '#FFFFFF' },
        text: { primary: '#0F172A', secondary: '#64748B' },
    },
    typography: { fontFamily: "'Inter', 'Outfit', sans-serif" },
    shape: { borderRadius: 8 },
    components: {
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    },
});

const Settings = () => {
    const theme = useTheme(); // Tema kullanımı
    const isDark = theme.palette.mode === 'dark';
    
    const { user, login } = useAuth(); 
    const [tabValue, setTabValue] = useState(0);
    const [message, setMessage] = useState(null);

    // Profil Formu
    const [profile, setProfile] = useState({
        name: '', email: '', phone: ''
    });

    // Dosya Yönetimi
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [currentImage, setCurrentImage] = useState('');

    // Şifre Formu
    const [pass, setPass] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    // DİNAMİK RENKLER
    const colors = {
        bg: theme.palette.background.default,
        paper: theme.palette.background.paper,
        textPrimary: theme.palette.text.primary,
        textSecondary: theme.palette.text.secondary,
        primary: theme.palette.primary.main,
        border: theme.palette.divider,
        tabBg: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
        avatarBg: isDark ? theme.palette.primary.dark : '#133D67'
    };

    // Modern Input Stili (Dinamik)
    const inputStyle = { 
        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: colors.border },
            '&:hover fieldset': { borderColor: colors.primary },
            '&.Mui-focused fieldset': { borderColor: colors.primary }
        },
        '& input': { color: colors.textPrimary },
        '& .MuiInputLabel-root': { color: colors.textSecondary },
        '& .MuiInputLabel-root.Mui-focused': { color: colors.primary }
    };

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
            setCurrentImage(user.profileImage ? `${SERVER_URL}${user.profileImage}` : '');
        }
    }, [user]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { 
                setMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' });
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
            setMessage(null);
        }
    };

    const handleDeletePhoto = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setCurrentImage(''); 
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('email', profile.email); 
        formData.append('phone', profile.phone);

        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        } else if (currentImage === '') {
            formData.append('deleteImage', 'true'); 
        }

        try {
            const config = { 
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data' 
                } 
            };

            await axios.put(`${SERVER_URL}/api/auth/updatedetails`, formData, config);
            
            setMessage({ type: 'success', text: 'Profil bilgileriniz güncellendi!' });
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Güncelleme başarısız.' });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (pass.newPassword !== pass.confirmPassword) {
            return setMessage({ type: 'error', text: 'Yeni şifreler uyuşmuyor!' });
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${SERVER_URL}/api/auth/updatepassword`, {
                currentPassword: pass.currentPassword,
                newPassword: pass.newPassword
            }, config);
            setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi!' });
            setPass({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Şifre değiştirilemedi.' });
        }
    };

    return (
        <ThemeProvider theme={adminTheme}>
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: colors.primary }}>
                Hesap Ayarları
            </Typography>
            
            {message && <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>{message.text}</Alert>}

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: colors.paper, border: `1px solid ${colors.border}` }}>
                <Tabs 
                    value={tabValue} 
                    onChange={(e, v) => { setTabValue(v); setMessage(null); }} 
                    variant="fullWidth" 
                    sx={{ bgcolor: colors.tabBg, borderBottom: `1px solid ${colors.border}` }}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<AccountCircleIcon />} label="Profil Bilgileri" iconPosition="start" sx={{ fontWeight: 'bold' }} />
                    <Tab icon={<LockResetIcon />} label="Şifre Değiştir" iconPosition="start" sx={{ fontWeight: 'bold' }} />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {/* --- TAB 0: PROFİL --- */}
                    {tabValue === 0 && (
                        <form onSubmit={handleProfileUpdate}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                        <Avatar 
                                            src={previewUrl || currentImage} 
                                            alt={profile.name}
                                            sx={{ 
                                                width: 140, 
                                                height: 140, 
                                                mx: 'auto', 
                                                mb: 2, 
                                                bgcolor: colors.avatarBg, 
                                                fontSize: 50,
                                                border: `4px solid ${colors.paper}`,
                                                boxShadow: theme.shadows[3]
                                            }}
                                        >
                                            {profile.name.charAt(0).toUpperCase()}
                                        </Avatar>

                                        {(previewUrl || currentImage) && (
                                            <Tooltip title="Fotoğrafı Kaldır">
                                                <IconButton 
                                                    onClick={handleDeletePhoto}
                                                    color="error"
                                                    sx={{ 
                                                        position: 'absolute', top: 0, right: 0, 
                                                        bgcolor: colors.paper, boxShadow: 2,
                                                        '&:hover': { bgcolor: isDark ? '#333' : '#ffebee' }
                                                    }}
                                                    size="small"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                    
                                    <Box mt={1}>
                                        <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" type="file" onChange={handleFileSelect} />
                                        <label htmlFor="raised-button-file">
                                            <Button 
                                                variant="outlined" 
                                                component="span" 
                                                startIcon={<CloudUploadIcon />}
                                                size="small"
                                                sx={{ borderRadius: 2, textTransform: 'none', color: colors.textPrimary, borderColor: colors.border }}
                                            >
                                                Fotoğraf Yükle
                                            </Button>
                                        </label>
                                    </Box>
                                    <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                                        Max 5MB (JPG, PNG)
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Stack spacing={3}>
                                        <TextField 
                                            label="Ad Soyad" fullWidth value={profile.name} 
                                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon color="action"/></InputAdornment> }}
                                            sx={inputStyle}
                                        />
                                        <TextField 
                                            label="E-Posta" fullWidth disabled value={profile.email} 
                                            helperText="E-posta adresi değiştirilemez."
                                            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action"/></InputAdornment> }}
                                            sx={inputStyle}
                                        />
                                        <TextField 
                                            label="Telefon (SMS/WhatsApp)" fullWidth value={profile.phone} 
                                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                            placeholder="+90 5XX XXX XX XX"
                                            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action"/></InputAdornment> }}
                                            sx={inputStyle}
                                        />
                                        
                                        <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ bgcolor: colors.primary, py: 1.5, color: 'white' }}>
                                            DEĞİŞİKLİKLERİ KAYDET
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    )}

                    {/* --- TAB 1: ŞİFRE --- */}
                    {tabValue === 1 && (
                        <Container maxWidth="sm">
                            <form onSubmit={handlePasswordUpdate}>
                                <Stack spacing={3}>
                                    <TextField 
                                        label="Mevcut Şifre" type="password" fullWidth required
                                        value={pass.currentPassword}
                                        onChange={(e) => setPass({...pass, currentPassword: e.target.value})}
                                        sx={inputStyle}
                                    />
                                    <Divider sx={{ borderColor: colors.border }} />
                                    <TextField 
                                        label="Yeni Şifre" type="password" fullWidth required
                                        value={pass.newPassword}
                                        onChange={(e) => setPass({...pass, newPassword: e.target.value})}
                                        sx={inputStyle}
                                    />
                                    <TextField 
                                        label="Yeni Şifre (Tekrar)" type="password" fullWidth required
                                        value={pass.confirmPassword}
                                        onChange={(e) => setPass({...pass, confirmPassword: e.target.value})}
                                        sx={inputStyle}
                                    />
                                    <Button type="submit" variant="contained" color="error" size="large" startIcon={<LockResetIcon />}>
                                        ŞİFREYİ DEĞİŞTİR
                                    </Button>
                                </Stack>
                            </form>
                        </Container>
                    )}
                </Box>
            </Paper>
        </Container>
        </Box>
        </ThemeProvider>
    );
};

export default Settings;