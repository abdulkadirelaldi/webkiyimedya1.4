// src/pages/Contact.jsx
import React, { useState } from 'react';
import {
    Container, Typography, TextField, Button, Box, Snackbar, Alert, Stack,
    Paper, IconButton, Grid, useTheme, useMediaQuery, MenuItem, Select, InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import contentService from '../services/contentService';
import SEO from '../components/SEO';

// Ülke kodları listesi (Genişletilebilir)
const countryCodes = [
    { code: '+90', label: 'TR' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+49', label: 'DE' },
    { code: '+33', label: 'FR' },
    { code: '+994', label: 'AZ' },
];

const Contact = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);

    // State yönetimi
    const [countryCode, setCountryCode] = useState('+90');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    // --- STYLES ---
    const styles = {
        textMain: '#0F172A',
        textSec: '#64748B',
        accentBlue: '#3B82F6',
        cardBg: '#FFFFFF',
        glassBorder: 'rgba(0, 0, 0, 0.07)',
        inputBg: '#FFFFFF',
    };

    // Genel Input Değişikliği
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Telefon Formatlayıcı ve Yönetici
    const handlePhoneChange = (e) => {
        // Sadece rakamları al
        const val = e.target.value.replace(/\D/g, '');

        // 10 haneden fazla girmeyi engelle
        if (val.length > 10) return;

        // Formatlama (555 123 45 67 şeklinde)
        let formattedValue = val;
        if (val.length > 6) {
            formattedValue = `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`;
        } else if (val.length > 3) {
            formattedValue = `${val.slice(0, 3)} ${val.slice(3)}`;
        }

        // Form datasını güncelle (Görünürde formatlı, arka planda da formatlı tutuyoruz)
        setFormData({ ...formData, phone: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Gönderilecek veriyi hazırla (Ülke kodu + Telefon birleşimi)
        const finalData = {
            ...formData,
            phone: `${countryCode} ${formData.phone}`
        };

        try {
            await contentService.sendMessage(finalData);
            setOpenSnackbar(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }
        catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    // Input Style
    const inputStyle = {
        bgcolor: '#FFFFFF',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
            color: '#0F172A',
            bgcolor: '#FFFFFF',
            '& fieldset': { borderColor: 'rgba(0,0,0,0.12)', transition: '0.3s' },
            '&:hover fieldset': { borderColor: styles.accentBlue },
            '&.Mui-focused fieldset': { borderColor: styles.accentBlue, borderWidth: '2px' }
        },
        '& .MuiInputLabel-root': { color: styles.textSec },
        '& .MuiInputLabel-root.Mui-focused': { color: styles.accentBlue, fontWeight: 'bold' },
        '& input, & textarea': { color: '#0F172A' },
        '& .MuiSelect-icon': { color: styles.textSec }
    };

    // Animations
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <Box sx={{ overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: styles.textMain }}>
            <SEO title="İletişim | Kıyı Medya" description="Projeleriniz için bizimle iletişime geçin." />

            <div className="aurora-bg" />

            <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: 10, position: 'relative', zIndex: 1 }}>

                {/* --- HERO / HEADER --- */}
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 3, borderRadius: '50px',
                            bgcolor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59,130,246,0.2)'
                        }}>
                            <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1 }}>
                                BİZE ULAŞIN
                            </Typography>
                        </Box>
                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '4rem' }, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            Bir Kahve İçelim, <br /> <span style={{ color: styles.accentBlue }}>Projenizi Konuşalım.</span>
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', color: styles.textSec, fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.8 }}>
                            Fikirlerinizi hayata geçirmek için buradayız. Formu doldurun veya iletişim kanallarımızdan bize ulaşın.
                        </Typography>
                    </Box>
                </motion.div>

                <Grid container spacing={6}>
                    {/* --- ILETISIM KARTLARI --- */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            {[
                                { icon: <PhoneIcon />, title: 'Telefon', value: '+90 553 174 82 04', link: 'tel:+905531748204' },
                                { icon: <EmailIcon />, title: 'E-posta', value: 'info@kiyimedya.com', link: 'mailto:info@kiyimedya.com' },
                                { icon: <LocationOnIcon />, title: 'Konum', value: 'Atakum, Samsun', link: 'https://maps.google.com' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Paper
                                        component="a"
                                        href={item.link}
                                        target={item.icon.type === LocationOnIcon ? "_blank" : "_self"}
                                        className="glass-panel"
                                        sx={{
                                            p: 3, display: 'flex', alignItems: 'center', gap: 3,
                                            borderRadius: 4, textDecoration: 'none',
                                            transition: 'all 0.3s',
                                            '&:hover': { transform: 'translateX(8px)', boxShadow: '0 8px 24px rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }
                                        }}
                                    >
                                        <Box sx={{
                                            color: styles.accentBlue, bgcolor: 'rgba(59, 130, 246, 0.08)',
                                            width: 50, height: 50, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {React.cloneElement(item.icon, { fontSize: 'medium' })}
                                        </Box>
                                        <Box>
                                            <Typography variant="overline" sx={{ fontWeight: 'bold', color: styles.textSec, letterSpacing: 1 }}>{item.title}</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: '700', color: '#0F172A', fontSize: '1.1rem' }}>{item.value}</Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))}

                            <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid rgba(0,0,0,0.07)` }}>
                                <Typography variant="body2" sx={{ color: styles.textSec, mb: 2, fontWeight: 'bold', letterSpacing: 1 }}>SOSYAL MEDYA</Typography>
                                <Stack direction="row" spacing={2}>
                                    {[
                                        { icon: <InstagramIcon />, link: 'https://www.instagram.com/medyakiyi' },
                                        { icon: <LinkedInIcon />, link: 'https://www.linkedin.com/company/kiyimedya' },
                                        { icon: <WhatsAppIcon />, link: 'https://wa.me/905531748204' }
                                    ].map((social, i) => (
                                        <IconButton
                                            key={i}
                                            component="a"
                                            href={social.link}
                                            target="_blank"
                                            sx={{
                                                color: '#475569', bgcolor: '#F8FAFC',
                                                border: `1px solid rgba(0,0,0,0.08)`,
                                                '&:hover': { bgcolor: styles.accentBlue, borderColor: styles.accentBlue, color: 'white', transform: 'scale(1.1)' },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* --- FORM ALANI --- */}
                    <Grid item xs={12} md={7}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                            <Paper className="glass-panel" elevation={0} sx={{
                                p: { xs: 4, md: 5 }, borderRadius: 5,
                                border: `1px solid ${styles.glassBorder}`,
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
                                    Mesaj Gönderin
                                </Typography>

                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={3}>
                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                            <TextField
                                                label="Adınız Soyadınız"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={inputStyle}
                                            />

                                            {/* --- Gelişmiş Telefon Inputu --- */}
                                            <TextField
                                                label="Telefon Numaranız"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                fullWidth
                                                variant="outlined"
                                                placeholder="5XX XXX XX XX"
                                                sx={inputStyle}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Select
                                                                value={countryCode}
                                                                onChange={(e) => setCountryCode(e.target.value)}
                                                                variant="standard"
                                                                disableUnderline
                                                                sx={{
                                                                    color: styles.textMain,
                                                                    '& .MuiSelect-select': {
                                                                        paddingRight: '16px !important',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        fontWeight: 'bold',
                                                                        minWidth: '35px'
                                                                    },
                                                                    mr: 1
                                                                }}
                                                            >
                                                                {countryCodes.map((option) => (
                                                                    <MenuItem key={option.code} value={option.code}>
                                                                        {option.code}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            <Box sx={{ width: '1px', height: '20px', bgcolor: 'rgba(0,0,0,0.1)', mr: 1 }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {/* ----------------------------- */}

                                        </Stack>

                                        {/* Opsiyonel yazısı kaldırıldı */}
                                        <TextField
                                            label="E-posta Adresiniz"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            fullWidth
                                            type="email"
                                            variant="outlined"
                                            sx={inputStyle}
                                        />

                                        <TextField label="Konu" name="subject" value={formData.subject} onChange={handleChange} fullWidth required variant="outlined" sx={inputStyle} />
                                        <TextField label="Projenizden bahsedin..." name="message" value={formData.message} onChange={handleChange} fullWidth required multiline rows={4} variant="outlined" sx={inputStyle} />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            disabled={loading}
                                            endIcon={loading ? null : <SendIcon />}
                                            sx={{
                                                bgcolor: styles.accentBlue,
                                                color: 'white',
                                                py: 2, fontSize: '1rem', fontWeight: 'bold', borderRadius: 2, textTransform: 'none',
                                                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                                                '&:hover': { bgcolor: '#2563eb', transform: 'translateY(-2px)' },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                                        </Button>
                                    </Stack>
                                </form>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2, bgcolor: '#10b981', color: 'white' }}>
                    Mesajınız başarıyla iletildi! En kısa sürede döneceğiz.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contact;