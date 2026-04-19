// src/pages/Portfolio.jsx
import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Typography, Card, CardMedia,
    Box, Dialog, DialogContent, Button, IconButton, Paper,
    ImageList, ImageListItem, Chip, useMediaQuery, useTheme, Grow, Tab, Tabs, Divider, Avatar
} from '@mui/material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { SERVER_URL } from '../config';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import LaunchIcon from '@mui/icons-material/Launch';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Portfolio = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [portfolioItems, setPortfolioItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState(['Tümü']);
    const [selectedCategory, setSelectedCategory] = useState('Tümü');

    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewMedia, setPreviewMedia] = useState({ type: '', url: '' });

    // --- STYLES ---
    const styles = {
        textMain: '#0F172A',
        textSec: '#64748B',
        accentBlue: '#3B82F6',
        cardBg: '#FFFFFF',
        glassBorder: 'rgba(0, 0, 0, 0.07)',
    };

    const getMediaUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${SERVER_URL}${path}`;
    };

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/portfolio`);
                if (res.data.success) {
                    const data = res.data.data.reverse();
                    setPortfolioItems(data);
                    setFilteredItems(data);

                    const cats = new Set(['Tümü']);
                    data.forEach(item => {
                        if (item.category) {
                            const itemCats = Array.isArray(item.category)
                                ? item.category
                                : item.category.split(',');
                            itemCats.forEach(c => cats.add(c.trim()));
                        }
                    });
                    setCategories(Array.from(cats));
                }
            } catch (error) {
                console.error("Hata:", error);
            }
        };
        fetchPortfolio();
    }, []);

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
        if (newValue === 'Tümü') {
            setFilteredItems(portfolioItems);
        } else {
            setFilteredItems(portfolioItems.filter(item => {
                const itemCats = Array.isArray(item.category) ? item.category : item.category.split(',').map(c => c.trim());
                return itemCats.includes(newValue);
            }));
        }
    };

    const handleClickOpen = (item) => { setSelectedItem(item); setOpen(true); };
    const handleClose = () => { setOpen(false); setTimeout(() => setSelectedItem(null), 200); };

    const handlePreviewOpen = (type, url) => { setPreviewMedia({ type, url }); setPreviewOpen(true); };
    const handlePreviewClose = () => { setPreviewOpen(false); setPreviewMedia({ type: '', url: '' }); };

    // Helper for Framer Motion
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const FALLBACK_IMAGE = 'https://placehold.co/600x400/F1F5F9/64748B?text=Resim+Yok';
    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    return (
        <Box sx={{ overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: styles.textMain }}>
            <SEO title="Portföy | Kıyı Medya" description="Başarı hikayelerimiz ve tamamladığımız projeler." />

            {/* GLOBAL BACKGROUND GLOW (AURORA) */}
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
                            PROJELERİMİZ
                        </Typography>
                    </Box>

                    <Typography variant="h2" sx={{
                        fontWeight: 800, mb: 3,
                        fontSize: { xs: '2.5rem', md: '4.5rem' },
                        lineHeight: 1.15, letterSpacing: '-0.02em', color: '#0F172A'
                    }}>
                        İlham Veren <br />
                        <span style={{ color: styles.accentBlue }}>Başarı Hikayeleri.</span>
                    </Typography>

                    <Typography variant="h6" sx={{ color: styles.textSec, fontWeight: 400, fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: '700px', mx: 'auto', lineHeight: 1.8 }}>
                        Fikirleri dijital gerçekliğe dönüştürdüğümüz, markalara değer katan seçkin projelerimiz.
                    </Typography>
                </motion.div>
            </Container>


            {/* ================================================================================== */}
            {/* 2. PORTFOLIO GRID */}
            {/* ================================================================================== */}
            <Container maxWidth="xl" sx={{ mb: 15, px: { xs: 2, md: 6 }, position: 'relative', zIndex: 5 }}>

                {/* --- KATEGORİ FİLTRELEME --- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Box display="flex" justifyContent="center" mb={6}>
                        <Paper className="glass-panel" elevation={0} sx={{
                            p: 1, borderRadius: 50, display: 'flex', alignItems: 'center',
                            maxWidth: '100%', overflowX: 'auto',
                            border: `1px solid ${styles.glassBorder}`,
                        }}>
                            <Tabs
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                textColor="inherit"
                                sx={{
                                    '& .MuiTabs-indicator': { display: 'none' },
                                    '& .MuiTab-root': {
                                        textTransform: 'none', fontWeight: 600, color: styles.textSec,
                                        minWidth: 'auto', px: 3, py: 1, borderRadius: 50, transition: 'all 0.3s',
                                        '&.Mui-selected': { bgcolor: styles.accentBlue, color: 'white' },
                                        '&:hover:not(.Mui-selected)': { color: '#0F172A' }
                                    }
                                }}
                            >
                                {categories.map((cat) => (
                                    <Tab key={cat} label={cat} value={cat} disableRipple />
                                ))}
                            </Tabs>
                        </Paper>
                    </Box>
                </motion.div>

                {/* --- PROJE IZGARASI --- */}
                <Grid container spacing={4}>
                    <AnimatePresence>
                        {filteredItems.map((item, index) => (
                            <Grid item key={item._id} xs={12} sm={6} md={4} lg={4}>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        className="glass-panel"
                                        onClick={() => handleClickOpen(item)}
                                        sx={{
                                            height: '100%', borderRadius: 4, position: 'relative', cursor: 'pointer', overflow: 'hidden',
                                            border: `1px solid rgba(0,0,0,0.07)`,
                                            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
                                            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 16px 48px rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.25)' }
                                        }}
                                    >
                                        {/* Medya Alanı */}
                                        <Box sx={{
                                            height: { xs: 250, md: 350 }, position: 'relative', overflow: 'hidden',
                                            borderRadius: 4, bgcolor: '#F1F5F9'
                                        }}>
                                            <CardMedia
                                                component="img"
                                                image={getMediaUrl(item.portray || item.logo)}
                                                alt={item.title}
                                                onError={handleImageError}
                                                sx={{
                                                    width: '100%', height: '100%', objectFit: 'cover',
                                                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                                    opacity: 0.8,
                                                    '&:hover': { transform: 'scale(1.05)', opacity: 1 }
                                                }}
                                            />

                                            {/* Overlay / Info */}
                                            <Box sx={{
                                                position: 'absolute', bottom: 0, left: 0, width: '100%', p: 3,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                                height: '50%'
                                            }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="800" color="white" gutterBottom sx={{ letterSpacing: 0.5 }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                                        {item.category && (Array.isArray(item.category) ? item.category : item.category.split(',')).slice(0, 3).map((cat, idx) => (
                                                            <Chip key={idx} label={cat.trim()} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.7rem', backdropFilter: 'blur(4px)', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Video İkonu */}
                                            {(item.video && (Array.isArray(item.video) ? item.video.length > 0 : !!item.video)) && (
                                                <Box sx={{
                                                    position: 'absolute', top: 20, right: 20,
                                                    bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                                                    borderRadius: '50%', p: 1, display: 'flex', border: `1px solid ${styles.glassBorder}`
                                                }}>
                                                    <PlayCircleOutlineIcon sx={{ color: 'white' }} />
                                                </Box>
                                            )}
                                            {/* PDF Badge */}
                                            {(item.pdf && (Array.isArray(item.pdf) ? item.pdf.length > 0 : !!item.pdf)) && (
                                                <Box sx={{
                                                    position: 'absolute', top: 20, left: 20,
                                                    bgcolor: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(5px)',
                                                    borderRadius: '8px', px: 1, py: 0.4, display: 'flex', alignItems: 'center', gap: 0.5
                                                }}>
                                                    <PictureAsPdfIcon sx={{ color: 'white', fontSize: 14 }} />
                                                    <Typography sx={{ color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>PDF</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </Container>


            {/* ================================================================================== */}
            {/* 3. PROJECT DETAIL MODAL */}
            {/* ================================================================================== */}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll="body"
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, bgcolor: '#FFFFFF', backgroundImage: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' } }}
            >
                {selectedItem && (
                    <>
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            p: { xs: 2, md: 4 }, borderBottom: `1px solid rgba(0,0,0,0.07)`
                        }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                    src={getMediaUrl(selectedItem.logo)}
                                    imgProps={{ sx: { objectFit: 'contain' }, onError: handleImageError }}
                                    sx={{ width: 50, height: 50, border: `1px solid rgba(0,0,0,0.07)`, bgcolor: '#F8FAFC' }}
                                >
                                    <CategoryIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="800" color="#0F172A" lineHeight={1.2}>{selectedItem.title}</Typography>
                                    <Typography variant="caption" color={styles.textSec} fontWeight="600">PROJE DETAYLARI</Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={handleClose} sx={{ color: '#475569', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}><CloseIcon /></IconButton>
                        </Box>

                        <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Grid container spacing={6}>
                                {/* Left Side */}
                                <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                                    <Box sx={{ position: 'sticky', top: 20 }}>
                                        <Typography variant="overline" color={styles.accentBlue} fontWeight="800" letterSpacing={1}>PROJE HAKKINDA</Typography>
                                        <Typography variant="body1" sx={{ mt: 1, mb: 4, color: styles.textSec, lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '1rem' }}>
                                            {selectedItem.description}
                                        </Typography>

                                        <Divider sx={{ my: 3 }} />

                                        <Typography variant="overline" color={styles.accentBlue} fontWeight="800" letterSpacing={1}>HİZMETLER</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 4 }}>
                                            {selectedItem.category && (Array.isArray(selectedItem.category) ? selectedItem.category : selectedItem.category.split(',')).map((cat, idx) => (
                                                <Chip key={idx} label={cat.trim()} sx={{ bgcolor: 'rgba(59,130,246,0.08)', color: styles.accentBlue, fontWeight: 600, border: `1px solid rgba(59,130,246,0.2)` }} />
                                            ))}
                                        </Box>

                                        {selectedItem.projectUrl && (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                endIcon={<LaunchIcon />}
                                                href={selectedItem.projectUrl.startsWith('http') ? selectedItem.projectUrl : `https://${selectedItem.projectUrl}`}
                                                target="_blank"
                                                sx={{
                                                    bgcolor: styles.accentBlue, color: 'white', py: 1.8, fontWeight: 'bold', borderRadius: 2,
                                                    '&:hover': { bgcolor: '#2563eb' }
                                                }}
                                            >
                                                Projeyi Ziyaret Et
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Right Side: Gallery */}
                                <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
                                    <ImageList variant="masonry" cols={isMobile ? 1 : 2} gap={16}>
                                        {selectedItem.video && (Array.isArray(selectedItem.video) ? selectedItem.video : [selectedItem.video]).map((vid, idx) => (
                                            vid && (
                                                <ImageListItem key={`vid-${idx}`} onClick={() => handlePreviewOpen('video', getMediaUrl(vid))} sx={{ cursor: 'pointer', borderRadius: 3, overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)', transition: '0.3s', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}>
                                                        <PlayCircleOutlineIcon sx={{ color: '#fff', fontSize: 60, filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))' }} />
                                                    </Box>
                                                    <video style={{ width: '100%', display: 'block', borderRadius: '12px' }}>
                                                        <source src={getMediaUrl(vid)} type="video/mp4" />
                                                    </video>
                                                </ImageListItem>
                                            )
                                        ))}

                                        {selectedItem.portray && (
                                            <ImageListItem onClick={() => handlePreviewOpen('image', getMediaUrl(selectedItem.portray))} sx={{ cursor: 'pointer', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                <img src={getMediaUrl(selectedItem.portray)} alt="Kapak" loading="lazy" onError={handleImageError} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                                                <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '50%', p: 0.5 }}>
                                                    <ZoomInIcon color="action" fontSize="small" />
                                                </Box>
                                            </ImageListItem>
                                        )}

                                        {selectedItem.gallery && selectedItem.gallery.map((img, index) => (
                                            <ImageListItem key={index} onClick={() => handlePreviewOpen('image', getMediaUrl(img))} sx={{ cursor: 'pointer', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                <img src={getMediaUrl(img)} alt={`Galeri ${index}`} loading="lazy" onError={handleImageError} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                                            </ImageListItem>
                                        ))}

                                        {selectedItem.pdf && (Array.isArray(selectedItem.pdf) ? selectedItem.pdf : [selectedItem.pdf]).map((pdfPath, idx) => {
                                            if (!pdfPath) return null;
                                            const pdfUrl = getMediaUrl(pdfPath);
                                            const fileName = pdfPath.split('/').pop() || `Belge ${idx + 1}`;
                                            return (
                                                <ImageListItem key={`pdf-${idx}`}>
                                                    <Box sx={{
                                                        borderRadius: '12px', overflow: 'hidden',
                                                        border: '1.5px solid #E2E8F0',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                        bgcolor: '#FAFAFA',
                                                        display: 'flex', flexDirection: 'column'
                                                    }}>
                                                        {/* PDF Önizleme Alanı */}
                                                        <Box sx={{
                                                            bgcolor: '#FEF2F2', display: 'flex', flexDirection: 'column',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            py: 4, px: 2, gap: 1
                                                        }}>
                                                            <PictureAsPdfIcon sx={{ fontSize: 64, color: '#EF4444' }} />
                                                            <Typography variant="caption" color="#64748B" fontWeight={600} textAlign="center"
                                                                sx={{ wordBreak: 'break-all', maxWidth: 200, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {fileName}
                                                            </Typography>
                                                        </Box>
                                                        {/* Butonlar */}
                                                        <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<VisibilityIcon />}
                                                                href={pdfUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{ flex: 1, bgcolor: '#3B82F6', '&:hover': { bgcolor: '#2563EB' }, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                                                            >
                                                                Görüntüle
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                startIcon={<DownloadIcon />}
                                                                href={pdfUrl}
                                                                download={fileName}
                                                                sx={{ flex: 1, borderColor: '#E2E8F0', color: '#475569', '&:hover': { borderColor: '#3B82F6', color: '#3B82F6' }, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                                                            >
                                                                İndir
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </ImageListItem>
                                            );
                                        })}
                                    </ImageList>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* --- LIGHTBOX --- */}
            <Dialog
                open={previewOpen}
                onClose={handlePreviewClose}
                maxWidth="xl"
                fullWidth
                PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}
                BackdropProps={{ sx: { bgcolor: 'rgba(0, 0, 0, 0.95)' } }}
            >
                <Box sx={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton onClick={handlePreviewClose} sx={{ position: 'absolute', top: 30, right: 30, color: '#fff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, zIndex: 10 }}>
                        <CloseIcon fontSize="large" />
                    </IconButton>

                    {previewMedia.type === 'video' ? (
                        <video controls autoPlay style={{ maxWidth: '90%', maxHeight: '90%', outline: 'none', borderRadius: '8px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                            <source src={previewMedia.url} type="video/mp4" />
                        </video>
                    ) : (
                        <img src={previewMedia.url} alt="Önizleme" onError={handleImageError} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default Portfolio;