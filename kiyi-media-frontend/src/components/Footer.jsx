// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider, useTheme, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // --- DİNAMİK RENK PALETİ ---
  const colors = {
    // Light Mod: Kurumsal Lacivert, Dark Mod: Çok Koyu Siyah/Lacivert
    bg: isDark ? '#020617' : '#1D3557',
    textMain: '#FFFFFF',
    textSoft: isDark ? '#94a3b8' : '#BFCAD6', // Dark modda slate-400, Light modda açık gri
    accent: isDark ? theme.palette.primary.main : '#637085',
    hover: theme.palette.secondary.main, // Turuncu veya temanın ikincil rengi
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'
  };

  // Link Stilleri
  const linkStyle = {
    color: colors.textSoft,
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: colors.hover,
      transform: 'translateX(5px)',
      textDecoration: 'none'
    },
  };

  // Başlık Altı Çizgisi
  const titleDividerStyle = {
    width: '40px',
    height: '2px',
    bgcolor: colors.accent,
    mb: 3,
    mt: 1,
    borderRadius: '2px'
  };

  // Sosyal Medya İkon Stili
  const socialIconStyle = {
    color: colors.textSoft,
    border: `1px solid ${alpha(colors.textSoft, 0.2)}`,
    mr: 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: colors.bg,
      bgcolor: '#fff',
      borderColor: '#fff',
      transform: 'translateY(-3px)'
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.bg,
        color: colors.textSoft,
        pt: 10,
        pb: 4,
        mt: 'auto',
        borderTop: `1px solid ${colors.border}`
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>

          {/* --- 1. SÜTUN: LOGO ve İLETİŞİM --- */}
          <Grid item xs={12} md={4}>

            {/* Logo Alanı */}
            <Box sx={{ mb: 4 }}>
              <Box
                component="img"
                src="/logo-white.png" // Footer her zaman koyu olduğu için beyaz logo
                alt="Kıyı Medya"
                sx={{
                  height: 55,
                  objectFit: 'contain',
                  opacity: 0.95,
                  filter: isDark ? 'brightness(0.9)' : 'none'
                }}
              />
            </Box>

            <Typography variant="subtitle1" sx={{ color: colors.textMain, fontWeight: 700, letterSpacing: '0.5px' }}>
              BİZE ULAŞIN
            </Typography>
            <Box sx={titleDividerStyle} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 1.5, fontSize: 18, color: colors.textSoft }} />
              <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>+90 553 174 82 04</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1.5, fontSize: 18, color: colors.textSoft }} />
              <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>info@kiyimedya.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start' }}>
              <LocationOnIcon sx={{ mr: 1.5, fontSize: 18, color: colors.textSoft, mt: 0.3 }} />
              <Typography variant="body2" sx={{ fontFamily: 'inherit', lineHeight: 1.6 }}>
                Atakum, Samsun<br />Türkiye
              </Typography>
            </Box>
          </Grid>

          {/* --- 2. SÜTUN: HIZLI MENÜ (SOL) --- */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: colors.textMain, fontWeight: 700, letterSpacing: '0.5px' }}>
              MENÜ
            </Typography>
            <Box sx={titleDividerStyle} />

            <MuiLink component={RouterLink} to="/" sx={linkStyle}>Anasayfa</MuiLink>
            <MuiLink component={RouterLink} to="/services" sx={linkStyle}>Hizmetler</MuiLink>
            <MuiLink component={RouterLink} to="/portfolio" sx={linkStyle}>Portföy</MuiLink>
          </Grid>

          {/* --- 3. SÜTUN: HIZLI MENÜ (SAĞ) --- */}
          <Grid item xs={6} md={2} sx={{ mt: { xs: 5, md: 0 } }}>
            {/* Boşluk hizalaması için görünmez başlık */}
            <Typography variant="subtitle1" sx={{ opacity: 0, userSelect: 'none', fontWeight: 700 }}>-</Typography>
            <Box sx={{ ...titleDividerStyle, opacity: 0 }} />

            <MuiLink component={RouterLink} to="/about" sx={linkStyle}>Kurumsal</MuiLink>
            <MuiLink component={RouterLink} to="/contact" sx={linkStyle}>İletişim</MuiLink>
            <MuiLink component={RouterLink} to="/blog" sx={linkStyle}>Blog</MuiLink>
          </Grid>

          {/* --- 4. SÜTUN: SOSYAL MEDYA --- */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ color: colors.textMain, fontWeight: 700, letterSpacing: '0.5px' }}>
              TAKİPTE KALIN
            </Typography>
            <Box sx={titleDividerStyle} />
            <Typography variant="body2" sx={{ mb: 3, color: colors.textSoft, lineHeight: 1.6 }}>
              Dijital dünyadaki yeniliklerden ve projelerimizden haberdar olmak için bizi sosyal medyada takip edin.
            </Typography>
            <Box>
              <IconButton
                href="https://www.instagram.com/medyakiyi"
                target="_blank"
                sx={socialIconStyle}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>

              <IconButton
                href="https://www.linkedin.com/company/kiyimedya"
                target="_blank"
                sx={socialIconStyle}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>

              <IconButton
                href="https://wa.me/905531748204"
                target="_blank"
                sx={socialIconStyle}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: colors.border }} />

        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), textAlign: { xs: 'center', md: 'left' } }}>
              &copy; {new Date().getFullYear()} <span style={{ color: '#fff', fontWeight: 600 }}>KIYI MEDYA</span>. Tüm hakları saklıdır.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
              <MuiLink component={RouterLink} to="/gizlilik-politikasi" sx={{ color: alpha('#fff', 0.5), textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: '#fff' } }}>Gizlilik Politikası</MuiLink>
              <MuiLink component={RouterLink} to="/kullanim-sartlari" sx={{ color: alpha('#fff', 0.5), textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: '#fff' } }}>Kullanım Şartları</MuiLink>
            </Box>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default Footer;