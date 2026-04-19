// src/pages/Blog.jsx
import React, { useEffect, useState } from 'react';
import {
    Container, Grid, Typography, Box, Card, CardContent, CardMedia,
    Button, Chip, Stack, Dialog, DialogContent, IconButton,
    useTheme, useMediaQuery, Avatar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';
import SEO from '../components/SEO';
import { SERVER_URL } from '../config';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // --- STYLES ---
    const styles = {
        textMain: '#0F172A',
        textSec: '#64748B',
        accentBlue: '#3B82F6',
        cardBg: '#FFFFFF',
        glassBorder: 'rgba(0, 0, 0, 0.07)',
        dateBadgeBg: 'rgba(255, 255, 255, 0.95)'
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/800x600?text=Kıyı+Medya+Blog';
        if (path.startsWith('http')) return path;
        return `${SERVER_URL}${path}`;
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/blogs`);
                if (res.data.success) {
                    const sortedBlogs = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setBlogs(sortedBlogs);
                }
            } catch (err) {
                console.error("Blog yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleOpenBlog = (blog) => setSelectedBlog(blog);
    const handleCloseBlog = () => setSelectedBlog(null);

    // Animations
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <Box sx={{ overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: styles.textMain }}>
            <SEO title="Blog | Kıyı Medya" description="Dijital pazarlama, web tasarım ve teknoloji dünyasından güncel haberler." />

            {/* GLOBAL BACKGROUND GLOW (AURORA) */}
            <div className="aurora-bg" />

            {/* --- HERO SECTION --- */}
            <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: 10, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px',
                        bgcolor: 'rgba(59,130,246,0.08)', border: `1px solid rgba(59,130,246,0.2)`
                    }}>
                        <AutoAwesomeIcon sx={{ color: styles.accentBlue, fontSize: 16, mr: 1 }} />
                        <Typography variant="caption" sx={{ color: styles.accentBlue, fontWeight: 700, letterSpacing: 1 }}>
                            GÜNCEL İÇERİKLER
                        </Typography>
                    </Box>

                    <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 3, fontSize: { xs: '2.5rem', md: '4.5rem' }, color: '#0F172A', letterSpacing: '-0.02em' }}>
                        Kıyı Medya <span style={{ color: styles.accentBlue }}>Blog</span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: styles.textSec, fontWeight: 400, fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
                        Dijital dünyanın trendlerini, ipuçlarını ve sektör haberlerini sizin için derliyoruz.
                    </Typography>
                </motion.div>
            </Container>

            {/* --- BLOG LİSTESİ --- */}
            <Container maxWidth="lg" sx={{ mb: 15, position: 'relative', zIndex: 5 }}>
                <Grid container spacing={4}>
                    {blogs.length > 0 ? (
                        blogs.map((blog, index) => (
                            <Grid item xs={12} md={4} key={blog._id}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                                    }}
                                >
                                    <Card
                                        className="glass-panel"
                                        onClick={() => handleOpenBlog(blog)}
                                        sx={{
                                            height: '100%',
                                            borderRadius: 4,
                                            display: 'flex', flexDirection: 'column',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 16px 48px rgba(59,130,246,0.12)',
                                                borderColor: 'rgba(59,130,246,0.2)',
                                                '& .blog-img': { transform: 'scale(1.05)' }
                                            }
                                        }}
                                    >
                                        {/* Resim Alanı */}
                                        <Box sx={{ height: 240, overflow: 'hidden', position: 'relative', borderRadius: '16px 16px 0 0' }}>
                                            <CardMedia
                                                className="blog-img"
                                                component="img"
                                                image={getImageUrl(blog.image)}
                                                alt={blog.title}
                                                sx={{
                                                    height: '100%', width: '100%', objectFit: 'cover',
                                                    transition: 'transform 0.6s ease',
                                                    filter: 'brightness(0.9)'
                                                }}
                                            />
                                            {/* Tarih Rozeti */}
                                            <Box sx={{
                                                position: 'absolute', top: 15, right: 15,
                                                bgcolor: 'white',
                                                borderRadius: 2, p: 1,
                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                                                    {new Date(blog.createdAt).getDate()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: styles.accentBlue, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                                    {new Date(blog.createdAt).toLocaleDateString('tr-TR', { month: 'short' })}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                                            <Stack direction="row" spacing={2} mb={2} sx={{ opacity: 0.7 }}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <PersonIcon sx={{ fontSize: 16, color: styles.accentBlue }} />
                                                    <Typography variant="caption" fontWeight="bold" color={styles.textSec}>Admin</Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <AccessTimeIcon sx={{ fontSize: 16, color: styles.accentBlue }} />
                                                    <Typography variant="caption" fontWeight="bold" color={styles.textSec}>3 Dk Oku</Typography>
                                                </Box>
                                            </Stack>

                                            <Typography variant="h6" fontWeight="bold" color="#0F172A" gutterBottom sx={{ lineHeight: 1.4, mb: 2, minHeight: 60 }}>
                                                {blog.title}
                                            </Typography>

                                            <Typography variant="body2" color={styles.textSec} sx={{ mb: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: 1.6 }}>
                                                {blog.content}
                                            </Typography>

                                            <Button
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{
                                                    mt: 'auto',
                                                    color: styles.accentBlue, fontWeight: 'bold',
                                                    justifyContent: 'flex-start', p: 0, textTransform: 'none',
                                                    '&:hover': { bgcolor: 'transparent', color: '#1D4ED8', ml: 1 },
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                Devamını Oku
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        !loading && (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                                <Typography variant="h6" color={styles.textSec}>Henüz blog yazısı eklenmemiş.</Typography>
                            </Box>
                        )
                    )}
                </Grid>
            </Container>

            {/* --- DETAY POPUP (DIALOG) --- */}
            <Dialog
                open={Boolean(selectedBlog)}
                onClose={handleCloseBlog}
                maxWidth="md"
                fullWidth
                scroll="body"
                PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', bgcolor: '#FFFFFF', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' } }}
            >
                {selectedBlog && (
                    <>
                        <Box sx={{ position: 'relative', height: { xs: 250, md: 400 } }}>
                            <CardMedia
                                component="img"
                                image={getImageUrl(selectedBlog.image)}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Kapat Butonu */}
                            <IconButton
                                onClick={handleCloseBlog}
                                sx={{
                                    position: 'absolute', top: 20, right: 20,
                                    bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                                    backdropFilter: 'blur(4px)', border: `1px solid ${styles.glassBorder}`,
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)', transform: 'rotate(90deg)' },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            {/* Başlık Overlay */}
                            <Box sx={{
                                position: 'absolute', bottom: 0, left: 0, width: '100%', p: { xs: 3, md: 5 },
                                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)'
                            }}>
                                <Stack direction="row" spacing={2} mb={2}>
                                    <Chip
                                        icon={<CalendarTodayIcon sx={{ fontSize: 14, color: 'white !important' }} />}
                                        label={new Date(selectedBlog.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(4px)' }}
                                    />
                                </Stack>
                                <Typography variant="h4" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                                    {selectedBlog.title}
                                </Typography>
                            </Box>
                        </Box>

                        <DialogContent sx={{ p: { xs: 3, md: 6 }, bgcolor: '#FFFFFF' }}>
                            <Typography sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.9,
                                fontSize: '1.05rem',
                                color: '#334155',
                                '&::first-letter': { fontSize: '3rem', float: 'left', mr: 1, lineHeight: 1, fontWeight: 'bold', color: styles.accentBlue }
                            }}>
                                {selectedBlog.content}
                            </Typography>

                            {/* Yazar Alanı */}
                            <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid rgba(0,0,0,0.08)`, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: styles.accentBlue }}>K</Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="#0F172A">Kıyı Medya Ekibi</Typography>
                                    <Typography variant="caption" color={styles.textSec}>İçerik Editörü</Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Blog;