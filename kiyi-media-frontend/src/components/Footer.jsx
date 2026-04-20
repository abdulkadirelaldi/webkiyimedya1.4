// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Footer = () => {
  const linkStyle = {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    display: 'block',
    mb: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    '&:hover': { color: '#60A5FA', transform: 'translateX(4px)', textDecoration: 'none' },
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #060C1A 0%, #03060F 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        pt: 10, pb: 4, mt: 'auto',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <Box sx={{ position: 'absolute', bottom: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '10%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={5}>

          {/* LOGO + CONTACT */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Box component="img" src="/logo-white.png" alt="Kıyı Medya"
                sx={{ height: 50, objectFit: 'contain', opacity: 0.9 }}
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
              Markanızı dijitalde güçlendiren, yaratıcılığı stratejiyle buluşturan 360° dijital ajans.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: '#60A5FA' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>+90 553 174 82 04</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#60A5FA' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>info@kiyimedya.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: '#60A5FA' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>Atakum, Samsun / Türkiye</Typography>
              </Box>
            </Box>
          </Grid>

          {/* MENU */}
          <Grid item xs={6} md={2}>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 2 }}>
              SAYFALAR
            </Typography>
            <MuiLink component={RouterLink} to="/" sx={linkStyle}>Anasayfa</MuiLink>
            <MuiLink component={RouterLink} to="/services" sx={linkStyle}>Hizmetler</MuiLink>
            <MuiLink component={RouterLink} to="/portfolio" sx={linkStyle}>Portföy</MuiLink>
            <MuiLink component={RouterLink} to="/about" sx={linkStyle}>Kurumsal</MuiLink>
            <MuiLink component={RouterLink} to="/blog" sx={linkStyle}>Blog</MuiLink>
            <MuiLink component={RouterLink} to="/contact" sx={linkStyle}>İletişim</MuiLink>
          </Grid>

          {/* SERVICES */}
          <Grid item xs={6} md={2}>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 2 }}>
              HİZMETLER
            </Typography>
            {['Web Tasarım', 'Sosyal Medya', 'Dijital Reklam', 'Video Prodüksiyon', 'Grafik Tasarım', 'SEO'].map((s) => (
              <MuiLink key={s} component={RouterLink} to="/services" sx={linkStyle}>{s}</MuiLink>
            ))}
          </Grid>

          {/* SOCIAL */}
          <Grid item xs={12} md={4}>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 2 }}>
              TAKİP EDİN
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, mb: 4 }}>
              Dijital dünyanın yeniliklerini ve projelerimizi sosyal medyadan takip edin.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[
                { icon: <InstagramIcon />, link: 'https://www.instagram.com/medyakiyi', color: '#E1306C' },
                { icon: <LinkedInIcon />, link: 'https://www.linkedin.com/company/kiyimedya', color: '#0A66C2' },
                { icon: <WhatsAppIcon />, link: 'https://wa.me/905531748204', color: '#25D366' },
              ].map((s, i) => (
                <IconButton key={i} href={s.link} target="_blank"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    transition: 'all 0.3s',
                    '&:hover': { color: '#fff', bgcolor: s.color, borderColor: s.color, transform: 'translateY(-3px)' }
                  }}>
                  {s.icon}
                </IconButton>
              ))}
            </Box>

            <Box sx={{ mt: 4, p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AutoAwesomeIcon sx={{ color: '#60A5FA', fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700 }}>ÜCRETSİZ DANIŞMANLIK</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Markanız için ücretsiz strateji görüşmesi alın.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.06)' }} />

        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', textAlign: { xs: 'center', md: 'left' } }}>
              &copy; {new Date().getFullYear()} <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>KIYI MEDYA</span>. Tüm hakları saklıdır.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 3 }}>
            <MuiLink component={RouterLink} to="/gizlilik-politikasi" sx={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>Gizlilik Politikası</MuiLink>
            <MuiLink component={RouterLink} to="/kullanim-sartlari" sx={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>Kullanım Şartları</MuiLink>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
