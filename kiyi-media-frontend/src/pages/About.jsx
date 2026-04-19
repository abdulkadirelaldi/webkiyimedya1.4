// src/pages/About.jsx
import React from 'react';
import { Container, Grid, Typography, Box, Paper, Button, Chip, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

// ICONS
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiamondIcon from '@mui/icons-material/Diamond';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BoltIcon from '@mui/icons-material/Bolt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PublicIcon from '@mui/icons-material/Public';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TerminalIcon from '@mui/icons-material/Terminal';

const About = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // --- STYLES ---
    const styles = {
        textMain: '#0F172A',
        textSec: '#64748B',
        accentBlue: '#3B82F6',
        glassBorder: 'rgba(0, 0, 0, 0.07)',
    };

    const techStack = [
        "WEB Tasarım", "Grafik Tasarım", "Sosyal Medya", "SEO & Ads", "Video Prodüksiyon", "Marka Yönetimi"
    ];

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <Box sx={{ overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: styles.textMain }}>

            <div className="aurora-bg" />

            {/* ================================================================================== */}
            {/* 1. HERO SECTION */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: 10, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>

                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px',
                        bgcolor: 'rgba(59, 130, 246, 0.08)', border: `1px solid rgba(59,130,246,0.2)`
                    }}>
                        <AutoAwesomeIcon sx={{ color: styles.accentBlue, fontSize: 16, mr: 1 }} />
                        <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1 }}>
                            YENİ NESİL DİJİTAL AJANS
                        </Typography>
                    </Box>

                    <Typography variant="h1" sx={{
                        fontSize: { xs: '2.5rem', md: '5rem' },
                        fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: '#0F172A',
                        lineHeight: 1.1
                    }}>
                        Markanızın <br />
                        <span style={{
                            background: `linear-gradient(135deg, #1D3557 0%, ${styles.accentBlue} 100%)`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            Dijital İmzası
                        </span>
                    </Typography>

                    <Typography variant="body1" sx={{ color: styles.textSec, maxWidth: '750px', mx: 'auto', mb: 6, fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.8 }}>
                        Kıyı Medya; yaratıcılığı teknolojiyle, stratejiyi sanatla birleştiren bir teknoloji üssüdür.
                        Biz sadece kod yazmıyoruz; markanızın geleceğini tasarlıyoruz.
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={1.5} flexWrap="wrap">
                        {techStack.map((tech, i) => (
                            <Chip
                                key={i}
                                label={tech}
                                sx={{
                                    bgcolor: '#F1F5F9',
                                    color: styles.textMain,
                                    border: `1px solid rgba(0,0,0,0.07)`,
                                    fontWeight: 600
                                }}
                            />
                        ))}
                    </Box>

                </motion.div>
            </Container>


            {/* ================================================================================== */}
            {/* 2. VISION & MISSION (GLASS GRID) */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ mb: 15, position: 'relative', zIndex: 2 }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper className="glass-panel" sx={{
                                p: { xs: 4, md: 6 }, height: '100%', borderRadius: 5,
                                position: 'relative', overflow: 'hidden',
                                borderLeft: '4px solid #3B82F6'
                            }}>
                                <Box sx={{
                                    position: 'absolute', top: 0, right: 0, p: 4, opacity: 0.05,
                                    transform: 'rotate(-15deg) scale(2)'
                                }}>
                                    <PublicIcon sx={{ fontSize: 100, color: '#0F172A' }} />
                                </Box>
                                <Typography variant="overline" color={styles.accentBlue} fontWeight="800" letterSpacing={2}>VİZYONUMUZ</Typography>
                                <Typography variant="h3" fontWeight="bold" color="#0F172A" gutterBottom sx={{ mt: 2 }}>Sınırları <br /> Zorlamak.</Typography>
                                <Typography variant="body1" color={styles.textSec} lineHeight={1.8} sx={{ fontSize: '1.05rem', mt: 3 }}>
                                    Teknolojinin hızına ayak uydurmak değil, ona yön vermek için buradayız.
                                    Hedefimiz, yerel değerleri global standartlarla buluşturan,
                                    sürdürülebilir ve yenilikçi dijital ekosistemler kurmaktır.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper className="glass-panel" sx={{
                                p: { xs: 4, md: 6 }, height: '100%', borderRadius: 5,
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, #FFFFFF 100%)',
                                position: 'relative', overflow: 'hidden',
                                borderLeft: '4px solid #1D3557'
                            }}>
                                <Box sx={{
                                    position: 'absolute', top: 0, right: 0, p: 4, opacity: 0.05,
                                    transform: 'rotate(15deg) scale(2)'
                                }}>
                                    <LightbulbIcon sx={{ fontSize: 100, color: styles.accentBlue }} />
                                </Box>
                                <Typography variant="overline" color="#1D3557" fontWeight="800">MİSYONUMUZ</Typography>
                                <Typography variant="h3" fontWeight="bold" color="#0F172A" gutterBottom sx={{ mt: 2 }}>Değer <br /> Yaratmak.</Typography>
                                <Typography variant="body1" color={styles.textSec} lineHeight={1.8} sx={{ fontSize: '1.05rem', mt: 3 }}>
                                    Her pikselde estetik, her kod satırında performans ve her stratejide başarı hedefliyoruz.
                                    İş ortaklarımızın büyüme hikayelerinin başrolünde yer alarak,
                                    onlara ölçülebilir ve kalıcı değer katıyoruz.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            {/* ================================================================================== */}
            {/* 3. CORE VALUES (COMPACT GRID) */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ mb: 15 }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <Box textAlign="center" mb={8}>
                        <Typography variant="h3" fontWeight="900" color="#0F172A" gutterBottom>DNA'mızdaki Değerler</Typography>
                        <Typography variant="body1" color={styles.textSec} sx={{ maxWidth: 600, mx: 'auto' }}>
                            Bizi sıradan bir ajanstan ayıran çalışma prensiplerimiz.
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
                        gap: 2,
                    }}>
                        {[
                            { title: 'Yenilikçi',       icon: <TerminalIcon />,       desc: 'En güncel teknolojiler ve trendleri takip ederek projelerinize değer katıyoruz.' },
                            { title: 'Şeffaf',          icon: <DiamondIcon />,        desc: 'Her adımda açık iletişimle güven inşa ediyoruz.' },
                            { title: 'Stratejik',       icon: <PsychologyIcon />,     desc: 'Veri odaklı kararlarla hedeflerinize en kısa yoldan ulaşıyoruz.' },
                            { title: 'Sonuç Odaklı',    icon: <TrendingUpIcon />,     desc: 'Gerçek başarı hikayelerini birlikte yazıyoruz.' },
                            { title: 'Hızlı',           icon: <BoltIcon />,           desc: 'Zamanında ve kaliteli teslimatı asla taviz vermeden sağlıyoruz.' },
                            { title: 'Mükemmeliyetçi',  icon: <WorkspacePremiumIcon />, desc: 'Piksel piksel özenle her detayı titizlikle işliyoruz.' },
                        ].map((item, index) => (
                            <Box key={index} sx={{
                                aspectRatio: '1 / 1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                p: 2.5,
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.07)',
                                bgcolor: '#FFFFFF',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: '#F8FAFC',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(59,130,246,0.12)',
                                    borderColor: 'rgba(59,130,246,0.25)',
                                }
                            }}>
                                <Box sx={{ color: styles.accentBlue, mb: 1.5, p: 1.2, borderRadius: '50%', bgcolor: 'rgba(59,130,246,0.08)', display: 'inline-flex' }}>
                                    {React.cloneElement(item.icon, { sx: { fontSize: 26 } })}
                                </Box>
                                <Typography variant="subtitle1" fontWeight={800} color="#0F172A" gutterBottom sx={{ lineHeight: 1.2, mb: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="caption" color={styles.textSec} sx={{ lineHeight: 1.6 }}>
                                    {item.desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </motion.div>
            </Container>

            {/* ================================================================================== */}
            {/* 4. PROCESS SECTION (MINIMALIST) */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ mb: 15 }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <Box sx={{
                        p: { xs: 4, md: 8 }, borderRadius: 6,
                        bgcolor: '#1D3557',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <Box sx={{ position: 'absolute', top: '-30%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                        <Grid container spacing={6} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="overline" color="#60A5FA" fontWeight="800" letterSpacing={2}>ÇALIŞMA SÜRECİMİZ</Typography>
                                <Typography variant="h3" fontWeight="900" color="white" sx={{ mb: 2 }}>Nasıl <br /> Çalışıyoruz?</Typography>
                                <Typography variant="body1" color="rgba(255,255,255,0.65)" sx={{ mb: 4 }}>
                                    Her projede aynı özenli süreci izliyoruz. Markanızı tanımaktan kampanya sonuçlarını ölçmeye kadar her adımda yanınızdayız.
                                </Typography>
                                <Button component={Link} to="/contact" variant="contained" sx={{ borderRadius: 50, bgcolor: 'white', color: '#1D3557', fontWeight: 700 }}>
                                    Hemen Başlayalım
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Grid container spacing={3}>
                                    {[
                                        { id: '01', title: 'Keşif & Strateji', desc: 'Markanızı, hedef kitlenizi ve rakiplerinizi derinlemesine analiz ederek size özel dijital strateji oluşturuyoruz.' },
                                        { id: '02', title: 'Konsept & Tasarım', desc: 'Marka kimliğinize uygun kreatif konseptler ve görsel dil geliştiriyoruz; içerik ve kampanya planını hazırlıyoruz.' },
                                        { id: '03', title: 'Üretim & Yayın', desc: 'İçerik üretimi, sosyal medya yönetimi, reklam kampanyaları ve web projelerini planlı takvimde hayata geçiriyoruz.' },
                                        { id: '04', title: 'Ölçüm & Büyüme', desc: 'Performans verilerini düzenli raporlarla paylaşıyor, sonuçlara göre stratejiyi optimize ederek büyümenizi sürdürüyoruz.' },
                                    ].map((step, idx) => (
                                        <Grid item xs={12} sm={6} key={idx}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                <Typography variant="h4" fontWeight="900" sx={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>{step.id}</Typography>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 0.5 }}>{step.title}</Typography>
                                                    <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ lineHeight: 1.7 }}>{step.desc}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </motion.div>
            </Container>

            {/* ================================================================================== */}
            {/* 5. CTA SECTION */}
            {/* ================================================================================== */}
            <Container maxWidth="md" sx={{ mb: 10, textAlign: 'center' }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <Typography variant="h3" fontWeight="900" color="#0F172A" mb={3} sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
                        Hazır mısınız?
                    </Typography>
                    <Typography variant="body1" color={styles.textSec} mb={5} sx={{ maxWidth: '500px', mx: 'auto' }}>
                        Markanızı bir üst seviyeye taşımak için bir kahve içelim ve projenizi konuşalım.
                    </Typography>
                    <Button
                        component={Link} to="/contact"
                        variant="contained" size="large"
                        sx={{
                            bgcolor: styles.accentBlue, color: 'white', borderRadius: '50px',
                            px: 6, py: 2, fontSize: '1.1rem', fontWeight: 700,
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                            '&:hover': { bgcolor: '#2563eb', transform: 'translateY(-2px)' }
                        }}
                    >
                        Bize Ulaşın
                    </Button>
                </motion.div>
            </Container>

        </Box>
    );
};

export default About;