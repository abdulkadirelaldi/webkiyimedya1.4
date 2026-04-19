// src/components/CookieConsent.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Slide, Container, useTheme, alpha } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';

const CookieConsent = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [open, setOpen] = useState(false);

  // Dinamik Renkler
  const colors = {
      // Banner arka planı: Dark modda daha koyu gri/lacivert, Light modda marka laciverti
      bg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(29, 53, 87, 0.95)',
      text: '#ffffff', // Koyu zemin üzerine beyaz yazı
      icon: theme.palette.secondary.main, // Turuncu/Vurgu rengi
      btnBg: theme.palette.secondary.main,
      btnHover: theme.palette.secondary.dark
  };

  useEffect(() => {
    // Daha önce kabul etmediyse göster
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        // Sayfa yüklendikten 1 saniye sonra aç
        setTimeout(() => setOpen(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setOpen(false);
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                bgcolor: colors.bg, 
                backdropFilter: 'blur(12px)', // Glassmorphism efekti
                color: colors.text, 
                py: 3, 
                zIndex: 1300,
                boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
                borderTop: `1px solid ${alpha('#fff', 0.1)}`
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CookieIcon sx={{ fontSize: 40, color: colors.icon }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">Çerezleri Kullanıyoruz</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, color: alpha(colors.text, 0.7) }}>
                            Size daha iyi bir deneyim sunmak için sitemizde çerezler (cookies) kullanılmaktadır. 
                            Kullanmaya devam ederek KVKK ve Gizlilik Politikamızı kabul etmiş olursunuz.
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                    <Button 
                        onClick={() => setOpen(false)} 
                        variant="text" 
                        sx={{ 
                            color: 'white', 
                            opacity: 0.7, 
                            textTransform: 'none',
                            '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } 
                        }}
                    >
                        Reddet
                    </Button>
                    <Button 
                        onClick={handleAccept} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: colors.btnBg, 
                            color: 'white', 
                            borderRadius: 50, 
                            px: 4, 
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            boxShadow: `0 4px 12px ${alpha(colors.btnBg, 0.4)}`,
                            '&:hover': { bgcolor: colors.btnHover } 
                        }}
                    >
                        Kabul Et
                    </Button>
                </Box>
            </Container>
        </Box>
    </Slide>
  );
};

export default CookieConsent;