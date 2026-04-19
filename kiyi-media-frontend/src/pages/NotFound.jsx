// src/pages/NotFound.jsx
import React from 'react';
import { Box, Typography, Button, Container, keyframes, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchOffIcon from '@mui/icons-material/SearchOff';

// --- HAFİF SÜZÜLME ANİMASYONU ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const NotFound = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Dinamik Renkler
  const colors = {
      bg: theme.palette.background.default,
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      textMain: theme.palette.text.primary,
      textSec: theme.palette.text.secondary,
      iconOpacity: isDark ? 0.3 : 0.15
  };

  return (
    <Box 
        sx={{ 
            minHeight: '85vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            bgcolor: colors.bg, // Dinamik Arka Plan
            py: 5,
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
        }}
    >
        <Container maxWidth="sm">
            {/* Animasyonlu İkon ve 404 Metni */}
            <Box sx={{ animation: `${float} 6s ease-in-out infinite` }}>
                <SearchOffIcon sx={{ fontSize: 120, color: colors.textSec, opacity: colors.iconOpacity, mb: -2 }} />
                
                <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '8rem', md: '12rem' }, color: colors.primary, lineHeight: 0.8, letterSpacing: -5 }}>
                    404
                </Typography>
            </Box>
            
            <Typography variant="h4" fontWeight="800" sx={{ color: colors.secondary, mt: 4, mb: 2 }}>
                Oops! Yolunuzu Kaybettiniz.
            </Typography>
            
            <Typography variant="body1" sx={{ color: colors.textSec, mb: 5, fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 450, mx: 'auto' }}>
                Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. 
                Merak etmeyin, dijital okyanusta kaybolmak bazen yeni rotalar keşfetmektir.
            </Typography>

            <Button 
                component={Link} 
                to="/" 
                variant="contained" 
                size="large" 
                startIcon={<HomeIcon />}
                sx={{ 
                    bgcolor: colors.primary,
                    color: 'white',
                    borderRadius: 50, 
                    px: 5, py: 1.8,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: theme.shadows[6],
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                        bgcolor: theme.palette.secondary.main, 
                        color: 'white',
                        transform: 'translateY(-3px)',
                        boxShadow: theme.shadows[10]
                    }
                }}
            >
                Ana Sayfaya Dön
            </Button>
        </Container>
    </Box>
  );
};

export default NotFound;