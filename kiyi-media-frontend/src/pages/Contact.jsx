// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert, Stack, IconButton, Grid, useTheme, useMediaQuery, MenuItem, Select, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import contentService from '../services/contentService';
import SEO from '../components/SEO';

const countryCodes = [
  { code: '+90', label: 'TR' }, { code: '+1', label: 'US' },
  { code: '+44', label: 'UK' }, { code: '+49', label: 'DE' },
  { code: '+33', label: 'FR' }, { code: '+994', label: 'AZ' },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }
});

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+90');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) return;
    let fv = val;
    if (val.length > 6) fv = `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`;
    else if (val.length > 3) fv = `${val.slice(0, 3)} ${val.slice(3)}`;
    setFormData({ ...formData, phone: fv });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contentService.sendMessage({ ...formData, phone: `${countryCode} ${formData.phone}` });
      setOpenSnackbar(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      bgcolor: 'rgba(255,255,255,0.04)',
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)', transition: '0.3s' },
      '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '2px' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#60A5FA', fontWeight: 600 },
    '& input, & textarea': { color: '#fff' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' }
  };

  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', bgcolor: '#060C1A', color: '#fff' }}>
      <SEO title="İletişim | Kıyı Medya" description="Projeleriniz için bizimle iletişime geçin." />

      {/* HERO */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 20 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{ position: 'absolute', top: 0, right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0)}>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <AutoAwesomeIcon sx={{ color: '#60A5FA', fontSize: 15, mr: 1 }} />
                <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>ÜCRETSİZ DANIŞMANLIK</Typography>
              </Box>
              <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.8rem', md: '5rem' }, letterSpacing: '-0.02em', lineHeight: 1.08 }}>
                Bir Kahve İçelim,<br />
                <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projenizi Konuşalım.</span>
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 580, mx: 'auto', color: 'rgba(255,255,255,0.55)', fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.9 }}>
                Fikirlerinizi hayata geçirmek için buradayız. Formu doldurun veya iletişim kanallarımızdan ulaşın.
              </Typography>
            </Box>
          </motion.div>

          {/* CSS Grid: mobilde DOM sırası = iletişim → form → sosyal/neden biz */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
            gridTemplateRows: { md: 'auto auto' },
            gap: { xs: 4, md: 6 },
            alignItems: 'start',
          }}>
            {/* 1. İLETİŞİM KARTLARI — mobil: ilk, desktop: sol üst */}
            <Box sx={{ gridColumn: { md: 1 }, gridRow: { md: 1 } }}>
              <Stack spacing={3}>
                {[
                  { icon: <PhoneIcon />, title: 'Telefon', value: '+90 553 174 82 04', link: 'tel:+905531748204', color: '#3B82F6' },
                  { icon: <EmailIcon />, title: 'E-posta', value: 'info@kiyimedya.com', link: 'mailto:info@kiyimedya.com', color: '#8B5CF6' },
                  { icon: <LocationOnIcon />, title: 'Konum', value: 'Atakum, Samsun / Türkiye', link: 'https://maps.google.com', color: '#10B981' }
                ].map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                    <Box component="a" href={item.link} target={item.title === 'Konum' ? '_blank' : '_self'}
                      sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 3, textDecoration: 'none', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s', '&:hover': { transform: 'translateX(6px)', bgcolor: 'rgba(255,255,255,0.07)', borderColor: `${item.color}40` } }}>
                      <Box sx={{ color: item.color, bgcolor: `${item.color}15`, border: `1px solid ${item.color}25`, width: 50, height: 50, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {React.cloneElement(item.icon, { fontSize: 'medium' })}
                      </Box>
                      <Box>
                        <Typography variant="overline" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5 }}>{item.title}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{item.value}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Box>

            {/* 2. FORM — mobil: ikinci, desktop: sağ (her iki satırı kaplar) */}
            <Box sx={{ gridColumn: { md: 2 }, gridRow: { md: '1 / 3' } }}>
              <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                <Box sx={{ p: { xs: 4, md: 5 }, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>Mesaj Gönderin</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 4 }}>En kısa sürede size geri döneceğiz.</Typography>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <TextField label="Adınız Soyadınız" name="name" value={formData.name} onChange={handleChange} fullWidth required variant="outlined" sx={inputStyle} />
                        <TextField label="Telefon Numaranız" name="phone" value={formData.phone} onChange={handlePhoneChange} fullWidth variant="outlined" placeholder="5XX XXX XX XX" sx={inputStyle}
                          InputProps={{ startAdornment: (
                            <InputAdornment position="start">
                              <Select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} variant="standard" disableUnderline
                                sx={{ color: '#fff', '& .MuiSelect-select': { paddingRight: '16px !important', fontWeight: 700, minWidth: '35px' }, mr: 1 }}>
                                {countryCodes.map((o) => <MenuItem key={o.code} value={o.code} sx={{ color: '#fff', bgcolor: '#0D1628' }}>{o.code}</MenuItem>)}
                              </Select>
                              <Box sx={{ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.1)', mr: 1 }} />
                            </InputAdornment>
                          ) }}
                        />
                      </Stack>
                      <TextField label="E-posta Adresiniz" name="email" value={formData.email} onChange={handleChange} fullWidth type="email" variant="outlined" sx={inputStyle} />
                      <TextField label="Konu" name="subject" value={formData.subject} onChange={handleChange} fullWidth required variant="outlined" sx={inputStyle} />
                      <TextField label="Projenizden bahsedin..." name="message" value={formData.message} onChange={handleChange} fullWidth required multiline rows={4} variant="outlined" sx={inputStyle} />
                      <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} endIcon={loading ? null : <SendIcon />}
                        sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', py: 2, fontSize: '1rem', fontWeight: 700, borderRadius: 2, boxShadow: '0 8px 30px rgba(59,130,246,0.4)', '&:hover': { opacity: 0.9, transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                        {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                      </Button>
                    </Stack>
                  </form>
                </Box>
              </motion.div>
            </Box>

            {/* 3. SOSYAL + NEDEN BİZ — mobil: üçüncü, desktop: sol alt */}
            <Box sx={{ gridColumn: { md: 1 }, gridRow: { md: 2 } }}>
              <Stack spacing={3}>
                <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.35)', mb: 3, display: 'block', letterSpacing: 2 }}>SOSYAL MEDYA</Typography>
                  <Stack direction="row" spacing={2}>
                    {[
                      { icon: <InstagramIcon />, link: 'https://www.instagram.com/medyakiyi', color: '#E1306C' },
                      { icon: <LinkedInIcon />, link: 'https://www.linkedin.com/company/kiyimedya', color: '#0A66C2' },
                      { icon: <WhatsAppIcon />, link: 'https://wa.me/905531748204', color: '#25D366' }
                    ].map((s, i) => (
                      <IconButton key={i} component="a" href={s.link} target="_blank"
                        sx={{ color: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { bgcolor: s.color, borderColor: s.color, color: 'white', transform: 'translateY(-3px)' }, transition: 'all 0.3s' }}>
                        {s.icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="h6" fontWeight={800} color="#fff" mb={2}>Neden Bizi Seçmelisiniz?</Typography>
                  {['30 dakikada strateji planı', 'Taahhütsüz ilk görüşme', 'Hızlı ve dürüst dönüş'].map((t, i) => (
                    <Box key={i} display="flex" alignItems="center" gap={1.5} mb={1.5}>
                      <CheckCircleIcon sx={{ color: '#34D399', fontSize: 18 }} />
                      <Typography variant="body2" color="rgba(255,255,255,0.7)" fontWeight={500}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2, bgcolor: '#10B981', color: 'white' }}>
          Mesajınız başarıyla iletildi! En kısa sürede döneceğiz.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
