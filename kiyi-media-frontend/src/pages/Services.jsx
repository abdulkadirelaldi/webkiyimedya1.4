// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import {
    Container, Grid, Typography, Box, Button, Paper, Stack,
    Dialog, AppBar, Toolbar, IconButton, Slide, Card, CardContent, CardMedia, Chip,
    useTheme, useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Helper for images
const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/800x600?text=Proje+Görseli';
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}${path}`;
};


const Services = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [servicesList, setServicesList] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    const [portfolios, setPortfolios] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [filteredProjects, setFilteredProjects] = useState([]);

    // --- STYLES ---
    const styles = {
        textMain: '#0F172A',
        textSec: '#64748B',
        accentBlue: '#3B82F6',
        cardBg: '#FFFFFF',
        glassBorder: 'rgba(0, 0, 0, 0.07)',
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/services`);
                if (res.data.data) setServicesList(res.data.data);
            } catch (error) {
                setServicesList([]);
            } finally {
                setServicesLoading(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/portfolio`);
                if (res.data.success) setPortfolios(res.data.data);
            } catch (error) { console.error("Portföy yüklenemedi:", error); }
        };
        fetchPortfolio();
    }, []);

    const handleCardClick = (service) => {
        setSelectedService(service);
        const projects = portfolios.filter(p => {
            const cats = p.category;
            if (!cats) return false;
            let titles = [];
            if (Array.isArray(cats)) titles = cats;
            else if (typeof cats === 'string') titles = cats.split(',').map(s => s.trim());
            return titles.some(t => t && t.toLowerCase() === service.title.toLowerCase());
        });
        setFilteredProjects(projects);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedService(null), 200);
    };

    // Animations
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <Box sx={{ overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: styles.textMain }}>
            <SEO title="Hizmetlerimiz | Kıyı Medya" description="Web tasarım, dijital pazarlama ve sosyal medya çözümleri." />

            <div className="aurora-bg" />

            {/* ================================================================================== */}
            {/* 1. HERO SECTION */}
            {/* ================================================================================== */}
            <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: 10, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px',
                        bgcolor: 'rgba(59,130,246,0.08)', border: `1px solid rgba(59,130,246,0.2)`
                    }}>
                        <AutoAwesomeIcon sx={{ color: styles.accentBlue, fontSize: 16, mr: 1 }} />
                        <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1 }}>
                            UZMANLIK ALANLARIMIZ
                        </Typography>
                    </Box>

                    <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 3, fontSize: { xs: '2.5rem', md: '4.5rem' }, color: '#0F172A', letterSpacing: '-0.02em' }}>
                        Dijital Dönüşümünüzü <br /> <span style={{ color: styles.accentBlue }}>Şimdi Başlatın</span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: styles.textSec, fontWeight: 400, fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
                        İhtiyaç duyduğunuz tüm dijital hizmetler, tek bir stratejik çatı altında.
                    </Typography>
                </motion.div>
            </Container>


            {/* ================================================================================== */}
            {/* 2. SERVICES GRID */}
            {/* ================================================================================== */}
            <Container maxWidth="xl" sx={{ mb: 15, px: { xs: 2, md: 6 }, position: 'relative', zIndex: 5 }}>
                <Grid container spacing={4} justifyContent="center">
                    {servicesList.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                                }}
                            >
                                <Paper
                                    className="glass-panel"
                                    elevation={0}
                                    onClick={() => handleCardClick(service)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex', flexDirection: 'column',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: `1px solid rgba(0,0,0,0.07)`,
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 16px 48px rgba(59,130,246,0.12)',
                                            borderColor: 'rgba(59,130,246,0.25)',
                                            '& .service-img': { transform: 'scale(1.05)' }
                                        }
                                    }}
                                >
                                    <Box sx={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                                        <Box
                                            component="img"
                                            className="service-img"
                                            src={getImageUrl(service.image)}
                                            alt={service.title}
                                            sx={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                transition: 'transform 0.6s ease',
                                                filter: 'brightness(0.85)'
                                            }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Hizmet+Görseli'; }}
                                        />
                                        <Box sx={{
                                            position: 'absolute', top: 20, right: 20,
                                            bgcolor: 'rgba(0,0,0,0.6)',
                                            color: '#fff',
                                            fontWeight: '800', fontSize: '1.1rem',
                                            width: 45, height: 45,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: 3, backdropFilter: 'blur(4px)',
                                            border: `1px solid ${styles.glassBorder}`
                                        }}>
                                            {service.id}
                                        </Box>
                                    </Box>
                                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                            {service.tags.map((tag, i) => (
                                                <Chip
                                                    key={i}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(59, 130, 246, 0.15)',
                                                        color: styles.accentBlue,
                                                        fontWeight: 600,
                                                        borderRadius: 1,
                                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#0F172A' }}>{service.title}</Typography>
                                        <Typography variant="body1" sx={{ color: styles.textSec, mb: 3, flexGrow: 1, lineHeight: 1.7 }}>{service.description}</Typography>
                                        <Button
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                justifyContent: 'flex-start', p: 0,
                                                color: styles.accentBlue, fontWeight: 700,
                                                textTransform: 'none',
                                                '&:hover': { color: '#1D4ED8', bgcolor: 'transparent', ml: 1 },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            İlgili Projeleri Gör
                                        </Button>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>


            {/* ================================================================================== */}
            {/* 3. PROJECT DIALOG */}
            {/* ================================================================================== */}
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                PaperProps={{ sx: { bgcolor: '#F8FAFC', backgroundImage: 'none', color: '#0F172A' } }}
            >
                <AppBar sx={{ position: 'relative', bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid rgba(0,0,0,0.08)`, boxShadow: '0 1px 12px rgba(0,0,0,0.06)', color: '#0F172A' }}>
                    <Toolbar>
                        <IconButton edge="start" onClick={handleClose} aria-label="close" sx={{ color: '#475569' }}>
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }} variant="h6" component="div">
                            {selectedService?.title}
                        </Typography>
                        <Button autoFocus onClick={handleClose} sx={{ fontWeight: 600, color: '#475569' }}>
                            Kapat
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Box textAlign="center" mb={6}>
                        <Typography variant="h4" fontWeight="800" color="#0F172A">
                            {selectedService?.title} <span style={{ fontWeight: 300, color: styles.textSec }}>Projeleri</span>
                        </Typography>
                        <Typography variant="body1" color={styles.textSec} mt={1}>
                            Bu alanda geliştirdiğimiz seçkin işler.
                        </Typography>
                    </Box>

                    {filteredProjects.length > 0 ? (
                        <Grid container spacing={4}>
                            {filteredProjects.map((project, idx) => (
                                <Grid item xs={12} md={4} key={project._id || idx}>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                        <Card className="glass-panel" sx={{
                                            height: '100%', borderRadius: 4, display: 'flex', flexDirection: 'column',
                                            transition: '0.3s',
                                            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 40px rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }
                                        }}>
                                            <Box sx={{ position: 'relative', height: 240, overflow: 'hidden', bgcolor: '#F1F5F9' }}>
                                                <CardMedia
                                                    component="img"
                                                    image={getImageUrl(project.portray || project.logo)}
                                                    alt={project.title}
                                                    sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                                />
                                                <Box sx={{ position: 'absolute', top: 15, left: 15 }}>
                                                    <Chip
                                                        icon={<ViewQuiltIcon style={{ color: 'white', fontSize: 16 }} />}
                                                        label={selectedService?.matchKey}
                                                        size="small"
                                                        sx={{ bgcolor: 'rgba(29,53,87,0.85)', color: 'white', fontWeight: 600, backdropFilter: 'blur(4px)' }}
                                                    />
                                                </Box>
                                            </Box>

                                            <CardContent sx={{ pt: 3, px: 3, pb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="h6" fontWeight="bold" color="#0F172A" gutterBottom>
                                                    {project.title}
                                                </Typography>

                                                <Typography variant="body2" color={styles.textSec} sx={{ mb: 3, flexGrow: 1, lineHeight: 1.7, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                    {project.description}
                                                </Typography>

                                                {project.projectUrl ? (
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        href={project.projectUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        startIcon={<LanguageIcon />}
                                                        sx={{
                                                            mt: 'auto', borderRadius: 50, textTransform: 'none', fontWeight: 600,
                                                            bgcolor: styles.accentBlue, color: 'white',
                                                            '&:hover': { bgcolor: '#2563EB', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }
                                                        }}
                                                    >
                                                        Projeyi İncele
                                                    </Button>
                                                ) : (
                                                    <Button disabled variant="outlined" fullWidth sx={{ mt: 'auto', borderRadius: 50, textTransform: 'none' }}>
                                                        Detaylar Yakında
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box textAlign="center" py={10}>
                            <Typography variant="h5" fontWeight="bold" color="#0F172A" gutterBottom>Henüz Proje Eklenmedi</Typography>
                            <Typography variant="body1" color={styles.textSec}>Bu kategoride yakında harika işler göreceksiniz.</Typography>
                            <Button component={Link} to="/contact" variant="contained" sx={{ mt: 3, bgcolor: styles.accentBlue, color: 'white', borderRadius: 50, fontWeight: 'bold' }}>
                                İlk Projemiz Siz Olun
                            </Button>
                        </Box>
                    )}
                </Container>
            </Dialog>
        </Box>
    );
};

export default Services;