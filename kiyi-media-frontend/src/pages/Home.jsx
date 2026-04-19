// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../config';
import {
    Box, Container, Typography, Button, Paper,
    Card, CardContent, Chip, IconButton,
    Dialog, DialogTitle, DialogContent,
    useTheme, useMediaQuery, Stack, Grid,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import Slider from "react-slick";
import { motion } from "framer-motion";

// Slider CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// İKONLAR
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import BoltIcon from '@mui/icons-material/Bolt';
import DevicesIcon from '@mui/icons-material/Devices';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BrushIcon from '@mui/icons-material/Brush';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GroupsIcon from '@mui/icons-material/Groups';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CampaignIcon from '@mui/icons-material/Campaign';
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

// --- GÖRSEL OPTİMİZASYON YARDIMCISI ---
const getOptimizedImage = (url) => {
    if (!url) return '';
    if (url.includes('cloudinary.com')) return url.replace('/upload/', `/upload/w_800,q_80,f_auto/`);
    return url.startsWith('http') ? url : `${SERVER_URL}${url}`;
};

const Home = ({ onlineUsers }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [stats, setStats] = useState({ totalVisitors: 0, monthlyVisitors: 0, totalProjects: 0 });
    const [brands, setBrands] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);

    // --- STYLES ---
    const styles = {
        textMain: '#0F172A',
        textSec: '#64748B',
        accentBlue: '#3B82F6',
        cardBg: '#FFFFFF',
        glassBorder: 'rgba(0, 0, 0, 0.07)',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!sessionStorage.getItem('visited')) {
                    await axios.post(`${SERVER_URL}/api/analytics/visit`);
                    sessionStorage.setItem('visited', 'true');
                }
                const [statsRes, brandsRes, annRes] = await Promise.all([
                    axios.get(`${SERVER_URL}/api/analytics/dashboard`),
                    axios.get(`${SERVER_URL}/api/portfolio?featured=true`)
                ]);

                if (statsRes.data.success) setStats(statsRes.data.data);
                if (brandsRes.data.success) {
                    setBrands(brandsRes.data.data.map(item => getOptimizedImage(item.logo || item.portray)));
                    setFeaturedProjects(brandsRes.data.data);
                }
            } catch (error) { console.error("Veri hatası:", error); }
        };
        fetchData();
    }, []);


    // Servis Listesi
    const servicesList = [
        {
            title: 'Modern Web Geliştirme',
            desc: 'İşletmeniz için modern, hızlı ve SEO uyumlu web çözümleri.',
            icon: <DevicesIcon />
        },
        {
            title: 'Sosyal Medya Yönetimi',
            desc: 'Markanızın dijital sesini güçlendiren stratejiler.',
            icon: <AutoGraphIcon />
        },
        {
            title: 'Kreatif Tasarım & UI/UX',
            desc: 'Estetik ve işlevsel tasarım çözümleri.',
            icon: <BrushIcon />
        },
        {
            title: 'Performans Pazarlama',
            desc: 'Nokta atışı hedefleme ile reklam yönetimi.',
            icon: <RocketLaunchIcon />
        },
        {
            title: 'Video Prodüksiyon',
            desc: 'Markanız için etkileyici, yüksek prodüksiyonlu videolar ve animasyonlar.',
            icon: <VideocamIcon />
        },
        {
            title: 'SEO & İçerik',
            desc: 'Arama motorlarında üst sıralarda yer almanızı sağlayan stratejiler.',
            icon: <SearchIcon />
        }
    ];

    const FALLBACK_IMAGE = 'https://placehold.co/600x400/1e293b/ffffff?text=Resim+Yok';
    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    return (
        <Box sx={{ overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: styles.textMain }}>
            <SEO title="Kıyı Medya | Dijital Medya Ajansı" />

            {/* GLOBAL BACKGROUND GLOW */}
            <div className="aurora-bg" />

            {/* ================================================================================== */}
            {/* 1. HERO SECTION */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: 10, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px',
                        bgcolor: 'rgba(59,130,246,0.08)', border: `1px solid rgba(59,130,246,0.2)`
                    }}>
                        <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1 }}>
                            Kıyı Medya | Digital Solutions
                        </Typography>
                    </Box>

                    <Typography variant="h1" sx={{
                        fontSize: { xs: '1.55rem', sm: '2.4rem', md: '4.5rem' },
                        fontWeight: 800, mb: 3, letterSpacing: '-0.02em', color: '#0F172A',
                        lineHeight: 1.2, whiteSpace: { sm: 'nowrap', xs: 'normal' }
                    }}>
                        Markanızı Geleceğe Taşıyan <br />
                        <span style={{ background: 'linear-gradient(135deg, #1D3557 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Dijital Medya Ajansı
                        </span>
                    </Typography>

                    <Typography variant="body1" sx={{ color: styles.textSec, maxWidth: '620px', mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                        Kıyı Medya ile dijital dünyada fark yaratın. Modern web tasarım, profesyonel sosyal medya yönetimi ve performans odaklı dijital pazarlama stratejilerimizle işletmenizi büyütüyoruz.
                    </Typography>

                </motion.div>
            </Container>


            {/* ================================================================================== */}
            {/* 3. BRANDS SECTION (Slider) */}
            {/* ================================================================================== */}
            {brands.length > 0 && (
                <Container maxWidth="lg" sx={{ mb: 15 }}>
                    <Box className="glass-panel" sx={{ p: 4, borderRadius: 4 }}>
                        <Typography variant="overline" color={styles.textSec} align="center" display="block" mb={4} letterSpacing={3}>GÜVENLE BÜYÜYEN MARKALAR</Typography>
                        <Slider {...{
                            dots: false, infinite: true, speed: 3000, slidesToShow: 5, slidesToScroll: 1, autoplay: true, autoplaySpeed: 0, cssEase: "linear", arrows: false,
                            responsive: [{ breakpoint: 900, settings: { slidesToShow: 3 } }, { breakpoint: 600, settings: { slidesToShow: 2 } }]
                        }}>
                            {brands.map((logo, index) => (
                                <Box key={index} sx={{ px: 2, display: 'flex !important', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                                    <img
                                        src={logo}
                                        alt="Brand"
                                        onError={handleImageError}
                                        style={{ maxHeight: '40px', maxWidth: '100%', filter: 'grayscale(100%)', opacity: 0.5, transition: '0.3s' }}
                                        onMouseOver={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.opacity = '1'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.opacity = '0.5'; }}
                                    />
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                </Container>
            )}


            {/* ================================================================================== */}
            {/* 4. ÖNE ÇIKAN ÇALIŞMALAR */}
            {/* ================================================================================== */}
            {featuredProjects.length > 0 && (
                <Box sx={{ py: 12, bgcolor: '#F8FAFC' }}>
                    <Container maxWidth="lg">
                        <Box textAlign="center" mb={7}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.7, mb: 3,
                                borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)'
                            }}>
                                <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1.5 }}>
                                    ÇALIŞMALARIMIZ
                                </Typography>
                            </Box>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.02em', mb: 2 }}>
                                Öne Çıkan Projeler
                            </Typography>
                            <Typography variant="body1" sx={{ color: styles.textSec, maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}>
                                Müşterilerimiz için hayata geçirdiğimiz seçkin işlerden bir kesit.
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {featuredProjects.map((item, index) => {
                                const cats = Array.isArray(item.category)
                                    ? item.category
                                    : (item.category || '').split(',').map(s => s.trim()).filter(Boolean);
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={item._id || index}>
                                        <Box
                                            component={motion.div}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.08 }}
                                        >
                                            <Card
                                                component={item.projectUrl ? 'a' : 'div'}
                                                href={item.projectUrl || undefined}
                                                target={item.projectUrl ? '_blank' : undefined}
                                                rel={item.projectUrl ? 'noopener noreferrer' : undefined}
                                                elevation={0}
                                                sx={{
                                                    borderRadius: 3, overflow: 'hidden', display: 'block',
                                                    textDecoration: 'none',
                                                    border: '1px solid rgba(0,0,0,0.07)',
                                                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                                    '&:hover': {
                                                        transform: 'translateY(-6px)',
                                                        boxShadow: '0 16px 48px rgba(59,130,246,0.12)',
                                                        borderColor: 'rgba(59,130,246,0.2)',
                                                        '& .featured-overlay': { opacity: 1 }
                                                    }
                                                }}
                                            >
                                                <Box sx={{ position: 'relative', height: 300, overflow: 'hidden', bgcolor: '#E2E8F0' }}>
                                                    <Box
                                                        component="img"
                                                        src={getOptimizedImage(item.portray || item.logo)}
                                                        alt={item.title}
                                                        onError={handleImageError}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                    />
                                                    <Box className="featured-overlay" sx={{
                                                        position: 'absolute', inset: 0,
                                                        bgcolor: 'rgba(15,23,42,0.55)',
                                                        opacity: 0, transition: 'opacity 0.3s',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', letterSpacing: 1 }}>
                                                            İncele
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ p: 2.5, bgcolor: '#FFFFFF' }}>
                                                    <Typography variant="subtitle1" fontWeight={700} color="#0F172A" gutterBottom noWrap>
                                                        {item.title}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                                        {cats.slice(0, 3).map((cat, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={cat}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'rgba(59,130,246,0.08)',
                                                                    color: styles.accentBlue,
                                                                    fontWeight: 600,
                                                                    border: '1px solid rgba(59,130,246,0.15)',
                                                                    borderRadius: 1
                                                                }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            </Card>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        <Box textAlign="center" mt={6}>
                            <Button
                                component={Link}
                                to="/portfolio"
                                endIcon={<ArrowForwardIcon />}
                                variant="outlined"
                                sx={{
                                    borderRadius: '50px', px: 4, py: 1.5,
                                    fontWeight: 700, textTransform: 'none', fontSize: '0.95rem',
                                    borderColor: 'rgba(59,130,246,0.4)', color: styles.accentBlue,
                                    '&:hover': { borderColor: styles.accentBlue, bgcolor: 'rgba(59,130,246,0.06)' }
                                }}
                            >
                                Tüm Projeleri Gör
                            </Button>
                        </Box>
                    </Container>
                </Box>
            )}


            {/* ================================================================================== */}
            {/* 5. 360 DIGITAL SOLUTIONS */}
            {/* ================================================================================== */}
            <Box sx={{ py: 12, position: 'relative', overflow: 'hidden' }}>
                {/* Arka plan dekor */}
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    borderRadius: '50%', zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

                    {/* Bölüm Başlığı — İki Kolonlu */}
                    <Grid container spacing={6} alignItems="flex-end" mb={9}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', px: 2, py: 0.6, mb: 3,
                                borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)'
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: styles.accentBlue, mr: 1 }} />
                                <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1.5 }}>
                                    HİZMETLERİMİZ
                                </Typography>
                            </Box>
                            <Typography variant="h2" sx={{
                                fontWeight: 900, color: '#0F172A', lineHeight: 1.1,
                                fontSize: { xs: '2.2rem', md: '3.2rem' }, letterSpacing: '-0.02em'
                            }}>
                                360°{' '}
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #1D3557 0%, #3B82F6 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>
                                    Dijital Çözümler
                                </Box>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ color: styles.textSec, lineHeight: 1.9, fontSize: '1.05rem', mb: 3 }}>
                                Markanızın tüm dijital ihtiyaçlarını tek çatı altında topluyoruz. Strateji, tasarım, geliştirme ve büyüme — hepsi burada.
                            </Typography>
                            <Button
                                component={Link}
                                to="/services"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    color: styles.accentBlue, fontWeight: 700, textTransform: 'none',
                                    fontSize: '0.95rem', p: 0,
                                    '&:hover': { bgcolor: 'transparent', gap: 1.5 },
                                    transition: 'gap 0.3s'
                                }}
                            >
                                Tüm Hizmetleri Gör
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Servis Kartları — Tek Satır */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                        gap: 2
                    }}>
                        {servicesList.map((item, index) => (
                            <Box
                                key={index}
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                sx={{
                                    flex: '1 1 0',
                                    minWidth: { xs: 'calc(50% - 8px)', md: 0 },
                                    height: 140,
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: '#FFFFFF',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    borderTop: '3px solid transparent',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    textAlign: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                    cursor: 'default',
                                    '&:hover': {
                                        borderTopColor: styles.accentBlue,
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 16px 40px rgba(59,130,246,0.1)',
                                        '& .svc-icon': { bgcolor: styles.accentBlue, color: 'white' }
                                    }
                                }}
                            >
                                <Box className="svc-icon" sx={{
                                    width: 42, height: 42, borderRadius: 2, mb: 1.5,
                                    bgcolor: 'rgba(59,130,246,0.08)', color: styles.accentBlue,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s', flexShrink: 0
                                }}>
                                    {React.cloneElement(item.icon, { fontSize: 'small' })}
                                </Box>
                                <Typography sx={{
                                    fontWeight: 700, color: '#0F172A',
                                    fontSize: '0.78rem', lineHeight: 1.4
                                }}>
                                    {item.title}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>


            {/* ================================================================================== */}
            {/* 5.5 NEDEN BİZ */}
            {/* ================================================================================== */}
            <Box sx={{ py: 14, bgcolor: '#FFFFFF' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.7, mb: 3,
                            borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)'
                        }}>
                            <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1.5 }}>
                                NEDEN KIYI MEDYA?
                            </Typography>
                        </Box>
                        <Typography variant="h2" sx={{
                            fontWeight: 900, color: '#0F172A', fontSize: { xs: '2.2rem', md: '3rem' },
                            letterSpacing: '-0.02em', mb: 2
                        }}>
                            Tek Ajans, Tüm Çözümler.
                        </Typography>
                        <Typography variant="body1" sx={{ color: styles.textSec, maxWidth: 520, mx: 'auto', lineHeight: 1.8 }}>
                            Strateji, tasarım, yazılım ve pazarlamayı tek çatı altında yönetiyoruz.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                        {[
                            { icon: <BoltIcon />, title: 'Hızlı Teslimat', desc: 'Belirlenen süreçlere sadık kalarak projenizi zamanında teslim ediyoruz.' },
                            { icon: <AssignmentTurnedInIcon />, title: 'Şeffaf Süreç', desc: 'Her aşamada bilgilendirilirsiniz. Sürpriz yok, gecikme yok.' },
                            { icon: <GroupsIcon />, title: 'Uzman Ekip', desc: 'Her disiplinde deneyimli profesyonellerden oluşan ekibimiz projenize odaklanır.' },
                            { icon: <CampaignIcon />, title: 'Ölçülebilir Sonuç', desc: 'Sezgiye değil veriye dayalı kararlar alıyor, büyümeyi raporlarla kanıtlıyoruz.' }
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                style={{ flex: 1 }}
                            >
                                <Box sx={{
                                    height: '100%',
                                    display: 'flex', flexDirection: 'column',
                                    p: 4, borderRadius: 3,
                                    bgcolor: '#F8FAFC',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: '#FFFFFF',
                                        borderColor: styles.accentBlue,
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 16px 40px rgba(59,130,246,0.1)',
                                        '& .why-icon': { bgcolor: styles.accentBlue, color: 'white' }
                                    }
                                }}>
                                    <Box className="why-icon" sx={{
                                        width: 52, height: 52, borderRadius: 2, mb: 3, flexShrink: 0,
                                        bgcolor: 'rgba(59,130,246,0.08)', color: styles.accentBlue,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}>
                                        {React.cloneElement(card.icon, { fontSize: 'medium' })}
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700} color="#0F172A" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: styles.textSec, lineHeight: 1.8, flexGrow: 1 }}>
                                        {card.desc}
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>

                    <Box textAlign="center" mt={7}>
                        <Button
                            component={Link} to="/contact"
                            endIcon={<ArrowForwardIcon />}
                            variant="contained"
                            sx={{
                                bgcolor: styles.accentBlue, color: 'white', borderRadius: '50px',
                                px: 5, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem',
                                '&:hover': { bgcolor: '#2563EB', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }
                            }}
                        >
                            Bizimle Çalışın
                        </Button>
                    </Box>
                </Container>
            </Box>


            {/* ================================================================================== */}
            {/* 5.8 ÇALIŞMA SÜRECİMİZ */}
            {/* ================================================================================== */}
            <Box sx={{ py: 14, bgcolor: '#F8FAFC' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.7, mb: 3,
                            borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)'
                        }}>
                            <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1.5 }}>
                                SÜREÇ
                            </Typography>
                        </Box>
                        <Typography variant="h2" sx={{
                            fontWeight: 900, color: '#0F172A', fontSize: { xs: '2rem', md: '3rem' },
                            letterSpacing: '-0.02em', mb: 2
                        }}>
                            Nasıl Çalışıyoruz?
                        </Typography>
                        <Typography variant="body1" sx={{ color: styles.textSec, maxWidth: 540, mx: 'auto', lineHeight: 1.8 }}>
                            Fikrinizden lansmanına kadar her adımda yanınızdayız. Şeffaf, hızlı ve sonuç odaklı bir süreç.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch' }}>
                        {[
                            { num: '01', icon: <SearchIcon />, title: 'Keşif & Analiz', desc: 'Markanızı, hedef kitlenizi ve rakiplerinizi derinlemesine analiz ediyoruz.' },
                            { num: '02', icon: <BrushIcon />, title: 'Strateji & Tasarım', desc: 'Veriye dayalı strateji ve kullanıcı odaklı tasarımla sağlam bir temel atıyoruz.' },
                            { num: '03', icon: <RocketLaunchIcon />, title: 'Geliştirme & Yayın', desc: 'Hızlı, test edilmiş ve optimize kodla projenizi hayata geçiriyoruz.' },
                            { num: '04', icon: <AutoGraphIcon />, title: 'Büyüme & Optimizasyon', desc: 'Canlıya geçtikten sonra performansı izliyor, sürekli iyileştiriyoruz.' }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                                style={{ flex: 1 }}
                            >
                                <Box sx={{
                                    height: '100%',
                                    display: 'flex', flexDirection: 'column',
                                    bgcolor: '#FFFFFF', borderRadius: 3, p: 4,
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    borderTop: `3px solid ${styles.accentBlue}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 20px 48px rgba(59,130,246,0.12)',
                                        borderColor: styles.accentBlue,
                                    }
                                }}>
                                    <Typography sx={{
                                        fontWeight: 900, fontSize: '2.5rem', lineHeight: 1,
                                        color: 'rgba(59,130,246,0.1)', mb: 2, letterSpacing: '-0.03em'
                                    }}>
                                        {step.num}
                                    </Typography>
                                    <Box sx={{
                                        width: 48, height: 48, borderRadius: 2, mb: 3, flexShrink: 0,
                                        bgcolor: styles.accentBlue, color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {React.cloneElement(step.icon, { fontSize: 'small' })}
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700} color="#0F172A" gutterBottom>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: styles.textSec, lineHeight: 1.8, flexGrow: 1 }}>
                                        {step.desc}
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>


            {/* ================================================================================== */}
            {/* 6. FAQ SECTION (Accordion) */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ mb: 15 }}>
                <Box textAlign="center" mb={6}>
                    <Box sx={{
                        display: 'inline-block', px: 2, py: 0.5, mb: 2, borderRadius: '20px',
                        border: `1px solid ${styles.accentBlue}`, color: styles.accentBlue, bgcolor: 'rgba(59, 130, 246, 0.1)'
                    }}>
                        <Typography variant="caption" fontWeight="bold" letterSpacing={1}>S.S.S</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="800" color="#0F172A" gutterBottom>Sıkça Sorulan Sorular</Typography>
                    <Typography variant="body1" color={styles.textSec} maxWidth="600px" mx="auto">
                        Merak edilenler ve hizmetlerimiz hakkında detaylı bilgiler.
                    </Typography>
                </Box>

                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    {[
                        { q: "Kıyı Medya olarak hangi hizmetleri sunuyorsunuz?", a: "Kıyı Medya olarak markanızın dijital dünyadaki tüm ihtiyaçlarına 360 derece çözümler üretiyoruz. Başlıca hizmetlerimiz arasında Web Tasarım ve Yazılım, Sosyal Medya Yönetimi, Video Prodüksiyon, Grafik Tasarım, Dijital Pazarlama (Meta Reklamları) ve SEO (Arama Motoru Optimizasyonu) bulunmaktadır." },
                        { q: "Web sitesi projelerinde hazır şablon mu yoksa özel yazılım mı kullanıyorsunuz?", a: "Projelerimizin çoğunda müşterimizin ihtiyaçlarına ve marka kimliğine özel olarak sıfırdan tasarladığımız arayüzleri ve yazılımları kullanıyoruz. Ancak bütçe ve süre kısıtlaması olan projeler için profesyonel altyapılar üzerine kurulu optimize edilmiş çözümler de sunabiliyoruz." },
                        { q: "Sosyal medya yönetimi hizmetiniz neleri kapsıyor?", a: "Sosyal medya hizmetimiz; strateji belirleme, içerik takvimi oluşturma, yaratıcı görsel/video tasarımı, metin yazarlığı, topluluk yönetimi (yorum ve mesaj cevaplama) ve aylık raporlamayı kapsar. Ayrıca Meta (Facebook/Instagram) reklam yönetimi ile hedef kitlenize nokta atışı ulaşmanızı sağlıyoruz." },
                        { q: "Video prodüksiyon ve fotoğraf çekimi yapıyor musunuz?", a: "Evet. Tanıtım filmleri, sosyal medya içerikleri (Reels/TikTok), ürün çekimleri ve kurumsal fotoğrafçılık gibi alanlarda profesyonel ekipmanlarımızla prodüksiyon hizmeti veriyoruz. Senaryodan kurguya kadar tüm süreci biz yönetiyoruz." },
                        { q: "SEO çalışmaları ne kadar sürede sonuç verir?", a: "SEO (Arama Motoru Optimizasyonu) uzun vadeli bir yatırımdır. Sektördeki rekabete ve anahtar kelimelere bağlı olarak değişmekle birlikte, teknik düzenlemeler ve içerik çalışmalarıyla birlikte genellikle 3. aydan itibaren gözle görülür yükselişler ve trafik artışı gözlemlenmeye başlanır." },
                        { q: "Dijital reklam (Meta/Google) bütçemi nasıl belirlemeliyim?", a: "Reklam bütçesi, sektörünüze ve hedeflerinize (satış, bilinirlik, form toplama vb.) göre değişir. Kıyı Medya olarak, önce küçük bütçelerle test yayınları yaparak en verimli hedef kitleyi ve reklam modelini buluyor, ardından bütçenizi bu veriler ışığında en verimli şekilde optimize ediyoruz." },
                        { q: "Sadece samsun içinde mi hizmet veriyorsunuz?", a: "Hayır. Ofisimiz samsunda olsa da dijital dünyanın sınırları yok. Türkiye'nin ve dünyanın her yerindeki markalara web tasarım, sosyal medya ve dijital pazarlama hizmetleri sunuyoruz. Prodüksiyon gerektiren işlerde ise proje bazlı seyahat planlaması yapabiliyoruz." },
                        { q: "Web sitesi veya yazılım projesi bittikten sonra destek veriyor musunuz?", a: "Kesinlikle. Projeyi teslim ettikten sonra da yanınızdayız. Olası teknik aksaklıklar, güncellemeler veya içerik düzenlemeleri için sunduğumuz bakım ve destek paketlerimizden yararlanarak sitenizin her zaman güncel ve güvenli kalmasını sağlayabilirsiniz." },
                        { q: "Çalışma süreciniz nasıl işliyor?", a: "Sürecimiz tanışma ve ihtiyaç analizi ile başlar. Sizi ve markanızı dinledikten sonra bir strateji ve teklif sunarız. Onayınızın ardından tasarım ve uygulama aşamasına geçeriz. Tüm süreç boyunca sizinle iletişimde kalarak revize taleplerinizi uygular ve projeyi tam içinize sinecek şekilde teslim ederiz." },
                        { q: "Fiyatlandırma politikanız nedir, teklif almak ücretli mi?", a: "Her markanın ihtiyacı farklı olduğu için paket fiyatlar yerine proje bazlı fiyatlandırma yapmayı tercih ediyoruz. İhtiyaçlarınızı analiz edip size özel bir yol haritası çıkarmamız ve fiyat teklifi sunmamız tamamen ücretsizdir. Bizimle iletişime geçerek hemen teklif alabilirsiniz." }
                    ].map((faq, index) => (
                        <Accordion key={index} sx={{
                            bgcolor: '#FFFFFF', color: '#0F172A', mb: 2, borderRadius: '16px !important',
                            border: `1px solid rgba(0,0,0,0.07)`, boxShadow: '0 1px 10px rgba(0,0,0,0.04)',
                            '&:before': { display: 'none' },
                            transition: 'all 0.3s',
                            '&:hover': { borderColor: 'rgba(59,130,246,0.3)', boxShadow: '0 4px 20px rgba(59,130,246,0.08)' }
                        }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: styles.accentBlue }} />}>
                                <Typography fontWeight="600" color="#0F172A">{faq.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: `1px solid rgba(0,0,0,0.06)`, pt: 2, pb: 3 }}>
                                <Typography variant="body2" color={styles.textSec} sx={{ mb: 2, lineHeight: 1.7 }}>
                                    {faq.a}
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/contact"
                                    startIcon={<ContactSupportIcon />}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        borderColor: 'rgba(59, 130, 246, 0.5)',
                                        color: styles.accentBlue,
                                        '&:hover': { borderColor: styles.accentBlue, bgcolor: 'rgba(59, 130, 246, 0.1)' }
                                    }}
                                >
                                    Bizimle İletişime Geçin
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>


            {/* ================================================================================== */}
            {/* 7. CTA SECTION */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ mb: 20 }}>
                <Box sx={{
                    position: 'relative', overflow: 'hidden', borderRadius: 6,
                    background: 'linear-gradient(135deg, #1D3557 0%, #0F172A 100%)',
                    p: { xs: 5, md: 10 }, textAlign: 'center'
                }}>
                    {/* Background Glow */}
                    <Box sx={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h3" fontWeight="900" color="white" mb={3} sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
                            Projenizi Hayata Geçirelim
                        </Typography>
                        <Typography variant="h6" color="rgba(255,255,255,0.65)" mb={6} sx={{ maxWidth: '600px', mx: 'auto', fontWeight: 400 }}>
                            Hayalinizdeki dijital dönüşümü başlatmak için bizimle tanışın. Sizi dinlemeye hazırız.
                        </Typography>
                        <Button
                            component={Link} to="/contact"
                            variant="contained" size="large"
                            sx={{
                                bgcolor: 'white', color: '#0F172A', borderRadius: '50px',
                                px: 6, py: 2, fontSize: '1.1rem', fontWeight: 800,
                                '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(255,255,255,0.2)' }
                            }}
                        >
                            Teklif Alın
                        </Button>
                    </Box>
                </Box>
            </Container>



        </Box>
    );
};

export default Home;